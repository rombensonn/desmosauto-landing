# 07. Система анимаций

## Общий принцип

Анимации в ДесмосАвто должны помогать читать структуру, показывать глубину и усиливать премиальность. Они не должны отвлекать от оффера и формы заявки.

Правило: анимация должна объяснять порядок, связь или состояние. Если она просто "крутится потому что красиво", ее не нужно добавлять.

## GSAP ScrollTrigger

Главный файл:

- `components/GsapScrollExperience.tsx`.

GSAP отвечает за:

- появление hero-элементов;
- reveal заголовков секций;
- reveal групп карточек;
- scroll-drift AEO hero panel;
- pinned horizontal scroll проблемного блока;
- sticky stack/parallax карточек.

Основные data hooks:

- `[data-gsap-hero-item]`;
- `[data-gsap-section-head]`;
- `[data-gsap-card-group]`;
- `[data-gsap-card]`;
- `[data-gsap-hero-visual]`;
- `[data-gsap-horizontal-section]`;
- `[data-gsap-horizontal-viewport]`;
- `[data-gsap-horizontal-track]`;
- `[data-gsap-horizontal-card]`.

Правила:

- не удалять data hooks без понимания;
- desktop horizontal scroll не переносить на мобильный;
- cleanup ScrollTrigger обязателен;
- reduced-motion отключает GSAP;
- элементы должны иметь стабильные размеры.

## Sticky stack

Файл:

- `components/ScrollStackShowcase.tsx`.

Смысл: показать путь клиента к заявке слоями:

1. вопрос/тревога;
2. доверие;
3. маршрут по сайту;
4. заявка.

Анимация:

- sticky cards;
- небольшой y-offset;
- parallax изображения;
- плавное усиление копирайта.

Это одна из фирменных секций. Не заменять обычными карточками без причины.

## Horizontal problem cards

Секция на главной:

- desktop: pinned horizontal scroll;
- mobile/tablet: обычная сетка.

Смысл: показать боли клиента/автосервиса как последовательную историю. Не плодить несколько таких секций.

## Framer Motion / Motion

Используется для:

- FAQ: поворот плюса и раскрытие ответа;
- service modal: backdrop, scale/y/opacity, focus trap;
- projects result count: spring-counting числа найденных проектов.

Правила:

- FAQ короткий и спокойный;
- модалки сохраняют Escape close, focus trap, body scroll lock;
- счетчик проектов должен иметь reduced-motion fallback.

## CSS hover

Hover-язык:

- кнопки поднимаются на 1px;
- primary становится оранжевым;
- карточки приподнимаются и получают более сильную тень;
- project preview image слегка увеличивается;
- proof marquee ставится на паузу при hover.

Не делать:

- резкие прыжки;
- большие scale;
- hover, который меняет размеры layout;
- шумные bounce-эффекты на основных CTA.

## Animate.css-style

Файлы:

- `app/aeo/ScrollAnimate.tsx`;
- keyframes в `app/globals.css`.

Используется на AEO-странице:

- `fadeInUp`;
- `zoomIn`;
- `bounceIn`.

Главная страница в основном должна использовать GSAP hooks, а не смешивать паттерны без причины.

## WebGL animation

Файл:

- `app/aeo/AeoNeuroSearchScene.tsx`.

Движение:

- легкий поворот браузерной панели;
- вертикальный drift;
- pulse ring;
- floating semantic chips.

Reduced motion:

- останавливает frame movement;
- отключает Float intensity.

## Обязательное правило

Перед добавлением новой анимации нужно ответить:

1. Что она объясняет?
2. Не мешает ли CTA?
3. Работает ли на мобильном?
4. Есть ли reduced-motion поведение?
5. Не ломает ли layout?

