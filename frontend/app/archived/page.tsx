'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn, getUser, clearAuth } from '@/lib/auth'
import { FileText, Archive, LayoutDashboard, BarChart3, Plus, Menu, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import NoteCard from '@/components/NoteCard'
import NoteEditor from '@/components/NoteEditor'

const s = {
  bg: '#0a0a0f', bg2: '#111118', bg3: '#1a1a24',
  border: 'rgba(255,255,255,0.06)',
  accent: '#7c6ff7', accentDim: 'rgba(124,111,247,0.12)',
  text: '#f0f0f8', textMuted: '#6b6b8a',
}

export default function ArchivedPage() {
  const router = useRouter()
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNote, setSelectedNote] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return }
    setUser(getUser())
    fetchArchived()
  }, [])

  const fetchArchived = async () => {
    try {
      const { data } = await api.get('/notes', { params: { archived: 'true' } })
      setNotes(data.notes)
    } catch { toast.error('Failed to load archived notes') }
    finally { setLoading(false) }
  }

  const deleteNote = async (id: string) => {
    if (!confirm('Delete this note?')) return
    try {
      await api.delete(`/notes/${id}`)
      setNotes(prev => prev.filter(n => n._id !== id))
      toast.success('Deleted!')
    } catch {}
  }

  const unarchiveNote = async (id: string) => {
    try {
      const { data } = await api.patch(`/notes/${id}`, { isArchived: false })
      setNotes(prev => prev.filter(n => n._id !== id))
      toast.success('Note unarchived!')
    } catch {}
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'My Notes', href: '/notes' },
    { icon: Archive, label: 'Archived', href: '/archived' },
    { icon: BarChart3, label: 'Insights', href: '/insights' },
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
            const active = item.href === '/archived'
            return (
              <button key={item.href} onClick={() => router.push(item.href)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', border: active ? `1px solid rgba(124,111,247,0.2)` : '1px solid transparent', background: active ? s.accentDim : 'transparent', color: active ? s.accent : s.textMuted, fontWeight: 500, fontSize: '13px', cursor: 'pointer', marginBottom: '2px', textAlign: 'left' }}>
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
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: `1px solid ${s.border}`, background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 20 }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>Archived Notes</h1>
            <p style={{ fontSize: '12px', color: s.textMuted }}>{notes.length} archived notes</p>
          </div>
        </header>

        <div style={{ padding: '24px 28px' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
              {[1,2,3].map(i => <div key={i} style={{ background: s.bg3, borderRadius: '16px', height: '180px', opacity: 0.5 }} />)}
            </div>
          ) : notes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No archived notes</h3>
              <p style={{ fontSize: '14px', color: s.textMuted }}>Notes you archive will appear here</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '14px' }}>
              {notes.map(note => (
                <NoteCard key={note._id} note={note}
                  onClick={() => setSelectedNote(note)}
                  onDelete={deleteNote}
                  onArchive={unarchiveNote} />
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