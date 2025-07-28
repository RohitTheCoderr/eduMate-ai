import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import Link from "next/link";

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else router.push('/login')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSignUp} className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-xl mb-4 font-bold">Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-3 w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-3 w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}


        <div className="flex gap-4 mt-8">
          Create Account
          <Link
            href="/signup"
            className="px-4 py-2 text-blue-500 rounded hover:text-blue-700"
          >
            Signup
          </Link>
        </div>
      </form>
    </div>
  )
}
