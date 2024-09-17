import { useQuery } from "@tanstack/react-query";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { client } from "@/app/SuinsClient";
export function useGetVoteCasted({
  address,
  proposalId,
}: {
  address: string;
  proposalId: string;
}) {
  const { data } = useGetProposalDetail({ proposalId });
  return useQuery({
    queryKey: ["get-vote-casted", address, proposalId],
    queryFn: async () => {
      const dynamicFields = await client.getDynamicFields({
        parentId: data?.fields.voters.fields.id.id ?? "",
      });
      console.log(dynamicFields, "dynamicFields");
      return dynamicFields;
    },
    enabled: !!address && !!proposalId && !!data,
    retry: false,
  });
}
