'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn, getUser, clearAuth } from '@/lib/auth'
import { FileText, Archive, LayoutDashboard, BarChart3, Sparkles, TrendingUp, Plus, LogOut } from 'lucide-react'
import api from '@/lib/api'

const s = {
  bg: '#0a0a0f', bg2: '#111118', bg3: '#1a1a24',
  border: 'rgba(255,255,255,0.06)',
  accent: '#7c6ff7', accentDim: 'rgba(124,111,247,0.12)',
  text: '#f0f0f8', textMuted: '#6b6b8a',
  green: '#00e5a0',
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'My Notes', href: '/notes' },
  { icon: Archive, label: 'Archived', href: '/archived' },
  { icon: BarChart3, label: 'Insights', href: '/insights' },
]

export default function InsightsPage() {
  const router = useRouter()
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return }
    setUser(getUser())
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      const { data } = await api.get('/notes/insights')
      setInsights(data.insights)
    } catch {}
    finally { setLoading(false) }
  }

  const statCards = [
    { icon: FileText, label: 'Total Notes', value: insights?.totalNotes ?? 0, color: s.accent },
    { icon: Sparkles, label: 'AI Used', value: insights?.aiUsed ?? 0, color: s.green },
    { icon: Archive, label: 'Archived', value: insights?.archivedNotes ?? 0, color: '#f59e0b' },
    { icon: TrendingUp, label: 'This Week', value: insights?.weeklyNotes ?? 0, color: '#06b6d4' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: s.bg, fontFamily: 'DM Sans, sans-serif', color: s.text }}>

      {/* Sidebar */}
      <aside style={{ width: '260px', background: s.bg2, borderRight: `1px solid ${s.border}`, height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 40, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: '13px' }}>P</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: '16px', fontFamily: 'Syne, sans-serif' }}>
            peblo<span style={{ color: s.accent }}>.</span>
          </span>
        </div>

        <div style={{ padding: '12px 16px' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa)', color: 'white', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Plus size={15} /> New Note
          </button>
        </div>

        <nav style={{ flex: 1, padding: '4px 10px' }}>
          {navItems.map(item => {
            const Icon = item.icon
            const active = item.href === '/insights'
            return (
              <button key={item.href} onClick={() => router.push(item.href)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', border: active ? '1px solid rgba(124,111,247,0.2)' : '1px solid transparent', background: active ? s.accentDim : 'transparent', color: active ? s.accent : s.textMuted, fontWeight: 500, fontSize: '13px', cursor: 'pointer', marginBottom: '2px', textAlign: 'left' }}>
                <Icon size={15} />{item.label}
              </button>
            )
          })}
        </nav>

        <div style={{ padding: '12px 16px', borderTop: `1px solid ${s.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600 }}>{user?.name}</p>
              <p style={{ fontSize: '11px', color: s.textMuted }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={() => { clearAuth(); router.push('/login') }}
            style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'transparent', border: `1px solid ${s.border}`, color: s.textMuted, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: '260px', flex: 1 }}>
        <header style={{ padding: '16px 28px', borderBottom: `1px solid ${s.border}`, background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 20 }}>
          <h1 style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>Insights</h1>
          <p style={{ fontSize: '12px', color: s.textMuted, marginTop: '2px' }}>Your productivity overview</p>
        </header>

        <div style={{ padding: '24px 28px' }}>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '28px' }}>
            {statCards.map(card => {
              const Icon = card.icon
              return (
                <div key={card.label} style={{ background: s.bg3, border: `1px solid ${s.border}`, borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${card.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={17} color={card.color} />
                    </div>
                    <span style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Syne, sans-serif' }}>{card.value}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: s.textMuted, fontWeight: 500 }}>{card.label}</p>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Top Tags */}
            <div style={{ background: s.bg3, border: `1px solid ${s.border}`, borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>🏷️ Most Used Tags</h3>
              {!insights?.topTags?.length ? (
                <p style={{ fontSize: '13px', color: s.textMuted }}>No tags yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {insights.topTags.map((t: any) => (
                    <div key={t.tag}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 500 }}>#{t.tag}</span>
                        <span style={{ color: s.textMuted }}>{t.count} notes</span>
                      </div>
                      <div style={{ height: '6px', borderRadius: '100px', background: s.bg2 }}>
                        <div style={{ height: '100%', borderRadius: '100px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa)', width: `${(t.count / insights.topTags[0].count) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Notes */}
            <div style={{ background: s.bg3, border: `1px solid ${s.border}`, borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>📝 Recently Edited</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {insights?.recentNotes?.map((note: any) => (
                  <div key={note._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${s.border}` }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: '12px' }}>{note.title}</p>
                    <span style={{ fontSize: '11px', color: s.textMuted, flexShrink: 0 }}>
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}