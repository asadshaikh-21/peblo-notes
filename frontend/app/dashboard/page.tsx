'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn, getUser, clearAuth } from '@/lib/auth'
import { Plus, Search, FileText, Sparkles, Archive, TrendingUp, Menu, X, LayoutDashboard, BarChart3, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import NoteCard from '@/components/NoteCard'
import NoteEditor from '@/components/NoteEditor'

const s = {
  bg: '#0a0a0f', bg2: '#111118', bg3: '#1a1a24',
  border: 'rgba(255,255,255,0.06)',
  accent: '#7c6ff7', accentDim: 'rgba(124,111,247,0.12)',
  text: '#f0f0f8', textMuted: '#6b6b8a', textDim: '#9999b8',
  green: '#00e5a0', greenDim: 'rgba(0,229,160,0.1)',
}

export default function Dashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notes, setNotes] = useState<any[]>([])
  const [insights, setInsights] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [selectedNote, setSelectedNote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const user = getUser()

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return }
    fetchNotes()
    fetchInsights()
  }, [])

  const fetchNotes = async (q = '') => {
    try {
      const params: any = {}
      if (q) params.search = q
      const { data } = await api.get('/notes', { params })
      setNotes(data.notes)
    } catch { toast.error('Failed to load notes') }
    finally { setLoading(false) }
  }

  const fetchInsights = async () => {
    try {
      const { data } = await api.get('/notes/insights')
      setInsights(data.insights)
    } catch {}
  }

  const createNote = async () => {
    try {
      const { data } = await api.post('/notes', { title: 'Untitled Note', content: '' })
      setNotes(prev => [data.note, ...prev])
      setSelectedNote(data.note)
      toast.success('Note created!')
    } catch { toast.error('Failed to create note') }
  }

  const deleteNote = async (id: string) => {
    if (!confirm('Delete this note?')) return
    try {
      await api.delete(`/notes/${id}`)
      setNotes(prev => prev.filter(n => n._id !== id))
      if (selectedNote?._id === id) setSelectedNote(null)
      toast.success('Note deleted')
    } catch {}
  }

  const archiveNote = async (id: string) => {
    try {
      const note = notes.find(n => n._id === id)
      const { data } = await api.patch(`/notes/${id}`, { isArchived: !note.isArchived })
      setNotes(prev => prev.map(n => n._id === id ? data.note : n))
    } catch {}
  }

  useEffect(() => {
    const timer = setTimeout(() => fetchNotes(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const statCards = [
    { icon: FileText, label: 'Total Notes', value: insights?.totalNotes ?? 0, color: s.accent, glow: 'rgba(124,111,247,0.2)' },
    { icon: Sparkles, label: 'AI Used', value: insights?.aiUsed ?? 0, color: s.green, glow: 'rgba(0,229,160,0.2)' },
    { icon: Archive, label: 'Archived', value: insights?.archivedNotes ?? 0, color: '#f59e0b', glow: 'rgba(245,158,11,0.2)' },
    { icon: TrendingUp, label: 'This Week', value: insights?.weeklyNotes ?? 0, color: '#06b6d4', glow: 'rgba(6,182,212,0.2)' },
  ]

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'My Notes', href: '/notes' },
    { icon: Archive, label: 'Archived', href: '/archived' },
    { icon: BarChart3, label: 'Insights', href: '/insights' },
  ]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: s.bg, fontFamily: 'DM Sans, sans-serif', color: s.text }}>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 30 }} />
      )}

      {/* Sidebar */}
      <aside style={{
        width: '260px', background: s.bg2, borderRight: `1px solid ${s.border}`,
        height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 40,
        display: 'flex', flexDirection: 'column',
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.3s ease',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: '13px' }}>P</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: '16px', fontFamily: 'Syne, sans-serif' }}>
              peblo<span style={{ color: s.accent }}>.</span>
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: s.textMuted, cursor: 'pointer', display: 'none' }}>
            <X size={16} />
          </button>
        </div>

        {/* New Note */}
        <div style={{ padding: '12px 16px' }}>
          <button onClick={createNote} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa)', color: 'white', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Plus size={15} /> New Note
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '4px 10px' }}>
          {navItems.map(item => {
            const Icon = item.icon
            const active = typeof window !== 'undefined' && window.location.pathname === item.href
            return (
              <button key={item.href} onClick={() => router.push(item.href)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', border: active ? `1px solid rgba(124,111,247,0.2)` : '1px solid transparent', background: active ? s.accentDim : 'transparent', color: active ? s.accent : s.textMuted, fontWeight: 500, fontSize: '13px', cursor: 'pointer', marginBottom: '2px', textAlign: 'left' }}>
                <Icon size={15} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* User */}
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${s.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
              <p style={{ fontSize: '11px', color: s.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={() => { clearAuth(); router.push('/login') }}
            style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'transparent', border: `1px solid ${s.border}`, color: s.textMuted, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: '260px', flex: 1, minHeight: '100vh' }}>

        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: `1px solid ${s.border}`, background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setSidebarOpen(true)}
              style={{ display: 'none', background: 'none', border: `1px solid ${s.border}`, color: s.textMuted, padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
              <Menu size={16} />
            </button>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>
                {greeting}, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p style={{ fontSize: '12px', color: s.textMuted, marginTop: '2px' }}>
                {notes.length} notes in your workspace
              </p>
            </div>
          </div>
          <button onClick={createNote}
            style={{ padding: '10px 18px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa)', color: 'white', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={15} /> New Note
          </button>
        </header>

        <div style={{ padding: '24px 28px' }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
            {statCards.map(card => {
              const Icon = card.icon
              return (
                <div key={card.label} style={{ background: s.bg3, border: `1px solid ${s.border}`, borderRadius: '16px', padding: '20px', transition: 'all 0.3s' }}>
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

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: s.textMuted }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search notes, tags, content..."
              style={{ width: '100%', padding: '12px 16px 12px 40px', background: s.bg3, border: `1px solid ${s.border}`, borderRadius: '12px', color: s.text, fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif' }} />
          </div>

          {/* Notes Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ background: s.bg3, border: `1px solid ${s.border}`, borderRadius: '16px', height: '180px', opacity: 0.5 }} />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No notes yet</h3>
              <p style={{ fontSize: '14px', color: s.textMuted, marginBottom: '24px' }}>
                {search ? 'No notes match your search' : 'Create your first note to get started!'}
              </p>
              {!search && (
                <button onClick={createNote}
                  style={{ padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c6ff7, #a78bfa)', color: 'white', border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                  Create First Note →
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
              {notes.map(note => (
                <NoteCard key={note._id} note={note}
                  onClick={() => setSelectedNote(note)}
                  onDelete={deleteNote}
                  onArchive={archiveNote} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedNote && (
        <NoteEditor note={selectedNote} onClose={() => setSelectedNote(null)}
          onUpdate={(updated) => {
            setNotes(prev => prev.map(n => n._id === updated._id ? updated : n))
            setSelectedNote(updated)
          }} />
      )}
    </div>
  )
}