import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'btn-primary',
    'btn-ghost',
    'glass',
    'note-card',
    'stat-card',
    'tag',
    'sidebar',
    'main-content',
    'input-style',
    'accent-gradient',
    'shimmer-text',
    'ai-result',
    'editor-area',
    'card-hover',
    'animate-fade-in-up',
    'animate-float',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config