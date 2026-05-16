'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn } from '@/lib/auth'
import Link from 'next/link'

export default function LandingPage() {
  const router = useRouter()
  useEffect(() => { if (isLoggedIn()) router.push('/dashboard') }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0f', color: '#f0f0f8', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: '14px' }}>P</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: '18px', fontFamily: 'Syne, sans-serif' }}>
            peblo<span style={{ color: '#7c6ff7' }}>.</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/login" style={{ padding: '8px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#9999b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s' }}>
            Login
          </Link>
          <Link href="/register" style={{ padding: '8px 18px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa)', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Get Started →
          </Link>
        </div>
      </nav>

      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '25%', left: '25%', width: '400px', height: '400px', borderRadius: '50%', background: '#7c6ff7', filter: 'blur(120px)', opacity: 0.08 }} />
        <div style={{ position: 'absolute', bottom: '25%', right: '25%', width: '300px', height: '300px', borderRadius: '50%', background: '#06b6d4', filter: 'blur(120px)', opacity: 0.06 }} />
      </div>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 20px', position: 'relative', zIndex: 1 }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.2)', color: '#00e5a0', fontSize: '12px', fontWeight: 600, marginBottom: '32px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00e5a0', display: 'inline-block' }} />
          AI-Powered Notes Workspace
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(48px, 10vw, 96px)', fontWeight: 900, lineHeight: 1, letterSpacing: '-3px', marginBottom: '24px', fontFamily: 'Syne, sans-serif' }}>
          Notes that<br />
          <span style={{ background: 'linear-gradient(90deg, #7c6ff7, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            think with you
          </span>
        </h1>

        {/* Desc */}
        <p style={{ fontSize: '17px', color: '#9999b8', maxWidth: '500px', lineHeight: 1.8, marginBottom: '40px' }}>
          Create, organize, and supercharge your notes with AI summaries, action items, and smart insights. Built for deep thinkers.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '80px' }}>
          <Link href="/register" style={{ padding: '14px 32px', borderRadius: '16px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa)', color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: 700, boxShadow: '0 8px 24px rgba(124,111,247,0.4)' }}>
            Start for free →
          </Link>
          <Link href="/login" style={{ padding: '14px 32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#9999b8', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>
            Sign in
          </Link>
        </div>

        {/* Feature cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '720px', width: '100%' }}>
          {[
            { icon: '✨', title: 'AI Summaries', desc: 'Instant summaries & action items' },
            { icon: '🔍', title: 'Smart Search', desc: 'Find any note instantly' },
            { icon: '🔗', title: 'Public Sharing', desc: 'Share notes with anyone' },
          ].map((f) => (
            <div key={f.title} style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px', textAlign: 'left', transition: 'all 0.3s' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{f.icon}</div>
              <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{f.title}</p>
              <p style={{ fontSize: '12px', color: '#6b6b8a' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', color: '#6b6b8a', fontSize: '12px' }}>
        Built with ❤️ by Asad Shaikh · Peblo Notes © 2026
      </footer>
    </div>
  )
}