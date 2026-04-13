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
          <div className="mb-8">
            <Skeleton width={320} height={48} borderRadius="1rem" />
          </div>
          <BookmarkGridSkeleton />
        </main>
      </div>
    </SkeletonTheme>
  )
}
