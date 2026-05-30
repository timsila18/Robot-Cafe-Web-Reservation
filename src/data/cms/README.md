# Robot Cafe Content Management

This folder is the staff-friendly content layer. Update these JSON files to change menus, offers, galleries, events, and holiday campaigns without editing React layout code.

## Cloudinary Folders

Upload assets under `robot-cafe/` using these folders:

- `robot-cafe/hero`
- `robot-cafe/gallery`
- `robot-cafe/menu`
- `robot-cafe/offers`
- `robot-cafe/promotions`
- `robot-cafe/events`
- `robot-cafe/holidays/valentines`
- `robot-cafe/holidays/mothers-day`
- `robot-cafe/holidays/fathers-day`
- `robot-cafe/holidays/christmas`
- `robot-cafe/holidays/easter`
- `robot-cafe/holidays/school-holiday`

Set `VITE_CLOUDINARY_CLOUD_NAME` in the environment to activate Cloudinary delivery. If it is missing, the website uses polished fallback images.

## Promotion Fields

Every promotion in `promotions.json` supports:

- `title`
- `description`
- `startDate`
- `endDate`
- `banner.publicId`
- `category`
- `cta.label`
- `cta.href`
- `featured`
- `active`

Use `active: false` to hide a promotion without deleting it. Use `featured: true` to prioritize it on the homepage carousel.

## Menu Fields

Menu items in `menu.json` support category, search text, pricing, Cloudinary media, and display flags:

- `featured`
- `popular`
- `signature`
- `active`

The Menu page automatically builds filters from these fields.

## Future Admin Dashboard

The React app reads all content through `src/services/contentService.js`. A future admin dashboard can write to the same JSON shape, or replace the JSON imports with an API while keeping page components stable.
