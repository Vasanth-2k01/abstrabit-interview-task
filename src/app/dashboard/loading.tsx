import { BookmarkGridSkeleton } from '@/components/bookmarks/BookmarkSkeleton'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

export default function Loading() {
  return (
    <SkeletonTheme baseColor="#1a1a1a" highlightColor="#333" borderRadius="0.5rem">
      <div className="min-h-screen bg-black text-white">
        <div className="h-16 border-b border-white/5 flex items-center px-4 md:px-8">
          <Skeleton width={120} height={24} />
        </div>
        <main className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-32">
          <div className="mb-12 space-y-3">
            <Skeleton width={256} height={40} borderRadius="1rem" />
            <Skeleton width={192} height={20} borderRadius="1rem" style={{ marginTop: '0.75rem' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl px-5 py-4 flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Skeleton width={36} height={36} borderRadius={12} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-100 flex items-center h-8">
                    <Skeleton width={40} height={24} />
                  </p>
                  <p className="text-xs text-zinc-500 font-medium flex items-center h-4">
                    <Skeleton width={80} height={12} />
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-8">
            <Skeleton width={320} height={48} borderRadius="1rem" />
          </div>
          <BookmarkGridSkeleton />
        </main>
      </div>
    </SkeletonTheme>
  )
}
