import { type FC } from "react";
import Typography from "../ui/typography";
import InfoSVG from "@/icons/info";

export const HomeNotes: FC = () => (
  <div className="mx-s grid max-w-[62.5rem] gap-l overflow-hidden rounded-m bg-[#2D2743] lg:grid-cols-2">
    <div className="min-h-[30rem] bg-[url('/images/Home/notes.png')] bg-cover bg-center" />
    <div className="px-m py-2xl">
      <h2>
        <Typography
          variant="label/Small Bold"
          className="uppercase text-secondary"
        >
          Important Notes:
        </Typography>
      </h2>
      <ul className="flex flex-col gap-s py-l">
        {[
          "During active governance votes, staked tokens cannot be unstaked",
          "Multiple staking positions can be managed independently",
          "Lock periods cannot be shortened once set",
          "Maximum lock period is 12 months",
        ].map((note) => (
          <li
            key={note}
            className="flex list-none gap-m rounded-xs bg-primary-dark p-m"
          >
            <InfoSVG width="100%" className="max-w-[1.25rem] text-tertiary" />
            <Typography variant="paragraph/Large" className="text-primary-main">
              {note}
            </Typography>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
