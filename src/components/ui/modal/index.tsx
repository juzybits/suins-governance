"use client";

import { type FC, type PropsWithChildren, useEffect } from "react";
import { type ModalProps } from "./modal.types";
import Typography from "../typography";
import TimesSVG from "@/icons/times";

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  title,
  onClose,
  children,
  subtitle,
}) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div className="z-1 fixed inset-0 flex items-center justify-center bg-bg-primary_dark bg-opacity-80">
      <div className="flex max-h-[90vh] w-full max-w-[45rem] flex-col overflow-y-auto overflow-x-hidden rounded-l-s rounded-r-s bg-bg-modal p-l text-primary-main">
        <div className="flex items-start gap-3xl">
          <div className="flex-1">
            <h2>
              <Typography variant="display/XSmall">{title}</Typography>
            </h2>
            <p>
              <Typography variant="paragraph/Large" className="text-secondary">
                {subtitle}
              </Typography>
            </p>
          </div>
          <button onClick={onClose} className="modal-close-button">
            <TimesSVG width="100%" className="max-w-[0.8rem]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
