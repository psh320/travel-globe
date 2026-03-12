# Travel Globe Product Spec

## Vision

Travel Globe is a premium-feeling 3D travel archive web app where users visualize countries and cities they have visited on a clean, stylized world map.

## Core visual style

- Simplified 3D world
- White land/base surfaces
- Grey borders between countries
- Soft shadows
- Smooth transitions
- Premium modern UI
- Lightweight rendering over realism

## Primary users

- People who want to archive travel memories visually
- People who want a personal map of visited places
- People who mainly upload photos as evidence of travel
- People who need a pleasant mobile-first experience while traveling

## Core user flows

### Flow 1: Explore the world

1. User opens the app
2. User sees a simplified 3D world view
3. Countries with archived visits are tinted based on relative archive intensity
4. User taps/clicks countries to inspect them

### Flow 2: Add visit by photo

1. User uploads a photo
2. App parses EXIF metadata if available
3. App infers country/city when practical
4. User can manually correct location data if needed
5. Visit is attached to the user archive
6. Map updates the affected region

### Flow 3: Add visit by text

1. User writes a travel post
2. User manually selects or confirms place
3. Visit is stored
4. Map updates based on saved archive data

### Flow 4: Open country detail

1. User taps/clicks a country once to select it
2. User taps/clicks again or presses open/view
3. Camera smoothly zooms to the selected country
4. Country detail mode opens
5. City borders appear when available
6. Photos and posts are shown, preferably grouped by city

## Functional requirements

- 3D global map
- Country hover/select/focus interaction
- Relative theme-based country intensity coloring
- Photo upload and storage
- EXIF metadata parsing
- Optional text posts
- Country detail mode
- City grouping in country detail mode
- Theme-aware heat/intensity scale logic
- Supabase-backed persistence

## Mobile-first usability

The app must work well on mobile, tablet, and desktop.

### Mobile requirements

- The main experience must be usable on touch devices
- Country selection and focus must support tap-based input
- The UI should avoid tiny touch targets
- Drawers, sheets, galleries, and controls must adapt to narrow screens
- Uploading photos from mobile devices should be a primary supported flow
- Performance should remain smooth on common modern phones
- Country detail mode should work naturally in portrait orientation
- Important actions must not rely on hover

### Responsive interaction requirements

- Desktop may use hover and click
- Mobile must support all important actions without hover
- First tap selects a country
- Second tap or visible open/view action enters focused country mode
- Country detail content should appear in a responsive drawer, sheet, or panel on mobile
- Photo galleries should be swipe-friendly where practical

### Mobile UX expectations

- Large touch targets
- Sticky or easy-to-reach add/upload actions
- Reduced clutter in default map mode
- Smooth transitions without overloading low-power devices
- Graceful degradation if reduced rendering complexity is needed

## Persistence requirements

- Real user progress must persist across sessions
- Structured data must be stored in Supabase Postgres
- Uploaded photos must be stored in Supabase Storage
- Temporary session/UI state may be stored locally
- The app should recover gracefully after refresh where practical

## Draft and recovery behavior

- Unsaved text drafts should be recoverable when practical
- Upload flow should clearly communicate progress, success, and failure
- Failed uploads should not silently lose user input
- Manual place assignment should remain editable later

## Domain model

A Visit is the main domain entity.

A Visit may come from:

- a photo upload with inferred metadata
- a text post with manual or assisted location selection

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

## Non-functional requirements

- Responsive
- Accessible basic controls
- Smooth animation
- Maintainable architecture
- Strong TypeScript usage
- Tests for core utilities and major UI logic

## Performance goals

- Fast initial render
- Smooth interactions on common laptops and phones
- Avoid overly heavy geometry and textures
- Prefer simplified meshes and memoized calculations
- Graceful fallback for weaker devices

## Known constraints

- EXIF may be missing from many photos
- Reverse geocoding may require fallback logic
- City-level boundaries may not be available for every country at equal quality
- The app should handle incomplete metadata gracefully

## Out of scope for first version

- Social feed
- Multi-user sharing
- Real-time collaboration
- Full GIS-grade precision
- Advanced route playback or timeline animation
