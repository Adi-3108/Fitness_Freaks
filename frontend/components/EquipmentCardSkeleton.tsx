import { Skeleton } from "./ui/skeleton";

export default function EquipmentCardSkeleton() {
  return (
    <div className="border p-4 rounded shadow">
      <Skeleton className="w-full h-[300px]" />
      <Skeleton className="h-6 w-3/4 mt-2" />
      <Skeleton className="h-4 w-1/4 mt-2" />
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  );
} 