'use client'

import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { Bookmark, LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session) router.push('/login')
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 h-16 px-4 md:px-8 flex items-center justify-between">
      <Link href="/dashboard" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all">
          <Bookmark size={18} fill="currentColor" />
        </div>
        <span className="text-lg font-bold tracking-tight hidden sm:flex items-center gap-0">
          Smart<span className="text-blue-500">Mark</span>
        </span>
      </Link>

      {user && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/8">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-white/15 flex-shrink-0 bg-zinc-800 flex items-center justify-center">
              {(user.user_metadata?.avatar_url || user.user_metadata?.picture) ? (
                <img
                  src={user.user_metadata.avatar_url || user.user_metadata.picture}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User size={15} className="text-zinc-500" />
              )}
            </div>
            <span className="text-sm font-medium text-zinc-300 hidden md:block max-w-[160px] truncate">
              {user.user_metadata?.full_name || user.email}
            </span>
          </div>

          <button
            id="logout-btn"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all text-sm font-medium disabled:opacity-40"
            title="Sign out"
          >
            <LogOut size={16} />
            <span className="hidden sm:block">Sign out</span>
          </button>
        </div>
      )}
    </nav>
  )
}
