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

export function useGetAllVoters({
  parentId,
  size = 10,
}: {
  size?: number;
  parentId?: string;
}) {
  return useInfiniteQuery<ParsedVoter>({
    initialPageParam: null,
    queryKey: ["get-all-voter", parentId],
    queryFn: async ({ pageParam = null }) => {
      if (!parentId) {
        throw new Error("Voter ID is missing");
      }

      const response = await client.getDynamicFields({
        parentId: normalizeSuiAddress(parentId),
        limit: size,
        cursor: pageParam as string | null, // Use the pageParam for pagination
      });
      const data = votesCastedSchema.safeParse(response);
      if (data.error) {
        throw new Error("Failed to fetch voters");
      }
      return data.data;
    },
    enabled: !!parentId,
    getNextPageParam: ({ nextCursor, hasNextPage }) =>
      hasNextPage ? nextCursor : null,
    refetchInterval: 30_000,
    retry: false,
  });
}
