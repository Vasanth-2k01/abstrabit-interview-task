'use client'

import { Bookmark } from '@/types/bookmark'
import { createClient } from '@/lib/supabase/client'
import { Bookmark as BookmarkIcon, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import BookmarkCard from './BookmarkCard'

export type { Bookmark }

interface BookmarkGridProps {
  initialBookmarks: Bookmark[]
}

export default function BookmarkGrid({ initialBookmarks }: BookmarkGridProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [searchQuery, setSearchQuery] = useState('')
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  useEffect(() => {
    const channel = supabase
      .channel('realtime:bookmarks')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookmarks' },
        (payload) => {
          setBookmarks(prev => {
            if (prev.some(b => b.id === payload.new.id)) return prev
            return [payload.new as Bookmark, ...prev]
          })
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'bookmarks' },
        (payload) => {
          setBookmarks(prev => prev.filter(b => b.id !== payload.old.id))
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bookmarks' },
        (payload) => {
          setBookmarks(prev =>
            prev.map(b => b.id === payload.new.id ? payload.new as Bookmark : b)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const filteredBookmarks = useMemo(() =>
    bookmarks.filter(b =>
      b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    [bookmarks, searchQuery]
  )

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center">
            <BookmarkIcon size={40} className="text-zinc-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <span className="text-blue-400 text-lg font-bold">+</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-3 text-zinc-100">Your collection awaits</h2>
        <p className="text-zinc-500 max-w-sm leading-relaxed">
          Click the{' '}
          <kbd className="bg-white/10 border border-white/10 px-2 py-1 rounded-lg text-xs font-mono">+</kbd>
          {' '}button to start saving your favorite websites with smart metadata.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={17} />
        <input
          id="bookmark-search"
          type="text"
          placeholder="Search bookmarks, tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/8 rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-blue-500/50 transition-colors placeholder:text-zinc-600 text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors text-xs"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-zinc-500">
        <span>
          <span className="text-zinc-200 font-semibold">{filteredBookmarks.length}</span>
          {' '}{filteredBookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
          {searchQuery && ` found for "${searchQuery}"`}
        </span>
        <span className="text-zinc-700">•</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Real-time sync active
        </span>
      </div>

      {filteredBookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search size={36} className="text-zinc-700 mb-4" />
          <h3 className="text-lg font-semibold text-zinc-400 mb-1">No results found</h3>
          <p className="text-zinc-600 text-sm">Try searching with different keywords or tags.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
    </div>
  )
}
