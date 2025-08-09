import { useId, type FC } from "react";
import Typography from "../typography";
import clsx from "clsx";
import { type TableProps } from "./table.types";
import { makeId } from "@/utils/id";

const Table: FC<TableProps> = ({
  header,
  content,
  minimalist,
  columnStyles = () => "text-left",
}) => {
  const id = useId();

  return (
    <table
      className={clsx(
        "w-full overflow-hidden",
        !minimalist && "rounded-l-xs rounded-r-xs",
      )}
    >
      <thead>
        <tr
          className={clsx(
            minimalist
              ? "border-b border-[#62519C88]"
              : "bg-[#FFFFFF05] text-primary-main",
          )}
        >
          {header.map((item, index) => (
            <th
              key={makeId(id, index, "head")}
              className={clsx(
                "py-s",
                columnStyles(index),
                !minimalist && "px-m",
                minimalist && !index && "w-[70%]",
                index && !minimalist && "border-l border-[#FFFFFF1A]",
              )}
            >
              <Typography variant="label/Small Medium">{item}</Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {content.map((row, idx) => (
          <tr
            className={clsx(
              minimalist
                ? "border-b border-[#62519C88]"
                : "backdrop-blur-30 odd:bg-[#FFFFFF01] even:bg-[#FFFFFF03]",
            )}
            key={makeId(id, idx, "row")}
          >
            {row.map((cell, index) => (
              <td
                key={makeId(id, index, "cell")}
                className={clsx(
                  "py-s",
                  columnStyles(index),
                  !minimalist && "px-m",
                  index && !minimalist && "border-l border-[#FFFFFF1A]",
                )}
              >
                <Typography
                  variant="paragraph/Small"
                  className="text-secondary"
                >
                  {cell}
                </Typography>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
