# Travel Globe Tasks

## Current status

- Current repository state: integrated mobile-first archive experience
- `npm run lint`: passes
- `npm run build`: passes
- `npm run test`: passes
- Approved milestone progress:
  - Wave 1 foundation shell: complete
  - Wave 2 persistence/read-model integration: complete
  - Wave 3 focus mode and country detail foundation: complete

## Completed wave - Wave 1 foundation shell

### Objective

Ship a mergeable foundation slice that replaces the starter app with a Travel Globe-specific shell, establishes subsystem boundaries, and proves the map, mobile UX, and color/data layers can integrate without Supabase dependency.

### Exit criteria

- [x] Starter content removed
- [x] Travel Globe app shell renders on mobile and desktop
- [x] Minimal map scene foundation compiles
- [x] Mock archive intensity data can drive UI state
- [x] At least one working unit test command exists and passes
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`

## Completed wave - Wave 2 persistence and archive ingestion

- [x] Configure Supabase client setup
- [x] Define schema for `profiles`, `visits`, `photo_assets`, and `travel_posts`
- [x] Configure Supabase Storage helpers and conventions
- [x] Add auth/session bootstrap
- [x] Build persisted archive read-model helpers
- [x] Adapt persisted rows into shared archive types
- [x] Reflect persisted archive counts on the map
- [ ] Build photo upload flow with progress and failure states
- [ ] Parse EXIF metadata on upload
- [ ] Add manual location correction flow
- [ ] Save visit records from the new create flow

## Completed wave - Wave 3 focus mode and country detail

- [x] Build selection-to-focus interaction
- [x] Add smooth camera transition
- [x] Implement focused country mode
- [x] Build country stats panel foundation
- [x] Add grouping/filtering by city
- [x] Add back-to-world interaction
- [x] Ensure mobile-focused detail presentation works well
- [ ] Reveal city-level boundaries where data is available
- [ ] Build richer photo/post gallery views

## Current wave - Wave 4 archive UX hardening

### Objective

Replace placeholder shell content with real persisted archive browsing and country-detail content, while tightening tests and project docs around the current integrated architecture.

### Implementation

- [x] Feed persisted visit details through the app read model
- [x] Replace placeholder country detail cards with real stats, city groups, and saved memory cards
- [x] Replace placeholder archive tab content with real top-country and recent-memory content
- [x] Preserve mobile-first sheet behavior and touch-first actions
- [x] Add targeted tests for archive panel data shaping
- [x] Update README/TASKS to match the real project state
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`

## Next wave - Wave 5 archive creation flow

- [ ] Build photo upload UI with visible progress, success, and failure states
- [ ] Add text-entry creation flow
- [ ] Parse EXIF metadata on selected photos
- [ ] Infer country/city when practical and show confidence clearly
- [ ] Allow manual country/city correction before save
- [ ] Persist visits, photo assets, and travel posts from the create flow
- [ ] Refresh the read model after save so map/detail state updates immediately

## Later wave - Wave 6 polish and release hardening

- [ ] Improve animation quality
- [ ] Improve rendering and interaction performance
- [ ] Improve touch behavior on mobile
- [ ] Add tests for selection/focus flow
- [ ] Add tests for archive persistence flow
- [ ] Add e2e test for the primary happy path
- [ ] Update architecture docs with the final integrated flow
- [ ] Final self-review pass
