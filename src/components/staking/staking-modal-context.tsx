"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type StakeModalContextProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  modalAction: "lock" | "stake" | null;
  setModalAction: (action: "lock" | "stake") => void;
  openModal: (action: "lock" | "stake") => () => void;
};

const StakeModalContext = createContext<StakeModalContextProps | undefined>(
  undefined,
);

export function StakeModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"lock" | "stake" | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
  };
  const openModal = (action: "lock" | "stake") => () => {
    setModalAction(action);

    setIsModalOpen(true);
  };

  return (
    <StakeModalContext.Provider
      value={{
        isModalOpen,
        openModal,
        closeModal,
        modalAction,
        setModalAction,
      }}
    >
      {children}
    </StakeModalContext.Provider>
  );
}

export function useStakeModal() {
  const context = useContext(StakeModalContext);
  if (!context)
    throw new Error("useStakeModal must be used within StakeModalProvider");
  return context;
}
