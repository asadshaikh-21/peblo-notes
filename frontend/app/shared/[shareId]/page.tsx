'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import { FileText, Sparkles, Calendar } from 'lucide-react'

export default function SharedNotePage() {
  const { shareId } = useParams()
  const [note, setNote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/notes/shared/${shareId}`)
        setNote(data.note)
      } catch { setError(true) }
      finally { setLoading(false) }
    }
    fetch()
  }, [shareId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-center">
        <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white font-black">P</span>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>Loading note...</p>
      </div>
    </div>
  )

  if (error || !note) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="font-black text-xl mb-2">Note not found</h2>
        <p style={{ color: 'var(--text-muted)' }}>This note may have been made private or deleted.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg accent-gradient flex items-center justify-center">
              <span className="text-white font-black text-xs">P</span>
            </div>
            <span className="font-black" style={{ fontFamily: 'Syne, sans-serif' }}>
              peblo<span style={{ color: 'var(--accent)' }}>.</span>
            </span>
          </div>
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>
            Public Note
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-6" style={{ color: 'var(--text-muted)' }}>
          <FileText size={14} />
          <span className="text-sm">Shared by {note.user?.name}</span>
          <span>·</span>
          <Calendar size={14} />
          <span className="text-sm">{new Date(note.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black mb-4 leading-tight">{note.title}</h1>

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {note.tags.map((tag: string) => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        {/* AI Summary */}
        {note.aiSummary && (
          <div className="ai-result mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} style={{ color: 'var(--accent)' }} />
              <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>AI SUMMARY</span>
            </div>
            <p className="text-sm leading-relaxed">{note.aiSummary}</p>
            {note.aiActionItems?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>ACTION ITEMS</p>
                <ul className="space-y-1">
                  {note.aiActionItems.map((item: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span style={{ color: 'var(--accent)' }}>→</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-dim)' }}>
            {note.content}
          </p>
        </div>
      </main>
    </div>
  )
}