import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { clients } from "@/lib/rpc";
import { NETWORK } from "@/constants/env";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { isFuture } from "date-fns";
import {
  proposalDetailSchema,
  votingObjectContentSchema,
} from "@/schemas/proposalResponseSchema";

async function getProposalsIds() {
  const network = NETWORK === "mainnet" ? "mainnet" : "testnet";
  const getProposalsContent = await clients[NETWORK].getDynamicFields({
    parentId: SUINS_PACKAGES[network].governanceCap,
    limit: 20,
  });

  const resp = await Promise.allSettled(
    getProposalsContent.data.map((item) =>
      clients[NETWORK].getObject({
        id: item.objectId,
        options: {
          showContent: true,
          showOwner: true,
          showType: true,
        },
      }),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/prefer-find
  return resp
    .map((item) => {
      if (item.status !== "fulfilled") return null;

      const data = votingObjectContentSchema.safeParse(
        item.value.data?.content,
      );
      if (data.error) return null;
      return data.data.fields.value.fields;
    })
    .filter(Boolean)[0];
}

async function getProposalDetail({ proposalId }: { proposalId: string }) {
  try {
    const resp = await clients[NETWORK].getObject({
      id: proposalId,
      options: {
        showContent: true,
        showDisplay: true,
        showOwner: true,
        showType: true,
      },
    });
    const objDetail = proposalDetailSchema.safeParse(resp?.data?.content);
    console.log(JSON.stringify(objDetail.error), "objDetail");
    if (objDetail.error) {
      return new TRPCError({
        code: "BAD_REQUEST",
        message: objDetail.error.message,
      });
    }
    return objDetail.data;
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occurred

      return new TRPCError({
        code: "BAD_REQUEST",
        message: cause.message,
      });
    }
  }
}

export const proposalRouter = createTRPCRouter({
  getProposalsIds: publicProcedure.query(getProposalsIds),

  getProposalDetail: publicProcedure
    .input(
      z.object({
        proposalId: z.string(),
      }),
    )
    .query(async ({ input: { proposalId } }) =>
      getProposalDetail({ proposalId }),
    ),

  getIsProposalActive: publicProcedure.query(async () => {
    const proposalIds = await getProposalsIds();
    const proposals = Object.values(proposalIds ?? {})[0];
    if (!proposals) return null;
    const proposalsDetail = await Promise.all(
      proposals.map((item) => getProposalDetail({ proposalId: item })),
    );
    const proposalsIDs = proposalIds ? Object.values(proposalIds) : [];
    const proposal = proposalsDetail.find(
      (item) =>
        item &&
        "fields" in item &&
        isFuture(new Date(Number(item.fields.end_time_ms ?? 0))),
    );

    return {
      isProposalActive:
        proposal && "fields" in proposal ? proposal.fields.id.id : null,
      defaultProposalId: proposalsIDs?.[0]?.length
        ? proposalsIDs[0].at(-1)
        : null,
    };
  }),
});
