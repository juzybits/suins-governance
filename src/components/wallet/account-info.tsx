import { formatName } from "@/utils/common";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import { NameAvatar } from "./name-avatar";
import { type FC } from "react";
import { type AccountInfoProps } from "./wallet.types";
import Typography from "../ui/typography";

export const AccountInfo: FC<AccountInfoProps> = ({
  address,
  nickName,
  showAddress,
  hideAccountPreview,
}) => {
  const { data: resolveSuiNSName } = useSuiClientQuery(
    "resolveNameServiceNames",
    { address },
  );

  const name = resolveSuiNSName?.data?.[0];

  return (
    <div className="flex items-center gap-s">
      <div className="h-[2rem] w-[2rem] text-primary-main">
        <NameAvatar name={name} />
      </div>
      {!hideAccountPreview ? (
        showAddress ? (
          <div className="flex flex-col whitespace-nowrap text-start">
            {name || nickName ? (
              <Typography
                variant="paragraph/Large"
                className="max-w-[200px] truncate text-primary-main"
              >
                {name
                  ? formatName(name, {
                      noTruncate: true,
                    })
                  : nickName}
              </Typography>
            ) : null}
            <Typography variant="label/Small Medium" className="text-secondary">
              {formatAddress(address)}
            </Typography>
          </div>
        ) : (
          <div className="whitespace-nowrap text-start">
            {(nickName || name) && !showAddress ? (
              <Typography
                variant="label/Regular Bold"
                className="max-w-[200px] truncate text-primary-main"
              >
                {name
                  ? formatName(name, {
                      noTruncate: true,
                    })
                  : nickName}
              </Typography>
            ) : (
              <Typography
                variant="label/Regular Bold"
                className="text-secondary"
              >
                {formatAddress(address)}
              </Typography>
            )}
          </div>
        )
      ) : null}
    </div>
  );
};
