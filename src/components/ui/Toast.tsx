import { Toaster } from "sonner";
import SvgCheckFill16 from "@/icons/CheckFill24";
import Loader from "@/components/ui/Loader";
import SvgXFill16 from "@/icons/XFill16";

export function Toast() {
  return (
    <Toaster
      position="bottom-right"
      icons={{
        loading: <Loader className="h-6 w-6" />,
        success: <SvgCheckFill16 className="h-1 w-1" />,
        error: <SvgXFill16 className="h-1 w-1" />,
      }}
      className="flex h-[44px] items-center justify-center rounded-2024_XS px-2024_XL py-2024_R"
      toastOptions={{
        unstyled: true,
        closeButton: false,
        actionButtonStyle: {
          display: "none",
        },
        duration: 10000,
        classNames: {
          toast:
            "flex items-center rounded-2024_XS items-center px-2024_XL py-2024_R ",
          title: "text-2024_body4 font-bold",
          loading: "bg-fill-background-primary",
          success: "bg-2024_fillBackground-good text-[#221C36]",
          error:
            "bg-2024_fillBackground-bad bg-2024_fillBackground-bad text-white",
        },
      }}
    />
  );
}
