import { formatDate } from "@/lib/utils";

interface TimelineItemProps {
  label: string;
  date: string | Date | null | undefined;
  icon: React.ReactNode;
  active: boolean;
  isLast?: boolean;
  destructive?: boolean;
}

export const TimelineItem = ({
  label,
  date,
  icon,
  active,
  isLast,
  destructive,
}: TimelineItemProps) => {
  const circleClass = destructive
    ? "bg-destructive border-destructive text-white"
    : active
      ? "bg-primary border-primary text-white"
      : "bg-background border-muted text-muted-foreground";

  const lineClass = destructive
    ? "bg-destructive"
    : active
      ? "bg-primary"
      : "bg-muted";

  return (
    <div className="relative flex gap-3 pb-6 last:pb-0">
      {/* The Vertical Connecting Line */}
      {!isLast && (
        <span
          className={`absolute left-[13px] top-[26px] h-[calc(100%-20px)] w-[2px] ${lineClass}`}
          aria-hidden="true"
        />
      )}

      {/* The Icon Circle */}
      <div
        className={`relative z-10 flex size-7 items-center justify-center rounded-full border-2 transition-colors duration-300 ${circleClass}`}
      >
        {icon}
      </div>

      {/* The Text Content */}
      <div className="flex flex-col gap-0.5">
        <p
          className={`text-sm font-semibold transition-colors ${
            active || destructive ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {label}
        </p>
        {date ? (
          <p className="text-[11px] text-muted-foreground">
            {formatDate(date, true)}
          </p>
        ) : (
          <p className="text-[11px] italic text-muted-foreground/60">
            Pending...
          </p>
        )}
      </div>
    </div>
  );
};
