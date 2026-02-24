# ResuEase — Project Context

## What is ResuEase?

A resume builder web application. Users authenticate, fill out structured forms, get AI-powered skill suggestions, preview their resume live, and export to PDF.

## Repository Structure

Informal monorepo — no workspace linking. Each app has its own `package.json` and runs independently.
`packages/types` is referenced via pnpm `link:` from both apps — no workspace root required.

```
ResuEase/
├── apps/app/
│   ├── backend/       # Express 5 API (port 3001)
│   ├── frontend/      # React 19 SPA via Vite 7 (port 5173)
│   └── web/           # Empty placeholder
├── packages/
│   └── types/         # @resuease/types — shared API contract types (frontend + backend)
└── docs/              # Architecture review
```

## Tech Stack

### Frontend (`apps/app/frontend/`)
- **React 19** + **Vite 7** + **Tailwind CSS 4**
- **React Router DOM 7** — 3 routes: `/auth`, `/`, `/resume-builder`
- **Supabase** — Auth only (email/password + Google + GitHub OAuth)
- **Lucide React** — Icons
- **pnpm** — Package manager

### Backend (`apps/app/backend/`)
- **Express 5** (Node.js)
- **Google Gemini API** (`gemini-2.5-flash-lite` via `@google/genai`) — AI skill suggestions
- **Puppeteer-core** — HTML-to-PDF via Browserless (`BROWSER_WS_ENDPOINT`) or local Chrome fallback
- **pnpm** — Package manager
- **Nixpacks** — Railway deployment

## API Endpoints (Backend)

| Method | Route                      | Purpose                        |
|--------|----------------------------|--------------------------------|
| GET    | `/`                        | Health check                   |
| GET    | `/api/test`                | Server info                    |
| POST   | `/api/ai/generate`         | Gemini connectivity test       |
| POST   | `/api/ai/soft-skills`      | AI soft skill suggestions      |
| POST   | `/api/ai/technical-skills` | AI technical skill suggestions |
| GET    | `/api/generate-test-pdf`   | Test PDF generation            |
| POST   | `/api/html-to-pdf`         | Convert HTML string to PDF     |

## Frontend Architecture

### Pages
- **AuthPage** (`/auth`) — Supabase Auth UI, public
- **HomePage** (`/`) — Dashboard, protected
- **ResumeBuilder** (`/resume-builder`) — Main editor, protected

### Key Directories
- `src/components/forms/sections/` — 17 section-level form components
- `src/components/forms/entries/` — 13 entry-level form components
- `src/components/forms/shared/` — Reusable: RichTextEditor, AiSkillSuggester, FormComponents
- `src/components/layout/` — TopNav, Sidebar, MainContent, PreviewPanel, BottomNav
- `src/components/resume/` — Resume templates (currently only HarvardTemplate)
- `src/hooks/` — useFormData, useSidebarStorage, useAuth, useDragDrop, useBulletPoints, useDeleteModal, useDebounce
- `src/services/` — AiService.ts, PdfService.ts
- `src/context/` — AuthContext (Supabase)
- `src/data/` — formFields.ts (initial data + schemas), sidebarItems.ts

### State Management
- **AuthContext** — Supabase user session
- **useFormData** — All resume data; auto-saves to localStorage with 2s debounce
- **useSidebarStorage** — Section ordering; persisted to localStorage
- No Redux or external state library

### Resume Data Shape (from `formFields.js`)
Top-level fields: `firstName`, `lastName`, `jobTitle`, `email`, `phone`, `location`, `portfolio`, `about`
Array sections: `projects`, `skills`, `technologiesSkills`, `education`, `employment`, `languages`, `internships`, `courses`, `references`, `links`, `hobbies`
Dynamic: `custom-{id}` sections

## External Services

### Frontend env vars (`apps/app/frontend/.env`)
| Service      | Purpose              | Env Variable              |
|--------------|----------------------|---------------------------|
| Supabase     | Authentication UI    | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| Backend API  | AI + PDF proxy       | `VITE_API_BASE_URL`       |

### Backend env vars (`apps/app/backend/.env`)
| Service      | Purpose              | Env Variable              |
|--------------|----------------------|---------------------------|
| Supabase     | JWT verification     | `SUPABASE_URL`, `SUPABASE_ANON_KEY` |
| Google Gemini| AI skill suggestions | `GOOGLE_GEMINI_API_KEY`   |
| Browserless  | Headless Chrome PDF  | `BROWSER_WS_ENDPOINT`     |
| Express      | CORS allowlist       | `CORS_ALLOWED_ORIGINS`    |

## Running Locally

```bash
# Backend
cd apps/app/backend
pnpm install
pnpm start          # or: node --import tsx server.ts

# Frontend
cd apps/app/frontend
pnpm install
pnpm dev            # Vite dev server
```

## Important Notes

- **No database for resume data** — Resumes live in localStorage scoped to `user.id`. No server-side persistence yet.
- **Supabase is auth-only** — Used for JWT verification on the backend and Auth UI on the frontend. Not used as a database.
- **Backend is stateless** — Pure proxy to Gemini and Puppeteer. No DB, no sessions.
- **Single resume template** — Only `HarvardTemplate` exists.
- **Rate limiting** — `aiLimiter` (20 req/min) on AI routes, `pdfLimiter` (10 req/min) on PDF route.
- **CORS** — Restricted to `CORS_ALLOWED_ORIGINS` env var (comma-separated allowlist).
- **Body limit** — 10MB for JSON payloads (needed for HTML-to-PDF).
- **Startup validation** — `validateConfig.ts` checks all required backend env vars at boot and exits with a full list if any are missing.

## Git Conventions

- Do NOT add `Co-Authored-By` or any author/co-author trailers to commit messages

## Conventions

- Always use context7 when I need code generation, setup or configuration steps, or library/API documentation
- Frontend uses `.tsx` extensions for all React components
- Tailwind utility classes for all styling (no CSS modules)
- Components are organized by feature domain, not by type
- Custom hooks encapsulate all stateful logic
- Services are static-method classes that call the backend API
- Brand color: blue (`#2563eb` / `#1d4ed8`)
