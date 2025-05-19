import Link from "next/link";
import { type FC } from "react";

import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import Typography from "../ui/typography";
import { type AccountContentButtonProps } from "./wallet.types";

export const AccountContentButton: FC<AccountContentButtonProps> = ({
  icon,
  label,
  onClick,
}) => (
  <DropdownMenuItem
    onSelect={onClick}
    className="flex w-full justify-center rounded-xs border border-tertiary p-m transition ease-in-out hover:border-primary-dark hover:bg-primary-dark"
  >
    <Link
      href="#"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-xs"
    >
      {icon}
      <Typography variant="label/Small Medium" className="text-secondary">
        {label}
      </Typography>
    </Link>
  </DropdownMenuItem>
);
