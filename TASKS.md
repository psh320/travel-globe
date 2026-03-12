# Travel Globe Tasks

## Current status

- Current repository state: bootstrap only
- `npm run lint`: passes
- `npm run build`: passes
- `npm run test`: passes
- Approved milestone progress: none

## Current wave - Wave 1 foundation shell

### Objective

Ship a mergeable foundation slice that replaces the starter app with a Travel Globe-specific shell, establishes subsystem boundaries, and proves the map, mobile UX, and color/data layers can integrate without Supabase dependency.

### Agent ownership

#### Map Engine Agent

- [ ] Add React Three Fiber and Drei dependencies
- [ ] Create a minimal `features/map` foundation that renders a lightweight world scene shell
- [ ] Stub country geometry/data loading boundary without coupling to Supabase or mobile drawer code
- [ ] Expose typed selection events for other layers to consume

#### Mobile UX Agent

- [ ] Replace the starter landing page with a mobile-first app shell
- [ ] Build touch-safe header, primary action area, and responsive detail-sheet scaffold
- [ ] Provide explicit open/view affordances so focus is never hover-dependent
- [ ] Keep copy and layout aligned with Travel Globe product language

#### Color & Data Logic Agent

- [ ] Create pure typed modules for mock visit summaries and relative intensity calculation
- [ ] Define theme scale structure for at least one full theme
- [ ] Provide map-facing selectors/adapters using mock data only
- [ ] Add unit tests for intensity calculation utilities

#### Supabase Agent

- [ ] Do not start persistence UI yet
- [ ] Add typed `lib/supabase` placeholder boundaries and env validation surface only if needed for compilation
- [ ] Draft schema/tasks for Wave 2 without coupling unfinished auth/storage code into Wave 1

### Exit criteria

- [ ] Starter content removed
- [ ] Travel Globe app shell renders on mobile and desktop
- [ ] Minimal map scene foundation compiles
- [ ] Mock archive intensity data can drive UI state
- [ ] At least one working unit test command exists and passes
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`

## Upcoming wave - Wave 2 persistence and archive ingestion

- [ ] Configure Supabase client setup
- [ ] Define schema for `users`, `visits`, `photo_assets`, and `travel_posts`
- [ ] Configure Supabase Storage for images
- [ ] Add auth/session bootstrap
- [ ] Build photo upload flow with progress and failure states
- [ ] Parse EXIF metadata on upload
- [ ] Add manual location correction flow
- [ ] Save visit records to Supabase
- [ ] Reflect persisted archive counts on the map

## Later wave - Wave 3 focus mode and country detail

- [ ] Build selection-to-focus interaction
- [ ] Add smooth camera transition
- [ ] Implement focused country mode
- [ ] Reveal city-level boundaries where data is available
- [ ] Build country stats panel
- [ ] Build photo/post gallery
- [ ] Add grouping/filtering by city
- [ ] Add back-to-world interaction
- [ ] Ensure mobile-focused detail presentation works well

## Later wave - Wave 4 hardening and polish

- [ ] Improve animation quality
- [ ] Improve rendering and interaction performance
- [ ] Improve touch behavior on mobile
- [ ] Add tests for selection/focus flow
- [ ] Add tests for archive persistence flow
- [ ] Add e2e test for the primary happy path
- [ ] Update README
- [ ] Update architecture docs
- [ ] Final self-review pass
