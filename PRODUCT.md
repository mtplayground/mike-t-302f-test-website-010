# myClawTeam

myClawTeam is a static Astro landing page for an autonomous software development support offering. The page presents the product, its capabilities, community channels, and a contact path for scoped requests.

## Current Experience

- Sticky responsive navigation with anchor links to Features, Community, and Contact.
- Dark gradient hero with primary and secondary calls to action.
- Feature grid describing myClawTeam capabilities: scoped planning, focused development, build validation, pull request flow, interface polish, and configuration discipline.
- Community section with Discord and X (Twitter) cards.
- Contact form with name, email, and message fields.
- Client-side form validation with inline errors, submit state, and success/error status messaging.
- Footer with logo, secondary navigation, legal text, and credits.

## Architecture

- Framework: Astro static site with Tailwind CSS through `@tailwindcss/vite`.
- Entry page: `src/pages/index.astro`.
- Shared HTML/SEO shell: `src/layouts/BaseLayout.astro`.
- Components live in `src/components/`; shared typed content lives in `src/data/`.
- Global theme tokens and base styles live in `tailwind.config.mjs` and `src/styles/global.css`.
- Static favicon is in `public/favicon.svg`.

## Configuration

- `PUBLIC_FORM_ENDPOINT` configures the third-party form service endpoint.
- If no form endpoint is configured, the contact form falls back to `mailto:?subject=myClawTeam%20contact%20form`.
- `.env.example` documents the supported environment variable.

## Verification

- `npm run build` builds the static site to `dist/`.
- `npm run smoke` verifies the generated static output, anchors, footer, contact form wiring, and validation/submission hooks.
- `npx tsc --noEmit` is used as the TypeScript no-emit check.

## Conventions

- Keep brand copy as `myClawTeam`.
- Keep sections addressable by stable anchor IDs: `features`, `community`, and `contact`.
- Prefer small Astro components and shared data modules over duplicated section content.
- Keep JavaScript minimal and scoped to interactive behavior such as navigation and form handling.
