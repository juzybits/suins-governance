"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type ModalAction = "stake" | "lock" | null;

type StakeModalContextProps = {
  modalAction: ModalAction;
  openModal: (action: "stake" | "lock") => void;
  closeModal: () => void;
};

const StakeModalContext = createContext<StakeModalContextProps | undefined>(
  undefined,
);

export function StakeModalProvider({ children }: { children: ReactNode }) {
  const [modalAction, setModalAction] = useState<ModalAction>(null);

  const openModal = (action: "stake" | "lock") => setModalAction(action);
  const closeModal = () => setModalAction(null);

  return (
    <StakeModalContext.Provider value={{ modalAction, openModal, closeModal }}>
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
