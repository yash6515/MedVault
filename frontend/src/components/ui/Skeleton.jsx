const Skeleton = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

export const CardSkeleton = () => (
  <div className="card p-6 space-y-4">
    <Skeleton className="h-4 w-1/3 rounded-xl" />
    <Skeleton className="h-3 w-full rounded-xl" />
    <Skeleton className="h-3 w-2/3 rounded-xl" />
    <div className="flex gap-3 pt-2">
      <Skeleton className="h-9 w-20 rounded-2xl" />
      <Skeleton className="h-9 w-24 rounded-2xl" />
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="h-32 skeleton rounded-3xl" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-3xl" />)}
    </div>
    <CardSkeleton />
    <CardSkeleton />
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="w-16 h-16 rounded-2xl" />
      <div className="space-y-3 flex-1">
        <Skeleton className="h-5 w-40 rounded-xl" />
        <Skeleton className="h-3 w-28 rounded-xl" />
      </div>
    </div>
    <CardSkeleton />
  </div>
);

export default Skeleton;
