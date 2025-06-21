import Typography from "@/components/ui/typography";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3xl bg-bg-primary p-s">
      <Typography variant="display/Regular" className="text-primary-main">
        Page Not Found
      </Typography>
      <Typography variant="paragraph/Regular" className="text-secondary">
        The page you are looking for does not exist
      </Typography>
    </div>
  );
}
