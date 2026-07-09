# DesmosAuto Figma Design System Kit

Этот пакет собран для переноса дизайн-системы ДесмосАвто в Figma. Он не меняет сайт и не содержит backend-секретов.

## Что внутри

- `design-system-spec.md` - полная спецификация дизайн-системы на русском языке.
- `desmosauto.tokens.json` - W3C Design Tokens JSON.
- `tokens-studio.json` - формат для плагина Tokens Studio в Figma.
- `desmosauto-variables.css` - CSS-переменные проекта.
- `desmosauto-design-system-board.svg` - визуальная доска, которую можно импортировать в Figma.
- `desmosauto-design-system-board.html` - локальная HTML-доска для просмотра в браузере.
- `figma-plugin-create-design-system.js` - скрипт для Figma plugin console, который создает страницы, стили, цветовые плашки, типографику и базовые компоненты.

## Как использовать в Figma

### Быстрый вариант

1. Открой Figma.
2. Создай новый design file.
3. Перетащи файл `desmosauto-design-system-board.svg` на canvas.
4. Получишь визуальную доску с цветами, типографикой, компонентами и правилами.

### Вариант с токенами

1. Установи в Figma плагин Tokens Studio.
2. Импортируй `tokens-studio.json`.
3. Используй коллекции `global`, `semantic`, `component` как основу переменных и стилей.

### Вариант с автосборкой файла

1. Создай локальный Figma plugin или открой plugin console в своем dev plugin.
2. Вставь содержимое `figma-plugin-create-design-system.js`.
3. Запусти plugin.
4. Скрипт создаст страницы `00 Cover`, `01 Foundations`, `02 Components`, `03 Semantics`, а также локальные paint/text/effect styles.

## Источник правды

Активная система: `design-system/десмосавто-saas/MASTER.md`.

Дополнительный источник фактических значений: `app/globals.css`.

Старая система `design-system/десмосавто/MASTER.md` считается deprecated и не должна смешиваться с текущей editorial/SaaS-системой.

