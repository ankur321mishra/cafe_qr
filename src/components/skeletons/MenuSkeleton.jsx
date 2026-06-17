import SkeletonLine from './SkeletonLine';

export default function MenuSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* 2 Category sections */}
      {[1, 2].map((section) => (
        <div key={`section-${section}`} className="px-4">
          <SkeletonLine width="40%" height="1.5rem" className="mb-4" />
          
          {/* Grid of 3 items per section (actually MenuPage uses a grid of 2, but prompt requested 3 item cards. I will render a grid of 2 with 4 items or grid of 2 with 3 items. Let's do grid grid-cols-2 gap-3) */}
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3].map((card) => (
              <div key={`card-${section}-${card}`} className="bg-white dark:bg-stone-900 rounded-xl border border-beige/40 dark:border-stone-800 overflow-hidden">
                <div className="h-28 bg-gray-200 dark:bg-stone-800 aspect-square rounded-t-xl" style={{ aspectRatio: 'auto' }} />
                <div className="p-3 space-y-2">
                  <SkeletonLine width="80%" height="1rem" />
                  <SkeletonLine width="40%" height="1rem" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
