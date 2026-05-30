# Assets

Project-bound media can live here, or be served from Cloudinary by setting `VITE_CLOUDINARY_CLOUD_NAME`.

The current implementation uses `src/config/media.js` and `src/services/mediaService.js` so production images can be swapped from fallback URLs to Cloudinary public IDs without changing components.
