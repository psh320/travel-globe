# Travel Globe UX Rules

## Core interaction rules

- First tap/click selects a country
- Second tap/click or explicit open/view action enters focused country mode
- Focused country mode must have a clear exit back to world view
- Hover is optional enhancement, never a dependency for core actions

## Mobile rules

- All key actions must be reachable by touch
- Use large touch targets
- Use bottom sheet or drawer patterns for detail on small screens
- Make upload/add-entry actions easy to reach
- Support portrait orientation well

## Detail mode rules

- Show a clear country heading
- Show stats first
- Show city grouping/filtering next
- Show gallery/cards below
- Handle empty, loading, and error states gracefully

## Upload rules

- Show upload progress clearly
- Show EXIF inference result clearly
- Allow manual correction when confidence is low or missing
- Preserve draft state when practical

## Visual rules

- Prioritize calm, premium, minimal visuals
- Avoid excessive clutter
- Keep map readable before making it flashy
