import { Status } from "@/src/types/db";
import { cn } from "../lib/utils";

/** Badge couleur qui reprend la couleur hex du statut */
export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        "border"
      )}
      style={{
        backgroundColor: `${status.color}22`, // 13 % d’opacité
        borderColor: status.color,
        color: status.color,
      }}
    >
      {status.name}
    </span>
  );
}
