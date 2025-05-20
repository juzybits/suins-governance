import { type FC } from "react";
import { type ChecklistProps } from "./checklist.types";
import CheckSVG from "@/icons/check";
import Typography from "../typography";

const Checklist: FC<ChecklistProps> = ({ list }) => (
  <ul>
    {list.map((item) => (
      <li className="flex items-center gap-s" key={item}>
        <CheckSVG width="100%" className="max-w-m" />
        <Typography variant="paragraph/Large" className="text-secondary">
          {item}
        </Typography>
      </li>
    ))}
  </ul>
);

export default Checklist;
