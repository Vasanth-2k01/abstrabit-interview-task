'use client'

import { deleteBookmark } from '@/app/actions/bookmarks'
import { Bookmark } from '@/types/bookmark'
import { Calendar, ExternalLink, Pencil, Tag, Trash2 } from 'lucide-react'
import { useState } from 'react'
import EditBookmarkModal from './EditBookmarkModal'

interface BookmarkCardProps {
  bookmark: Bookmark
}

export default function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteBookmark(bookmark.id)
    } catch (err) {
      console.error(err)
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  let domain = bookmark.url
  try {
    domain = new URL(bookmark.url).hostname.replace('www.', '')
  } catch {
  }

  const formattedDate = new Date(bookmark.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <>
      <article className="group relative glass-card rounded-3xl flex flex-col h-full overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 flex-shrink-0 flex items-center justify-center border border-white/5 overflow-hidden">
                {bookmark.favicon_url ? (
                  <img
                    src={bookmark.favicon_url}
                    alt=""
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <ExternalLink size={14} className="text-zinc-600" />
                )}
              </div>
              <span className="text-xs font-semibold text-zinc-500 truncate tracking-wide">
                {domain}
              </span>
            </div>

            <div className="flex items-center">
              <button
                id={`edit-${bookmark.id}`}
                onClick={() => setShowEdit(true)}
                aria-label="Edit bookmark"
                className="p-1.5 rounded-lg text-zinc-600 hover:text-blue-400 hover:bg-blue-500/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
              >
                <Pencil size={15} />
              </button>
              <button
                id={`delete-${bookmark.id}`}
                onClick={() => setShowConfirm(true)}
                aria-label="Delete bookmark"
                className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 ml-1"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 block group/link mb-4"
          >
            <h3 className="font-semibold text-zinc-100 mb-2 line-clamp-2 leading-snug group-hover/link:text-blue-400 transition-colors text-sm">
              {bookmark.title || bookmark.url}
            </h3>
            {bookmark.description && (
              <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                {bookmark.description}
              </p>
            )}
          </a>

          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {bookmark.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-[10px] font-medium bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/15"
                >
                  <Tag size={8} />
                  {tag}
                </span>
              ))}
              {bookmark.tags.length > 3 && (
                <span className="text-[10px] text-zinc-600">+{bookmark.tags.length - 3}</span>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] text-zinc-600">
              <Calendar size={11} />
              {formattedDate}
            </span>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 hover:text-blue-400 transition-colors px-2 py-1 rounded-lg hover:bg-blue-500/5"
            >
              Visit <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </article>

      {showConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) setShowConfirm(false) }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm glass rounded-3xl border border-white/10 p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
              <Trash2 size={28} className="text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-zinc-100">Delete Bookmark?</h3>
            <p className="text-zinc-400 text-sm mb-2 font-medium truncate px-4">{bookmark.title || bookmark.url}</p>
            <p className="text-zinc-600 text-xs mb-8">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                id={`cancel-delete-${bookmark.id}`}
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-2xl border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors text-zinc-300 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                id={`confirm-delete-${bookmark.id}`}
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <EditBookmarkModal
        bookmark={bookmark}
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
      />
    </>
  )
}
