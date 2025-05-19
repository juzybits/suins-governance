import { ConnectModal } from "@mysten/dapp-kit";
import { type FC, useState } from "react";
import { Button } from "../ui/button";
import Typography from "../ui/typography";
import { type ButtonProps } from "../ui/button/button.types";

export const ConnectWalletButton: FC<
  Partial<Pick<ButtonProps, "variant" | "className">>
> = ({ variant, className }) => {
  const [open, setOpen] = useState(false);

  return (
    <ConnectModal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant={variant ?? "short/gradient"} className={className}>
          <Typography
            variant="label/Large Bold"
            className="text-primary-darker"
          >
            Connect Wallet
          </Typography>
        </Button>
      }
    />
  );
};
