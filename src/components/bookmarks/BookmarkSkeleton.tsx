import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

export default function BookmarkSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1a1a" highlightColor="#333" borderRadius="0.5rem">
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex-shrink-0">
              <Skeleton circle width={32} height={32} />
            </div>
              <Skeleton containerClassName="flex-1 block w-full" width="60%" height={12} />
          </div>
          <div className="mb-4">
            <Skeleton containerClassName="block w-full" count={2} height={16} style={{ marginBottom: '0.5rem' }} />
          </div>
          <div className="mb-4">
            <Skeleton containerClassName="block w-full" count={3} height={12} style={{ marginBottom: '0.3rem' }} />
          </div>
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <Skeleton width={80} height={12} />
            <Skeleton width={48} height={12} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  )
}

export function BookmarkGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <BookmarkSkeleton key={i} />
      ))}
    </div>
  )
}
