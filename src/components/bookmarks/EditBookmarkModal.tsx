'use client'

import { updateBookmark } from '@/app/actions/bookmarks'
import { Bookmark } from '@/types/bookmark'
import { Link as LinkIcon, Loader2, Tag, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface EditBookmarkModalProps {
  bookmark: Bookmark
  isOpen: boolean
  onClose: () => void
}

export default function EditBookmarkModal({ bookmark, isOpen, onClose }: EditBookmarkModalProps) {
  const [url, setUrl] = useState(bookmark.url)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(bookmark.tags ?? [])

  const [title, setTitle] = useState(bookmark.title ?? '')
  const [description, setDescription] = useState(bookmark.description ?? '')

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setUrl(bookmark.url)
      setTags(bookmark.tags ?? [])
      setTitle(bookmark.title ?? '')
      setDescription(bookmark.description ?? '')
      setError('')
    }
  }, [isOpen, bookmark])

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
      if (!tags.includes(newTag)) setTags(prev => [...prev, newTag])
      setTagInput('')
    }
  }

  const isValidUrl = (urlString: string) => {
    try {
      const finalUrl = urlString.startsWith('http')
        ? urlString
        : `https://${urlString}`

      const url = new URL(finalUrl)

      if (!['http:', 'https:'].includes(url.protocol)) {
        return false
      }

      if (!url.hostname.includes('.') && url.hostname !== 'localhost') {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  const handleSave = async () => {
    if (!url) {
      setError('URL is required')
      return
    }
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL')
      return
    }
    setLoading(true)
    setError('')
    try {
      const finalUrl = url.startsWith('http') ? url : `https://${url}`
      await updateBookmark(bookmark.id, {
        url: finalUrl,
        title: title || finalUrl,
        description: description,
        tags,
      })
      onClose()
    } catch {
      setError('Failed to update bookmark. Please try again.')
    } finally {
      if (isOpen) {
        setLoading(false)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div className="w-full max-w-lg glass rounded-3xl border border-white/10 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/8 text-zinc-500 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <h2 id="edit-modal-title" className="text-xl font-bold mb-6 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
            <LinkIcon size={16} className="text-blue-400" />
          </div>
          Edit Bookmark
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="edit-bookmark-url" className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">
              Website URL <span className="text-red-400">*</span>
            </label>
            <input
              id="edit-bookmark-url"
              ref={inputRef}
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500/50 transition-colors placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label htmlFor="edit-bookmark-title" className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">
              Title
            </label>
            <input
              id="edit-bookmark-title"
              type="text"
              placeholder="Enter a title for the bookmark"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500/50 transition-colors placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label htmlFor="edit-bookmark-desc" className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">
              Description
            </label>
            <textarea
              id="edit-bookmark-desc"
              rows={3}
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500/50 transition-colors placeholder:text-zinc-600 resize-none"
            />
          </div>

          <div>
            <label htmlFor="edit-bookmark-tags" className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1 flex items-center gap-1.5">
              <Tag size={13} /> Tags <span className="text-zinc-600 font-normal">(press Enter or comma to add)</span>
            </label>
            <input
              id="edit-bookmark-tags"
              type="text"
              placeholder="e.g. design, productivity, tools"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500/50 transition-colors placeholder:text-zinc-600"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-blue-500/10 text-blue-400 text-xs font-medium px-3 py-1 rounded-full border border-blue-500/20">
                    #{tag}
                    <button onClick={() => setTags(t => t.filter(t2 => t2 !== tag))} className="ml-1 hover:text-red-400">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2.5 rounded-xl border border-red-500/20">
              {error}
            </p>
          )}

          <div className="pt-2 flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-6 rounded-2xl border border-white/10 font-medium hover:bg-white/5 transition-colors text-zinc-300 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !url}
              className="flex-1 py-3 px-8 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Updating...</>
              ) : (
                'Update Bookmark'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
