'use client'

import { addBookmark } from '@/app/actions/bookmarks'
import { fetchMetadata } from '@/app/actions/metadata'
import { Link as LinkIcon, Loader2, Plus, Tag, X } from 'lucide-react'
import { useRef, useState } from 'react'

interface MetadataPreview {
  title: string
  description: string
  image_url: string
  favicon_url: string
}

export default function AddBookmarkModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<MetadataPreview | null>(null)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [manualTitle, setManualTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOpen = () => {
    setIsOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleClose = () => {
    setIsOpen(false)
    setUrl('')
    setPreview(null)
    setError('')
    setTags([])
    setTagInput('')
    setManualTitle('')
  }

  const handleFetchMetadata = async () => {
    if (!url) return
    setLoading(true)
    setError('')
    try {
      const urlToCheck = url.startsWith('http') ? url : `https://${url}`
      const metadata = await fetchMetadata(urlToCheck)
      setPreview(metadata)
      if (metadata.title) setManualTitle(metadata.title)
    } catch {
      setError('Could not fetch metadata. Fill in the details manually.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
      if (!tags.includes(newTag)) setTags(prev => [...prev, newTag])
      setTagInput('')
    }
  }

  const handleSave = async () => {
    if (!url) return
    setLoading(true)
    setError('')
    try {
      const finalUrl = url.startsWith('http') ? url : `https://${url}`
      await addBookmark({
        url: finalUrl,
        title: manualTitle || preview?.title || finalUrl,
        description: preview?.description,
        image_url: preview?.image_url,
        favicon_url: preview?.favicon_url,
        tags,
      })
      handleClose()
    } catch {
      setError('Failed to save bookmark. Please try again.')
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleClose()
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        id="add-bookmark-btn"
        aria-label="Add new bookmark"
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/40 hover:scale-110 hover:bg-blue-500 active:scale-95 transition-all z-40"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-lg glass rounded-3xl border border-white/10 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/8 text-zinc-500 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <h2 id="modal-title" className="text-xl font-bold mb-6 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
            <LinkIcon size={16} className="text-blue-400" />
          </div>
          Add New Bookmark
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="bookmark-url" className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">
              Website URL <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="bookmark-url"
                ref={inputRef}
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleFetchMetadata() }}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500/50 transition-colors placeholder:text-zinc-600"
              />
              <button
                id="fetch-metadata-btn"
                onClick={handleFetchMetadata}
                disabled={loading || !url}
                className="px-5 rounded-2xl bg-blue-600/20 text-blue-400 font-semibold hover:bg-blue-600/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Fetch'}
              </button>
            </div>
          </div>

          {preview && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/8 flex gap-3">
              {preview.favicon_url && (
                <img
                  src={preview.favicon_url}
                  alt="Site favicon"
                  className="w-10 h-10 rounded-lg flex-shrink-0 object-contain bg-white/10 p-1"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Preview</p>
                <h3 className="font-semibold text-zinc-100 truncate">{preview.title || 'No title found'}</h3>
                <p className="text-sm text-zinc-400 line-clamp-2 mt-0.5">{preview.description || 'No description found'}</p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="bookmark-title" className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">
              Title {!preview && <span className="text-zinc-600 font-normal">(auto-filled on fetch)</span>}
            </label>
            <input
              id="bookmark-title"
              type="text"
              placeholder="Enter a title for the bookmark"
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500/50 transition-colors placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label htmlFor="bookmark-tags" className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1 flex items-center gap-1.5">
              <Tag size={13} /> Tags <span className="text-zinc-600 font-normal">(press Enter or comma to add)</span>
            </label>
            <input
              id="bookmark-tags"
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
              id="cancel-bookmark-btn"
              onClick={handleClose}
              className="flex-1 py-3 px-6 rounded-2xl border border-white/10 font-medium hover:bg-white/5 transition-colors text-zinc-300"
            >
              Cancel
            </button>
            <button
              id="save-bookmark-btn"
              onClick={handleSave}
              disabled={loading || !url}
              className="flex-1 py-3 px-8 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Saving...</>
              ) : (
                'Add Bookmark'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
