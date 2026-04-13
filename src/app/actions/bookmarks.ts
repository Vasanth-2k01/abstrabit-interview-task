'use server'

import { Bookmark } from '@/types/bookmark'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface AddBookmarkInput {
  url: string
  title?: string
  description?: string
  image_url?: string
  favicon_url?: string
  tags?: string[]
}

export async function addBookmark(formData: AddBookmarkInput) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.from('bookmarks').insert({
    user_id: user.id,
    url: formData.url,
    title: formData.title ?? null,
    description: formData.description ?? null,
    image_url: formData.image_url ?? null,
    favicon_url: formData.favicon_url ?? null,
    tags: formData.tags ?? [],
  })

  if (error) {
    console.error('Error adding bookmark:', error)
    throw new Error('Failed to add bookmark')
  }

  revalidatePath('/dashboard')
}

export async function updateBookmark(id: string, formData: Partial<AddBookmarkInput>) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('bookmarks')
    .update({
      url: formData.url,
      title: formData.title ?? null,
      description: formData.description ?? null,
      image_url: formData.image_url ?? null,
      favicon_url: formData.favicon_url ?? null,
      tags: formData.tags ?? [],
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating bookmark:', error)
    throw new Error('Failed to update bookmark')
  }

  revalidatePath('/dashboard')
}


export async function deleteBookmark(id: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting bookmark:', error)
    throw new Error('Failed to delete bookmark')
  }

  revalidatePath('/dashboard')
}

export async function getBookmarks(): Promise<Bookmark[]> {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return []
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .select('id, user_id, url, title, description, image_url, favicon_url, tags, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookmarks:', error)
    return []
  }

  return (data ?? []) as Bookmark[]
}
