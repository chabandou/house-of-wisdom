import { cn } from "@/lib/utils";

export default function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-screen-xl mx-auto px-2.5 md:px-20",
        className
      )}
    >
      {children}
    </div>
  );
}
