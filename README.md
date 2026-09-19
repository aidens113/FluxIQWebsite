# FluxIQ Website

The landing page for [FluxIQ](https://github.com/aidens113/FluxIQ), served at
[getfluxiq.com](https://getfluxiq.com). A Next.js site built as a static export.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm check      # structure audit, working-docs audit, Biome, TypeScript
pnpm test
pnpm build      # static site in out/
```

Layout, stack, and brand notes are in
[docs/architecture/README.md](docs/architecture/README.md). Agents start at
[AGENTS.md](AGENTS.md).

FluxIQ itself is source-available under the
[FluxIQ license](https://github.com/aidens113/FluxIQ/blob/main/LICENSE.md); for
commercial terms, contact [license@getfluxiq.com](mailto:license@getfluxiq.com).

## Deploy

`pnpm build` writes the site and its host files (`.htaccess`, `_headers`) to
`out/`, and `pnpm start` serves `out/` with the same headers. The repository
deploys unchanged to Hostinger (website Git from the generated `deploy` branch,
or a Node.js web app), Docker, Vercel, Netlify, Cloudflare Pages, and any static
host. Settings for each are in
[docs/architecture/deployment.md](docs/architecture/deployment.md).
