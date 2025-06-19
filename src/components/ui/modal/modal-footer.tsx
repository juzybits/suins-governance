import { type FC } from "react";
import { type ModalFooterProps } from "./modal.types";
import { Button } from "../button";
import Typography from "../typography";

export const ModalFooter: FC<ModalFooterProps> = ({
  onClose,
  onAction,
  actionText,
  disabled,
}) => (
  <div className="flex justify-end gap-s">
    <Button variant="short/outline" onClick={onClose} bg="#2D2743">
      <Typography variant="label/Regular Bold">Cancel</Typography>
    </Button>
    <Button variant="short/gradient" onClick={onAction} disabled={disabled}>
      <Typography variant="label/Regular Bold">{actionText}</Typography>
    </Button>
  </div>
);
