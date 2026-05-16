import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Peblo Notes — AI-Powered Collaborative Workspace',
  description: 'Smart notes with AI summaries, action items, and collaborative features.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1a24',
              color: '#f0f0f8',
              border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#00e5a0', secondary: '#0a0a0f' } },
            error: { iconTheme: { primary: '#f43f5e', secondary: '#0a0a0f' } },
          }}
        />
      </body>
    </html>
  )
}