# CLAUDE.md

## Commands

### Frontend (`apps/app/frontend`)
```bash
pnpm dev          # Start Vite dev server at http://localhost:5173
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm test         # Run tests once
pnpm test:watch   # Run tests in watch mode
```

### Backend (`apps/app/backend`)
```bash
pnpm dev          # Start with tsx watch (hot reload)
pnpm start        # Start production server
pnpm build        # tsc compile
pnpm test         # Run tests once
pnpm test:watch   # Run tests in watch mode
```

### Running a single test file
```bash
# From the relevant app directory
pnpm vitest run src/__tests__/controllers/aiController.test.ts
```

## Environment Variables

**Backend** (`.env` in `apps/app/backend`):
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase anonymous key
- `GOOGLE_GEMINI_API_KEY` — Google Gemini API key (model: `gemini-2.5-flash-lite`)
- `CORS_ALLOWED_ORIGINS` — Comma-separated allowed origins (defaults to `http://localhost:5173`)

**Frontend** (`.env` in `apps/app/frontend`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL` — e.g. `http://localhost:3001/api`

## Architecture

### Monorepo Structure
- `apps/app/frontend` — React 19 + Vite + TypeScript + Tailwind CSS v4
- `apps/app/backend` — Express 5 + TypeScript (ESM), runs with `tsx`
- `packages/types` — Shared TypeScript interfaces consumed by both apps via `@resuease/types`

### Frontend Architecture

**Pages & Routing** (`App.tsx`): Three routes — `/auth`, `/` (home, protected), `/resume-builder` (protected). `AuthProvider` wraps the entire tree.

**`ResumeBuilder` page** is the main feature. It composes:
- `Sidebar` — section navigation with drag-and-drop reordering; sidebar state persisted to `localStorage` per user via `useSidebarStorage`
- `MainContent` — renders the active section's form
- `PreviewPanel` — live PDF.js resume preview with debounced updates (300ms)
- `TopNavigation` — browser-side PDF download trigger

**Form data flow**: `useFormData(userId)` centralizes all resume state. Data auto-saves to `localStorage` with a 2-second debounce under the key `resumeBuilder_formData_<userId>`. Section items are managed via `addSectionItem` / `updateSectionItem` / `removeSectionItem`.

**Section system**: Sections are defined in `data/sidebarItems.ts`. Fixed sections (`personal`, `contact`) cannot be removed. Additional sections (summary, internships, references, languages, links, custom) can be added. Custom sections use IDs like `custom-1`, `custom-2` and store data under `customEntries_custom-<N>` in `formData`.

**Forms**: Each resume section has a `*Form.tsx` in `components/forms/sections/` backed by individual `*EntryForm.tsx` components in `components/forms/entries/`. AI features are in `components/forms/shared/` — `AiTextActions` (text transform) and `AiSkillSuggester` (skill suggestions).

**Resume document pipeline**: `buildResumeDocumentModel` converts `FormData` + `SidebarItem[]` into a deterministic, locale-resolved model. `HarvardPdfDocument` renders that model with `@react-pdf/renderer`; `useResumePdf` shares the resulting Blob between the lazy PDF.js preview and download, with revision-keyed artifact caching. This is entirely browser-side and does not call the backend.

**Auth**: `AuthContext` provides `user`, `signIn`, `signOut`, `signUp` via Supabase. The `useAuth` hook reads from context. `ProtectedRoute` redirects to `/auth` if unauthenticated.

### Backend Architecture

**Server** (`server.ts`): Express 5 app. Validates required env vars on startup (exits immediately if any are missing — see `src/lib/validateConfig.ts`). AI endpoints are rate-limited to 20 req/min and require `requireAuth` middleware.

**Auth middleware** (`src/middleware/auth.ts`): Verifies Supabase JWT from `Authorization: Bearer <token>` header. Attaches the decoded user to `req.user`.

**AI controller** (`src/controllers/aiController.ts`): Uses `@google/genai` with `gemini-2.5-flash-lite`. Provides `softSkills`, `technicalSkills`, and `textTransform` endpoints. Text transform prompts are built per-section by `src/lib/textTransformPrompts.ts` to provide context-aware AI instructions.

**API routes**:
- `POST /api/ai/soft-skills` — AI soft skill suggestions
- `POST /api/ai/technical-skills` — AI technical skill suggestions
- `POST /api/ai/text-transform` — Rewrite / add-metrics / make-stronger text transforms

### Shared Types (`packages/types`)
All request/response interfaces for AI endpoints live in `packages/types/src/index.ts` and are imported as `@resuease/types` in frontend services and backend controllers.

### Testing
Both apps use **Vitest**. Frontend uses `jsdom` environment with `@testing-library/react`. Backend uses `node` environment with `supertest` for HTTP integration tests. Test files live in `src/__tests__/` subdirectories mirroring the source structure.

### Resume Data Shape (from `formFields.ts`)
Top-level fields: `firstName`, `lastName`, `jobTitle`, `email`, `phone`, `location`, `portfolio`, `about`
Array sections: `projects`, `skills`, `technologiesSkills`, `education`, `employment`, `languages`, `internships`, `courses`, `references`, `links`, `hobbies`
Dynamic: `customEntries_custom-{id}` keys for custom sections

## Git Conventions

- Do NOT add `Co-Authored-By` or any author/co-author trailers to commit messages

## Conventions

- Always use context7 when you need code generation, setup or configuration steps, or library/API documentation
- Frontend uses `.tsx` extensions for all React components
- Tailwind utility classes for all styling (no CSS modules)
