You are the lead engineer for this repository.

# Project

Build a production-quality web application called **Travel Globe**.

Travel Globe is a premium-feeling 3D travel archive app where users visually track countries and cities they have visited. The main experience is a simplified white 3D world map with soft shadows and subtle grey borders between countries. The visual style should feel elegant, modern, and lightweight, inspired by the smoothness and delight of Google Earth, but intentionally stylized and minimal rather than photorealistic.

# Product vision

Users archive travel memories by:

- uploading photos
- optionally writing text posts about places they visited

The app should attempt to infer or verify place data from uploaded photos using EXIF metadata when available. When a visit is recorded, the corresponding country should be colored with a theme-based intensity scale relative to the user’s own archive distribution. Example for a red theme:

- very light pink
- pink
- light red
- red
- strong red

The default experience is a global 3D world view. A user can:

- tap/click a country once to select it
- tap/click it again, or press an obvious open/view action, to enter a focused country mode

In focused country mode:

- animate smoothly into the selected country
- emphasize the selected country
- reveal city-level borders if available
- show photos and posts associated with that country
- group or filter content by city
- show stats such as visit count, city count, and photo count

The product must work well on mobile, tablet, and desktop, with touch-first usability treated as a first-class requirement.

# Technology direction

Use the following stack unless the existing repository strongly justifies a close alternative:

- Next.js
- TypeScript
- Tailwind CSS
- React Three Fiber + Drei
- Framer Motion
- Zustand
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- EXIF parsing utility for photo metadata
- Vitest + React Testing Library
- Playwright for major user flows

# Core functional requirements

## 1. Global map experience

- Render a simplified 3D world view
- Use a minimal white base style
- Show subtle grey country borders
- Support hover on desktop where useful
- Support tap-first interaction on mobile
- Provide smooth selection feedback
- Keep rendering lightweight and performant

## 2. Archive creation

- Users can upload photos
- Users can create text posts
- Parse EXIF metadata from uploaded images when available
- Infer country/city from metadata when practical
- Allow manual correction when metadata is missing or low confidence
- Persist uploaded photos, text posts, and visit records

## 3. Visit coloring logic

- Countries should be colored based on relative archive intensity
- Intensity must be relative to the user’s own data, not global data
- Implement reusable theme-aware color scale utilities
- Support at least one complete theme and a structure for adding more themes later

## 4. Country focus mode

- First tap/click selects a country
- Second tap/click or open/view action enters focused country mode
- Focused mode must animate smoothly
- Focused mode must reveal city-level borders if data exists
- Show photos/posts grouped by city where available
- Provide a way to exit back to world view smoothly

## 5. Country detail UX

- Show country title and summary stats
- Show visit count, city count, photo count, and post count where applicable
- Show a gallery or card grid for photos/posts
- Support city grouping/filtering
- Include loading, empty, and error states
- Make the detail panel work well as a drawer or bottom sheet on mobile

## 6. Mobile-first usability

- All essential interactions must work without hover
- Main map must be usable on touch devices
- Uploading photos from mobile should be a primary supported flow
- Use large touch targets
- Country detail should work naturally in portrait orientation
- Prefer drawers/bottom sheets for narrow screens
- Keep animations smooth on common phones
- Add graceful fallback for weaker devices if needed

## 7. Persistence

- Real user progress must persist across sessions
- Use Supabase Postgres for structured data
- Use Supabase Storage for uploaded images
- Use local persistence only for temporary UI/session state
- Temporary UI state may include:
  - selected country
  - active filters
  - last viewed country
  - theme before sync
  - unsaved draft post

## 8. Domain model expectations

A Visit is the main domain entity. A visit may originate from:

- a photo upload
- a text post

Each visit should support:

- user id
- country code
- country name
- city name if known
- coordinates if known
- source type
- confidence level
- visited date if available
- created/updated timestamps
- optional linkage to photos and posts

## 9. Quality requirements

- Strong TypeScript typing
- Maintainable folder structure
- Separation of rendering logic, domain logic, data access, and UI state
- Responsive layouts
- Accessible controls and semantics where practical
- Minimal but meaningful test coverage
- Clean README and architecture documentation

# Rendering and interaction guidance

- Prefer simple, performant 3D rendering over heavy realism
- Avoid overly expensive texture or geometry pipelines unless necessary
- Prioritize smooth camera movement, clean transitions, and stable interaction
- City-level detail should be graceful: when detailed city boundary data is unavailable, fall back cleanly to country-level detail

# Data confidence guidance

- Treat EXIF metadata as best-effort evidence, not guaranteed truth
- Store confidence levels for inferred locations
- Support manual correction and later editing
- Do not block the user when metadata is absent

# Suggested implementation phases

## Phase 1 - Foundation

- Initialize app shell and routing
- Set up styling and layout
- Set up 3D scene foundation
- Render a basic global world view
- Load country boundary data
- Implement hover/select behavior
- Add mock visit data
- Add first-pass relative intensity coloring

## Phase 2 - Persistence and archive flow

- Set up Supabase auth, database, and storage integration
- Define schema for users, visits, photos, posts
- Build upload UI
- Parse EXIF metadata
- Save travel archive data
- Reflect stored archive counts on the map

## Phase 3 - Focus mode

- Build world-to-country transition
- Implement focused country mode
- Add city-level grouping and rendering where data exists
- Build detail panel, gallery, stats, and filters

## Phase 4 - Polish and hardening

- Improve animation quality
- Improve performance
- Improve mobile UX
- Add tests for color scale, selection flow, and archive flow
- Add e2e coverage for the primary journey
- Update README and architecture documentation

# Autonomous execution rules

1. First inspect the repository and existing files.
2. Then create or update TASKS.md with a concrete execution plan.
3. Then begin implementation immediately.
4. Work in small but meaningful increments.
5. After each major milestone, run the required checks.
6. If checks fail, diagnose the root cause, fix it, and rerun them.
7. After each milestone, perform self-review for:
   - bugs
   - weak UX
   - poor animation quality
   - edge cases
   - weak mobile behavior
   - performance problems
   - accessibility issues
   - code duplication
   - missing tests
8. Improve issues found during self-review before moving on when practical.
9. Do not stop at the first working version if more safe progress can be made.
10. Do not ask for confirmation unless blocked by missing credentials, legal constraints, unavailable external services, or ambiguous destructive actions.

# Required checks

Run these after each major milestone:

- npm run lint
- npm run test
- npm run build

If Playwright is configured, also run:

- npm run test:e2e

If checks fail:

- fix the issue
- rerun the failed command
- continue only when the codebase is stable or clearly blocked

# Definition of done

The project is done only when:

- the app runs locally
- the global 3D map renders correctly
- selection and focus interactions work smoothly
- archive data persists through Supabase
- uploaded photos are stored correctly
- EXIF extraction is integrated with graceful fallback
- country intensity coloring works relative to the user’s archive distribution
- country detail view shows stats and grouped content
- mobile interaction is solid
- lint passes
- tests pass
- build passes
- README explains setup, architecture, and limitations
- the code quality is at a professional standard

# Self-review rubric

After each phase, score 1-5:

- correctness
- UX completeness
- animation quality
- mobile usability
- performance
- code quality
- accessibility
- test coverage
- documentation

If any category is below 4, continue improving unless blocked.

# First actions

Start now by:

1. auditing the repository
2. writing or updating TASKS.md
3. implementing Phase 1 immediately
4. continuing through the phases until the definition of done is satisfied
