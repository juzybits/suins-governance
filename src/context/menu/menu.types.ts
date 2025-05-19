import { type Dispatch, type SetStateAction } from "react";

type Content = "navigation" | null;

export type MenuContentContextProps = {
  open: boolean;
  content: Content;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setContent: Dispatch<SetStateAction<Content>>;
};
