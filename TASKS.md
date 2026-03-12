# Travel Globe Tasks

## Phase 1 - Foundation

- [ ] Initialize app shell and basic routing
- [ ] Set up Tailwind and core layout primitives
- [ ] Set up 3D scene foundation with React Three Fiber
- [ ] Render a basic global world view
- [ ] Load and normalize country boundary data
- [ ] Implement country hover/select interactions
- [ ] Add mock archive data
- [ ] Add first-pass relative intensity coloring
- [ ] Add basic mobile layout behavior
- [ ] Ensure lint/test/build pass

## Phase 2 - Persistence and archive flow

- [x] Configure Supabase client setup
- [ ] Add Supabase auth flow
- [x] Define schema for users, visits, photo_assets, and travel_posts
- [x] Configure Supabase Storage for images
- [ ] Build photo upload UI
- [ ] Parse EXIF metadata on upload
- [ ] Add manual location correction flow
- [ ] Save visit records to Supabase
- [ ] Reflect persisted archive counts on the map
- [ ] Add loading, empty, and error states
- [ ] Ensure lint/test/build pass

## Phase 3 - Country focus mode

- [ ] Build selection-to-focus interaction
- [ ] Add smooth camera transition
- [ ] Implement focused country mode
- [ ] Reveal city-level boundaries where data is available
- [ ] Build country stats panel
- [ ] Build photo/post gallery
- [ ] Add grouping/filtering by city
- [ ] Add back-to-world interaction
- [ ] Ensure mobile-focused detail presentation works well
- [ ] Ensure lint/test/build pass

## Phase 4 - Polish

- [ ] Refactor map/domain/UI separation
- [ ] Improve animation quality
- [ ] Improve performance and memoization
- [ ] Improve touch behavior on mobile
- [ ] Add tests for intensity scaling logic
- [ ] Add tests for selection/focus flow
- [ ] Add tests for archive persistence flow
- [ ] Add e2e test for the primary happy path
- [ ] Update README
- [ ] Update architecture docs
- [ ] Final self-review pass
