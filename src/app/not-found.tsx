import { Heading } from "@/components/ui/legacy/Heading";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-2">
      <Heading variant="H1/super" as="h1">
        Page Not Found
      </Heading>
      <p className="text-slate-400">
        The page you are looking for does not exist
      </p>
    </div>
  );
}
