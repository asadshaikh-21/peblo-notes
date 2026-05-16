'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { isLoggedIn, clearAuth } from '@/lib/auth'

export default function Navbar() {
  const router = useRouter()
  const loggedIn = isLoggedIn()

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: '14px' }}>P</span>
        </div>
        <span style={{ fontWeight: 800, fontSize: '18px', fontFamily: 'Syne, sans-serif', color: '#f0f0f8' }}>
          peblo<span style={{ color: '#7c6ff7' }}>.</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {loggedIn ? (
          <>
            <Link href="/dashboard" style={{ padding: '8px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#9999b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              Dashboard
            </Link>
            <button onClick={handleLogout} style={{ padding: '8px 18px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa)', color: 'white', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ padding: '8px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#9999b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              Login
            </Link>
            <Link href="/register" style={{ padding: '8px 18px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa)', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
              Get Started →
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}