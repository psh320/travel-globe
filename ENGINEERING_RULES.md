# Engineering Rules

## General

- Prefer simple, maintainable solutions
- Avoid introducing unnecessary dependencies
- Use strong typing
- Keep pure logic in testable utility modules
- Keep components focused and composable

## Map and rendering

- Do not over-engineer the globe into a photorealistic engine
- Prefer lightweight rendering and smooth motion
- Optimize for common laptops and phones
- Use graceful fallback when high-detail data is unavailable

## Persistence

- Real archive data belongs in Supabase
- Files belong in Supabase Storage
- Temporary UI state may be local only
- Do not keep critical progress only in client state

## Data confidence

- Treat metadata-derived location as best-effort
- Preserve confidence level and manual corrections
- Allow the product to work even when metadata is incomplete

## Testing

- Test pure logic first
- Add targeted UI interaction tests
- Add e2e coverage for the primary user journey
