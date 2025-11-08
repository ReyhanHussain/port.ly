# Port.ly – AI-Powered Portfolio Generator

Port.ly converts a single resume PDF into a polished, live portfolio site in minutes. Users upload their resume, review and edit parsed content with AI assistance, select from responsive templates, and deploy instantly to Netlify – all from the browser.

## Tech Stack

- **Frontend:** Vanilla HTML5, modern CSS3 (custom design system, responsive layouts), JavaScript ES2020 modules
- **AI & Parsing:** [OpenRouter](https://openrouter.ai/) API for resume parsing and content enhancement (LLM prompts)
- **PDF Processing:** Mozilla `pdf.js` (v3.11) for extracting text client-side
- **Deployment:** Netlify REST API (manual deploy endpoints) for on-demand site creation and updates
- **Branding & SEO:** Custom SVG favicon, rich meta tags (Open Graph, Twitter Cards), Schema.org structured data

## Product Highlights

- **Resume-to-Portfolio Pipeline** – Drag & drop PDF upload, automatic text extraction, and AI-powered structuring into portfolio-friendly JSON.
- **AI Editing Tools** – Contextual "Enhance" buttons for bios, projects, and experience entries using specialized prompts.
- **Template System** – Three curated themes (Student, Professional, Creative) with tailored typography, gradients, and responsive layouts.
- **Realtime Preview URL** – Username entry instantly previews the published subdomain with the `portly-username.netlify.app` format.
- **Domain Availability Check** – Netlify DNS probing via `fetch` HEAD requests with timeout handling for reliable username validation.
- **One-Click Deployment** – Automated Netlify site provisioning, deploy creation, and HTML upload through the Netlify API using a hash manifest.
- **Success UX** – Rich confirmation state with live link, deployment delay notice, and quick launch button.
- **Privacy & Compliance** – In-app About, Privacy Policy, and Terms modals with accessible navigation.
- **Full SEO Surface** – Canonical tags, social previews, structured data (Organization + WebSite schemas), and per-portfolio Person schema.

## File & Module Overview

```
public/
├── index.html           # Marketing + application shell (hero, workflow, templates, publish flow)
├── style.css            # Global design system, animations, component styling, responsive rules
├── script.js            # Core controller: state management, PDF flow, forms, templates, deployment
├── favicon.svg          # Brand icon used across app and generated sites
└── js/
    ├── api.js           # OpenRouter integration (resume parsing + content enhancement prompts)
    ├── config.js        # Central place for API credentials (OpenRouter + Netlify)
    ├── generator.js     # HTML template generator with SEO meta, structured data, attribution
    ├── netlify-deploy.js# Manual deploy workflow for Netlify REST API
    ├── pdf-parser.js    # Wrapper around pdf.js text extraction
    └── templates.js     # CSS snippets for Student / Professional / Creative themes
```

### `script.js` – Application Orchestrator

- Manages global `portfolioData`, selected template, and multi-step wizard state.
- Handles PDF dropzone interactions, calls `extractTextFromPDF`, and triggers AI parsing via `parseResumeWithAI`.
- Populates editable form fields, adds/removes dynamic items (skills, projects, experience, education).
- Provides AI "Enhance" hooks (`enhanceContent`) for individual sections with loading states.
- Updates preview URL, validates usernames (character rules), and performs DNS availability checks.
- Drives template preview modal and final publish flow (`generatePortfolioHTML` + `deployToNetlify`).

### `generator.js` – Portfolio Builder

- Normalizes resume data, repairs links, and builds semantic HTML with rich SEO metadata.
- Injects template-specific CSS, favicon data URI, Open Graph/Twitter meta, canonical tag, and Person schema.
- Appends themed footer attribution linking back to [https://portly.pages.dev/](https://portly.pages.dev/).

### `netlify-deploy.js` – Deployment Pipeline

- Uses SHA-1 hashing to build Netlify's deploy manifest and uploads the generated HTML.
- Creates or reuses Netlify sites with the `portly-{username}` convention.
- Returns the final HTTPS URL for display.

### `api.js` – AI Services

- Crafts structured prompts for resume parsing (JSON output) and for enhancing bios/projects/experience.
- Calls OpenRouter endpoints with required headers, models, and error handling.

### `pdf-parser.js`

- Leverages `pdf.js` to load the uploaded PDF client-side and concatenate text content safely.

### `templates.js`

- Exposes theme-specific CSS strings consumed by `generator.js` to style each portfolio variation.

## Feature Deep Dive

### Resume Upload & Parsing

1. User drops or selects a PDF.
2. `pdf.js` extracts text, preserving order.
3. AI prompt structures data into a predictable JSON schema.
4. Data hydrates the editable form, which users can refine immediately.

### Template Selection & Preview

- Grid of cards showcasing Student, Professional, and Creative designs.
- Preview button opens a modal with an iframe rendering the generated HTML in real time.
- Selection stores template choice for final deployment.

### Username Availability & URL Preview

- Username input validates character set on blur and input.
- Availability checker performs a timed HEAD request to the target Netlify subdomain.
- Success/failure messaging updates the call-to-action button state.
- Preview text mirrors the eventual published URL.

### Deployment Workflow

1. Generate full HTML via `generatePortfolioHTML` (with template CSS + SEO).
2. `deployToNetlify` ensures a site exists (create or reuse).
3. Netlify deploy is initiated with file digest.
4. Required file upload sends the HTML as `/index.html`.
5. Success response provides the live URL displayed in the UI.

### UX Enhancements

- Animated scroll reveals and button effects for modern feel.
- Success message includes caution about CDN propagation delays and quick launch button.
- Accessibility: semantic structure, aria labels, focusable modals, keyboard enter handling.

## Environment & Security Notes

- `public/js/config.js` centralizes API keys. Keep this file out of version control when publishing publicly.
- Example `.env` format (Vite-style) is documented inline for future build tooling upgrades.
- Netlify token must have access to create and deploy sites; OpenRouter key must allow model usage declared in prompts.

## Customizing Port.ly

- **Templates:** Extend `templates.js` with new CSS blocks and add corresponding cards in `index.html`.
- **SEO:** Edit meta tags in `index.html` and tweak structured data generation in `generator.js`.
- **AI Prompts:** Adjust prompt strings in `api.js` to refine tone, output structure, or target models.
- **Deployment Target:** Swap Netlify API endpoints for another provider by adapting `netlify-deploy.js`.
- **Branding:** Update `favicon.svg`, hero badge, footer text, and theme colors in `style.css`.

## Known Considerations

- OpenRouter and Netlify APIs require valid keys; rate limits/errors bubble up via alert dialogs.
- Large PDFs depend on browser memory; consider chunking or server-side parsing if scaling.
- Netlify propagation can briefly return "Not Found"; UI warns users and encourages refresh after ~2 minutes.
- The app currently operates entirely client-side. Server-side persistence (e.g., saving user portfolios) would require additional infrastructure.

## Roadmap Ideas

- Add user authentication and saved portfolio dashboards.
- Offer additional template packs or a visual editor.
- Introduce analytics for published portfolios (views, clicks).
- Integrate domain management for custom domains.
- Provide multi-language prompt variants for non-English resumes.
