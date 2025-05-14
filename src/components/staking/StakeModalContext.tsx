"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type StakeModalContextProps = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const StakeModalContext = createContext<StakeModalContextProps | undefined>(
  undefined,
);

export function StakeModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <StakeModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
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
