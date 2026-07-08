# ДесмосАвто Editorial Studio Design System

Источник правды для текущего визуального языка сайта. Система адаптирована по референсу Orbix Studio: чистый editorial/SaaS-лендинг, сильная типографика, чёрно-белая основа, широкие визуальные полосы, тонкие линии и точечные цветовые акценты.

## Дизайн-семантика

- **Главная идея:** ДесмосАвто выглядит как специализированная студия/продуктовая система для автосервисов, а не как типовой шаблон сайтов.
- **Главный оффер:** получить демо-версию сайта за сутки без предоплаты и обязательств.
- **Доказательство:** 120 рабочих проектов подаются как evidence layer: кейсы, структура, заявки, SEO/AEO.
- **Тон:** уверенный, лаконичный, агентский, без перегруженного автомобильного визуального шума.
- **Визуальный код:** белый canvas, чёрные CTA и секции, serif italic-акценты, тонкие разделители, один тёплый оранжевый акцент, реальные превью сайтов.
- **Ограничение:** не копировать референс буквально; использовать его ритм, типографику, контраст и композиционные принципы.

## Design Tokens

| Role | Token | Value | Usage |
|---|---|---:|---|
| Ink / CTA | `--color-primary` | `#080808` | Основные кнопки, тёмные секции, главные акценты |
| On Primary | `--color-on-primary` | `#FFFFFF` | Текст на чёрном |
| Secondary text | `--color-secondary` | `#353535` | Вторичный текст |
| Warm accent | `--color-accent` | `#FF5A1F` | Номера, активные proof-маркеры, hover |
| Accent soft | `--color-accent-soft` | `#FFF0E8` | Мягкие теги и плашки |
| Product blue | `--color-blue` | `#2667FF` | Редкие продуктовые детали, не доминирующий цвет |
| Success | `--color-success` | `#0F8F5F` | Успешные состояния формы |
| Canvas | `--color-reference-canvas` | `#F7F7F5` | Общий фон страницы |
| Band | `--color-reference-band` | `#F1F2F3` | Светлые широкие секции |
| Surface | `--color-surface` | `#FFFFFF` | Карточки, формы, FAQ-callout |
| Foreground | `--color-foreground` | `#101010` | Основной текст |
| Border line | `--color-reference-line` | `#E4E4DF` | Разделители, рамки карточек |
| Error | `--color-destructive` | `#DC2626` | Ошибки формы |
| Focus ring | `--color-ring` | `#080808` | Keyboard focus |

## Typography

- Основной stack: `Arial`, `Helvetica Neue`, `system-ui`, `sans-serif`.
- Editorial accent: `Georgia`, `Times New Roman`, serif, italic, weight 400.
- Hero: 40-72px, `font-black`, tight line-height около `0.98`.
- Section headings: 30-48px, `font-black`, centered unless layout is intentionally split.
- Body: 16-18px, line-height 1.6-1.75.
- Cards: headings 18-24px, never hero-scale.
- Letter spacing: `0`; не использовать negative tracking.

## Layout System

- `.container-page`: mobile `100% - 32px`, desktop `min(82vw, 1280px)`.
- Section rhythm: `clamp(72px, 8vw, 124px)`.
- Cards and tool frames: 8px radius.
- Primary CTA: black pill, 48px min height.
- Page sections are full-width bands, not floating nested cards.
- Use wide media blocks for first-viewport drama: showreel, real previews, large type.

## Component Semantics

### Header

- Minimal sticky header, 64px height.
- Small black logo mark plus `ДесмосАвто`.
- Navigation labels are short: Главная, Кейсы, Процесс, FAQ.
- Desktop CTA: black pill `Демо за сутки`.

### Hero

- Centered editorial composition: eyebrow, large H1, short supporting copy, CTA pair, three metrics.
- Serif italic phrase is allowed inside H1 and section headings.
- Showreel sits as a separate wide band after the hero copy.
- Hero media uses a real local project preview, not a decorative abstract SVG.

### Proof Strip

- Thin full-width strip after showreel.
- Items are concise proof points with Lucide check icons.
- Motion is linear marquee and must respect `prefers-reduced-motion`.

### Sections

- Default section header is centered.
- `.reference-soft-section`: light gray editorial band.
- `.reference-dark-section`: black proof/process/CTA band.
- FAQ uses a split layout: intro + callout on the left, accordion lines on the right.

### Cards

- `.surface`: white, 1px neutral border, restrained shadow, 8px radius.
- Use cards for repeated service/problem/case/trust items only.
- Avoid blue gradients inside cards; use neutral wells and one orange marker.

### Case Cards

- Position projects as working evidence, not decorative portfolio tiles.
- Required semantics: business type, site type, goal, SEO/AEO focus, primary action.
- CTA is black pill; secondary external action is a neutral outline pill.

### Forms

- Fields: name, phone, consent, honeypot.
- Inputs use neutral borders and black focus.
- Errors are red; success state is green with Lucide check.
- Submission still targets `/api/leads.php` or `NEXT_PUBLIC_LEAD_ENDPOINT`.

## Content Rules

- Prefer “кейсы” and “рабочие проекты” over “наши работы”.
- Prefer “демо-версия за сутки” over vague “быстрый запуск”.
- Avoid exaggerated guarantees.
- Avoid western platform/logo references in client-facing copy.
- Keep copy compact and proof-led.

## Asset Rules

- Use local files from `public/images` and `public/project-previews`.
- Primary hero/showreel preview: a real local project screenshot.
- Meaningful images need descriptive alt text.
- Do not import external fonts or remote images.

## Responsive Rules

- Test widths: 390px, 768px, 1024px, 1440px.
- No horizontal scroll.
- Showreel device must keep a stable 16:9 aspect ratio.
- Text inside buttons and cards must wrap cleanly on mobile.
- Big background words may be cropped decoratively, but must not cause overflow.

## Avoid

- Literal copy of Orbix Studio content, logos, claims, or awards.
- Purple/pink AI-gradient dominance.
- Beige/brown automotive cliché palettes.
- Decorative blobs/orbs/bokeh.
- Emoji as icons.
- Overly rounded card surfaces.
- Hidden focus states or layout-shifting hover effects.
