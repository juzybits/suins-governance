import { Toaster } from "sonner";
import CheckSVG from "@/icons/check";
import Loader from "@/components/ui/legacy/Loader";
import SvgOutlineX from "@/icons/legacy/OutlineX";

export function Toast() {
  return (
    <Toaster
      position="bottom-right"
      icons={{
        loading: <Loader className="h-s w-s" />,
        success: <CheckSVG className="h-s w-s" />,
        error: <SvgOutlineX className="h-s w-s" />,
      }}
      className="flex h-[44px] max-w-[600px] items-center justify-center rounded-xs"
      toastOptions={{
        unstyled: true,
        descriptionClassName: "w-full",
        closeButton: false,
        actionButtonStyle: {
          display: "none",
        },
        duration: 3000,
        classNames: {
          toast:
            "flex items-center rounded-xs items-center px-xl py-m w-full",
          title: "text-m font-bold",
          loading: "bg-bg-primary",
          success: "bg-bg-good text-primary-darker",
          icon: "hidden",
          error: "bg-bg-error text-primary-main",
        },
      }}
    />
  );
}
