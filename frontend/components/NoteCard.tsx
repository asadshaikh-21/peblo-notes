'use client'
import { FileText, Sparkles, Archive, Trash2 } from 'lucide-react'

interface Note {
  _id: string
  title: string
  content: string
  tags: string[]
  isArchived: boolean
  aiSummary: string | null
  updatedAt: string
}

interface NoteCardProps {
  note: Note
  onClick: () => void
  onDelete: (id: string) => void
  onArchive: (id: string) => void
}

const s = {
  bg3: '#1a1a24',
  border: 'rgba(255,255,255,0.06)',
  accent: '#7c6ff7',
  accentDim: 'rgba(124,111,247,0.12)',
  text: '#f0f0f8',
  textMuted: '#6b6b8a',
}

export default function NoteCard({ note, onClick, onDelete, onArchive }: NoteCardProps) {
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div onClick={onClick}
      style={{ background: s.bg3, border: `1px solid ${s.border}`, borderRadius: '16px', padding: '20px', cursor: 'pointer', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(124,111,247,0.3)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = s.border; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: s.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={13} color={s.accent} />
          </div>
          <span style={{ fontSize: '11px', color: s.textMuted }}>{timeAgo(note.updatedAt)}</span>
        </div>
        {note.aiSummary && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 8px', borderRadius: '100px', background: s.accentDim, color: s.accent }}>
            <Sparkles size={10} /> AI
          </div>
        )}
      </div>

      {/* Title */}
      <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: s.text }}>
        {note.title}
      </h3>

      {/* Preview */}
      <p style={{ fontSize: '12px', color: s.textMuted, lineHeight: 1.6, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {note.aiSummary || note.content || 'No content yet...'}
      </p>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {note.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '100px', background: s.accentDim, color: '#a78bfa', border: '1px solid rgba(124,111,247,0.2)' }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div onClick={e => e.stopPropagation()}
        style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: `1px solid ${s.border}` }}>
        <button onClick={() => onArchive(note._id)}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '6px 12px', borderRadius: '8px', background: 'transparent', border: `1px solid ${s.border}`, color: s.textMuted, cursor: 'pointer' }}>
          <Archive size={11} />
          {note.isArchived ? 'Unarchive' : 'Archive'}
        </button>
        <button onClick={() => onDelete(note._id)}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)', color: '#f43f5e', cursor: 'pointer' }}>
          <Trash2 size={11} /> Delete
        </button>
      </div>
    </div>
  )
}