import { useInfiniteQuery } from "@tanstack/react-query";
import { normalizeSuiAddress } from "@mysten/sui/utils";
import { client } from "@/app/SuinsClient";
import { z } from "zod";

const votesCastedSchema = z.object({
  data: z.array(
    z.object({
      name: z.object({
        type: z.literal("address"),
        value: z.string(),
      }),
      bcsName: z.string(),
      type: z.literal("DynamicField"),
      objectType: z.string(),
      objectId: z.string(),
      version: z.number(),
      digest: z.string(),
    }),
  ),
  nextCursor: z.string(),
  hasNextPage: z.boolean(),
});

type ParsedVoter = z.infer<typeof votesCastedSchema>;

/**
 * Get all dynamic fields in the proposal.voters LinkedTable
 */
export function useGetAllVotersDfs({
  votersLinkedTableId,
  size = 10,
}: {
  size?: number;
  votersLinkedTableId?: string;
}) {
  return useInfiniteQuery<ParsedVoter>({
    initialPageParam: null,
    queryKey: ["all-voters-dfs", votersLinkedTableId],
    queryFn: async ({ pageParam = null }) => {
      if (!votersLinkedTableId) {
        throw new Error("Voter ID is missing");
      }

      const response = await client.getDynamicFields({
        parentId: normalizeSuiAddress(votersLinkedTableId),
        limit: size,
        cursor: pageParam as string | null, // Use the pageParam for pagination
      });
      const data = votesCastedSchema.safeParse(response);
      if (data.error) {
        throw new Error("Failed to fetch voters");
      }
      return data.data;
    },
    enabled: !!votersLinkedTableId,
    getNextPageParam: ({ nextCursor, hasNextPage }) =>
      hasNextPage ? nextCursor : null,
    refetchInterval: 30_000,
    retry: false,
  });
}
