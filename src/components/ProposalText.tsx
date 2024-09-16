import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { ProposalStatus } from "./ui/ProposalStatus";
import { Button } from "./ui/button/Button";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";

// TODO: Add hook to fetch proposal data
export function ProposalText({ proposalId }: { proposalId: string }) {
  const isSmallOrAbove = useBreakpoint("sm");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false); // Check if the content overflows
  const contentRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error } = useGetProposalDetail({ proposalId });
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  console.log(data, error);

  useEffect(() => {
    // Check if the content height is more than 350px
    if (contentRef.current && contentRef.current.scrollHeight > 350) {
      setIsOverflowing(true); // Show "Show More" button if height exceeds 350px
    }
  }, []);
  return (
    <section className="relative flex flex-col gap-2024_4XL sm:gap-2024_5XL">
      <div className="flex flex-col gap-2024_XL">
        <ProposalStatus status="active" />
        <Heading variant="H3/extraBold" className="text-start capitalize">
          Proposal Title Goes Here
        </Heading>
      </div>
      <div className="flex flex-col gap-2024_3XL">
        <Heading variant="H4/super" className="max-sm:hidden">
          Description
        </Heading>
        <div className="flex flex-col gap-2024_L">
          <motion.div
            ref={contentRef}
            initial={false}
            animate={{
              height: isExpanded ? "auto" : 350,
              opacity: isExpanded ? 1 : 0.85,
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="relative flex flex-col gap-2024_S overflow-hidden"
          >
            <Text
              variant={isSmallOrAbove ? "P1/regular" : "P2/regular"}
              color="fillContent-primary"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <Text
              variant={isSmallOrAbove ? "P1/regular" : "P2/regular"}
              color="fillContent-primary"
            >
              Cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl.
              Consectetur a erat nam at lectus urna duis convallis. Amet justo
              donec enim diam. Ultrices neque ornare aenean euismod elementum
              nisi quis eleifend. Nec feugiat nisl pretium fusce id velit. Ut
              tellus elementum sagittis vitae et leo. Accumsan lacus vel
              facilisis volutpat est. Tellus in metus vulputate eu scelerisque
              felis imperdiet
            </Text>
            <Text
              variant={isSmallOrAbove ? "P1/regular" : "P2/regular"}
              color="fillContent-primary"
            >
              Cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl.
              Consectetur a erat nam at lectus urna duis convallis. Amet justo
              donec enim diam. Ultrices neque ornare aenean euismod elementum
              nisi quis eleifend. Nec feugiat nisl pretium fusce id velit. Ut
              tellus elementum sagittis vitae et leo. Accumsan lacus vel
              facilisis volutpat est. Tellus in metus vulputate eu scelerisque
              felis imperdiet
            </Text>
            <Text
              variant={isSmallOrAbove ? "P1/regular" : "P2/regular"}
              color="fillContent-primary"
            >
              Cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl.
              Consectetur a erat nam at lectus urna duis convallis. Amet justo
              donec enim diam. Ultrices neque ornare aenean euismod elementum
              nisi quis eleifend. Nec feugiat nisl pretium fusce id velit. Ut
              tellus elementum sagittis vitae et leo. Accumsan lacus vel
              facilisis volutpat est. Tellus in metus vulputate eu scelerisque
              felis imperdiet
            </Text>
            <Text
              variant={isSmallOrAbove ? "P1/regular" : "P2/regular"}
              color="fillContent-primary"
            >
              Cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl.
              Consectetur a erat nam at lectus urna duis convallis. Amet justo
              donec enim diam. Ultrices neque ornare aenean euismod elementum
              nisi quis eleifend. Nec feugiat nisl pretium fusce id velit. Ut
              tellus elementum sagittis vitae et leo. Accumsan lacus vel
              facilisis volutpat est. Tellus in metus vulputate eu scelerisque
              felis imperdiet
            </Text>
          </motion.div>
          {/* Fade effect */}
          {!isExpanded && isOverflowing && (
            <div className="pointer-events-none absolute bottom-16 left-0 right-0 h-28 bg-show-more-gradient" />
          )}

          {/* Show "Show More" button only if content exceeds 350px */}
          {isOverflowing && (
            <Button
              onClick={toggleExpanded}
              variant="short"
              className="mt-4 self-start border-2 border-[#6E609F] bg-[#221C3603] transition-all"
            >
              <Text variant="LABEL/bold" color="fillContent-secondary">
                {isExpanded ? "Show Less" : "Show More"}
              </Text>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
