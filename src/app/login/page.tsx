'use client'

import { createClient } from '@/lib/supabase/client'
import { Bookmark, Globe, Shield, Star, Zap } from 'lucide-react'
import { useState } from 'react'

const FEATURES = [
  { icon: Zap, title: 'Real-time Sync', desc: 'Changes reflect instantly across all your devices' },
  { icon: Star, title: 'Smart Scraping', desc: 'Auto-fetches title, description & favicon for any URL' },
  { icon: Shield, title: 'Fully Private', desc: 'Row-Level Security ensures only you see your bookmarks' },
]

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      })
      if (error) throw error
    } catch (err) {
      console.error('Login error:', err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mesh text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/6 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center relative z-10">

        <div className="hidden md:flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-xl shadow-blue-500/30">
              <Bookmark size={26} fill="white" className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Smart<span className="text-blue-500">Mark</span></h2>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Bookmark Manager</p>
            </div>
          </div>

          <div>
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent mb-4">
              Your web,<br />organized.
            </h1>
            <p className="text-zinc-400 text-base leading-relaxed max-w-sm">
              Save anything from the web with smart metadata, search instantly, and access it everywhere — in real time.
            </p>
          </div>

          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={16} className="text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-200 text-sm">{title}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl border border-white/8 p-8 shadow-2xl">
          <div className="flex md:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Bookmark size={20} fill="white" className="text-white" />
            </div>
            <span className="text-xl font-bold">Smart<span className="text-blue-500">Mark</span></span>
          </div>

          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
          <p className="text-zinc-400 text-sm mb-8">
            Sign in to access your bookmark collection.
          </p>

          <button
            id="google-signin-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-zinc-900 font-semibold py-4 px-6 rounded-2xl hover:bg-zinc-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6 shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Globe size={20} />
                Continue with Google
              </>
            )}
          </button>

          <p className="text-xs text-zinc-600 text-center leading-relaxed">
            By signing in, you agree that your bookmarks are stored securely
            in Supabase with Row-Level Security enforced at the database level.
          </p>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-zinc-600">
            <Shield size={11} />
            <span>Powered by Supabase Auth</span>
          </div>
        </div>
      </div>
    </div>
  )
}
