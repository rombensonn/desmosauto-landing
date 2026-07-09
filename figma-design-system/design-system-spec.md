# Дизайн-система ДесмосАвто для Figma

## 1. Роль системы

Дизайн-система ДесмосАвто описывает визуальный язык специализированного продукта для автомобильного бизнеса. Сайт должен выглядеть как премиальная, спокойная, технически надежная editorial/SaaS-студия, а не как типовой шаблон для автосервиса.

Главная задача визуального языка: показать, что ДесмосАвто делает не просто "красивые сайты", а онлайн-точки, которые объясняют услуги, разгружают звонки, повышают доверие и приводят более подготовленные заявки.

## 2. Дизайн-семантика

### Ключевые ощущения

- Профессионально.
- Чисто.
- Дорого, но без роскоши ради роскоши.
- Технически надежно.
- Специализировано под авто-нишу.
- Уверенно и лаконично.

### Визуальный код

- Светлый canvas.
- Почти черный текст и CTA.
- Тонкие нейтральные линии.
- Один теплый оранжевый акцент.
- Serif italic-акценты внутри крупных заголовков.
- Реальные превью проектов как evidence layer.
- 3D PNG-модели как объясняющие визуальные объекты.
- Широкие секции вместо вложенных декоративных карточек.

### Запрещенные направления

- Фиолетово-синие AI-градиенты.
- Бежево-коричневый "гаражный" визуал.
- Декоративные blobs/orbs/bokeh.
- Слишком круглые карточки.
- Emoji вместо иконок.
- Слишком игровой или шумный автомобильный стиль.
- Смешивание старого синего CTA из deprecated-системы с текущим оранжевым акцентом.

## 3. Цвета

### Global colors

| Token | Value | Назначение |
|---|---:|---|
| `color.ink.950` | `#080808` | Основной ink, CTA, темные секции |
| `color.ink.900` | `#101010` | Основной текст |
| `color.ink.700` | `#353535` | Вторичный текст |
| `color.ink.500` | `#616161` | Muted labels |
| `color.white` | `#FFFFFF` | Поверхности и текст на темном |
| `color.canvas` | `#F7F7F5` | Основной фон страницы |
| `color.background` | `#F6F7F8` | Технический background |
| `color.band` | `#F1F2F3` | Светлые широкие секции |
| `color.surface` | `#FFFFFF` | Карточки, формы, панели |
| `color.muted` | `#F0F1F2` | Нейтральная подложка |
| `color.mutedStrong` | `#D9DADB` | Более сильный muted |
| `color.border` | `#E2E2DF` | Базовые borders |
| `color.line` | `#E4E4DF` | Editorial dividers |
| `color.accent` | `#FF5A1F` | Основной теплый accent |
| `color.accentStrong` | `#E44810` | Активный accent / emphasis |
| `color.accentSoft` | `#FFF0E8` | Мягкие плашки |
| `color.blue` | `#2667FF` | Редкие продуктовые детали |
| `color.green` | `#14A76C` | Positive accent |
| `color.success` | `#0F8F5F` | Успешные состояния |
| `color.destructive` | `#DC2626` | Ошибки |
| `color.projectAccent` | `#EF5A24` | Акцент страницы проектов |

### Semantic colors

| Token | Value | Назначение |
|---|---:|---|
| `color.bg.page` | `#F7F7F5` | Основной фон |
| `color.bg.pageGradientStart` | `#FBFBFA` | Верхний слой body gradient |
| `color.bg.sectionSoft` | `#F1F2F3` | Светлая секция |
| `color.bg.sectionDark` | `#080808` | Темная proof/CTA секция |
| `color.surface.primary` | `#FFFFFF` | Базовая поверхность |
| `color.surface.translucent` | `rgba(255,255,255,0.94)` | Surface на светлом фоне |
| `color.text.primary` | `#101010` | Главный текст |
| `color.text.secondary` | `#353535` | Вторичный текст |
| `color.text.muted` | `#616161` | Muted labels |
| `color.text.inverse` | `#FFFFFF` | Текст на черном |
| `color.text.inverseMuted` | `rgba(255,255,255,0.72)` | Вторичный текст на темном |
| `color.border.default` | `#E4E4DF` | Рамки и разделители |
| `color.border.focus` | `#080808` | Фокус |
| `color.cta.primary.bg` | `#080808` | Primary CTA |
| `color.cta.primary.hover` | `#FF5A1F` | CTA hover |
| `color.status.error.text` | `#B91C1C` | Текст ошибки |
| `color.status.error.bg` | `#FEF2F2` | Подложка ошибки |
| `color.status.success.text` | `#166534` | Текст успеха |
| `color.status.success.bg` | `#F0FDF4` | Подложка успеха |

## 4. Типографика

### Семейства

| Token | Value | Назначение |
|---|---|---|
| `font.family.heading` | `Arial, Helvetica Neue, system-ui, sans-serif` | Заголовки и плотная UI-типографика |
| `font.family.body` | `Arial, Helvetica Neue, system-ui, sans-serif` | Основной текст |
| `font.family.serif` | `Georgia, Times New Roman, serif` | Editorial italic accent |
| `font.family.mono` | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` | Метрики/технические фрагменты |

### Text styles для Figma

| Style | Size | Line | Weight | Usage |
|---|---:|---:|---:|---|
| `Display/Hero` | `72` | `70` | `950` | Главный hero desktop |
| `Display/Hero Mobile` | `40` | `41` | `950` | Hero mobile |
| `Heading/Section` | `48` | `52` | `950` | H2 секции |
| `Heading/Section Mobile` | `30` | `34` | `950` | H2 mobile |
| `Heading/Card` | `24` | `30` | `900` | Заголовки карточек |
| `Heading/Small` | `18` | `24` | `900` | UI headings |
| `Body/Large` | `18` | `32` | `400` | Крупные описания |
| `Body/Base` | `16` | `26` | `400` | Основной текст |
| `Body/Small` | `14` | `22` | `700` | Form labels, nav |
| `Caption/Bold` | `12` | `14` | `850` | Eyebrow, tags |
| `Accent/Serif Italic` | `48` | `52` | `400 italic` | Выделение слов в заголовках |

Правило: letter spacing всегда `0`, кроме маленьких uppercase labels, где допустимо `0.08em`.

## 5. Spacing

База 4px/8px. В Figma переменные хранить как number tokens.

| Token | Value | Usage |
|---|---:|---|
| `space.1` | `4` | Микро-отступы |
| `space.2` | `8` | Icon gap |
| `space.3` | `12` | Compact padding |
| `space.4` | `16` | Базовый padding |
| `space.5` | `20` | Form/card inner rhythm |
| `space.6` | `24` | Card padding |
| `space.8` | `32` | Большой gap |
| `space.10` | `40` | Desktop gap |
| `space.12` | `48` | Section internal rhythm |
| `space.16` | `64` | Large rhythm |
| `space.18` | `72` | Mobile section-y min |
| `space.24` | `96` | Desktop section rhythm |
| `space.31` | `124` | Section-y max |

## 6. Radius

| Token | Value | Usage |
|---|---:|---|
| `radius.none` | `0` | Editorial hard lines |
| `radius.sm` | `8` | Основные карточки, формы, панели |
| `radius.md` | `14` | Projects catalog cards |
| `radius.lg` | `18` | Крупные модальные панели, если нужно |
| `radius.pill` | `999` | CTA, tags, nav pills |
| `radius.circle` | `50%` | Иконки-кружки |

Главная страница использует преимущественно `8px`. Страница проектов допускает `14px`.

## 7. Shadows / elevation

| Token | Value | Usage |
|---|---|---|
| `shadow.saasSoft` | `0 10px 28px rgba(8,8,8,0.06)` | Обычные карточки |
| `shadow.saas` | `0 18px 52px rgba(8,8,8,0.10)` | Hover / stronger cards |
| `shadow.reference` | `0 24px 80px rgba(8,8,8,0.12)` | Hero/showreel frame |
| `shadow.projectsSoft` | `0 16px 44px rgba(20,20,18,0.075)` | Project card |
| `shadow.projects` | `0 28px 90px rgba(20,20,18,0.11)` | Project hover |

## 8. Motion tokens

| Token | Value | Usage |
|---|---:|---|
| `motion.duration.fast` | `160ms` | Small hover |
| `motion.duration.base` | `180ms` | Buttons, nav, cards |
| `motion.duration.medium` | `220ms` | Inputs, project card hover |
| `motion.duration.reveal` | `700ms` | GSAP reveal |
| `motion.duration.marquee` | `28s` | Proof strip |
| `motion.ease.standard` | `ease` | Simple CSS |
| `motion.ease.out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Reveal |

Reduced motion обязателен: все длительные анимации отключаются или сокращаются до почти нуля.

## 9. Layout tokens

| Token | Value | Usage |
|---|---:|---|
| `layout.container.mobile` | `calc(100% - 32px)` | Mobile container |
| `layout.container.desktop` | `min(82vw, 1280px)` | Desktop container |
| `layout.container.max` | `1280px` | Max content width |
| `layout.header.height` | `64px` | Sticky header |
| `layout.cta.minHeight` | `48px` | Primary buttons |
| `layout.form.inputHeight` | `48px` | Inputs |
| `layout.showreel.aspect` | `16 / 9` | Media frame |

## 10. Основные компоненты

### Header

- Sticky top.
- Height около `64px`.
- Background `#F7F7F5` с прозрачностью и blur.
- Логотип: черный круг 32x32 с wrench icon, рядом текст `ДесмосАвто`.
- Nav pills: `Главная`, `Услуги`, `Кейсы`, `SEO/AEO`, `FAQ`.
- CTA: черный pill `Демо за сутки`.

### Button / Primary

- Height min `48px`.
- Radius `999px`.
- Padding `12px 18px`.
- Background `#080808`.
- Text `#FFFFFF`.
- Hover: background `#FF5A1F`, transform `translateY(-1px)`.

### Button / Secondary

- Background `#FFFFFF`.
- Border `rgba(8,8,8,0.16)`.
- Text `#080808`.
- Hover: border `#080808`, background `#F7F7F5`.

### Eyebrow

- Inline pill.
- Border `#E2E2DF`.
- Background `rgba(255,255,255,0.76)`.
- Text `#616161`.
- Font 12px, weight 800.
- Radius `999px`.

### Surface card

- Background `rgba(255,255,255,0.94)`.
- Border `#E4E4DF`.
- Shadow `shadow.saasSoft`.
- Radius `8px`.
- Hover card: border `rgba(8,8,8,0.22)`, shadow `shadow.saas`, translateY `-2px`.

### Dark surface

- Background `#141414`.
- Border `rgba(255,255,255,0.12)`.
- Text inverse.
- Используется на темных proof/CTA секциях.

### Form field

- Input height min `48px`.
- Radius `8px`.
- Border neutral `#D4D4D8` / `neutral-300`.
- Focus border `#080808`.
- Label 14px bold.
- Error text red, only after submit.
- Success box green.

### Checkbox consent

- Size `20px`.
- Accent `#080808`.
- Label with legal link underline.
- Error appears below only after submit.

### Project card

- Radius `14px`.
- Surface `#FFFFFF`.
- Accent `#EF5A24`.
- Preview 16:9 or fixed browser-like frame.
- Tags as neutral pills.
- Primary action black pill, hover orange.

### CTA section

- Full-width dark band.
- Left: offer and benefit chips.
- Right: light form surface.
- Form surface radius `8px`, padding 20-28px.

## 11. Figma page structure

Рекомендуемые страницы:

1. `00 Cover` - название, принципы, версия.
2. `01 Foundations` - colors, typography, spacing, radius, shadows, motion.
3. `02 Components` - buttons, inputs, cards, header, CTA, project card, FAQ row.
4. `03 Semantics` - когда использовать каждый токен и какие паттерны запрещены.
5. `04 Examples` - hero, form block, project grid, dark CTA.

## 12. Naming conventions

### Цветовые стили

- `DS/Color/Global/Ink 950`
- `DS/Color/Semantic/Text Primary`
- `DS/Color/Semantic/CTA Primary BG`
- `DS/Color/Component/Button Primary BG`

### Текстовые стили

- `DS/Text/Display Hero`
- `DS/Text/Heading Section`
- `DS/Text/Body Base`
- `DS/Text/Accent Serif Italic`

### Effect styles

- `DS/Shadow/SaaS Soft`
- `DS/Shadow/SaaS`
- `DS/Shadow/Reference`

## 13. Правила поддержки

- Любой новый цвет сначала добавлять как global token, затем semantic token.
- Компоненты должны ссылаться на semantic/component tokens, а не на случайные hex.
- Не добавлять новый radius без причины.
- Не добавлять новый стиль заголовка, если подходит существующий.
- При изменении сайта обновлять `figma-design-system` и `design-system/десмосавто-saas/MASTER.md`.
- Не хранить Telegram token или любые secrets в Figma-документации.

