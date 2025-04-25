import { Skeleton } from "@/src/components/ui/skeleton";

export default function BoardSkeleton() {
  return (
    <div className="flex gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="w-72 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  );
}
