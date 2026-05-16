'use client'
import { useState, useEffect, useRef } from 'react'
import { X, Sparkles, Share2, Tag, Save, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

interface NoteEditorProps {
  note: any
  onClose: () => void
  onUpdate: (note: any) => void
}

const s = {
  bg: '#0a0a0f', bg2: '#111118', bg3: '#1a1a24',
  border: 'rgba(255,255,255,0.06)',
  accent: '#7c6ff7', accentDim: 'rgba(124,111,247,0.12)',
  text: '#f0f0f8', textMuted: '#6b6b8a', textDim: '#9999b8',
  green: '#00e5a0',
}

export default function NoteEditor({ note, onClose, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [tags, setTags] = useState<string[]>(note.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [aiResult, setAiResult] = useState<any>(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveNote(), 1500)
    return () => clearTimeout(saveTimer.current)
  }, [title, content, tags])

  const saveNote = async () => {
    setSaving(true)
    try {
      const { data } = await api.patch(`/notes/${note._id}`, { title, content, tags })
      onUpdate(data.note)
    } catch {}
    finally { setTimeout(() => setSaving(false), 500) }
  }

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      const newTag = tagInput.trim().toLowerCase()
      if (!tags.includes(newTag)) setTags(prev => [...prev, newTag])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag))

  const generateAI = async () => {
    setLoadingAI(true)
    try {
      const { data } = await api.post(`/notes/${note._id}/generate-summary`)
      setAiResult(data.ai)
      onUpdate({ ...note, aiSummary: data.ai.summary })
      toast.success('AI analysis complete! ✨')
    } catch { toast.error('AI generation failed') }
    finally { setLoadingAI(false) }
  }

  const shareNote = async () => {
    try {
      const { data } = await api.post(`/notes/${note._id}/share`)
      const url = `${window.location.origin}/shared/${data.shareId}`
      setShareUrl(url)
      toast.success('Share link generated!')
    } catch { toast.error('Failed to generate share link') }
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied!')
  }

  return (
    // Full screen overlay
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      padding: '20px',
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>

      {/* Modal */}
      <div style={{
        width: '100%', maxWidth: '760px',
        maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        background: s.bg3,
        border: `1px solid ${s.border}`,
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: `1px solid ${s.border}`, background: s.bg2, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={13} color={s.textMuted} />
            <span style={{ fontSize: '12px', color: saving ? s.accent : s.textMuted }}>
              {saving ? 'Saving...' : 'Auto-saved'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={generateAI} disabled={loadingAI}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: s.accentDim, border: '1px solid rgba(124,111,247,0.25)', color: s.accent, fontSize: '12px', fontWeight: 600, cursor: loadingAI ? 'not-allowed' : 'pointer', opacity: loadingAI ? 0.6 : 1, fontFamily: 'DM Sans, sans-serif' }}>
              <Sparkles size={13} />
              {loadingAI ? 'Generating...' : 'AI Summary'}
            </button>
            <button onClick={shareNote}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: 'transparent', border: `1px solid ${s.border}`, color: s.textMuted, fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              <Share2 size={13} /> Share
            </button>
            <button onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: 'transparent', border: `1px solid ${s.border}`, color: s.textMuted, cursor: 'pointer' }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px' }}>

          {/* Title */}
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Note title..."
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '26px', fontWeight: 900, color: s.text, fontFamily: 'Syne, sans-serif', marginBottom: '16px', letterSpacing: '-0.5px' }} />

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${s.border}` }}>
            <Tag size={13} color={s.textMuted} />
            {tags.map(tag => (
              <button key={tag} onClick={() => removeTag(tag)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '100px', background: s.accentDim, color: '#a78bfa', border: '1px solid rgba(124,111,247,0.2)', cursor: 'pointer' }}>
                #{tag} <X size={9} />
              </button>
            ))}
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
              placeholder="Add tag..."
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '12px', color: s.textMuted, width: '80px', fontFamily: 'DM Sans, sans-serif' }} />
          </div>

          {/* Content */}
          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder="Start writing your note... (AI will analyze when you click AI Summary)"
            style={{ width: '100%', minHeight: '200px', background: 'transparent', border: 'none', outline: 'none', fontSize: '15px', lineHeight: 1.8, color: s.textDim, fontFamily: 'DM Sans, sans-serif', resize: 'none' }} />

          {/* AI Result */}
          {aiResult && (
            <div style={{ marginTop: '24px', background: 'linear-gradient(135deg, rgba(124,111,247,0.08), rgba(6,182,212,0.05))', border: '1px solid rgba(124,111,247,0.2)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Sparkles size={14} color={s.accent} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: s.accent, letterSpacing: '0.08em' }}>AI ANALYSIS</span>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: s.textMuted, marginBottom: '6px', letterSpacing: '0.06em' }}>SUMMARY</p>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: s.text }}>{aiResult.summary}</p>
              </div>
              {aiResult.action_items?.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: s.textMuted, marginBottom: '8px', letterSpacing: '0.06em' }}>ACTION ITEMS</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {aiResult.action_items.map((item: string, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: s.textDim }}>
                        <span style={{ color: s.accent, flexShrink: 0 }}>→</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {aiResult.suggested_title && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: s.textMuted, marginBottom: '6px', letterSpacing: '0.06em' }}>SUGGESTED TITLE</p>
                  <button onClick={() => setTitle(aiResult.suggested_title)}
                    style={{ fontSize: '13px', padding: '6px 14px', borderRadius: '8px', background: s.accentDim, color: s.accent, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    Use: "{aiResult.suggested_title}"
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Share URL */}
          {shareUrl && (
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: s.bg2, border: `1px solid ${s.border}`, borderRadius: '12px' }}>
              <input value={shareUrl} readOnly
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '12px', color: s.textDim, fontFamily: 'DM Sans, sans-serif' }} />
              <button onClick={copyUrl}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '8px', background: s.accentDim, border: 'none', cursor: 'pointer', color: s.accent }}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}