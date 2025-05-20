import { type FC } from "react";
import Typography from "../typography";
import clsx from "clsx";
import { type TableProps } from "./table.types";

const Table: FC<TableProps> = ({ header, content }) => (
  <table className="w-full overflow-hidden rounded-l-xs rounded-r-xs">
    <thead>
      <tr className="bg-[#FFFFFF05] text-primary-main">
        {header.map((item, index) => (
          <th
            key={item}
            className={clsx(
              "px-m py-s text-left",
              index && "border-l border-[#FFFFFF1A]",
            )}
          >
            <Typography variant="label/Small Medium">{item}</Typography>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {content.map((row) => (
        <tr
          className="backdrop-blur-30 odd:bg-[#FFFFFF01] even:bg-[#FFFFFF03]"
          key={JSON.stringify(row)}
        >
          {row.map((cell, index) => (
            <td
              key={cell}
              className={clsx(
                "px-m py-s text-left",
                index && "border-l border-[#FFFFFF1A]",
              )}
            >
              <Typography variant="paragraph/Small" className="text-secondary">
                {cell}
              </Typography>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
