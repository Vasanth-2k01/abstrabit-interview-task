/**
 * Shared Bookmark type used across client and server.
 * Mirrors the `bookmarks` table schema exactly.
 */
export interface Bookmark {
  id: string
  user_id: string
  url: string
  title: string | null
  description: string | null
  image_url: string | null
  favicon_url: string | null
  tags: string[]
  created_at: string
}
