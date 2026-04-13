import { getBookmarks } from '@/app/actions/bookmarks'
import AddBookmarkModal from '@/components/bookmarks/AddBookmarkModal'
import BookmarkGrid from '@/components/bookmarks/BookmarkGrid'
import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { Bookmark, Clock, Tag } from 'lucide-react'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard | SmartMark',
  description: 'Manage your personal bookmark collection with real-time sync.',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const initialBookmarks = await getBookmarks()

  const totalTags = [...new Set(initialBookmarks.flatMap(b => b.tags ?? []))].length
  const latestDate = initialBookmarks[0]
    ? new Date(initialBookmarks[0].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '—'

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-36">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            My Bookmarks
          </h1>
          <p className="text-zinc-500 text-base md:text-lg">
            Hello,{' '}
            <span className="text-zinc-300 font-medium">
              {user.user_metadata?.full_name?.split(' ')[0] || 'there'}
            </span>
            . Your personal knowledge library.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="glass-card rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <Bookmark size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{initialBookmarks.length}</p>
              <p className="text-xs text-zinc-500 font-medium">Bookmarks</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Tag size={18} className="text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{totalTags}</p>
              <p className="text-xs text-zinc-500 font-medium">Unique Tags</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <Clock size={18} className="text-green-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-zinc-100">{latestDate}</p>
              <p className="text-xs text-zinc-500 font-medium">Last Added</p>
            </div>
          </div>
        </div>

        <BookmarkGrid initialBookmarks={initialBookmarks} />
      </main>

      <AddBookmarkModal />
    </div>
  )
}
