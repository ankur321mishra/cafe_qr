import SkeletonLine from './SkeletonLine';

export default function AdminSkeleton() {
  return (
    <div className="animate-pulse space-y-6 fade-in p-2">
      {/* Header */}
      <div className="mb-6">
        <SkeletonLine width="200px" height="2rem" className="mb-2" />
        <SkeletonLine width="300px" height="1rem" />
      </div>

      {/* 4 Stat cards in a row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((card) => (
          <div key={`stat-${card}`} className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 p-5 shadow-sm h-[104px]">
            <div className="h-[80px] flex flex-col justify-between">
              <SkeletonLine width="30%" height="1rem" />
              <SkeletonLine width="50%" height="1.5rem" />
            </div>
          </div>
        ))}
      </div>

      {/* Table block below stats */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 shadow-sm p-5 h-[300px] mt-6 flex flex-col gap-4">
        <SkeletonLine width="150px" height="1.5rem" className="mb-2" />
        <SkeletonLine width="100%" height="2rem" />
        <SkeletonLine width="100%" height="2rem" />
        <SkeletonLine width="100%" height="2rem" />
        <SkeletonLine width="100%" height="2rem" />
      </div>
    </div>
  );
}
