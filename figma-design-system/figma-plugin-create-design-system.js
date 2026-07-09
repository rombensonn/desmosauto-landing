const C = {
  ink: "#0A0A0A",
  black: "#000000",
  graphite: "#181818",
  text: "#161616",
  muted: "#5E5E5A",
  soft: "#F6F5F2",
  paper: "#FFFFFF",
  line: "#E3E1DC",
  lineDark: "#313131",
  accent: "#FF4A1C",
  accentSoft: "#FFF0EA",
  accentLine: "#FFC9B8",
  warm: "#ECE9E2",
  success: "#1F8A4C",
  danger: "#C81414",
};

let F = {
  regular: { family: "Arial", style: "Regular" },
  medium: { family: "Arial", style: "Regular" },
  semibold: { family: "Arial", style: "Bold" },
  bold: { family: "Arial", style: "Bold" },
};

async function loadFonts() {
  async function load(primary, fallback) {
    try {
      await figma.loadFontAsync(primary);
      return primary;
    } catch (error) {
      await figma.loadFontAsync(fallback);
      return fallback;
    }
  }

  F.regular = await load({ family: "Inter", style: "Regular" }, { family: "Arial", style: "Regular" });
  F.medium = await load({ family: "Inter", style: "Medium" }, { family: "Arial", style: "Regular" });
  F.semibold = await load({ family: "Inter", style: "Semi Bold" }, { family: "Arial", style: "Bold" });
  F.bold = await load({ family: "Inter", style: "Bold" }, { family: "Arial", style: "Bold" });
}

function rgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
  };
}

function paint(hex) {
  return [{ type: "SOLID", color: rgb(hex) }];
}

function shadow(kind = "soft") {
  if (kind === "dark") {
    return [
      { type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.22 }, offset: { x: 0, y: 24 }, radius: 60, spread: -18, visible: true, blendMode: "NORMAL" },
    ];
  }
  return [
    { type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.08 }, offset: { x: 0, y: 18 }, radius: 46, spread: -20, visible: true, blendMode: "NORMAL" },
  ];
}

function frame(parent, name, x, y, w, h, fill = C.paper, radius = 8, stroke = null, effect = null) {
  const node = figma.createFrame();
  node.name = name;
  node.x = x;
  node.y = y;
  node.resize(w, h);
  node.fills = paint(fill);
  node.cornerRadius = radius;
  node.clipsContent = false;
  if (stroke) {
    node.strokes = paint(stroke);
    node.strokeWeight = 1;
  }
  if (effect) node.effects = shadow(effect);
  parent.appendChild(node);
  return node;
}

function rect(parent, name, x, y, w, h, fill = C.paper, radius = 0, stroke = null) {
  const node = figma.createRectangle();
  node.name = name;
  node.x = x;
  node.y = y;
  node.resize(w, h);
  node.fills = paint(fill);
  node.cornerRadius = radius;
  if (stroke) {
    node.strokes = paint(stroke);
    node.strokeWeight = 1;
  }
  parent.appendChild(node);
  return node;
}

function ellipse(parent, name, x, y, size, fill = C.accent) {
  const node = figma.createEllipse();
  node.name = name;
  node.x = x;
  node.y = y;
  node.resize(size, size);
  node.fills = paint(fill);
  parent.appendChild(node);
  return node;
}

function text(parent, name, value, x, y, w, size, fill = C.text, font = F.regular, lineHeight = 1.25) {
  const node = figma.createText();
  node.name = name;
  node.fontName = font;
  node.characters = value;
  node.fontSize = size;
  node.fills = paint(fill);
  node.x = x;
  node.y = y;
  node.textAutoResize = "HEIGHT";
  node.resize(w, Math.max(24, Math.round(size * 1.5)));
  node.lineHeight = { unit: "PIXELS", value: Math.round(size * lineHeight) };
  parent.appendChild(node);
  return node;
}

function pill(parent, name, label, x, y, w, tone = "dark") {
  const fill = tone === "accent" ? C.accent : tone === "light" ? C.accentSoft : C.ink;
  const color = tone === "light" ? C.accent : C.paper;
  rect(parent, `${name} / shape`, x, y, w, 38, fill, 99, tone === "light" ? C.accentLine : null);
  text(parent, `${name} / label`, label, x + 18, y + 10, w - 36, 14, color, F.semibold, 1.05);
}

function card(parent, name, x, y, w, h, title, body, opts = {}) {
  const fill = opts.fill || C.paper;
  const stroke = opts.stroke || (fill === C.ink || fill === C.graphite ? C.lineDark : C.line);
  const titleColor = opts.titleColor || (fill === C.ink || fill === C.graphite ? C.paper : C.text);
  const bodyColor = opts.bodyColor || (fill === C.ink || fill === C.graphite ? "#C9C9C7" : C.muted);
  frame(parent, `${name} / card`, x, y, w, h, fill, opts.radius || 10, stroke, opts.shadow ? "soft" : null);
  if (opts.dot !== false) ellipse(parent, `${name} / dot`, x + 28, y + 30, 12, opts.accent || C.accent);
  text(parent, `${name} / title`, title, x + 28, y + 56, w - 56, opts.titleSize || 24, titleColor, F.semibold, 1.15);
  text(parent, `${name} / body`, body, x + 28, y + 100, w - 56, opts.bodySize || 16, bodyColor, F.regular, 1.45);
}

function swatch(parent, name, x, y, w, h, color, title, value, desc) {
  frame(parent, `${name} / container`, x, y, w, h, C.paper, 10, C.line, "soft");
  rect(parent, `${name} / color`, x + 18, y + 18, w - 36, 108, color, 8);
  text(parent, `${name} / title`, title, x + 18, y + 150, w - 36, 22, C.text, F.semibold);
  text(parent, `${name} / value`, value, x + 18, y + 184, w - 36, 16, color === C.black ? C.muted : color, F.semibold);
  text(parent, `${name} / desc`, desc, x + 18, y + 214, w - 36, 15, C.muted, F.regular, 1.35);
}

function tokenRow(parent, name, x, y, w, cols, index) {
  const fills = index % 2 === 0 ? C.paper : "#F0EFEA";
  rect(parent, `${name} / row`, x, y, w, 56, fills, 6, C.line);
  const widths = [260, 310, 520, w - 1130];
  let cursor = x + 22;
  cols.forEach((col, i) => {
    text(parent, `${name} / c${i + 1}`, col, cursor, y + 18, widths[i] - 24, 15, i === 1 ? C.accent : i === 0 ? C.text : C.muted, i < 2 ? F.semibold : F.regular, 1.1);
    cursor += widths[i];
  });
}

function sectionTitle(parent, label, title, x, y, w) {
  pill(parent, `${title} / pill`, label, x, y, 118, "light");
  text(parent, `${title} / heading`, title, x, y + 56, w, 34, C.text, F.semibold, 1.12);
}

function board(pageName, title, subtitle) {
  const page = figma.createPage();
  page.name = pageName;
  page.backgrounds = paint(C.soft);

  const root = frame(page, `${pageName} / polished board`, 0, 0, 2400, 1800, C.soft, 0, null, null);
  text(root, `${pageName} / index`, pageName.split(" ")[0], 88, 78, 90, 22, C.accent, F.semibold);
  text(root, `${pageName} / title`, title, 88, 112, 980, 54, C.text, F.bold, 1.04);
  text(root, `${pageName} / subtitle`, subtitle, 88, 190, 1280, 22, C.muted, F.regular, 1.45);
  rect(root, `${pageName} / header line`, 88, 260, 2040, 1, C.line, 0);
  text(root, `${pageName} / brand label`, "Desmos Auto Design System", 1780, 114, 350, 18, C.muted, F.medium);
  rect(root, `${pageName} / brand mark orange`, 2140, 106, 48, 48, C.accent, 6);
  rect(root, `${pageName} / brand mark black`, 2198, 106, 48, 48, C.ink, 6);
  return { page, root };
}

function miniBrowser(parent, name, x, y, w, h, title) {
  frame(parent, `${name} / browser`, x, y, w, h, C.paper, 10, C.line, "soft");
  rect(parent, `${name} / topbar`, x, y, w, 42, "#F1F0EC", 10);
  ellipse(parent, `${name} / dot 1`, x + 20, y + 15, 10, C.accent);
  ellipse(parent, `${name} / dot 2`, x + 38, y + 15, 10, "#D9D7D0");
  ellipse(parent, `${name} / dot 3`, x + 56, y + 15, 10, "#D9D7D0");
  text(parent, `${name} / browser title`, title, x + 90, y + 14, w - 120, 13, C.muted, F.medium, 1.05);
}

function addButton(parent, name, x, y, w, label, tone = "dark") {
  const fill = tone === "accent" ? C.accent : tone === "light" ? C.paper : C.ink;
  const color = tone === "light" ? C.text : C.paper;
  rect(parent, `${name} / button`, x, y, w, 58, fill, 99, tone === "light" ? C.line : null);
  text(parent, `${name} / label`, label, x + 28, y + 19, w - 70, 17, color, F.semibold, 1.05);
  text(parent, `${name} / arrow`, "->", x + w - 54, y + 17, 32, 20, color, F.semibold, 1.05);
}

function addInput(parent, name, x, y, w, label, value, state = "default") {
  const stroke = state === "error" ? C.danger : state === "focus" ? C.ink : C.line;
  text(parent, `${name} / label`, label, x, y, w, 15, C.text, F.semibold);
  rect(parent, `${name} / field`, x, y + 28, w, 56, C.paper, 8, stroke);
  text(parent, `${name} / value`, value, x + 18, y + 46, w - 36, 17, state === "empty" ? "#9A9993" : C.text, F.regular, 1.05);
  if (state === "error") text(parent, `${name} / error`, "Показываем только после нажатия CTA", x, y + 96, w, 14, C.danger, F.medium, 1.2);
}

function addCheckbox(parent, name, x, y, label, checked = false) {
  rect(parent, `${name} / box`, x, y, 28, 28, checked ? C.ink : C.paper, 5, checked ? C.ink : "#9A9993");
  if (checked) text(parent, `${name} / check`, "✓", x + 7, y + 3, 20, 20, C.paper, F.bold, 1);
  text(parent, `${name} / label`, label, x + 46, y + 3, 440, 18, C.text, F.regular, 1.35);
}

function page00() {
  const { root } = board("00 Cover", "ДесмосАвто: внутренняя дизайн-система", "Единая карта визуала, смыслов, компонентов, анимаций и правил handoff для сайта Desmos Auto.");

  frame(root, "Cover / hero", 88, 340, 1370, 610, C.ink, 16, null, "dark");
  pill(root, "Cover / status", "production-ready .fig", 140, 400, 210, "accent");
  text(root, "Cover / hero title", "Сайт для автобизнеса как цифровой администратор", 140, 470, 860, 68, C.paper, F.bold, 1.02);
  text(root, "Cover / hero body", "Он объясняет услуги до звонка, снижает поток повторных вопросов и приводит клиента к заявке уже с пониманием предложения.", 140, 660, 700, 25, "#D5D5D1", F.regular, 1.45);
  addButton(root, "Cover / CTA", 140, 800, 260, "Получить демо", "accent");
  rect(root, "Cover / orange plate", 1080, 430, 250, 116, C.accent, 12);
  rect(root, "Cover / dark plate", 1010, 590, 320, 150, C.graphite, 12, C.lineDark);
  rect(root, "Cover / light plate", 940, 775, 390, 52, "#2B2B2B", 8);

  sectionTitle(root, "map", "Что внутри файла", 1540, 340, 520);
  const map = [
    ["01", "Brand Assets", "Логотип, знак, lockups, правила применения"],
    ["02", "Foundations", "Цвета, типографика, spacing, радиусы, тени"],
    ["03", "Tokens", "Primitive, semantic и component tokens"],
    ["04", "Components", "Кнопки, формы, карточки, FAQ, header"],
    ["05-08", "Patterns + Handoff", "Секции, motion, UX semantics, release checklist"],
  ];
  map.forEach((item, i) => {
    const y = 470 + i * 88;
    frame(root, `Cover / map row ${i + 1}`, 1540, y, 600, 66, C.paper, 10, C.line, "soft");
    text(root, `Cover / map index ${i + 1}`, item[0], 1565, y + 21, 70, 18, C.accent, F.semibold);
    text(root, `Cover / map title ${i + 1}`, item[1], 1645, y + 14, 220, 18, C.text, F.semibold);
    text(root, `Cover / map body ${i + 1}`, item[2], 1645, y + 38, 430, 14, C.muted, F.regular);
  });

  sectionTitle(root, "pillars", "Опорные принципы", 88, 1060, 660);
  card(root, "Cover / clarity", 88, 1190, 470, 250, "Понятность до звонка", "Структура сайта заранее отвечает на вопросы клиента и разгружает менеджера или администратора.", { shadow: true });
  card(root, "Cover / trust", 590, 1190, 470, 250, "Доверие через факты", "Кейсы, этапы, гарантии, фото, цифры и конкретные формулировки вместо пустых обещаний.", { shadow: true });
  card(root, "Cover / action", 1092, 1190, 470, 250, "Заявка без трения", "Форма ведет к Telegram/backend без ручных действий, а ошибки появляются только после submit.", { fill: C.accentSoft, stroke: C.accentLine, shadow: true });
  card(root, "Cover / premium", 1594, 1190, 470, 250, "Строгий премиальный визуал", "Белое поле, черные CTA, оранжевый акцент, editorial-типографика и спокойные анимации.", { fill: C.ink, shadow: true });
}

function page01() {
  const { root } = board("01 Brand Assets", "Brand Assets", "Логотип, знак, lockups и правила применения бренда в интерфейсе и презентационных материалах.");

  frame(root, "Brand / logo stage", 88, 340, 980, 560, C.paper, 16, C.line, "soft");
  rect(root, "Brand / grid line 1", 148, 410, 860, 1, C.line, 0);
  rect(root, "Brand / grid line 2", 148, 770, 860, 1, C.line, 0);
  rect(root, "Brand / grid line 3", 238, 380, 1, 460, C.line, 0);
  rect(root, "Brand / grid line 4", 888, 380, 1, 460, C.line, 0);
  rect(root, "Brand / mark accent", 290, 465, 150, 150, C.accent, 16);
  rect(root, "Brand / mark black", 470, 465, 150, 150, C.ink, 16);
  rect(root, "Brand / mark graphite", 380, 642, 240, 86, C.graphite, 14);
  text(root, "Brand / wordmark", "ДесмосАвто", 690, 510, 260, 42, C.text, F.bold, 1.04);
  text(root, "Brand / descriptor", "цифровые сайты для автобизнеса", 692, 568, 260, 18, C.muted, F.medium, 1.25);
  text(root, "Brand / clear space", "Clear space: минимум 1 высота оранжевого знака вокруг lockup.", 148, 820, 760, 18, C.muted, F.regular, 1.35);

  sectionTitle(root, "lockups", "Lockup variants", 1160, 340, 520);
  frame(root, "Brand / lockup 1", 1160, 470, 460, 180, C.paper, 12, C.line, "soft");
  rect(root, "Brand / lockup 1 mark", 1200, 520, 64, 64, C.accent, 8);
  text(root, "Brand / lockup 1 text", "ДесмосАвто", 1290, 525, 220, 32, C.text, F.bold, 1);
  text(root, "Brand / lockup 1 desc", "Primary horizontal", 1292, 565, 220, 15, C.muted, F.regular);
  frame(root, "Brand / lockup 2", 1660, 470, 460, 180, C.ink, 12, null, "dark");
  rect(root, "Brand / lockup 2 mark", 1700, 520, 64, 64, C.accent, 8);
  text(root, "Brand / lockup 2 text", "ДесмосАвто", 1790, 525, 220, 32, C.paper, F.bold, 1);
  text(root, "Brand / lockup 2 desc", "Dark surface", 1792, 565, 220, 15, "#BFBFBA", F.regular);
  frame(root, "Brand / lockup 3", 1160, 700, 460, 180, C.accentSoft, 12, C.accentLine, "soft");
  rect(root, "Brand / lockup 3 mark", 1200, 750, 64, 64, C.accent, 8);
  text(root, "Brand / lockup 3 text", "DA", 1290, 752, 100, 38, C.ink, F.bold, 1);
  text(root, "Brand / lockup 3 desc", "Compact / favicon", 1292, 796, 220, 15, C.muted, F.regular);
  frame(root, "Brand / lockup 4", 1660, 700, 460, 180, C.paper, 12, C.line, "soft");
  text(root, "Brand / lockup 4 text", "Desmos Auto", 1700, 748, 260, 40, C.text, F.bold, 1);
  text(root, "Brand / lockup 4 desc", "Latin fallback for files and export names", 1702, 798, 300, 15, C.muted, F.regular);

  sectionTitle(root, "rules", "Usage rules", 88, 1010, 520);
  card(root, "Brand / do", 88, 1140, 610, 260, "Do", "Использовать знак на спокойных белых, черных или теплых поверхностях. Сохранять свободное поле и контраст.", { shadow: true, accent: C.success });
  card(root, "Brand / dont", 740, 1140, 610, 260, "Don't", "Не растягивать знак, не ставить на шумный фон, не добавлять новые цвета и не превращать логотип в декоративный паттерн.", { shadow: true, accent: C.danger });
  card(root, "Brand / file naming", 1392, 1140, 610, 260, "File naming", "Для handoff использовать DesmosAuto или ДесмосАвто-design-system. Не хранить версии как final-final-v3.", { fill: C.accentSoft, stroke: C.accentLine, shadow: true });
}

function page02() {
  const { root } = board("02 Foundations", "Foundations", "Базовые визуальные решения: цветовая система, типографика, spacing, радиусы, сетка и тени.");

  sectionTitle(root, "color", "Palette", 88, 330, 420);
  swatch(root, "Color / Ink", 88, 460, 300, 300, C.ink, "Ink", "#0A0A0A", "Primary text, dark sections, black CTA.");
  swatch(root, "Color / Accent", 420, 460, 300, 300, C.accent, "Action Orange", "#FF4A1C", "Primary action accent, markers, important highlights.");
  swatch(root, "Color / Paper", 752, 460, 300, 300, C.paper, "Paper", "#FFFFFF", "Cards, fields, clean surfaces.");
  swatch(root, "Color / Soft", 1084, 460, 300, 300, C.soft, "Warm Canvas", "#F6F5F2", "Main page canvas, design-system boards.");
  swatch(root, "Color / Graphite", 1416, 460, 300, 300, C.graphite, "Graphite", "#181818", "3D stage, secondary dark panels.");
  swatch(root, "Color / Line", 1748, 460, 300, 300, C.line, "Warm Line", "#E3E1DC", "Subtle borders and dividers.");

  sectionTitle(root, "type", "Typography scale", 88, 860, 520);
  frame(root, "Type / stage", 88, 990, 960, 500, C.paper, 14, C.line, "soft");
  text(root, "Type / display", "Display / 68", 138, 1045, 760, 68, C.text, F.bold, 1);
  text(root, "Type / h1", "Headline / 54", 138, 1155, 700, 54, C.text, F.bold, 1.04);
  text(root, "Type / h2", "Section / 34", 138, 1242, 700, 34, C.text, F.semibold, 1.1);
  text(root, "Type / body", "Body / 18: сайт должен объяснять услугу быстро, спокойно и без маркетинговой воды.", 138, 1310, 720, 18, C.muted, F.regular, 1.45);
  text(root, "Type / note", "Caption / 14: подписи, токены, статусы, короткие технические примечания.", 138, 1400, 700, 14, C.muted, F.medium, 1.35);

  sectionTitle(root, "layout", "Spacing, radius, elevation", 1160, 860, 680);
  frame(root, "Spacing / stage", 1160, 990, 890, 500, C.paper, 14, C.line, "soft");
  const spacings = [["4", 4], ["8", 8], ["12", 12], ["16", 16], ["24", 24], ["32", 32], ["48", 48], ["72", 72]];
  spacings.forEach((s, i) => {
    const x = 1210 + i * 95;
    rect(root, `Spacing / ${s[0]}`, x, 1060 + (72 - s[1]), 54, s[1], C.accent, 4);
    text(root, `Spacing / label ${s[0]}`, s[0], x, 1148, 54, 14, C.muted, F.semibold);
  });
  text(root, "Spacing / title", "Spacing tokens", 1210, 1018, 360, 22, C.text, F.semibold);
  text(root, "Radius / title", "Radius", 1210, 1230, 220, 22, C.text, F.semibold);
  rect(root, "Radius / 4", 1210, 1280, 90, 70, C.ink, 4);
  rect(root, "Radius / 8", 1330, 1280, 90, 70, C.ink, 8);
  rect(root, "Radius / 12", 1450, 1280, 90, 70, C.ink, 12);
  rect(root, "Radius / 99", 1570, 1280, 120, 70, C.ink, 99);
  text(root, "Radius / labels", "4        8        12       pill", 1210, 1372, 540, 16, C.muted, F.semibold);
  text(root, "Elevation / title", "Elevation", 1210, 1430, 220, 22, C.text, F.semibold);
  frame(root, "Elevation / card 1", 1390, 1415, 140, 70, C.paper, 8, C.line, "soft");
  frame(root, "Elevation / card 2", 1560, 1405, 160, 80, C.paper, 8, C.line, "dark");
}

function page03() {
  const { root } = board("03 Tokens", "Design Tokens", "Нормализованная система токенов: primitive, semantic, component и motion values для дизайна и разработки.");

  sectionTitle(root, "primitive", "Primitive tokens", 88, 330, 520);
  frame(root, "Tokens / primitive table", 88, 460, 1120, 560, C.paper, 14, C.line, "soft");
  const primitive = [
    ["color.ink", "#0A0A0A", "Text / dark surface", "Primary black"],
    ["color.accent", "#FF4A1C", "CTA / highlight", "Orange action"],
    ["color.paper", "#FFFFFF", "Cards / fields", "Main white"],
    ["color.canvas", "#F6F5F2", "Page background", "Warm neutral"],
    ["radius.card", "8-10px", "Cards and panels", "Strict, not bubbly"],
    ["shadow.soft", "0 18 46 -20", "Cards", "Subtle depth"],
    ["space.section", "96-144px", "Landing sections", "Breathing room"],
  ];
  primitive.forEach((row, i) => tokenRow(root, `Primitive ${i + 1}`, 120, 540 + i * 62, 1056, row, i));

  sectionTitle(root, "semantic", "Semantic tokens", 1280, 330, 520);
  frame(root, "Tokens / semantic table", 1280, 460, 860, 560, C.paper, 14, C.line, "soft");
  const semantic = [
    ["surface.default", "color.canvas", "Warm page background"],
    ["surface.card", "color.paper", "Cards / forms / docs"],
    ["surface.inverse", "color.ink", "Dark CTA sections"],
    ["text.primary", "color.ink", "Headings and body"],
    ["text.secondary", "#5E5E5A", "Descriptions and hints"],
    ["action.primary", "color.ink", "Black CTA button"],
    ["action.accent", "color.accent", "Orange highlights"],
  ];
  semantic.forEach((row, i) => {
    rect(root, `Semantic row ${i + 1}`, 1320, 540 + i * 62, 780, 52, i % 2 ? "#F0EFEA" : C.paper, 6, C.line);
    text(root, `Semantic name ${i + 1}`, row[0], 1342, 558 + i * 62, 220, 15, C.text, F.semibold);
    text(root, `Semantic value ${i + 1}`, row[1], 1600, 558 + i * 62, 180, 15, C.accent, F.semibold);
    text(root, `Semantic use ${i + 1}`, row[2], 1810, 558 + i * 62, 260, 15, C.muted, F.regular);
  });

  sectionTitle(root, "component", "Component tokens", 88, 1120, 620);
  frame(root, "Tokens / component table", 88, 1250, 2052, 360, C.paper, 14, C.line, "soft");
  const component = [
    ["button.primary.bg", "surface.inverse", "CTA background", "Black button on light canvas"],
    ["button.primary.fg", "color.paper", "CTA label", "White text"],
    ["form.field.border.default", "color.line", "Input border", "Calm default state"],
    ["form.field.border.focus", "color.ink", "Input focus", "Clear but not loud"],
    ["form.error.text", "#C81414", "Validation", "Only after submit"],
  ];
  component.forEach((row, i) => tokenRow(root, `Component ${i + 1}`, 128, 1330 + i * 58, 1970, row, i));
}

function page04() {
  const { root } = board("04 Components", "Component Library", "Редактируемые компоненты и состояния: кнопки, формы, карточки, header, FAQ и lead form.");

  sectionTitle(root, "buttons", "Buttons", 88, 330, 420);
  frame(root, "Components / buttons stage", 88, 460, 720, 390, C.paper, 14, C.line, "soft");
  addButton(root, "Button / primary", 138, 540, 280, "Получить демо", "dark");
  addButton(root, "Button / accent", 138, 625, 280, "Записаться", "accent");
  addButton(root, "Button / light", 138, 710, 280, "Подробнее", "light");
  text(root, "Button / rules", "Hover: translateY(-1px), стрелка вправо, без изменения размера.\nActive: легкое затемнение.\nDisabled: opacity 40%, cursor default.", 470, 540, 260, 17, C.muted, F.regular, 1.45);

  sectionTitle(root, "forms", "Lead form states", 900, 330, 520);
  frame(root, "Components / form", 900, 460, 560, 640, C.paper, 16, C.line, "soft");
  text(root, "Form / title", "Получить демо за сутки", 950, 520, 420, 34, C.text, F.bold, 1.05);
  addInput(root, "Form / name", 950, 610, 460, "Имя", "Алексей", "focus");
  addInput(root, "Form / phone", 950, 735, 460, "Телефон", "+7 (999) 999 99-99", "default");
  addCheckbox(root, "Form / policy", 950, 870, "Я ознакомлен(а) с политикой конфиденциальности", true);
  addCheckbox(root, "Form / consent", 950, 930, "Даю согласие на обработку персональных данных", true);
  addButton(root, "Form / submit", 950, 1010, 460, "Получить демо", "dark");

  frame(root, "Components / error form", 1520, 460, 560, 640, C.accentSoft, 16, C.accentLine, "soft");
  text(root, "Error Form / title", "Validation после submit", 1570, 520, 420, 34, C.text, F.bold, 1.05);
  addInput(root, "Error Form / name", 1570, 610, 460, "Имя", "Введите имя", "error");
  addInput(root, "Error Form / phone", 1570, 755, 460, "Телефон", "+7 (___) ___ __-__", "empty");
  text(root, "Error Form / rule", "Красные тексты не появляются при обычном переходе между полями. Только после попытки отправки.", 1570, 900, 420, 19, C.danger, F.semibold, 1.42);
  addButton(root, "Error Form / submit", 1570, 1010, 460, "Получить демо", "dark");

  sectionTitle(root, "cards", "Cards & content rows", 88, 1190, 620);
  card(root, "Component / service card", 88, 1320, 420, 240, "Сервисная карточка", "Заголовок, конкретная польза, 1-2 доказательства и мягкий переход к CTA.", { shadow: true });
  card(root, "Component / case card", 540, 1320, 420, 240, "Кейс проекта", "Формат: ниша, проблема, что сделали, результат. Без абстрактных обещаний.", { fill: C.ink, shadow: true });
  frame(root, "Component / FAQ row", 992, 1320, 600, 96, C.paper, 8, C.line, "soft");
  text(root, "FAQ / q", "Сколько занимает запуск демо?", 1020, 1352, 420, 24, C.text, F.semibold);
  text(root, "FAQ / plus", "+", 1535, 1348, 40, 30, C.accent, F.bold);
  frame(root, "Component / Header", 992, 1465, 800, 96, C.ink, 12, null, "dark");
  text(root, "Header / logo", "ДесмосАвто", 1030, 1498, 180, 25, C.paper, F.bold);
  text(root, "Header / nav", "Услуги    Кейсы    FAQ    Контакты", 1270, 1502, 320, 17, "#C9C9C7", F.medium);
  addButton(root, "Header / cta", 1610, 1484, 150, "Демо", "accent");
}

function page05() {
  const { root } = board("05 Page Patterns", "Page Patterns", "Композиционные паттерны ключевых секций лендинга: от hero до формы заявки.");

  miniBrowser(root, "Pattern / hero", 88, 340, 940, 500, "Hero / first viewport");
  text(root, "Pattern / hero title", "Сайт для автосервиса как цифровой администратор", 140, 455, 500, 50, C.text, F.bold, 1.03);
  text(root, "Pattern / hero body", "Объясняет услуги, снимает повторные вопросы и приводит подготовленные заявки.", 140, 620, 390, 20, C.muted, F.regular, 1.45);
  addButton(root, "Pattern / hero cta", 140, 735, 240, "Получить демо", "dark");
  rect(root, "Pattern / hero media a", 720, 470, 200, 92, C.accent, 10);
  rect(root, "Pattern / hero media b", 670, 600, 250, 150, C.ink, 10);

  miniBrowser(root, "Pattern / proof", 1110, 340, 900, 230, "Proof strip");
  ["120 проектов", "Демо за сутки", "Без предоплаты", "SEO/AEO"].forEach((item, i) => {
    ellipse(root, `Proof / dot ${i + 1}`, 1160 + i * 200, 445, 14, i === 1 ? C.accent : C.ink);
    text(root, `Proof / label ${i + 1}`, item, 1185 + i * 200, 442, 130, 16, C.text, F.semibold);
  });

  miniBrowser(root, "Pattern / problems", 1110, 650, 900, 430, "Problem -> Solution grid");
  card(root, "Problem / q", 1160, 750, 230, 220, "Повторные вопросы", "FAQ и структура отвечают до звонка.", { titleSize: 19, bodySize: 14, shadow: false });
  card(root, "Problem / service", 1420, 750, 230, 220, "Непонятные услуги", "Этапы и условия записи объясняются онлайн.", { fill: C.accentSoft, stroke: C.accentLine, titleSize: 19, bodySize: 14, shadow: false });
  card(root, "Problem / trust", 1680, 750, 230, 220, "Слабое доверие", "Кейсы и факты работают как evidence layer.", { titleSize: 19, bodySize: 14, shadow: false });

  miniBrowser(root, "Pattern / services", 88, 930, 940, 420, "Services / package cards");
  ["Диагностика", "Ремонт", "Детейлинг"].forEach((item, i) => {
    const x = 140 + i * 280;
    frame(root, `Service pattern / card ${i + 1}`, x, 1035, 235, 210, i === 1 ? C.ink : C.paper, 10, i === 1 ? C.lineDark : C.line, "soft");
    ellipse(root, `Service pattern / dot ${i + 1}`, x + 24, 1065, 14, C.accent);
    text(root, `Service pattern / title ${i + 1}`, item, x + 24, 1100, 170, 22, i === 1 ? C.paper : C.text, F.semibold);
    text(root, `Service pattern / body ${i + 1}`, "Кому подходит, что входит, какой следующий шаг.", x + 24, 1140, 170, 15, i === 1 ? "#C9C9C7" : C.muted, F.regular, 1.35);
  });

  miniBrowser(root, "Pattern / lead", 1110, 1160, 900, 430, "Dark CTA + Lead form");
  rect(root, "Lead pattern / dark", 1160, 1240, 800, 260, C.ink, 12);
  text(root, "Lead pattern / title", "Покажем демо сайта за сутки", 1210, 1310, 300, 34, C.paper, F.bold, 1.05);
  text(root, "Lead pattern / body", "Уточним направление и покажем структуру без предоплаты.", 1210, 1400, 290, 18, "#C9C9C7", F.regular, 1.4);
  frame(root, "Lead pattern / form", 1580, 1275, 310, 190, C.paper, 10, C.line, null);
  addInput(root, "Lead pattern / mini name", 1610, 1305, 250, "Имя", "", "empty");
  addButton(root, "Lead pattern / mini cta", 1610, 1405, 250, "Отправить", "dark");
}

function page06() {
  const { root } = board("06 Motion & Interactions", "Motion & Interactions", "Анимации должны добавлять ощущение технологичности, но не мешать чтению, форме и производительности.");

  sectionTitle(root, "scroll", "Scroll choreography", 88, 330, 560);
  frame(root, "Motion / scroll lane", 88, 460, 1280, 330, C.paper, 14, C.line, "soft");
  const steps = [["Hero reveal", "0-700ms"], ["Proof lock", "viewport"], ["Cards stack", "scroll"], ["CTA settle", "submit-ready"]];
  steps.forEach((s, i) => {
    const x = 150 + i * 295;
    rect(root, `Motion / step ${i + 1}`, x, 560, 220, 92, i === 0 ? C.ink : i === 3 ? C.accent : C.accentSoft, 10, i === 0 ? null : C.accentLine);
    text(root, `Motion / step title ${i + 1}`, s[0], x + 22, 588, 160, 20, i === 0 || i === 3 ? C.paper : C.text, F.semibold);
    text(root, `Motion / step time ${i + 1}`, s[1], x + 22, 620, 160, 14, i === 0 || i === 3 ? "#D9D9D4" : C.accent, F.medium);
    if (i < 3) text(root, `Motion / arrow ${i + 1}`, "->", x + 245, 592, 60, 26, C.muted, F.bold);
  });
  text(root, "Motion / scroll rule", "ScrollTrigger: opacity + translateY, pin только если помогает сравнить или объяснить. Никаких layout jumps.", 140, 715, 980, 18, C.muted, F.regular, 1.4);

  sectionTitle(root, "tokens", "Motion tokens", 1480, 330, 480);
  frame(root, "Motion / token table", 1480, 460, 660, 520, C.paper, 14, C.line, "soft");
  const rows = [
    ["fast", "160ms", "hover/icon"],
    ["base", "180ms", "button/nav"],
    ["medium", "220ms", "accordion/cards"],
    ["reveal", "700ms", "section reveal"],
    ["marquee", "28s", "continuous strip"],
    ["ease.out", "cubic-bezier", "premium ease"],
  ];
  rows.forEach((r, i) => {
    rect(root, `Motion token / row ${i + 1}`, 1520, 540 + i * 62, 580, 52, i % 2 ? "#F0EFEA" : C.paper, 6, C.line);
    text(root, `Motion token / name ${i + 1}`, r[0], 1542, 558 + i * 62, 130, 15, C.text, F.semibold);
    text(root, `Motion token / value ${i + 1}`, r[1], 1700, 558 + i * 62, 160, 15, C.accent, F.semibold);
    text(root, `Motion token / use ${i + 1}`, r[2], 1880, 558 + i * 62, 160, 15, C.muted, F.regular);
  });

  sectionTitle(root, "micro", "Micro interactions", 88, 910, 520);
  card(root, "Motion / button", 88, 1040, 430, 250, "Button hover", "translateY(-1px), стрелка вправо, усиление контраста. Размеры не меняются.", { shadow: true });
  card(root, "Motion / card", 550, 1040, 430, 250, "Card hover", "Легкий lift, border чуть активнее, без превращения карточки в декоративный объект.", { shadow: true });
  card(root, "Motion / form", 1012, 1040, 430, 250, "Form focus", "Видимый focus, ошибки только после submit, исправление поля очищает ошибку.", { fill: C.accentSoft, stroke: C.accentLine, shadow: true });
  card(root, "Motion / reduced", 1474, 1040, 430, 250, "Reduced motion", "Учитывать prefers-reduced-motion: отключать parallax и длинные reveal-анимации.", { fill: C.ink, shadow: true });

  frame(root, "Motion / 3D stage", 88, 1390, 1300, 250, C.ink, 14, null, "dark");
  text(root, "Motion / 3D title", "3D/WebGL: фоновая технология, а не препятствие", 140, 1450, 660, 38, C.paper, F.bold, 1.05);
  text(root, "Motion / 3D body", "Сцена помогает ощущению современности, но не перекрывает текст, не блокирует форму и имеет fallback.", 140, 1530, 760, 20, "#C9C9C7", F.regular, 1.4);
  rect(root, "Motion / 3D orange", 1050, 1450, 200, 84, C.accent, 10);
  rect(root, "Motion / 3D black", 980, 1560, 270, 54, C.graphite, 10, C.lineDark);
}

function page07() {
  const { root } = board("07 UX Semantics & Governance", "UX Semantics & Governance", "Смысл проекта, целевая аудитория, аналитические правила и governance для будущих решений.");

  frame(root, "UX / north star", 88, 340, 1700, 260, C.ink, 16, null, "dark");
  pill(root, "UX / north star pill", "north star", 140, 400, 130, "accent");
  text(root, "UX / north star title", "Меньше хаоса в звонках, больше подготовленных клиентов", 140, 455, 1060, 42, C.paper, F.bold, 1.04);
  text(root, "UX / north star body", "ДесмосАвто нужен не только для лидов. Он разгружает автосервисы и другой автобизнес от повторных вопросов, объясняя сервис онлайн.", 140, 555, 1040, 20, "#D4D4D0", F.regular, 1.4);
  rect(root, "UX / north star accent", 1510, 410, 170, 76, C.accent, 10);
  rect(root, "UX / north star bar", 1440, 510, 240, 42, C.graphite, 8, C.lineDark);

  sectionTitle(root, "audience", "Audience matrix", 88, 700, 560);
  const audience = [
    ["Автосервисы", "Запись, диагностика, доверие, этапы ремонта"],
    ["Детейлинг / мойки", "Пакеты, визуальный результат, понятные различия"],
    ["Запчасти / тюнинг", "Подбор, сроки, наличие, сценарии консультации"],
    ["Любой автобизнес", "Если есть сложная услуга и повторные вопросы"],
  ];
  audience.forEach((a, i) => card(root, `UX / audience ${i + 1}`, 88 + i * 500, 830, 460, 230, a[0], a[1], { fill: i === 3 ? C.accentSoft : C.paper, stroke: i === 3 ? C.accentLine : C.line, shadow: true }));

  sectionTitle(root, "analytics", "Как анализировать проект", 88, 1160, 640);
  frame(root, "UX / analytics table", 88, 1290, 980, 360, C.paper, 14, C.line, "soft");
  const prompts = [
    ["Рынок", "Какие услуги сложнее всего объяснить по телефону?"],
    ["ЦА", "Какие вопросы клиент задает до записи?"],
    ["Оффер", "Что снижает страх: цена, гарантия, сроки, кейсы?"],
    ["Контент", "Какие блоки заменяют 5-7 минут разговора?"],
    ["Метрики", "Заявки, качество лида, снижение повторных вопросов"],
  ];
  prompts.forEach((p, i) => {
    rect(root, `UX / prompt row ${i + 1}`, 128, 1360 + i * 54, 900, 46, i % 2 ? "#F0EFEA" : C.paper, 6, C.line);
    text(root, `UX / prompt name ${i + 1}`, p[0], 150, 1375 + i * 54, 120, 15, C.accent, F.semibold);
    text(root, `UX / prompt body ${i + 1}`, p[1], 300, 1375 + i * 54, 680, 15, C.text, F.regular);
  });

  sectionTitle(root, "governance", "Governance", 1180, 1160, 520);
  card(root, "UX / source", 1180, 1290, 430, 260, "Источник правды", "Figma, AGENTS.md и neural-training-context должны обновляться вместе с ключевыми решениями.", { shadow: true });
  card(root, "UX / security", 1640, 1290, 430, 260, "Секреты", "Telegram token/chat ID не показывать в публичном UI. В production только backend/PHP handler.", { fill: C.ink, shadow: true });
}

function page08() {
  const { root } = board("08 Handoff Summary", "Handoff Summary", "Итоговая карта для передачи файла: структура, источники правды, release checklist и правила, которые нельзя потерять.");

  frame(root, "Handoff / formula", 88, 340, 1720, 300, C.ink, 16, null, "dark");
  text(root, "Handoff / formula label", "Formula", 140, 400, 220, 18, C.accent, F.semibold);
  text(root, "Handoff / formula title", "white canvas + black CTA + orange action + editorial typography + real evidence + auto-business semantics", 140, 450, 1260, 46, C.paper, F.bold, 1.08);
  text(root, "Handoff / formula body", "Файл должен читаться как готовая система: аккуратные блоки, понятные токены, чистые компоненты, логика motion и продуктовая семантика.", 140, 560, 1160, 21, "#D4D4D0", F.regular, 1.4);
  rect(root, "Handoff / formula orange", 1560, 430, 160, 76, C.accent, 10);
  rect(root, "Handoff / formula bar", 1490, 535, 230, 42, C.graphite, 8, C.lineDark);

  sectionTitle(root, "file map", "File map", 88, 740, 420);
  frame(root, "Handoff / map table", 88, 870, 900, 600, C.paper, 14, C.line, "soft");
  const fileMap = [
    ["Common / Archive", "Исходники, логотипы, импортированные артефакты"],
    ["00 Cover", "Смысл и навигация"],
    ["01 Brand Assets", "Лого, lockups, usage rules"],
    ["02 Foundations", "Цвет, типографика, сетка, тени"],
    ["03 Tokens", "Primitive, semantic, component tokens"],
    ["04 Components", "UI-компоненты и состояния"],
    ["05 Page Patterns", "Композиции лендинга"],
    ["06 Motion", "Scroll, hover, 3D, reduced motion"],
    ["07 UX", "Аудитория, аналитика, governance"],
    ["08 Handoff", "Release summary"],
  ];
  fileMap.forEach((row, i) => {
    rect(root, `Handoff / row ${i + 1}`, 128, 930 + i * 48, 820, 40, i % 2 ? "#F0EFEA" : C.paper, 5, C.line);
    text(root, `Handoff / row title ${i + 1}`, row[0], 148, 943 + i * 48, 210, 14, C.text, F.semibold);
    text(root, `Handoff / row body ${i + 1}`, row[1], 390, 943 + i * 48, 500, 14, C.muted, F.regular);
  });

  sectionTitle(root, "release", "Release checklist", 1100, 740, 520);
  frame(root, "Handoff / release panel", 1100, 870, 780, 360, C.paper, 14, C.line, "soft");
  const checks = [
    "Форма отправляет заявку в Telegram на локальном и production.",
    "Ошибки формы появляются только после submit.",
    "Мобильная верстка не перекрывает текст и CTA.",
    "Архив для хостинга содержит готовый backend handler.",
    "Figma и MD-контекст обновлены после дизайн-решений.",
  ];
  checks.forEach((item, i) => {
    rect(root, `Handoff / check box ${i + 1}`, 1145, 940 + i * 50, 24, 24, C.ink, 5);
    text(root, `Handoff / check ${i + 1}`, "✓", 1151, 942 + i * 50, 18, 16, C.paper, F.bold, 1);
    text(root, `Handoff / check text ${i + 1}`, item, 1190, 940 + i * 50, 610, 16, C.text, F.regular, 1.35);
  });

  frame(root, "Handoff / ready badge", 1905, 340, 300, 300, C.accent, 14, null, "soft");
  text(root, "Handoff / ready", "READY\nFOR\n.fig", 1952, 405, 210, 40, C.paper, F.bold, 1.02);
  text(root, "Handoff / ready note", "Внутренний Figma-файл проекта Desmos Auto.", 1905, 700, 300, 24, C.text, F.semibold, 1.32);

  card(root, "Handoff / sources", 1100, 1310, 780, 250, "Source of truth", "Figma фиксирует визуальную систему. AGENTS.md и neural-training-context фиксируют контекст проекта. Кодовая база фиксирует реализацию.", { fill: C.accentSoft, stroke: C.accentLine, shadow: true });
  card(root, "Handoff / no break", 88, 1540, 900, 160, "Не ломать", "Не возвращать синий primary CTA. Не превращать 3D в шум. Не хранить важные решения только в переписке. Не публиковать секреты в UI.", { fill: C.ink, shadow: true, dot: false, titleSize: 25 });
}

async function main() {
  await loadFonts();

  const safePage = figma.root.children.find((page) => page.name === "00 Cover") || figma.root.children[0];
  if (safePage) await figma.setCurrentPageAsync(safePage);

  figma.root.children
    .filter((page) => page.name === "08 Handoff Summary")
    .forEach((page) => page.remove());

  page08();

  const order = [
    "Common",
    "Archive",
    "00 Cover",
    "01 Brand Assets",
    "02 Foundations",
    "03 Tokens",
    "04 Components",
    "05 Page Patterns",
    "06 Motion & Interactions",
    "07 UX Semantics & Governance",
    "08 Handoff Summary",
  ];
  order.forEach((name, index) => {
    const item = figma.root.children.find((page) => page.name === name);
    if (item) figma.root.insertChild(index, item);
  });

  const page = figma.root.children.find((item) => item.name === "08 Handoff Summary");
  if (page) await figma.setCurrentPageAsync(page);

  const temp = figma.root.children.find((item) => item.name === "__polish_tmp__");
  if (temp) temp.remove();

  const currentRoot = figma.currentPage.children[0];
  if (currentRoot) figma.viewport.scrollAndZoomIntoView([currentRoot]);
  figma.closePlugin("Polished 08 Handoff Summary and page order.");
}

main();
