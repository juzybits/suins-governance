import { type z } from "zod";
import { proposalV2Schema } from "@/schemas/proposalV2Schema";
import { proposalV1Schema } from "@/schemas/proposalV1Schema";

export type ProposalObjResp =
  | z.infer<typeof proposalV1Schema>
  | z.infer<typeof proposalV2Schema>;
