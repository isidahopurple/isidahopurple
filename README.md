# Is Idaho Purple?

An open experiment for Idaho's Nov 3, 2026 general election: how to vote, the whole ballot with sourced quotes, and a published method for the "vote math" in each race. Live at https://isidahopurple.com.

## How it works
- Every fact lives in `data/idaho/` as YAML, with a source URL. The schema is `src/content.config.ts`; the build fails on bad data.
- Pages are Astro (`src/views/`), in English (`/`) and Spanish (`/es/`).
- Hosted as static assets on Cloudflare Workers.

## Commands (Node 22+)
| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build into `dist/` |
| `npm run deploy:preview` | Review build (noindex, includes `/review`) to the preview worker |
| `npm run deploy` | Production deploy to isidahopurple.com |

## Contributing
Read `docs/CONTRIBUTING.md`. Every quote needs a URL; every pick follows the published method.

## Forking for your state
Copy `data/idaho/` to `data/<state>/`, change `STATE` in `src/content.config.ts`, and replace the Idaho-specific copy in `src/views/`.

## License
Code: MIT (`LICENSE`). Original text and data: CC BY 4.0. Quotes belong to the people quoted and link to their sources.
