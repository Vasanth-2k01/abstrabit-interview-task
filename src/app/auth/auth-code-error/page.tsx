import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md glass rounded-3xl border border-white/10 p-10 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={30} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Authentication Error</h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          Something went wrong during sign-in. This can happen if the
          authorization code has expired or already been used. Please try again.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all active:scale-[0.98]"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}
