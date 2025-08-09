import { type FC } from "react";
import { type ModalFooterProps } from "./modal.types";
import { Button } from "../button";
import Typography from "../typography";

export const ModalFooter: FC<ModalFooterProps> = ({
  loading,
  onClose,
  onAction,
  disabled,
  actionText,
}) => (
  <div className="flex justify-end gap-s">
    <Button variant="short/outline" onClick={onClose} bg="#2D2743">
      <Typography variant="label/Regular Bold">Cancel</Typography>
    </Button>
    <Button
      loading={loading}
      onClick={onAction}
      variant="short/gradient"
      disabled={loading || disabled}
      className={disabled ? "opacity-30" : ""}
    >
      <Typography variant="label/Regular Bold">{actionText}</Typography>
    </Button>
  </div>
);
