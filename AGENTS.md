# Development notes

- This repository is a static HTML/CSS/JavaScript portfolio, not a fullstack app. No database, migrations, or credentials are needed to render it.
- Base44 uses `docker compose -f docker-compose.base44.yml up -d --build`. The Node container installs from the lockfile at startup and serves the bind-mounted checkout with Vite on port 3000. Keep `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` passed through for the preview proxy.
- Verify with `docker compose -f docker-compose.base44.yml ps`, `curl -fsS http://localhost:3000/`, and `curl -fsS http://localhost:3000/script.js`. The HTML should contain `DEVSPARK` and `/@vite/client`, confirming the live source server rather than a production bundle.
- EmailJS is loaded from a CDN and uses the existing browser-public configuration in `index.html` and `script.js`. No private EmailJS credential is needed to boot. Email delivery has not been tested; the account and allowed origins must be valid to send mail. Never put private API keys in browser code.
- Four portfolio demo links reference HTML files absent from this checkout; setup does not implement those pages.
- Existing production deployment is the GitHub Pages workflow in `.github/workflows/static.yml`; the Base44 compose is development-only and does not replace it.
- There is no automated test suite. Use preview checks for render errors; avoid submitting the contact form with valid data during setup because it sends real email.
