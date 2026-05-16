'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { setAuth } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      setAuth(data.token, data.user)
      toast.success('Welcome back! 👋')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', fontFamily: 'DM Sans, sans-serif', padding: '20px' }}>

      {/* Orb */}
      <div style={{ position: 'fixed', top: '30%', left: '30%', width: '400px', height: '400px', borderRadius: '50%', background: '#7c6ff7', filter: 'blur(120px)', opacity: 0.07, pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '40px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: '20px' }}>P</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#f0f0f8', fontFamily: 'Syne, sans-serif', marginBottom: '4px' }}>Welcome back</h1>
            <p style={{ fontSize: '13px', color: '#6b6b8a' }}>Sign in to your workspace</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b6b8a', marginBottom: '8px', letterSpacing: '0.08em' }}>EMAIL</label>
              <input type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com" required
                style={{ width: '100%', padding: '12px 16px', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#f0f0f8', fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b6b8a', marginBottom: '8px', letterSpacing: '0.08em' }}>PASSWORD</label>
              <input type="password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••" required
                style={{ width: '100%', padding: '12px 16px', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#f0f0f8', fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif' }} />
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', borderRadius: '12px', background: loading ? '#555' : 'linear-gradient(135deg, #7c6ff7, #a78bfa)', color: 'white', fontWeight: 700, fontSize: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b6b8a', marginTop: '24px' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#7c6ff7', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}