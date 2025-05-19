import { ConnectModal } from "@mysten/dapp-kit";
import { type FC, useState } from "react";
import { Button } from "../ui/button";
import Typography from "../ui/typography";

export const ConnectWalletButton: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <ConnectModal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="short/gradient" className="w-full min-w-[10rem]">
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
