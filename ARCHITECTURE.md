# Travel Globe Architecture

## Overview

Travel Globe is a mobile-first 3D travel archive web application where users visualize the countries and cities they have visited.

The application focuses on:

- a simplified 3D world map
- photo-based travel archives
- country and city grouping
- relative color intensity visualization
- mobile-first usability
- Supabase-backed persistence

The system is designed to support **multi-agent development**, where different AI agents own different architectural areas.

---

# Core Architecture Principles

### 1. Clear domain boundaries

Separate these concerns:

- rendering
- domain logic
- persistence
- UI state
- derived statistics

Each layer must remain independent.

---

### 2. Mobile-first design

The experience must work smoothly on:

- phones
- tablets
- desktops

Desktop features must never rely on hover-only interactions.

---

### 3. Lightweight rendering

The map engine must prioritize:

- performance
- smooth camera transitions
- simple geometry
- maintainable rendering code

Avoid photorealistic complexity.

---

### 4. Durable persistence

All important user progress must persist through Supabase:

- visits
- posts
- photos
- location metadata
- archive summaries

Temporary UI state may be local.

---

### 5. Agent ownership boundaries

Each AI agent owns a specific subsystem:

| Agent      | Ownership                          |
| ---------- | ---------------------------------- |
| Map Engine | 3D world rendering                 |
| Supabase   | persistence and storage            |
| Mobile UX  | responsive layout and interaction  |
| Color/Data | derived statistics and color logic |
| CTO        | planning and review                |

Agents should avoid modifying areas outside their domain.

---

# Tech Stack

Frontend:

- Next.js
- TypeScript
- Tailwind CSS
- React Three Fiber
- Drei
- Framer Motion
- Zustand

Backend:

- Supabase Auth
- Supabase Postgres
- Supabase Storage

Testing:

- Vitest
- React Testing Library
- Playwright

---

# Suggested Folder Structure

src/
app/
components/
features/
map/
archive/
country-detail/
auth/
lib/
geo/
exif/
color-scale/
animation/
supabase/
utils/
store/
hooks/
types/
styles/

tests/
public/
supabase/

---

# Module Responsibilities

## features/map

Responsible for:

- world rendering
- country shapes
- hover and selection
- camera transitions
- map performance

Must remain independent of backend persistence.

---

## features/archive

Responsible for:

- photo upload flow
- travel post creation
- visit creation
- archive browsing
- photo gallery rendering

---

## features/country-detail

Responsible for:

- country focus mode
- country statistics
- city grouping
- archive exploration
- detail drawer / panel UI

---

## features/auth

Responsible for:

- login
- user sessions
- profile preferences
- theme storage

---

## lib/geo

Responsible for:

- GeoJSON parsing
- country boundary mapping
- city boundary mapping
- coordinate normalization

---

## lib/exif

Responsible for:

- metadata extraction
- GPS parsing
- timestamp extraction
- confidence scoring

---

## lib/color-scale

Responsible for:

- theme definitions
- archive intensity calculation
- country color mapping
- city intensity logic

All functions should be **pure and testable**.

---

## lib/supabase

Responsible for:

- Supabase client
- database access helpers
- storage upload helpers
- auth helpers

---

## store

Global UI state such as:

- selected country
- focus mode
- filters
- theme state
- upload state

---

# Persistence Strategy

## Durable storage (Supabase)

Stored in Postgres:

- users
- visits
- travel posts
- photo assets
- location metadata
- theme preferences

---

## File storage

Uploaded photos stored in:

Supabase Storage

Database stores only:

- file path
- metadata
- location inference

---

## Local UI persistence

Client-side storage may contain:

- last selected country
- filters
- unsaved drafts
- temporary preferences

These should never be the source of truth.

---

# Domain Model

The core domain object is:

**Visit**

A visit represents a user traveling to a location.

A visit may originate from:

- a photo upload
- a text post

A visit may include:

- country
- city
- coordinates
- photos
- posts
- metadata confidence

---

# Rendering Strategy

The map engine should:

- use simplified geometry
- minimize expensive textures
- prioritize smooth interaction
- support graceful degradation

If city boundaries are unavailable, fallback to country-level detail.

---

# Mobile UX Strategy

Mobile is a first-class target.

Key design patterns:

- bottom sheet for country detail
- large touch targets
- swipe-friendly galleries
- portrait orientation support

Hover interactions must always have tap alternatives.

---

# Testing Strategy

Focus on testing:

1. color scaling utilities
2. archive summarization logic
3. visit creation flow
4. Supabase data access
5. country focus interaction

Avoid excessive UI snapshot testing.

---

# Performance Goals

- fast initial load
- smooth map interaction
- stable rendering on laptops and phones
- minimal heavy geometry

---

# Out of Scope (v1)

Not included in the first release:

- social feeds
- multi-user sharing
- real-time collaboration
- timeline animations
- complex GIS queries
