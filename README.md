# Peblo Notes — AI-Powered Collaborative Workspace

> A smart, full-stack notes application with AI-generated summaries, action items, real-time auto-save, public sharing, and productivity insights.

🔗 **Live Demo:** [https://peblo-notes-zjnq.vercel.app](https://peblo-notes-zjnq.vercel.app)  
🐙 **GitHub:** [https://github.com/asadshaikh-21/peblo-notes](https://github.com/asadshaikh-21/peblo-notes)  
👨‍💻 **Built by:** Asad Shaikh

---

## Screenshots

### Landing Page
![Landing Page](https://peblo-notes-zjnq.vercel.app/og-preview.png)

> Dark editorial design with gradient hero, feature cards, and clear CTAs.

### Dashboard
> Stats overview, note cards with AI badges, search, and sidebar navigation.

### Note Editor
> Centered modal editor with auto-save, tag management, AI summary, and public share link generation.

### Insights Page
> Tag usage charts, recently edited notes, weekly activity, and AI usage stats.

---

## What I Built

Peblo Notes is a lightweight, collaborative, AI-powered notes workspace built as a full-stack product. It lets users:

1. Create and manage notes with auto-save
2. Organise notes using tags and categories
3. Generate AI summaries, action items, and suggested titles using Google Gemini API
4. Search and filter notes by keyword or tag
5. Share notes publicly via unique URLs
6. View productivity insights on a personal dashboard

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT                             │
│   Next.js 14 (App Router) + TypeScript + Inline Styles  │
│   Deployed on Vercel                                    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP / REST API
                       ▼
┌─────────────────────────────────────────────────────────┐
│                     BACKEND                             │
│   Node.js + Express.js                                  │
│   JWT Authentication + bcryptjs                         │
│   Rate Limiting + Input Validation                      │
│   Deployed on Render                                    │
└──────────────────────┬──────────────────────────────────┘
                       │ Mongoose ODM
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    DATABASE                             │
│   MongoDB Atlas (Cloud)                                 │
│   Collections: Users, Notes                             │
└─────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   AI LAYER                              │
│   Google Gemini 1.5 Flash API                           │
│   Prompt → JSON parsing → Graceful fallback             │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
User types note
    ↓
Auto-save triggers (1.5s debounce)
    ↓
PATCH /api/v1/notes/:id
    ↓
MongoDB updated
    ↓
[Optional] POST /api/v1/notes/:id/generate-summary
    ↓
Gemini API called with note content
    ↓
JSON response parsed → { summary, action_items, suggested_title }
    ↓
Stored in note document
    ↓
Returned to client and displayed
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14 (App Router) | SSR, file-based routing, modern React |
| Language | TypeScript | Type safety, better DX |
| Styling | Inline styles + CSS variables | Bypasses Tailwind purging issues in Next.js 16 |
| Backend | Node.js + Express.js | Fast, familiar, great ecosystem |
| Database | MongoDB + Mongoose | Flexible schema for notes/tags |
| Auth | JWT + bcryptjs | Stateless, secure, scalable |
| AI | Google Gemini 1.5 Flash | Fast, free tier, excellent JSON output |
| Deployment | Vercel (FE) + Render (BE) | Industry standard, free tiers |

---

## Project Structure

```
peblo-notes/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, GetMe
│   │   └── noteController.js     # CRUD, AI summary, sharing, insights
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   ├── models/
│   │   ├── User.js               # User schema with password hashing
│   │   └── Note.js               # Note schema with AI fields + shareId
│   ├── routes/
│   │   ├── authRoutes.js         # /api/v1/auth
│   │   └── noteRoutes.js         # /api/v1/notes
│   ├── .env.example
│   └── server.js                 # Express app entry point
│
└── frontend/
    ├── app/
    │   ├── page.tsx              # Landing page
    │   ├── layout.tsx            # Root layout
    │   ├── login/page.tsx        # Login page
    │   ├── register/page.tsx     # Register page
    │   ├── dashboard/page.tsx    # Main dashboard
    │   ├── notes/page.tsx        # All notes view
    │   ├── archived/page.tsx     # Archived notes
    │   ├── insights/page.tsx     # Productivity insights
    │   └── shared/[shareId]/     # Public shared note view
    ├── components/
    │   ├── NoteCard.tsx          # Note preview card
    │   ├── NoteEditor.tsx        # Full note editor modal
    │   └── Navbar.tsx            # Top navigation
    └── lib/
        ├── api.ts                # Axios instance with interceptors
        └── auth.ts               # Auth helpers (localStorage)
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login + get JWT |
| GET | `/api/v1/auth/me` | Get current user |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/notes` | Get all notes (search, filter, sort) |
| POST | `/api/v1/notes` | Create note |
| GET | `/api/v1/notes/:id` | Get single note |
| PATCH | `/api/v1/notes/:id` | Update note (auto-save) |
| DELETE | `/api/v1/notes/:id` | Delete note |
| POST | `/api/v1/notes/:id/generate-summary` | Generate AI summary |
| POST | `/api/v1/notes/:id/share` | Generate public share link |
| GET | `/api/v1/notes/shared/:shareId` | Get public note (no auth) |
| GET | `/api/v1/notes/insights` | Get dashboard insights |

---

## Features

### Core
- ✅ JWT Authentication (register, login, logout, protected routes)
- ✅ Create, read, update, delete notes
- ✅ Auto-save with 1.5s debounce
- ✅ Tag management (add/remove inline)
- ✅ Archive/unarchive notes
- ✅ Keyword search across title, content, tags
- ✅ Sort by newest/oldest

### AI (Google Gemini 1.5 Flash)
- ✅ AI-generated summary (2-3 sentences)
- ✅ Action items extracted from note content
- ✅ Suggested title based on content
- ✅ Graceful fallback if API fails

### Sharing
- ✅ Unique public URL per note (UUID-based)
- ✅ Public share page (no login required)
- ✅ Copy share link to clipboard

### Insights Dashboard
- ✅ Total notes count
- ✅ AI usage statistics
- ✅ Archived notes count
- ✅ Weekly activity count
- ✅ Most used tags with bar chart
- ✅ Recently edited notes list

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### 1. Clone the repo
```bash
git clone https://github.com/asadshaikh-21/peblo-notes.git
cd peblo-notes
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## Deployment

### Backend → Render
1. Push to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Connect repo → select `backend` folder
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables

### Frontend → Vercel
1. Import repo on [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL=your_render_url/api/v1`
4. Deploy

---

## AI Integration Approach

The AI feature uses **Google Gemini 1.5 Flash** for speed and cost efficiency.

### Prompt Design
```
Analyze this note and provide:
1. A concise summary (2-3 sentences)
2. Key action items (max 5 bullet points)
3. A suggested title (max 8 words)

Note content: "..."

Respond in this exact JSON format:
{
  "summary": "...",
  "action_items": ["item1", "item2"],
  "suggested_title": "..."
}
```

### Why hardcoded rules for audit logic?
The note-saving, tagging, archiving, and search logic uses **deterministic code** — not AI. AI is only used where it genuinely adds value: understanding unstructured text and generating human-readable summaries. This keeps the system predictable and fast.

### Fallback Handling
If the Gemini API fails (rate limit, network error, etc.), the system falls back to a templated summary based on word count and title — so the user always gets a response.

---

## Decisions Made

| Decision | Why |
|----------|-----|
| Inline styles over Tailwind | Next.js 16 Turbopack had CSS purging issues with custom classes; inline styles are always reliable |
| MongoDB over PostgreSQL | Notes with dynamic tags fit a document model better than relational tables |
| Gemini over OpenAI | Free tier is generous, Flash model is fast, JSON output is reliable |
| JWT over sessions | Stateless auth scales better; no server-side session storage needed |
| Debounced auto-save | Better UX than manual save; 1.5s delay prevents excessive API calls |
| UUID for share IDs | Unpredictable, collision-resistant, no sequential enumeration risk |

---

## Improvements With More Time

1. **Real-time collaboration** using WebSockets (Socket.io)
2. **Markdown support** with preview toggle
3. **PDF export** of notes and AI summaries
4. **Email notifications** for shared notes using Resend
5. **OAuth** (Google/GitHub login) via NextAuth
6. **Folders/Workspaces** for better note organisation
7. **Dark/Light mode toggle**
8. **Mobile app** using React Native

---

## Environment Variables

### Backend `.env.example`
```env
PORT=5000
MONGO_URI=
JWT_SECRET=
JWT_EXPIRE=7d
GEMINI_API_KEY=
NODE_ENV=development
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=
```

---

## Author

**Asad Shaikh**  
Full Stack Developer | AI Integration Engineer  
📧 shaikhasadimam@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/asad-shaikh-9677522a2)  
🐙 [GitHub](https://github.com/asadshaikh-21)  
🌐 [Portfolio](https://asadshaikh.vercel.app)

---

*Built with ❤️ for the Peblo internship assignment*
