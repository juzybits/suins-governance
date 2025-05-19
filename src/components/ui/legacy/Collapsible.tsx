import * as RadixCollapsible from "@radix-ui/react-collapsible";
import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  type ReactNode,
  useContext,
  useId,
  useState,
} from "react";

const CollapsibleContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function useCollapsible() {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error(
      "Collapsible compound components cannot be rendered outside the Collapsible component",
    );
  }
  return context;
}

interface CollapsibleTriggerProps {
  children: ReactNode | (({ open }: { open: boolean }) => ReactNode);
}

export function CollapsibleTrigger({ children }: CollapsibleTriggerProps) {
  const { open } = useCollapsible();

  return (
    <RadixCollapsible.Trigger asChild>
      {typeof children === "function" ? children({ open }) : children}
    </RadixCollapsible.Trigger>
  );
}

interface CollapsibleContentProps {
  children: ReactNode | (({ open }: { open: boolean }) => ReactNode);
  className?: string;
}

export function CollapsibleContent({
  children,
  className,
}: CollapsibleContentProps) {
  const { open } = useCollapsible();
  const id = useId();

  return (
    <RadixCollapsible.Content forceMount className={className}>
      <AnimatePresence key={id}>
        {open && (
          <motion.div
            key={`content-${id}`}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {typeof children === "function" ? children({ open }) : children}
          </motion.div>
        )}
      </AnimatePresence>
    </RadixCollapsible.Content>
  );
}

interface CollapsibleProps {
  children: ReactNode;
  isOpen?: boolean;
}

export function Collapsible({ isOpen, children }: CollapsibleProps) {
  const [open, setOpen] = useState(isOpen ?? false);

  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <RadixCollapsible.Root open={open} onOpenChange={setOpen}>
        {children}
      </RadixCollapsible.Root>
    </CollapsibleContext.Provider>
  );
}
