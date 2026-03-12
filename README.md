# Travel Globe

A mobile-first 3D travel archive: visualize countries and cities you’ve visited through photos and travel posts. The experience is built around a minimal 3D world map with smooth interaction and clear visualization of your travel history.

---

## Core Features

- Simplified 3D world map with grey country borders
- Smooth camera transitions
- Photo-based travel archives with EXIF-assisted location detection
- Country color intensity reflecting visit data
- Mobile-friendly country detail view
- Supabase-backed persistence

---

## Visual Style

The map aims for a **clean, premium** look rather than photorealism:

- Minimal white surfaces and soft shadows
- Grey country borders
- Smooth animations and lightweight rendering

---

## Tech Stack

**Frontend:** Next.js, TypeScript, Tailwind CSS, React Three Fiber, Drei, Framer Motion, Zustand

**Backend:** Supabase Auth, Postgres, Storage

**Testing:** Vitest, React Testing Library, Playwright

---

## Project Architecture

The project is set up for **multi-agent development**. Five agents have defined roles:

| Agent            | Responsibility       |
| ---------------- | -------------------- |
| Map Engine       | 3D rendering         |
| Supabase         | Persistence layer    |
| Mobile UX        | Responsive interface |
| Color/Data Logic | Archive statistics   |
| CTO Agent        | Planning and review  |

Each subsystem has clear ownership to reduce conflicts.

---

## Local Development

Install and run:

```bash
npm install
npm run dev
```

### Quality checks

- **Lint:** `npm run lint`
- **Unit tests:** `npm run test`
- **Production build:** `npm run build`
- **E2E tests:** `npm run test:e2e`

### Environment variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_APP_NAME=Travel Globe
NEXT_PUBLIC_DEFAULT_THEME=red
```

### Supabase persistence setup

This repository now includes the first persistence wave under [`supabase/migrations`](./supabase/migrations) and [`src/lib/supabase`](./src/lib/supabase).

Apply the schema to your Supabase project with the Supabase CLI from the repository root:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

The migration provisions:

- `profiles` for user preferences
- `visits` as the core durable archive entity
- `photo_assets` for uploaded photo metadata and EXIF inference snapshots
- `travel_posts` for text memories linked to visits
- private `travel-photos` storage with folder-based RLS policies

### Storage convention

Uploaded photos should live in the private `travel-photos` bucket using this path shape:

```text
{userId}/{visitId}/{photoAssetId}/{sanitizedFileName}
```

This keeps object ownership aligned with row-level policies and lets the app derive signed URLs later without mixing UI state into persistence.

### Auth/session notes

- Browser, server, and admin Supabase clients are separated under [`src/lib/supabase/clients`](./src/lib/supabase/clients)
- [`/middleware.ts`](./middleware.ts) refreshes auth session cookies for App Router requests
- Server-only code that needs elevated access should use the service-role client sparingly and never expose that key to the browser

### EXIF persistence model

- `visits` stores the canonical location shown in the archive
- `photo_assets` stores raw EXIF coordinates, inferred location fields, and confidence snapshots
- Manual corrections should update the visit location and set `location_confidence` to `manual`, preserving the original inference snapshot on the photo asset

---

## Core product flow

1. User opens the app and sees the 3D world map.
2. Visited countries are colored by travel archive intensity.
3. User uploads photos or adds travel posts; EXIF is used to infer location when possible.
4. Tapping a country opens the detail view with cities and travel memories.

---

## Mobile experience

The app is **mobile-first**. Key behaviors:

- Tap-based country selection
- Bottom-sheet detail views
- Swipe-friendly galleries
- Straightforward photo upload
- Portrait-oriented layout

Hover-only interactions are not used; everything works with touch.

---

## Data model

The main entity is **Visit** (a user’s travel to a place). Visits can be created from photo uploads or travel posts and may include: country, city, coordinates, confidence, photos, and other metadata.

---

## Repository docs

Agents should read these before making changes:

- **SPEC.md** — product spec
- **ARCHITECTURE.md** — system design
- **DATA_MODEL.md** — data structures
- **TASKS.md** — current work
- **UX_RULES.md** — UX constraints
- **ENGINEERING_RULES.md** — code standards
- **AGENTS.md** — agent roles and workflow

---

## Development strategy

Work is organized in **waves** (e.g. foundation → integration → core experience → intelligence → polish). Each wave uses four specialist agents plus one review agent; approved work is merged before the next wave.

---

## License

Internal development project.
