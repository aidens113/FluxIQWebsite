# FluxIQ social media kit

Rendered from `social-kit.html` with the site's Geist and Geist Mono fonts.
Colours: ink `#0c0d0f`, text `#e8e6e3`, muted `#8c8a85`, amber `#f5b83d`
(`#e0a21f` on light grounds).

| File | Size | Use |
| --- | --- | --- |
| `fluxiq-avatar-1024.png` | 1024 × 1024 | Profile picture on X, LinkedIn, GitHub, Discord; safe inside a circle crop |
| `fluxiq-mark-on-dark-1024.png`, `fluxiq-mark-on-dark.svg` | 1024 × 1024, vector | The mark alone, transparent, for dark backgrounds |
| `fluxiq-mark-on-light-1024.png`, `fluxiq-mark-on-light.svg` | 1024 × 1024, vector | The mark alone, transparent, for light backgrounds |
| `fluxiq-lockup-on-dark.png` | 1800 × 520 | Mark and wordmark, transparent, for dark backgrounds |
| `fluxiq-lockup-on-light.png` | 1800 × 520 | Mark and wordmark, transparent, for light backgrounds |
| `x-header-1500x500.png` | 1500 × 500 | X (Twitter) header; content clears the avatar at the bottom left |
| `linkedin-cover-1584x396.png` | 1584 × 396 | LinkedIn cover; content clears the profile photo |
| `github-social-preview-1280x640.png` | 1280 × 640 | GitHub repository social preview (Settings → Social preview) |
| `post-square-1080.png` | 1080 × 1080 | Square announcement post |

## Re-rendering

1. `pnpm build`, then `pnpm preview` to serve `out/`.
2. In a headless browser, serve `social-kit.html` from the preview origin with
   its Google Fonts link replaced by the built site's CSS
   (`out/_next/static/css/*.css`), so the self-hosted Geist files load.
3. Make the page background transparent, then screenshot each `.asset`
   element at its own size, by its `id`, with a transparent background for
   the `.clear` ones.

These files are masters for upload to other services; nothing here is served
by the site.
