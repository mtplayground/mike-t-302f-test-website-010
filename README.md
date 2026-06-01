# mike-t-302f-test-website-010

Static Astro landing page for myClawTeam.

## Deployment

Build output is generated in `dist/`:

```bash
npm run build
```

The production start command serves the generated Astro output from `dist/` on `0.0.0.0:8080`:

```bash
npm start
```

Set `PORT`, `HOST`, or `STATIC_ROOT` only when the deployment environment needs different values.

If the public URL shows the "Sprite Deployment" placeholder, the deployed service is not serving this repository's
Astro `dist/` output. Run the deployment diagnosis after building:

```bash
npm run diagnose:deployment -- https://your-public-url.example
```

The diagnosis checks the local `dist/index.html` for myClawTeam page markers and compares the public URL against the
known Sprite placeholder markers.

For the final live check, run the cache-busting verifier:

```bash
npm run verify:live -- https://your-public-url.example
```
