'use client'
import { useRouter, usePathname } from 'next/navigation'
import { clearAuth, getUser } from '@/lib/auth'
import { LayoutDashboard, FileText, Archive, BarChart3, LogOut, Plus, X } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onNewNote: () => void
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'My Notes', href: '/notes' },
  { icon: Archive, label: 'Archived', href: '/archived' },
  { icon: BarChart3, label: 'Insights', href: '/insights' },
]

export default function Sidebar({ isOpen, onClose, onNewNote }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const user = getUser()

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onClose} />
      )}

      <aside className={`sidebar w-70 flex flex-col ${isOpen ? 'open' : ''}`} style={{ width: '280px' }}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg accent-gradient flex items-center justify-center">
              <span className="text-white font-black text-sm">P</span>
            </div>
            <span className="font-black text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>
              peblo<span style={{ color: 'var(--accent)' }}>.</span>
            </span>
          </div>
          <button onClick={onClose} className="md:hidden p-1 rounded-lg btn-ghost">
            <X size={16} />
          </button>
        </div>

        {/* New Note Button */}
        <div className="p-4">
          <button onClick={onNewNote}
            className="btn-primary w-full py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2">
            <Plus size={16} />
            New Note
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <button key={item.href} onClick={() => { router.push(item.href); onClose() }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'text-white'
                    : 'hover:bg-white/5'
                }`}
                style={{
                  background: active ? 'var(--accent-dim)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  border: active ? '1px solid rgba(124,111,247,0.2)' : '1px solid transparent',
                }}>
                <Icon size={16} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl accent-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="btn-ghost w-full py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2">
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}