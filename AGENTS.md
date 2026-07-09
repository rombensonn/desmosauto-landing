# AGENTS.md

Project-specific instructions for future Codex/agent work in this repository.

## Project Overview

- This is the DesmosAuto landing site for automotive businesses.
- The frontend is a static Next.js App Router export.
- The lead form backend is a separate PHP endpoint intended for REG.RU Host-0 hosting.
- The production site domain is `https://desmosauto.ru`.
- The site language and public copy are Russian.
- The project should be treated as a production landing page, not as a prototype.

## Product Context

DesmosAuto sells fast, conversion-oriented websites for automotive businesses. The site should always feel like a practical commercial tool for shop owners, not like a generic agency portfolio or abstract SaaS product.

Core promise:

- A website/demo for an automotive business can be shown in 24 hours.
- The first demo is offered without prepayment or obligation.
- The site is built around real client questions, trust, service structure, SEO/AEO, and a short lead form.
- The lead form asks only for name and phone, then sends the lead to a PHP backend and Telegram.

Primary audience:

- Owners and managers of auto service businesses.
- Administrators or sales leads who handle incoming calls and want fewer repetitive questions.
- Automotive niches: STO/autoservice, tire service, detailing, body repair, diagnostics, inspection, auto parts, related repair/service shops.

Audience mindset:

- They care about leads, speed, trust, and a clear explanation of services.
- They may not care about design theory, but they do care that the website looks serious and does not feel like a cheap template.
- They often need proof: real projects, service structure, FAQ, guarantees, photos, prices from / pricing logic, and a clear next step.
- They want minimal manual work and ready-to-upload delivery packages.

Messaging pillars:

- "Сайт для автосервиса, который объясняет и приводит заявки."
- "Демо за сутки."
- "Без предоплаты и обязательств."
- "120 рабочих кейсов."
- "SEO/AEO-структура с первого дня."
- "Сайт работает как цифровой администратор, а не как визитка."

Do not drift into generic copy like "grow your business with innovative solutions." Keep language grounded in auto-service reality: services, symptoms, repairs, diagnostics, trust, price logic, photos, warranties, FAQ, calls, administrators, and booked leads.

## Offer And Funnel

The conversion path is:

- Hero explains the offer and pushes to the lead form or cases.
- Proof strip reinforces 24-hour demo, no prepayment, 120 projects, SEO/AEO, short form.
- Problem sections explain what clients struggle with before calling.
- Solution sections show how the website answers those concerns.
- Services section helps identify the right site format for the business type.
- AEO/SEO sections explain the search/AI-answer advantage.
- Cases and project catalog provide proof and inspiration.
- FAQ removes objections.
- CTA form collects name + phone and sends to Telegram.

The CTA should stay direct and low-friction. Avoid adding long qualification forms unless the user explicitly asks; the product promise depends on fast contact.

## Content Architecture

Main pages and their roles:

- `/` - main landing page and core conversion path.
- `/services` and `/services/[slug]` - explain site formats for auto-service niches.
- `/projects` - 120-case searchable/filterable proof catalog.
- `/projects/[slug]` - case detail pages when `futureCaseReady` is enabled.
- `/aeo` - deeper explanation of AEO and AI-answer optimization.
- `/faq` - objection handling and search-friendly FAQ content.
- `/contact` - focused lead form page.
- `/privacy-policy` and `/personal-data-consent` - legal consent pages linked from the form.

Service detail pages should be full narrative sales pages, not short three-card summaries. Each service page should explain what the format is, when it fits, what is included, how it moves an auto-service client toward a lead, show relevant real project examples, and end with a direct demo request. The current `/services/[slug]` pages use a shared story system with service-specific copy, a matching 3D model, process/delivery sections, and project examples.

When adding content, keep it structured for both people and search systems: clear headings, short answer blocks, service-specific language, FAQ-like answers, and a direct next step.

## Design System

The visual system is a premium editorial/SaaS hybrid tailored to automotive services. It should feel precise, clean, trustworthy, fast, and technical, with enough visual depth from 3D models and motion to feel bespoke.

Global design tokens live in `app/globals.css`.

Core palette:

- Ink/primary: `#080808`, `#101010`.
- Surface: `#ffffff`, `#fbfbfa`, `#f7f7f5`, `#f6f7f8`.
- Lines/borders: `#e4e4df`, `#e2e2df`, neutral translucent black borders.
- Accent orange: `#ff5a1f`; strong accent `#e44810`; soft accent `#fff0e8`.
- Support colors: blue `#2667ff`, green/success `#14a76c` / `#0f8f5f`, destructive `#dc2626`.
- Projects page accent: `--projects-accent: #ef5a24`.

Palette rules:

- Keep the main site mostly light, warm white, and neutral, with orange used as a conversion/attention accent.
- Dark sections are used for contrast and premium rhythm, especially process/AEO blocks.
- Do not introduce random purple/blue gradients or generic AI-style colorful blobs.
- Avoid beige-only or one-note color themes; the system is neutral + orange + black with carefully placed warm gradients.

Typography:

- Main site uses locally bundled AA Stetica via `next/font/local` and `--font-aa-stetica`; `--font-heading` and `--font-body` should point to it with Arial/Helvetica/system fallbacks.
- Serif accent uses Georgia italic via `.serif-accent`; use it sparingly inside large headings for editorial contrast.
- Projects page uses `Manrope` and `Geist_Mono` via `next/font/google`.
- Headings are heavy/black, compact, and confident.
- Body text is practical, readable, and usually neutral gray.
- Letter spacing should generally stay `0`; only preserve existing tighter projects typography where already defined.

Layout:

- Main content width uses `.container-page`, usually `min(100% - 32px, 1180px)` and wider desktop behavior at 1024px.
- Vertical rhythm uses `.section-y` with clamp-based padding.
- Cards use restrained radius, usually `8px` on the main landing and `14px` on the projects catalog.
- Do not nest decorative cards inside decorative cards.
- Sections should be full-width bands or clear layouts; cards are for repeated items, modals, proof panels, and framed tools.
- Mobile-first behavior matters: grids collapse cleanly and CTA buttons become full-width where needed.

Reusable UI patterns:

- `.surface` - light card/panel with subtle border and soft shadow.
- `.surface-dark` - dark panel for process/dark sections.
- `.btn-primary` - black pill button, orange on hover, small lift.
- `.btn-hero-secondary` / `.btn-secondary` / `.btn-muted` - supporting actions.
- `.eyebrow` - pill label for section/category context.
- `.tag` - small pill for attributes/categories.
- `.card-hover` - subtle lift, stronger shadow, slightly stronger border.

Interaction and accessibility rules:

- Keep visible focus states from `app/globals.css`.
- Respect `prefers-reduced-motion`; the project already globally reduces animation durations and disables GSAP experience when motion is reduced.
- Touch targets should stay at least about 44-48px for primary controls.
- Do not use visual-only controls where text or accessible labels are needed.

## Visual Asset System

The site relies heavily on actual bitmap assets, not SVG decoration:

- `public/images/problem-models-uniform/` - uniform 3D problem illustrations.
- `public/images/solution-models-uniform/` - uniform 3D solution illustrations.
- `public/images/service-models/` - service-format 3D models.
- `public/images/trust-models/` - trust/advantage 3D models.
- `public/images/projects-hero-3d-model.png` - projects hero model.
- `public/project-previews/` - real project preview screenshots.
- `public/images/brand/` - DesmosAuto brand marks.

Asset rules:

- Prefer existing generated PNG/WebP assets when adding sections.
- Use real project screenshots for cases; do not replace them with generic placeholders unless the case has no live preview.
- Keep model images decorative with empty `alt` and `aria-hidden` when they do not add semantic content.
- Use `assetPath()` for public assets that must work with GitHub Pages/basePath.
- Keep Next images `unoptimized` because the project exports statically.

## Animation System

Animation is part of the brand experience. It should clarify structure, reveal depth, and make the site feel premium. It should not become noisy.

### GSAP Scroll Experience

Main file: `components/GsapScrollExperience.tsx`.

GSAP is used for:

- Hero reveal: `[data-gsap-hero-item]` fades/slides in with `y: 26`, `duration: 0.9`, `power3.out`, slight stagger.
- Section headings: `[data-gsap-section-head]` reveal once near viewport entry.
- Card groups: `[data-gsap-card-group]` / `[data-gsap-card]` reveal with fade, `y: 38`, slight scale `0.985`, stagger.
- Hero visual drift: `.aeo-hero-panel` drifts vertically during scroll via scrubbed ScrollTrigger.
- Horizontal pinned problem section on desktop: `[data-gsap-horizontal-section]` pins and scrubs a horizontal track across cards.
- Sticky stack/parallax on tablet/desktop: `.scroll-stack-card`, `.scroll-stack-image`, `.scroll-stack-copy` move/scale/fade with scrub.

Rules:

- Always keep meaningful `data-gsap-*` hooks if moving animated sections.
- Do not attach GSAP to generated or layout-unstable elements without stable dimensions.
- Mobile horizontal problem cards should remain a normal grid/list; pinned horizontal scroll is desktop-only.
- Keep cleanup behavior in GSAP components so ScrollTrigger instances are killed on unmount.
- Do not ignore `prefers-reduced-motion`; GSAP should stay disabled for reduced motion.

### Sticky Stack

Main file: `components/ScrollStackShowcase.tsx`.

The stack communicates the client journey:

- Question/client anxiety.
- Trust/proof.
- Route through the site.
- Short lead form.

Visual pattern:

- Large sticky cards with `top`, `z-index` based on `--stack-index`.
- Subtle vertical offset per card.
- 3D model image with drop shadow and small parallax scale.
- Copy fades from slightly dimmed/left-shifted to full clarity.

Do not replace this with generic feature cards; it is one of the core storytelling sections.

### Horizontal Problem Cards

Main source: problem section in `app/page.tsx` plus `.problem-horizontal-*` CSS.

Purpose:

- Show the real objections/problems auto-service clients have before contacting the shop.
- Desktop uses a pinned horizontal scroll that feels like a guided sequence.
- Tablet/mobile uses normal grid/list behavior for usability.

Do not add more horizontal-scroll sections casually; one is enough for emphasis.

### Framer Motion / Motion

Used in:

- `components/FAQ.tsx` - plus icon rotates 0/45 degrees; answer panel animates height and opacity.
- `components/ServicesGrid.tsx` - modal backdrop/content enter/exit with opacity, `y`, and scale.
- `components/ProjectsClient.tsx` - result count card spring entrance/hover and animated number counting.

Rules:

- Keep FAQ animation short and calm.
- Modals must preserve focus trap, Escape close, body scroll lock, and focus restoration.
- Project count animation must support reduced motion with static fallback.

### CSS Hover And Micro-Interactions

Current hover language:

- Primary buttons: orange background + `translateY(-1px)`.
- Secondary buttons: stronger border/white background + small lift.
- Cards: subtle lift, shadow, border-color change.
- Project cards: `translateY(-4px)` and preview image `scale(1.035)`.
- Trust model images: group hover scale around `1.03`.
- Service buttons: orange text/border emphasis with small active press.
- Proof marquee pauses on hover.

Rules:

- Hover effects should be small and tactile, not bouncy or theatrical.
- Keep transform distances modest: 1-4px lift, image scale around 1.03.
- Avoid adding hover effects that change layout size.

### Animate.css-Style Scroll Reveals

Files:

- `app/aeo/ScrollAnimate.tsx`.
- Animate keyframes in `app/globals.css`.

Used for AEO page blocks:

- `fadeInUp`.
- `zoomIn`.
- `bounceIn`.

Rules:

- Use these only where the AEO page already uses this pattern.
- Prefer GSAP data hooks on the main landing page.
- Keep reduced-motion fallback intact.

### AEO WebGL / 3D Scene

Files:

- `app/aeo/AeoNeuroSearchBlock.tsx`.
- `app/aeo/AeoNeuroSearchScene.tsx`.

Implementation:

- Uses React Three Fiber Canvas, Drei `RoundedBox`, `Float`, `ContactShadows`.
- Scene represents a browser/search answer interface and semantic chips:
  - "вопрос клиента";
  - "короткий ответ";
  - "доказательство";
  - "заявка".
- Animation uses `useFrame` for slight browser rotation, vertical drift, and pulse ring scale.
- Uses a WebGL capability check.
- Always renders static fallback UI first/behind the canvas.
- Respects reduced motion by stopping frame-based movement and Float movement.

Rules:

- Keep the static fallback fully usable and visually polished.
- Do not make the 3D scene interactive unless explicitly requested.
- Keep the scene decorative/illustrative; it supports the AEO explanation, not gameplay.
- Any future 3D work should be checked in a browser for nonblank canvas, correct framing, and reduced-motion behavior.

### Projects Page Animations

The projects page has its own visual system:

- `projects-showcase-page` uses Manrope + Geist Mono.
- `[data-projects-reveal]` uses CSS `projects-rise-in` under no-preference motion.
- Project cards lift and preview images scale on hover.
- Filter result number animates with spring from `motion/react`.
- Filters are horizontal pill controls with orange soft hover and black active state.

Keep this page slightly more editorial/catalog-like than the home page. It is proof-heavy and should support scanning/comparison.

## Visual Design Maintenance Rules

- When adding a new section, decide whether it belongs to the main landing visual system, projects visual system, or AEO visual system.
- Reuse existing classes and variables before adding new tokens.
- Keep 3D model assets consistent with the existing families; do not mix in flat stock icons as primary visuals.
- Keep cards at 8px radius on main landing unless matching the projects catalog style.
- Do not add decorative orbs/blobs as standalone background gimmicks.
- Do not use visible grid/checkered/graph-paper backgrounds or repeated 1px line patterns in any section or card.
- Do not add gradients unless they support an existing AEO/dark/accent pattern.
- Keep all text inside buttons/cards fitting across mobile and desktop.
- Preserve generated visual context in this file: when a major design direction, animation system, or product positioning changes, update this `AGENTS.md` in the same task.
- If an old visual rule becomes inaccurate, remove or rewrite it. Do not let this file become stale.

## Tech Stack

- Next.js App Router with `output: "export"`.
- React, TypeScript, Tailwind CSS, GSAP/framer-motion/motion where already used.
- PHP for lead submission at `api/leads.php`.
- Package manager: `pnpm`.
- Static export output directory: `out/`.
- Deployment package output directory: `output/`.

## Important Source Areas

- `app/` - pages, layouts, metadata, static routes.
- `components/` - shared UI and interactive components.
- `components/LeadForm.tsx` - frontend lead form behavior.
- `components/HashScrollGuard.tsx` - hash/navigation scroll behavior.
- `data/projects.ts` - 120 project/case entries.
- `data/services.ts` - service page data.
- `data/faqs.ts` - FAQ data and JSON-LD content.
- `backend/api/leads.php` - PHP lead handler.
- `backend/api/leads.config.example.php` - public example config only.
- `backend/api/leads.config.php` - local ignored real config with Telegram credentials.
- `deploy/reg-ru-host0/.htaccess` - required REG.RU clean URL rules.

Do not edit generated files in `.next/`, `out/`, or `output/` as source changes. Rebuild them instead.

## Local Development

Install dependencies:

```bash
pnpm install
```

Run Next.js:

```bash
pnpm dev
```

Run the PHP backend locally:

```bash
php -S 127.0.0.1:8081 -t backend
```

Local `.env.local` may point the frontend to:

```text
NEXT_PUBLIC_LEAD_ENDPOINT=http://127.0.0.1:8081/api/leads.php
```

For production/static archive builds, always override this with:

```bash
NEXT_PUBLIC_LEAD_ENDPOINT=/api/leads.php pnpm build
```

This prevents accidentally shipping a static bundle that submits to `127.0.0.1`.

## Verification Commands

Use these checks before handing work back when relevant:

```bash
pnpm typecheck
NEXT_PUBLIC_LEAD_ENDPOINT=/api/leads.php pnpm build
php -l backend/api/leads.php
```

The default `pnpm lint` command may scan generated folders if they exist. Prefer:

```bash
pnpm exec eslint . --ignore-pattern 'out/**' --ignore-pattern 'output/**' --ignore-pattern '_next/**' --ignore-pattern '.next/**'
```

For lead form/backend checks:

```bash
curl -i -s -X POST http://127.0.0.1:8081/api/leads.php \
  -H 'Origin: http://localhost:3000' \
  -H 'Content-Type: application/json' \
  --data '{"name":"Telegram Live Check","phone":"+7 (999) 999 99-99","website":"","privacyPolicyAccepted":true,"personalDataConsent":true,"pageUrl":"http://localhost:3000/contact","source":"telegram-live-check"}'
```

Expected result with real Telegram config: `200 OK` and `{"ok":true,...}`.

## Lead Form Rules

- Validation errors must appear only after the user submits an incomplete form.
- Do not validate on input blur.
- Clear a field's error when the user changes that field.
- Keep the privacy policy and personal data consent checkboxes required.
- The honeypot field `website` must remain hidden and must continue to short-circuit spam.
- The frontend should show backend `message` values when the backend returns an error.
- Do not expose internal PHP stack traces or raw secrets in UI messages.

## Scroll/Navigation Rules

- Do not restore the old behavior that forced every page reload/hash change back to the first block.
- `HashScrollGuard` should only handle intentional internal anchor navigation.
- Browser reloads should be allowed to preserve normal scroll position.

## PHP Lead Backend Rules

- `backend/api/leads.php` must:
  - accept POST JSON only;
  - handle CORS for the configured origins;
  - validate name, phone, policy acceptance, and personal data consent;
  - save every valid lead to `storage/leads.jsonl`;
  - protect storage with `.htaccess` and `index.html`;
  - send Telegram notifications after saving;
  - log notification failures to `storage/notification-errors.log`.
- Production must not show a false success if Telegram did not accept the notification.
- If Telegram is required and missing/failing, the backend should return a non-2xx response with a user-safe message.
- Keep detailed Telegram/API failure reasons in `storage/notification-errors.log`, not in public UI text.

## Telegram Configuration

- The source of truth for real Telegram credentials is the ignored local file:

```text
backend/api/leads.config.php
```

- Do not put the full bot token into `README.md`, `AGENTS.md`, or other public docs.
- Do not print the full bot token in final responses.
- The production Telegram chat id for lead notifications is:

```text
-1003658178524
```

- Production archives must have:

```php
'telegram_required' => true,
'telegram_chat_ids' => ['-1003658178524'],
```

- The bot token must be copied from `backend/api/leads.config.php` into the archive's `api/leads.config.php`.
- If `backend/api/leads.config.php` is missing, ask the user for the Telegram bot token and chat id before creating a final deployment archive.
- Do not create a "ready" archive with blank Telegram credentials.

## REG.RU Host-0 Archive Rules

Every future REG.RU Host-0 deployment archive must include a fully ready site root.

The archive root must contain:

```text
index.html
.htaccess
_next/
api/leads.php
api/leads.config.php
storage/.htaccess
storage/index.html
```

Critical rules:

- Use `NEXT_PUBLIC_LEAD_ENDPOINT=/api/leads.php pnpm build` before packaging.
- Copy `deploy/reg-ru-host0/.htaccess` to the archive root as `.htaccess`.
- Copy `backend/api/leads.php` to the archive as `api/leads.php`.
- Copy `backend/api/leads.config.php` to the archive as `api/leads.config.php`.
- Do not use `backend/api/leads.config.example.php` as the final production config.
- Create `storage/` in the archive, but do not include local test leads or local notification logs.
- Include `storage/.htaccess` and `storage/index.html`.
- ZIP the contents of the archive folder, not the parent folder, so extracting on hosting places files directly into the site root.

Suggested archive flow:

```bash
NEXT_PUBLIC_LEAD_ENDPOINT=/api/leads.php pnpm build

ARCHIVE_DIR="output/desmosauto-host0-reg-ru-ready-telegram-final-$(date +%Y%m%d)"
mkdir -p "$ARCHIVE_DIR/api" "$ARCHIVE_DIR/storage"
rsync -a out/ "$ARCHIVE_DIR/"
cp deploy/reg-ru-host0/.htaccess "$ARCHIVE_DIR/.htaccess"
cp backend/api/leads.php "$ARCHIVE_DIR/api/leads.php"
cp backend/api/leads.config.php "$ARCHIVE_DIR/api/leads.config.php"
cp backend/storage/.htaccess "$ARCHIVE_DIR/storage/.htaccess" 2>/dev/null || printf 'Require all denied\nDeny from all\n' > "$ARCHIVE_DIR/storage/.htaccess"
touch "$ARCHIVE_DIR/storage/index.html"
rm -f "$ARCHIVE_DIR/storage/leads.jsonl" "$ARCHIVE_DIR/storage/notification-errors.log"
(cd "$ARCHIVE_DIR" && zip -r -X "../$(basename "$ARCHIVE_DIR").zip" .)
```

Before handing off a new archive, verify the production Telegram config:

```bash
php -r '$c = include "output/<archive-folder>/api/leads.config.php"; var_export([$c["telegram_required"], $c["telegram_chat_ids"], $c["telegram_bot_token"] !== ""]); echo PHP_EOL;'
```

Expected result: Telegram is required, chat id contains `-1003658178524`, and the bot token is non-empty.

Also verify the built archive does not contain a local endpoint:

```bash
rg -n "127\\.0\\.0\\.1:8081|localhost:8081" output/<archive-folder> --glob '!**/*.map'
```

Expected result: no matches.

## REG.RU URL Handling

- The root `.htaccess` from `deploy/reg-ru-host0/.htaccess` is required.
- It must rewrite clean URLs like `/contact`, `/projects`, `/services`, and `/faq` to matching `.html` files before Apache treats same-named exported folders as directories.
- Without this, REG.RU Host-0 can redirect `/contact` to `/contact/` and return `403 Forbidden`.

## Generated And Ignored Files

These are generated or local-only and should not be treated as source:

- `.next/`
- `out/`
- `output/`
- `tmp/`
- `backend/storage/`
- `backend/api/leads.config.php`
- `api/leads.config.php`
- `.env.local`

Do not commit local Telegram credentials. It is acceptable for ignored local files and generated archives to contain the real token when the user asks for a ready deployment package.

## Communication Notes

- The user prefers ready-to-upload archives with minimal manual work.
- If a secret is needed and missing, say exactly what is missing and why the final archive cannot be genuinely ready without it.
- When reporting Telegram status, distinguish between:
  - lead saved to `storage/leads.jsonl`;
  - Telegram API accepted the notification;
  - frontend showed a success message.
- Do not claim that Telegram delivery is fixed unless a real POST returned `200 OK` with Telegram required and no new notification error was logged.
