/**
 * Re-export from the plugin's built dist to avoid the package's "development"
 * export (which points at src/ and fails to resolve .jsx components).
 * "bunny-input-dist" is aliased to dist/index.js in tsconfig and next.config.
 */
export {
  bunnyInput,
  getMp4Url,
  getPlaybackUrl,
  getThumbnailUrl,
} from 'bunny-input-dist'
