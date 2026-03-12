# Travel Globe Data Model

## Main rule

A Visit is the central entity in the system.

## Entities

### users

- id
- email
- display_name
- theme
- created_at
- updated_at

### visits

- id
- user_id
- country_code
- country_name
- city_name
- latitude
- longitude
- source_type: photo | text
- confidence_level: high | medium | low | manual
- visited_at
- created_at
- updated_at

### photo_assets

- id
- user_id
- visit_id
- storage_bucket
- storage_path
- exif_latitude
- exif_longitude
- exif_captured_at
- inferred_country_code
- inferred_city_name
- created_at

Photo URLs should be derived from storage metadata at read time, not stored as durable source-of-truth fields.

### travel_posts

- id
- user_id
- visit_id
- title
- content
- country_code
- city_name
- created_at
- updated_at

## Notes

- A visit may exist without EXIF data
- A user must be able to edit inferred place information later
- Intensity scores should be derived from saved archive data, not stored as the sole source of truth
