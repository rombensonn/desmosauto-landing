export type Project = {
  id: number;
  slug: string;
  title: string;
  businessType: ProjectCategory;
  siteType: "Лендинг" | "Многостраничный сайт";
  status: "Рабочий проект" | "Реальный кейс";
  city?: string;
  mainGoal: string;
  description: string;
  tags: string[];
  featured: boolean;
  aeoFocus: string[];
  seoFocus: string[];
  futureCaseReady: boolean;
  liveUrl?: string;
  updatedAt?: string;
  caseData?: {
    clientContext: string;
    problem: string;
    solution: string;
    structure: string[];
    seoPlan: string[];
    aeoPlan: string[];
    leadFormLogic: string;
    mobileLogic: string;
    result?: string;
  };
};

export const projectCategories = [
  "Автосервис",
  "Шиномонтаж",
  "Детейлинг",
  "Кузовной ремонт",
  "Диагностика",
  "Техосмотр",
  "Автозапчасти",
  "Смешанный формат",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];
export type ProjectFilterValue = "all" | ProjectCategory;

type ProjectSeed = {
  slug: string;
  title: string;
  businessType: ProjectCategory;
  siteType: Project["siteType"];
  city?: string;
  mainGoal: string;
  tags: string[];
  liveUrl: string;
  updatedAt: string;
  featured: boolean;
};

type CategoryProfile = {
  description: string;
  problem: string;
  solution: string;
  structure: string[];
  aeoFocus: string[];
  seoFocus: string[];
  baseTags: string[];
};

const categoryProfiles: Record<ProjectCategory, CategoryProfile> = {
  "Автосервис": {
    description: "Опубликованный проект для автосервиса с четкой структурой услуг, доверием, записью на ремонт и ответами на частые вопросы клиентов.",
    problem: "Обычный сайт автосервиса часто показывает только адрес и телефон, но не объясняет услуги, сроки, порядок обращения и причины доверять мастерам.",
    solution: "Собрали структуру с понятным первым экраном, услугами, доказательствами, вопросами клиентов и короткой заявкой.",
    structure: ["Первый экран с оффером", "Услуги и направления ремонта", "Блоки доверия", "FAQ", "Форма заявки"],
    aeoFocus: ["Короткие ответы о видах ремонта", "Сценарии выбора услуги по симптомам", "Вопросы о записи, сроках и согласовании работ"],
    seoFocus: ["услуги автосервиса", "плановое ТО", "ремонт автомобиля рядом"],
    baseTags: ["Автосервис", "Запись", "Услуги"],
  },
  "Шиномонтаж": {
    description: "Опубликованный проект для сезонной записи, подбора услуг шиномонтажа, хранения колес и быстрых заявок с мобильного устройства.",
    problem: "В сезон клиенту нужно быстро понять услуги, цену, расположение и свободный способ связи, иначе он уходит к ближайшему конкуренту.",
    solution: "Собрали короткий сценарий выбора услуги, сезонные акценты и заметный контакт для записи.",
    structure: ["Сезонный оффер", "Услуги шиномонтажа", "Балансировка и хранение", "Преимущества", "Запись"],
    aeoFocus: ["Ответы о сезонной смене шин", "Подсказки по балансировке и хранению", "Вопросы о записи и подготовке автомобиля"],
    seoFocus: ["шиномонтаж", "сезонная замена шин", "хранение колес"],
    baseTags: ["Шиномонтаж", "Сезон", "Запись"],
  },
  "Детейлинг": {
    description: "Опубликованный проект для презентации процедур ухода, пакетов работ, визуальных доказательств качества и формы предварительной оценки.",
    problem: "Клиенту сложно сравнить процедуры детейлинга без понятных пакетов, визуального результата и спокойного объяснения этапов.",
    solution: "Показали услуги через пакеты, результат, доверие и простую заявку на предварительную оценку.",
    structure: ["Визуальный первый экран", "Пакеты ухода", "Этапы процедуры", "Доказательства качества", "Заявка на оценку"],
    aeoFocus: ["Ответы о различиях процедур детейлинга", "Подбор услуги по состоянию автомобиля", "Вопросы о сроках, уходе и подготовке"],
    seoFocus: ["детейлинг авто", "полировка кузова", "химчистка салона"],
    baseTags: ["Детейлинг", "Уход", "Пакеты"],
  },
  "Кузовной ремонт": {
    description: "Опубликованный проект для объяснения этапов кузовного ремонта, оценки повреждений, согласования работ и доверительной подачи процесса.",
    problem: "Перед кузовным ремонтом клиент боится непонятной оценки, скрытых работ и неопределенных сроков.",
    solution: "Выстроили подачу вокруг оценки, этапов ремонта, гарантий и быстрой заявки на консультацию.",
    structure: ["Оценка повреждений", "Виды кузовных работ", "Этапы ремонта", "Гарантии", "Заявка"],
    aeoFocus: ["Ответы о ремонте вмятин и окрасе", "Сценарии оценки повреждений по фото", "Вопросы о сроках, материалах и согласовании"],
    seoFocus: ["кузовной ремонт", "покраска детали", "ремонт вмятин"],
    baseTags: ["Кузов", "Оценка", "Ремонт"],
  },
  "Диагностика": {
    description: "Опубликованный проект для сервиса диагностики с ясным описанием проверок, симптомов неисправностей, записи и объяснения результатов клиенту.",
    problem: "Клиент часто приходит с симптомом, а не с готовым названием услуги, поэтому сайту нужно переводить жалобу в понятный следующий шаг.",
    solution: "Собрали структуру от симптомов и направлений диагностики к заявке и объяснению дальнейших действий.",
    structure: ["Симптомы неисправностей", "Виды диагностики", "Что входит в проверку", "Результат для клиента", "Запись"],
    aeoFocus: ["Ответы по симптомам неисправностей", "Подбор диагностики по жалобе клиента", "Вопросы о расшифровке и дальнейших шагах"],
    seoFocus: ["диагностика автомобиля", "компьютерная диагностика", "проверка перед покупкой"],
    baseTags: ["Диагностика", "Проверка", "Симптомы"],
  },
  "Техосмотр": {
    description: "Опубликованный проект для станции техосмотра с прозрачным списком документов, этапов проверки, требований и удобной записи.",
    problem: "Клиенты часто не понимают, какие документы нужны и как проходит проверка, поэтому откладывают обращение.",
    solution: "Разложили процесс по шагам, вынесли требования и сделали быстрый сценарий записи.",
    structure: ["Документы", "Этапы проверки", "Требования", "Частые вопросы", "Запись"],
    aeoFocus: ["Ответы о документах для техосмотра", "Пояснения по этапам проверки", "Вопросы о подготовке автомобиля"],
    seoFocus: ["техосмотр", "диагностическая карта", "пункт техосмотра"],
    baseTags: ["Техосмотр", "Документы", "Запись"],
  },
  "Автозапчасти": {
    description: "Опубликованный проект для магазина или склада запчастей с быстрым подбором, понятными категориями и заявкой по VIN или описанию детали.",
    problem: "Покупателю важно быстро понять наличие, аналоги и способ подбора детали без длинных переписок.",
    solution: "Собрали структуру с категориями, сценарием подбора и заявкой на уточнение наличия.",
    structure: ["Категории деталей", "Подбор по параметрам", "Наличие и аналоги", "Связка с сервисом", "Заявка"],
    aeoFocus: ["Ответы о подборе запчастей", "Сценарии заявки по VIN и параметрам", "Вопросы о наличии, аналогах и сроках"],
    seoFocus: ["автозапчасти", "подбор запчастей", "детали в наличии"],
    baseTags: ["Запчасти", "Подбор", "Склад"],
  },
  "Смешанный формат": {
    description: "Опубликованный проект для автоцентра с несколькими направлениями, общей навигацией, разделением услуг и единым сценарием заявки.",
    problem: "Когда направлений много, сайт легко становится перегруженным и не помогает клиенту выбрать нужный раздел.",
    solution: "Разделили услуги по сценариям, сохранили общий маршрут к заявке и сделали навигацию более спокойной.",
    structure: ["Главный оффер автоцентра", "Направления услуг", "Навигация по задачам", "Доверие", "Единая заявка"],
    aeoFocus: ["Ответы по нескольким направлениям автоуслуг", "Маршруты выбора услуги по задаче клиента", "Вопросы о записи, оценке и комплексном обслуживании"],
    seoFocus: ["автоцентр", "комплексные автоуслуги", "ремонт и обслуживание"],
    baseTags: ["Автоцентр", "Комплекс", "Навигация"],
  },
};

const projectSeeds: ProjectSeed[] = [
  {
    slug: "remont-generatorov-landing",
    title: "Лендинг диагностики авто «Ремонт генераторов»",
    businessType: "Диагностика",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "вести клиента от симптома неисправности к диагностике и заявке",
    tags: ["Диагностика","Опубликован","Генераторы"],
    liveUrl: "https://rombensonn.github.io/remont-generatorov-landing/",
    updatedAt: "2026-07-01T11:41:56Z",
    featured: true
  },
  {
    slug: "biz-car-garage-landing",
    title: "Лендинг автоцентра «Biz Car Garage»",
    businessType: "Смешанный формат",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "разделить несколько автонаправлений и привести клиента к понятной заявке",
    tags: ["Смешанный формат","Опубликован"],
    liveUrl: "https://rombensonn.github.io/biz-car-garage-landing/",
    updatedAt: "2026-06-30T20:35:37Z",
    featured: true
  },
  {
    slug: "kvadrogroup-landing",
    title: "Лендинг автоцентра «КвадроГрупп»",
    businessType: "Смешанный формат",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "разделить несколько автонаправлений и привести клиента к понятной заявке",
    tags: ["Смешанный формат","Опубликован"],
    liveUrl: "https://rombensonn.github.io/kvadrogroup-landing/",
    updatedAt: "2026-06-30T15:56:59Z",
    featured: true
  },
  {
    slug: "autoservice-approval-landing",
    title: "Лендинг автосервиса «Автосервис Approval»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/autoservice-approval-landing/",
    updatedAt: "2026-06-29T15:47:58Z",
    featured: true
  },
  {
    slug: "autoservice-zvenigorod",
    title: "Сайт автосервиса «Автосервис Zvenigorod»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Звенигород",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Звенигород через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Звенигород"],
    liveUrl: "https://rombensonn.github.io/autoservice-zvenigorod/",
    updatedAt: "2026-06-28T17:06:35Z",
    featured: true
  },
  {
    slug: "autoservice-moscow",
    title: "Сайт автосервиса «Автосервис Moscow»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Москва",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Москва через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Москва"],
    liveUrl: "https://rombensonn.github.io/autoservice-moscow/",
    updatedAt: "2026-06-26T18:50:15Z",
    featured: true
  },
  {
    slug: "autoservice-mishkovo",
    title: "Сайт автосервиса «8158 Мишково»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Мишково",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Мишково через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Мишково"],
    liveUrl: "https://rombensonn.github.io/autoservice-mishkovo/",
    updatedAt: "2026-06-25T22:49:41Z",
    featured: true
  },
  {
    slug: "garage40-landing",
    title: "Лендинг автосервиса «Garage40»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/garage40-landing/",
    updatedAt: "2026-06-25T13:22:03Z",
    featured: true
  },
  {
    slug: "autoservice-losino-petrovsky",
    title: "Сайт автосервиса «Автосервис Losino Petrovsky»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Лосино-Петровский",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Лосино-Петровский через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Лосино-Петровский"],
    liveUrl: "https://rombensonn.github.io/autoservice-losino-petrovsky/",
    updatedAt: "2026-06-25T12:30:26Z",
    featured: true
  },
  {
    slug: "gazeltekhno-landing",
    title: "Лендинг автосервиса «ГазельТехно»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Коммерческий транспорт"],
    liveUrl: "https://rombensonn.github.io/gazeltekhno-landing/",
    updatedAt: "2026-06-25T12:29:31Z",
    featured: true
  },
  {
    slug: "sitromania-landing",
    title: "Лендинг автосервиса «СитроМания»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/sitromania-landing/",
    updatedAt: "2026-06-24T23:29:27Z",
    featured: true
  },
  {
    slug: "favorit-avto-landing",
    title: "Лендинг автосервиса «Фаворит Авто»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/favorit-avto-landing/",
    updatedAt: "2026-06-24T15:39:27Z",
    featured: true
  },
  {
    slug: "cleancar-landing-preview",
    title: "Лендинг детейлинга «Cleancar»",
    businessType: "Детейлинг",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "показывать уход за автомобилем, пакеты работ и собирать заявки на оценку",
    tags: ["Детейлинг","Опубликован"],
    liveUrl: "https://rombensonn.github.io/cleancar-landing-preview/",
    updatedAt: "2026-06-24T15:24:25Z",
    featured: false
  },
  {
    slug: "garazh-777-landing",
    title: "Лендинг автосервиса «Гараж 777»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/garazh-777-landing/",
    updatedAt: "2026-06-24T11:25:59Z",
    featured: false
  },
  {
    slug: "shinservis-6-landing",
    title: "Лендинг шиномонтажа «Shinservis 6»",
    businessType: "Шиномонтаж",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "получать сезонные записи на шиномонтаж и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован"],
    liveUrl: "https://rombensonn.github.io/shinservis-6-landing/",
    updatedAt: "2026-06-24T10:57:10Z",
    featured: false
  },
  {
    slug: "autoservice-lakinsk-landing",
    title: "Лендинг автосервиса «Автосервис Lakinsk»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: "Лакинск",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Лакинск через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Лакинск"],
    liveUrl: "https://rombensonn.github.io/autoservice-lakinsk-landing/",
    updatedAt: "2026-06-24T10:14:54Z",
    featured: false
  },
  {
    slug: "black-service-landing",
    title: "Лендинг автосервиса «Black Сервис»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/black-service-landing/",
    updatedAt: "2026-06-24T10:06:23Z",
    featured: false
  },
  {
    slug: "autoservice-efremov",
    title: "Сайт автосервиса «Автосервис Efremov»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Ефремов",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Ефремов через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Ефремов"],
    liveUrl: "https://rombensonn.github.io/autoservice-efremov/",
    updatedAt: "2026-06-23T22:24:22Z",
    featured: false
  },
  {
    slug: "koda-auto-landing",
    title: "Лендинг автосервиса «Koda Авто»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/koda-auto-landing/",
    updatedAt: "2026-06-23T22:24:11Z",
    featured: false
  },
  {
    slug: "region-71-auto-landing",
    title: "Лендинг автосервиса «Region 71 Авто»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/region-71-auto-landing/",
    updatedAt: "2026-06-23T20:50:37Z",
    featured: false
  },
  {
    slug: "autoservice-maloyaroslavets",
    title: "Сайт автосервиса «Автосервис Maloyaroslavets»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Малоярославец",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Малоярославец через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Малоярославец"],
    liveUrl: "https://rombensonn.github.io/autoservice-maloyaroslavets/",
    updatedAt: "2026-06-23T20:48:45Z",
    featured: false
  },
  {
    slug: "auto-lider-landing",
    title: "Лендинг автосервиса «Авто Лидер»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/auto-lider-landing/",
    updatedAt: "2026-06-23T20:05:45Z",
    featured: false
  },
  {
    slug: "vagguide-landing",
    title: "Лендинг диагностики авто «Vagguide»",
    businessType: "Диагностика",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "вести клиента от симптома неисправности к диагностике и заявке",
    tags: ["Диагностика","Опубликован","VAG"],
    liveUrl: "https://rombensonn.github.io/vagguide-landing/",
    updatedAt: "2026-06-23T15:02:00Z",
    featured: false
  },
  {
    slug: "autoservice-khimki",
    title: "Сайт автосервиса «Автосервис Khimki»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Химки",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Химки через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Химки"],
    liveUrl: "https://rombensonn.github.io/autoservice-khimki/",
    updatedAt: "2026-06-23T11:25:30Z",
    featured: false
  },
  {
    slug: "autoservice-rzhavki",
    title: "Сайт автосервиса «Автосервис Rzhavki»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Ржавки",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Ржавки через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Ржавки"],
    liveUrl: "https://rombensonn.github.io/autoservice-rzhavki/",
    updatedAt: "2026-06-23T00:17:01Z",
    featured: false
  },
  {
    slug: "autoservice-zelenograd",
    title: "Сайт автосервиса «Автосервис Zelenograd»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Зеленоград",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Зеленоград через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Зеленоград"],
    liveUrl: "https://rombensonn.github.io/autoservice-zelenograd/",
    updatedAt: "2026-06-22T23:59:30Z",
    featured: false
  },
  {
    slug: "autoservice-tver",
    title: "Сайт автосервиса «Автосервис Tver»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Тверь",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Тверь через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Тверь"],
    liveUrl: "https://rombensonn.github.io/autoservice-tver/",
    updatedAt: "2026-06-22T19:02:30Z",
    featured: false
  },
  {
    slug: "lastochka-landing",
    title: "Лендинг автосервиса «Lastochka»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/lastochka-landing/",
    updatedAt: "2026-06-22T18:31:14Z",
    featured: false
  },
  {
    slug: "honda-bro-landing",
    title: "Лендинг автосервиса «Honda Bro»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Honda"],
    liveUrl: "https://rombensonn.github.io/honda-bro-landing/",
    updatedAt: "2026-06-22T17:56:43Z",
    featured: false
  },
  {
    slug: "autoservice-novomoskovsk",
    title: "Сайт автосервиса «Автосервис Novomoskovsk»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Новомосковск",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Новомосковск через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Новомосковск"],
    liveUrl: "https://rombensonn.github.io/autoservice-novomoskovsk/",
    updatedAt: "2026-06-22T17:30:22Z",
    featured: false
  },
  {
    slug: "avtodiagnostika-landing",
    title: "Лендинг диагностики авто «Avtodiagnostika»",
    businessType: "Диагностика",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "вести клиента от симптома неисправности к диагностике и заявке",
    tags: ["Диагностика","Опубликован"],
    liveUrl: "https://rombensonn.github.io/avtodiagnostika-landing/",
    updatedAt: "2026-06-22T17:27:09Z",
    featured: false
  },
  {
    slug: "avtolyubitel-landing",
    title: "Лендинг автосервиса «Avtolyubitel»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/avtolyubitel-landing/",
    updatedAt: "2026-06-22T15:38:44Z",
    featured: false
  },
  {
    slug: "shintorg33-landing",
    title: "Лендинг шиномонтажа «Шинторг 33»",
    businessType: "Шиномонтаж",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "получать сезонные записи на шиномонтаж и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован"],
    liveUrl: "https://rombensonn.github.io/shintorg33-landing/",
    updatedAt: "2026-06-22T15:30:29Z",
    featured: false
  },
  {
    slug: "autoservice-petushki",
    title: "Сайт автосервиса «Автосервис Petushki»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Петушки",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Петушки через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Петушки"],
    liveUrl: "https://rombensonn.github.io/autoservice-petushki/",
    updatedAt: "2026-06-22T13:08:34Z",
    featured: false
  },
  {
    slug: "avtomarket-landing",
    title: "Лендинг автозапчастей «Автомаркет»",
    businessType: "Автозапчасти",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "помогать клиенту быстро оставить заявку на подбор деталей",
    tags: ["Автозапчасти","Опубликован"],
    liveUrl: "https://rombensonn.github.io/avtomarket-landing/",
    updatedAt: "2026-06-20T19:01:53Z",
    featured: false
  },
  {
    slug: "aleks-servis-landing",
    title: "Лендинг автосервиса «Алекс Сервис»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/aleks-servis-landing/",
    updatedAt: "2026-06-20T18:23:08Z",
    featured: false
  },
  {
    slug: "prosto-service-lakinsk-landing",
    title: "Лендинг автосервиса «Prosto Сервис Lakinsk»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: "Лакинск",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Лакинск через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Лакинск"],
    liveUrl: "https://rombensonn.github.io/prosto-service-lakinsk-landing/",
    updatedAt: "2026-06-20T13:25:24Z",
    featured: false
  },
  {
    slug: "autoservice-lakinsk",
    title: "Сайт автосервиса «Автосервис Lakinsk»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Лакинск",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Лакинск через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Лакинск"],
    liveUrl: "https://rombensonn.github.io/autoservice-lakinsk/",
    updatedAt: "2026-06-20T13:24:20Z",
    featured: false
  },
  {
    slug: "kuzovnoy-landing",
    title: "Лендинг кузовного ремонта «Кузовной»",
    businessType: "Кузовной ремонт",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "объяснять этапы кузовного ремонта и получать заявки на оценку повреждений",
    tags: ["Кузовной ремонт","Опубликован"],
    liveUrl: "https://rombensonn.github.io/kuzovnoy-landing/",
    updatedAt: "2026-06-20T09:23:50Z",
    featured: false
  },
  {
    slug: "yumatavto-landing",
    title: "Лендинг автосервиса «YumatAvto»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/yumatavto-landing/",
    updatedAt: "2026-06-20T08:21:23Z",
    featured: false
  },
  {
    slug: "autoservice-pokrov",
    title: "Сайт автосервиса «Автосервис Pokrov»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/autoservice-pokrov/",
    updatedAt: "2026-06-20T08:21:07Z",
    featured: false
  },
  {
    slug: "proservice-landing",
    title: "Лендинг автосервиса «ProService»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/proservice-landing/",
    updatedAt: "2026-06-20T00:17:30Z",
    featured: false
  },
  {
    slug: "grizli-landing",
    title: "Лендинг автосервиса «Гризли»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/grizli-landing/",
    updatedAt: "2026-06-19T23:31:10Z",
    featured: false
  },
  {
    slug: "autoservice-vyazniki",
    title: "Сайт автосервиса «Автосервис Vyazniki»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/autoservice-vyazniki/",
    updatedAt: "2026-06-19T23:30:13Z",
    featured: false
  },
  {
    slug: "zelvolvo-landing",
    title: "Лендинг автосервиса «Zelvolvo»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Volvo"],
    liveUrl: "https://rombensonn.github.io/zelvolvo-landing/",
    updatedAt: "2026-06-19T23:22:16Z",
    featured: false
  },
  {
    slug: "pitleyn-landing",
    title: "Лендинг автосервиса «Питлейн»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/pitleyn-landing/",
    updatedAt: "2026-06-19T23:12:57Z",
    featured: false
  },
  {
    slug: "avto-den-landing",
    title: "Лендинг автосервиса «Авто Den»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/avto-den-landing/",
    updatedAt: "2026-06-19T18:44:12Z",
    featured: false
  },
  {
    slug: "carmasters-landing",
    title: "Лендинг автосервиса «Carmasters»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/carmasters-landing/",
    updatedAt: "2026-06-19T18:43:10Z",
    featured: false
  },
  {
    slug: "avtomaster-landing",
    title: "Лендинг автосервиса «Автомастер»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/avtomaster-landing/",
    updatedAt: "2026-06-19T18:34:18Z",
    featured: false
  },
  {
    slug: "moy-motogarazh-landing",
    title: "Лендинг детейлинга «Мой Motogarazh»",
    businessType: "Детейлинг",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "показывать уход за автомобилем, пакеты работ и собирать заявки на оценку",
    tags: ["Детейлинг","Опубликован"],
    liveUrl: "https://rombensonn.github.io/moy-motogarazh-landing/",
    updatedAt: "2026-06-19T18:26:17Z",
    featured: false
  },
  {
    slug: "h2o-kirzhach-landing",
    title: "Лендинг детейлинга «H2O Kirzhach»",
    businessType: "Детейлинг",
    siteType: "Лендинг",
    city: "Киржач",
    mainGoal: "показывать уход за автомобилем, пакеты работ и собирать заявки на оценку для города Киржач",
    tags: ["Детейлинг","Опубликован","Киржач"],
    liveUrl: "https://rombensonn.github.io/h2o-kirzhach-landing/",
    updatedAt: "2026-06-19T16:27:21Z",
    featured: false
  },
  {
    slug: "master-shin-landing",
    title: "Лендинг шиномонтажа «Мастер Шин»",
    businessType: "Шиномонтаж",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "получать сезонные записи на шиномонтаж и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован"],
    liveUrl: "https://rombensonn.github.io/master-shin-landing/",
    updatedAt: "2026-06-18T15:17:22Z",
    featured: false
  },
  {
    slug: "autoservice-kolchugino",
    title: "Сайт автосервиса «Автосервис Kolchugino»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Кольчугино",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Кольчугино через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Кольчугино"],
    liveUrl: "https://rombensonn.github.io/autoservice-kolchugino/",
    updatedAt: "2026-06-18T00:13:55Z",
    featured: false
  },
  {
    slug: "garazh-landing",
    title: "Лендинг автосервиса «Гараж»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/garazh-landing/",
    updatedAt: "2026-06-17T21:22:36Z",
    featured: false
  },
  {
    slug: "as-service-landing",
    title: "Лендинг автосервиса «As Сервис»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/as-service-landing/",
    updatedAt: "2026-06-17T13:29:40Z",
    featured: false
  },
  {
    slug: "shinomontazh-staroandreevskaya-landing",
    title: "Лендинг шиномонтажа «Шиномонтаж Staroandreevskaya»",
    businessType: "Шиномонтаж",
    siteType: "Лендинг",
    city: "Староандреевская",
    mainGoal: "получать сезонные записи на шиномонтаж для города Староандреевская и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован","Староандреевская"],
    liveUrl: "https://rombensonn.github.io/shinomontazh-staroandreevskaya-landing/",
    updatedAt: "2026-06-17T12:06:36Z",
    featured: false
  },
  {
    slug: "autoservice-andreevka-landing",
    title: "Лендинг автосервиса «Автосервис Andreevka»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: "Андреевка",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Андреевка через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Андреевка"],
    liveUrl: "https://rombensonn.github.io/autoservice-andreevka-landing/",
    updatedAt: "2026-06-17T12:05:52Z",
    featured: false
  },
  {
    slug: "avangard-landing",
    title: "Лендинг автосервиса «Авангард»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/avangard-landing/",
    updatedAt: "2026-06-16T20:12:16Z",
    featured: false
  },
  {
    slug: "pogranichnaya-auto-liquid",
    title: "Сайт автосервиса «Pogranichnaya Авто Liquid»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Пограничная",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Пограничная через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Пограничная"],
    liveUrl: "https://rombensonn.github.io/pogranichnaya-auto-liquid/",
    updatedAt: "2026-06-16T17:48:16Z",
    featured: false
  },
  {
    slug: "autoservice-sergiev-posad",
    title: "Сайт автосервиса «Автосервис Sergiev Posad»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Сергиев Посад",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Сергиев Посад через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Сергиев Посад"],
    liveUrl: "https://rombensonn.github.io/autoservice-sergiev-posad/",
    updatedAt: "2026-06-16T17:13:55Z",
    featured: false
  },
  {
    slug: "autoservice-pogranichnaya",
    title: "Сайт автосервиса «Автосервис Pogranichnaya»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Пограничная",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Пограничная через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Пограничная"],
    liveUrl: "https://rombensonn.github.io/autoservice-pogranichnaya/",
    updatedAt: "2026-06-16T16:49:15Z",
    featured: false
  },
  {
    slug: "vr-service-landing",
    title: "Лендинг автосервиса «Vr Сервис»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/vr-service-landing/",
    updatedAt: "2026-06-16T16:03:52Z",
    featured: false
  },
  {
    slug: "autolar-landing",
    title: "Лендинг автосервиса «Autolar»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/autolar-landing/",
    updatedAt: "2026-06-16T14:50:42Z",
    featured: false
  },
  {
    slug: "autoservice-skoropuskovskiy",
    title: "Сайт автосервиса «Автосервис Skoropuskovskiy»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Скоропусковский",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Скоропусковский через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Скоропусковский"],
    liveUrl: "https://rombensonn.github.io/autoservice-skoropuskovskiy/",
    updatedAt: "2026-06-16T13:37:49Z",
    featured: false
  },
  {
    slug: "rtl-trackservice-landing",
    title: "Лендинг автосервиса «Rtl Trackservice»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/rtl-trackservice-landing/",
    updatedAt: "2026-06-15T22:02:31Z",
    featured: false
  },
  {
    slug: "miniavtoservice-u-ovika-landing",
    title: "Лендинг автосервиса «Miniavtoservice U Ovika»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/miniavtoservice-u-ovika-landing/",
    updatedAt: "2026-06-15T19:12:58Z",
    featured: false
  },
  {
    slug: "autoservice-elektrostal",
    title: "Сайт автосервиса «Автосервис Elektrostal»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Электросталь",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Электросталь через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Электросталь"],
    liveUrl: "https://rombensonn.github.io/autoservice-elektrostal/",
    updatedAt: "2026-06-11T16:29:22Z",
    featured: false
  },
  {
    slug: "miniavtoservice-ovika-landing",
    title: "Лендинг автосервиса «Miniavtoservice Ovika»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/miniavtoservice-ovika-landing/",
    updatedAt: "2026-06-11T14:00:59Z",
    featured: false
  },
  {
    slug: "grand-parts-landing",
    title: "Лендинг автозапчастей «Grand Parts»",
    businessType: "Автозапчасти",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "помогать клиенту быстро оставить заявку на подбор деталей",
    tags: ["Автозапчасти","Опубликован"],
    liveUrl: "https://rombensonn.github.io/grand-parts-landing/",
    updatedAt: "2026-06-11T11:34:47Z",
    featured: false
  },
  {
    slug: "doctorshin-landing",
    title: "Лендинг шиномонтажа «DoctorShin»",
    businessType: "Шиномонтаж",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "получать сезонные записи на шиномонтаж и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован"],
    liveUrl: "https://rombensonn.github.io/doctorshin-landing/",
    updatedAt: "2026-06-10T21:40:48Z",
    featured: false
  },
  {
    slug: "greenbox-landing",
    title: "Лендинг автосервиса «Greenbox»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/greenbox-landing/",
    updatedAt: "2026-06-10T14:30:28Z",
    featured: false
  },
  {
    slug: "automig-landing",
    title: "Лендинг автосервиса «АвтоМиг»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/automig-landing/",
    updatedAt: "2026-06-10T13:38:17Z",
    featured: false
  },
  {
    slug: "autoservice-khotkovo",
    title: "Сайт автосервиса «Автосервис Khotkovo»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Хотьково",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Хотьково через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Хотьково"],
    liveUrl: "https://rombensonn.github.io/autoservice-khotkovo/",
    updatedAt: "2026-06-09T21:38:16Z",
    featured: false
  },
  {
    slug: "techinkomavto-landing",
    title: "Лендинг автосервиса «Техинкомавто»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/techinkomavto-landing/",
    updatedAt: "2026-06-09T19:16:46Z",
    featured: false
  },
  {
    slug: "svr-landing",
    title: "Лендинг автосервиса «СВР»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/svr-landing/",
    updatedAt: "2026-06-09T15:57:04Z",
    featured: false
  },
  {
    slug: "hozyain-morey-autoservice",
    title: "Сайт автосервиса «Hozyain Morey Автосервис»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/hozyain-morey-autoservice/",
    updatedAt: "2026-06-05T18:35:16Z",
    featured: false
  },
  {
    slug: "zln-garage",
    title: "Сайт автосервиса «ZLN Garage»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/zln-garage/",
    updatedAt: "2026-06-05T14:19:10Z",
    featured: false
  },
  {
    slug: "autocomplex-velyaminovo",
    title: "Сайт автоцентра «Автокомплекс Velyaminovo»",
    businessType: "Смешанный формат",
    siteType: "Многостраничный сайт",
    city: "Вельяминово",
    mainGoal: "разделить несколько автонаправлений и привести клиента к понятной заявке для города Вельяминово",
    tags: ["Смешанный формат","Опубликован","Вельяминово"],
    liveUrl: "https://rombensonn.github.io/autocomplex-velyaminovo/",
    updatedAt: "2026-06-04T13:41:58Z",
    featured: false
  },
  {
    slug: "carservice-rastunovo-landing",
    title: "Лендинг автосервиса «Carservice Rastunovo»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: "Растуново",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Растуново через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Растуново"],
    liveUrl: "https://rombensonn.github.io/carservice-rastunovo-landing/",
    updatedAt: "2026-06-04T13:18:54Z",
    featured: false
  },
  {
    slug: "gazel-service-domodedovo",
    title: "Сайт автосервиса «Газель Сервис Domodedovo»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Домодедово",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Домодедово через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Домодедово","Коммерческий транспорт"],
    liveUrl: "https://rombensonn.github.io/gazel-service-domodedovo/",
    updatedAt: "2026-06-04T12:04:49Z",
    featured: false
  },
  {
    slug: "ton-plus-domodedovo",
    title: "Сайт кузовного ремонта «Тон Плюс Domodedovo»",
    businessType: "Кузовной ремонт",
    siteType: "Многостраничный сайт",
    city: "Домодедово",
    mainGoal: "объяснять этапы кузовного ремонта и получать заявки на оценку повреждений для города Домодедово",
    tags: ["Кузовной ремонт","Опубликован","Домодедово"],
    liveUrl: "https://rombensonn.github.io/ton-plus-domodedovo/",
    updatedAt: "2026-06-04T12:03:56Z",
    featured: false
  },
  {
    slug: "red-auto-domodedovo",
    title: "Сайт автосервиса «Red Авто Domodedovo»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Домодедово",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Домодедово через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Домодедово"],
    liveUrl: "https://rombensonn.github.io/red-auto-domodedovo/",
    updatedAt: "2026-06-04T10:35:41Z",
    featured: false
  },
  {
    slug: "pit-stop-landing",
    title: "Лендинг автосервиса «Pit Stop»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/pit-stop-landing/",
    updatedAt: "2026-06-04T10:29:10Z",
    featured: false
  },
  {
    slug: "kashirka-autoservice-landing",
    title: "Лендинг автосервиса «Kashirka Автосервис»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: "Каширское направление",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Каширское направление через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Каширское направление"],
    liveUrl: "https://rombensonn.github.io/kashirka-autoservice-landing/",
    updatedAt: "2026-06-04T10:28:48Z",
    featured: false
  },
  {
    slug: "shinomontazh-yusupovo",
    title: "Сайт шиномонтажа «Шиномонтаж Yusupovo»",
    businessType: "Шиномонтаж",
    siteType: "Многостраничный сайт",
    city: "Юсупово",
    mainGoal: "получать сезонные записи на шиномонтаж для города Юсупово и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован","Юсупово"],
    liveUrl: "https://rombensonn.github.io/shinomontazh-yusupovo/",
    updatedAt: "2026-06-04T10:16:46Z",
    featured: false
  },
  {
    slug: "antikoravto-landing",
    title: "Лендинг кузовного ремонта «Antikoravto»",
    businessType: "Кузовной ремонт",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "объяснять этапы кузовного ремонта и получать заявки на оценку повреждений",
    tags: ["Кузовной ремонт","Опубликован"],
    liveUrl: "https://rombensonn.github.io/antikoravto-landing/",
    updatedAt: "2026-06-03T20:31:02Z",
    featured: false
  },
  {
    slug: "shinomontazh-dmd",
    title: "Сайт шиномонтажа «Шиномонтаж Dmd»",
    businessType: "Шиномонтаж",
    siteType: "Многостраничный сайт",
    city: undefined,
    mainGoal: "получать сезонные записи на шиномонтаж и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован"],
    liveUrl: "https://rombensonn.github.io/shinomontazh-dmd/",
    updatedAt: "2026-06-03T20:07:31Z",
    featured: false
  },
  {
    slug: "shinomontazh-naberezhnaya-12",
    title: "Сайт шиномонтажа «Шиномонтаж Naberezhnaya 12»",
    businessType: "Шиномонтаж",
    siteType: "Многостраничный сайт",
    city: "Набережная",
    mainGoal: "получать сезонные записи на шиномонтаж для города Набережная и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован","Набережная"],
    liveUrl: "https://rombensonn.github.io/shinomontazh-naberezhnaya-12/",
    updatedAt: "2026-06-03T19:47:09Z",
    featured: false
  },
  {
    slug: "don-domodedovo-autoservice",
    title: "Сайт автосервиса «Don Domodedovo Автосервис»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Домодедово",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Домодедово через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Домодедово"],
    liveUrl: "https://rombensonn.github.io/don-domodedovo-autoservice/",
    updatedAt: "2026-06-03T19:28:03Z",
    featured: false
  },
  {
    slug: "sto-petrovskaya",
    title: "Сайт автосервиса «Sto Petrovskaya»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Петровская",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Петровская через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Петровская"],
    liveUrl: "https://rombensonn.github.io/sto-petrovskaya/",
    updatedAt: "2026-06-03T18:31:46Z",
    featured: false
  },
  {
    slug: "shinomontazh-leninskaya-53",
    title: "Сайт шиномонтажа «Шиномонтаж Leninskaya 53»",
    businessType: "Шиномонтаж",
    siteType: "Многостраничный сайт",
    city: "Ленинская",
    mainGoal: "получать сезонные записи на шиномонтаж для города Ленинская и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован","Ленинская"],
    liveUrl: "https://rombensonn.github.io/shinomontazh-leninskaya-53/",
    updatedAt: "2026-06-03T15:12:36Z",
    featured: false
  },
  {
    slug: "avto-masterskaya-pushkino",
    title: "Сайт автосервиса «Авто Masterskaya Pushkino»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Пушкино",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Пушкино через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Пушкино"],
    liveUrl: "https://rombensonn.github.io/avto-masterskaya-pushkino/",
    updatedAt: "2026-06-03T15:11:56Z",
    featured: false
  },
  {
    slug: "shinomontazh-tolmacheva",
    title: "Сайт шиномонтажа «Шиномонтаж Tolmacheva»",
    businessType: "Шиномонтаж",
    siteType: "Многостраничный сайт",
    city: "Толмачёва",
    mainGoal: "получать сезонные записи на шиномонтаж для города Толмачёва и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован","Толмачёва"],
    liveUrl: "https://rombensonn.github.io/shinomontazh-tolmacheva/",
    updatedAt: "2026-06-03T15:02:50Z",
    featured: false
  },
  {
    slug: "autoservice-rastunovo",
    title: "Сайт автосервиса «Автосервис Rastunovo»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Растуново",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Растуново через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Растуново"],
    liveUrl: "https://rombensonn.github.io/autoservice-rastunovo/",
    updatedAt: "2026-06-03T15:02:24Z",
    featured: false
  },
  {
    slug: "rusich-avto-landing",
    title: "Лендинг автосервиса «Русич Авто»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/rusich-avto-landing/",
    updatedAt: "2026-06-03T14:39:52Z",
    featured: false
  },
  {
    slug: "shinomontazh-lugovaya",
    title: "Сайт шиномонтажа «Шиномонтаж Lugovaya»",
    businessType: "Шиномонтаж",
    siteType: "Многостраничный сайт",
    city: undefined,
    mainGoal: "получать сезонные записи на шиномонтаж и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован"],
    liveUrl: "https://rombensonn.github.io/shinomontazh-lugovaya/",
    updatedAt: "2026-06-03T06:37:05Z",
    featured: false
  },
  {
    slug: "VlasGas",
    title: "Сайт автосервиса «VlasGas»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/VlasGas/",
    updatedAt: "2026-06-02T21:35:39Z",
    featured: false
  },
  {
    slug: "kuzovnoy-ceh-rastunovo",
    title: "Сайт кузовного ремонта «Кузовной Ceh Rastunovo»",
    businessType: "Кузовной ремонт",
    siteType: "Многостраничный сайт",
    city: "Растуново",
    mainGoal: "объяснять этапы кузовного ремонта и получать заявки на оценку повреждений для города Растуново",
    tags: ["Кузовной ремонт","Опубликован","Растуново"],
    liveUrl: "https://rombensonn.github.io/kuzovnoy-ceh-rastunovo/",
    updatedAt: "2026-06-02T14:45:21Z",
    featured: false
  },
  {
    slug: "service-drive-domodedovo-landing",
    title: "Лендинг автосервиса «Сервис Drive Domodedovo»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: "Домодедово",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Домодедово через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Домодедово"],
    liveUrl: "https://rombensonn.github.io/service-drive-domodedovo-landing/",
    updatedAt: "2026-06-01T16:09:17Z",
    featured: false
  },
  {
    slug: "techcenter-severny-landing",
    title: "Лендинг автоцентра «Техцентр Severny»",
    businessType: "Смешанный формат",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "разделить несколько автонаправлений и привести клиента к понятной заявке",
    tags: ["Смешанный формат","Опубликован"],
    liveUrl: "https://rombensonn.github.io/techcenter-severny-landing/",
    updatedAt: "2026-06-01T13:02:19Z",
    featured: false
  },
  {
    slug: "fenix-car-studio-landing",
    title: "Лендинг детейлинга «Fenix Car Studio»",
    businessType: "Детейлинг",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "показывать уход за автомобилем, пакеты работ и собирать заявки на оценку",
    tags: ["Детейлинг","Опубликован"],
    liveUrl: "https://rombensonn.github.io/fenix-car-studio-landing/",
    updatedAt: "2026-05-30T15:05:24Z",
    featured: false
  },
  {
    slug: "shinomontazh-belye-stolby",
    title: "Сайт шиномонтажа «Шиномонтаж Belye Stolby»",
    businessType: "Шиномонтаж",
    siteType: "Многостраничный сайт",
    city: "Белые Столбы",
    mainGoal: "получать сезонные записи на шиномонтаж для города Белые Столбы и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован","Белые Столбы"],
    liveUrl: "https://rombensonn.github.io/shinomontazh-belye-stolby/",
    updatedAt: "2026-05-30T11:49:42Z",
    featured: false
  },
  {
    slug: "autogarant-dmd-landing",
    title: "Лендинг автосервиса «Autogarant Dmd»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/autogarant-dmd-landing/",
    updatedAt: "2026-05-29T19:02:43Z",
    featured: false
  },
  {
    slug: "autoelektrik-diagnost-industrial",
    title: "Сайт диагностики авто «Автоэлектрик Диагност Industrial»",
    businessType: "Диагностика",
    siteType: "Многостраничный сайт",
    city: undefined,
    mainGoal: "вести клиента от симптома неисправности к диагностике и заявке",
    tags: ["Диагностика","Опубликован"],
    liveUrl: "https://rombensonn.github.io/autoelektrik-diagnost-industrial/",
    updatedAt: "2026-05-29T17:45:41Z",
    featured: false
  },
  {
    slug: "autoelektrik-diagnost",
    title: "Сайт диагностики авто «Автоэлектрик Диагност»",
    businessType: "Диагностика",
    siteType: "Многостраничный сайт",
    city: undefined,
    mainGoal: "вести клиента от симптома неисправности к диагностике и заявке",
    tags: ["Диагностика","Опубликован"],
    liveUrl: "https://rombensonn.github.io/autoelektrik-diagnost/",
    updatedAt: "2026-05-29T16:25:10Z",
    featured: false
  },
  {
    slug: "zln-garage-landing",
    title: "Лендинг автосервиса «ZLN Garage»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/zln-garage-landing/",
    updatedAt: "2026-05-29T14:24:05Z",
    featured: false
  },
  {
    slug: "mobile-shinomontazh-domodedovo",
    title: "Сайт шиномонтажа «Mobile Шиномонтаж Domodedovo»",
    businessType: "Шиномонтаж",
    siteType: "Многостраничный сайт",
    city: "Домодедово",
    mainGoal: "получать сезонные записи на шиномонтаж для города Домодедово и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован","Домодедово","Мобильный сервис"],
    liveUrl: "https://rombensonn.github.io/mobile-shinomontazh-domodedovo/",
    updatedAt: "2026-05-29T14:09:59Z",
    featured: false
  },
  {
    slug: "autoservice-konstantinovo-obezdnoy",
    title: "Сайт автосервиса «Автосервис Konstantinovo Obezdnoy»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/autoservice-konstantinovo-obezdnoy/",
    updatedAt: "2026-05-29T10:49:21Z",
    featured: false
  },
  {
    slug: "doctor-cars",
    title: "Сайт автосервиса «Doctor Cars»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/doctor-cars/",
    updatedAt: "2026-05-27T22:28:03Z",
    featured: false
  },
  {
    slug: "shinomontazh-vladimir-pogodina-11",
    title: "Сайт шиномонтажа «Шиномонтаж Vladimir Pogodina 11»",
    businessType: "Шиномонтаж",
    siteType: "Многостраничный сайт",
    city: "Владимир",
    mainGoal: "получать сезонные записи на шиномонтаж для города Владимир и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован","Владимир"],
    liveUrl: "https://rombensonn.github.io/shinomontazh-vladimir-pogodina-11/",
    updatedAt: "2026-05-27T20:29:43Z",
    featured: false
  },
  {
    slug: "gazel-remont-korgashino",
    title: "Сайт шиномонтажа «Газель Ремонт Korgashino»",
    businessType: "Шиномонтаж",
    siteType: "Многостраничный сайт",
    city: "Коргашино",
    mainGoal: "получать сезонные записи на шиномонтаж для города Коргашино и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован","Коргашино","Коммерческий транспорт"],
    liveUrl: "https://rombensonn.github.io/gazel-remont-korgashino/",
    updatedAt: "2026-05-27T18:55:10Z",
    featured: false
  },
  {
    slug: "arsenal-2013",
    title: "Сайт автосервиса «Arsenal 2013»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/arsenal-2013/",
    updatedAt: "2026-05-26T12:11:05Z",
    featured: false
  },
  {
    slug: "auto-rihtovka",
    title: "Сайт кузовного ремонта «Авто Рихтовка»",
    businessType: "Кузовной ремонт",
    siteType: "Многостраничный сайт",
    city: undefined,
    mainGoal: "объяснять этапы кузовного ремонта и получать заявки на оценку повреждений",
    tags: ["Кузовной ремонт","Опубликован"],
    liveUrl: "https://rombensonn.github.io/auto-rihtovka/",
    updatedAt: "2026-05-23T15:31:54Z",
    featured: false
  },
  {
    slug: "katyusha-autoservice-podolsk",
    title: "Сайт автосервиса «Katyusha Автосервис Podolsk»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Подольск",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Подольск через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Подольск"],
    liveUrl: "https://rombensonn.github.io/katyusha-autoservice-podolsk/",
    updatedAt: "2026-05-23T12:13:59Z",
    featured: false
  },
  {
    slug: "kuzovnoy-remont-mytishchi-site",
    title: "Сайт кузовного ремонта «Кузовной Ремонт Mytishchi»",
    businessType: "Кузовной ремонт",
    siteType: "Многостраничный сайт",
    city: "Мытищи",
    mainGoal: "объяснять этапы кузовного ремонта и получать заявки на оценку повреждений для города Мытищи",
    tags: ["Кузовной ремонт","Опубликован","Мытищи"],
    liveUrl: "https://rombensonn.github.io/kuzovnoy-remont-mytishchi-site/",
    updatedAt: "2026-05-23T09:35:05Z",
    featured: false
  },
  {
    slug: "shinomontazh-24-podolsk",
    title: "Сайт шиномонтажа «Шиномонтаж 24 Podolsk»",
    businessType: "Шиномонтаж",
    siteType: "Многостраничный сайт",
    city: "Подольск",
    mainGoal: "получать сезонные записи на шиномонтаж для города Подольск и быстро вести клиента к контакту",
    tags: ["Шиномонтаж","Опубликован","Подольск"],
    liveUrl: "https://rombensonn.github.io/shinomontazh-24-podolsk/",
    updatedAt: "2026-05-22T17:44:37Z",
    featured: false
  },
  {
    slug: "makro-tuning-podolsk",
    title: "Сайт автосервиса «Макро Тюнинг»",
    businessType: "Автосервис",
    siteType: "Многостраничный сайт",
    city: "Подольск",
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей для города Подольск через понятную структуру услуг",
    tags: ["Автосервис","Опубликован","Подольск"],
    liveUrl: "https://rombensonn.github.io/makro-tuning-podolsk/",
    updatedAt: "2026-05-22T17:38:41Z",
    featured: false
  },
  {
    slug: "tun-akpp",
    title: "Сайт диагностики авто «ТЮН АКПП»",
    businessType: "Диагностика",
    siteType: "Многостраничный сайт",
    city: undefined,
    mainGoal: "вести клиента от симптома неисправности к диагностике и заявке",
    tags: ["Диагностика","Опубликован","АКПП"],
    liveUrl: "https://rombensonn.github.io/tun-akpp/",
    updatedAt: "2026-05-22T15:55:05Z",
    featured: false
  },
  {
    slug: "panev-detailing-landing",
    title: "Лендинг детейлинга «Panev Детейлинг»",
    businessType: "Детейлинг",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "показывать уход за автомобилем, пакеты работ и собирать заявки на оценку",
    tags: ["Детейлинг","Опубликован"],
    liveUrl: "https://rombensonn.github.io/panev-detailing-landing/",
    updatedAt: "2026-05-21T11:41:28Z",
    featured: false
  },
  {
    slug: "autoservice-777-landing",
    title: "Лендинг автосервиса «Автосервис 777»",
    businessType: "Автосервис",
    siteType: "Лендинг",
    city: undefined,
    mainGoal: "собирать заявки на ремонт и обслуживание автомобилей через понятную структуру услуг",
    tags: ["Автосервис","Опубликован"],
    liveUrl: "https://rombensonn.github.io/autoservice-777-landing/",
    updatedAt: "2026-05-21T10:31:32Z",
    featured: false
  }
];

const uniqueTags = (tags: string[]): string[] => Array.from(new Set(tags));

const createCaseData = (seed: ProjectSeed, profile: CategoryProfile): NonNullable<Project["caseData"]> => {
  const location = seed.city ? " в городе " + seed.city : "";

  return {
    clientContext: seed.title + " — опубликованный проект для направления «" + seed.businessType + "»" + location + ". Задача: " + seed.mainGoal + ".",
    problem: profile.problem,
    solution: profile.solution,
    structure: profile.structure,
    seoPlan: seed.city ? [...profile.seoFocus, "локальные запросы: " + seed.city] : profile.seoFocus,
    aeoPlan: profile.aeoFocus,
    leadFormLogic: "Форма заявки не перегружает клиента: достаточно имени, телефона и понятного следующего шага для администратора.",
    mobileLogic: "Мобильная версия рассчитана на быстрый просмотр: оффер, услуги, доверие и заявка доступны без длинной навигации.",
    result: "Проект опубликован и добавлен в каталог как рабочий кейс с живой версией и описанием структуры."
  };
};

const createProject = (seed: ProjectSeed, index: number): Project => {
  const profile = categoryProfiles[seed.businessType];
  const caseData = createCaseData(seed, profile);

  return {
    id: index + 1,
    slug: seed.slug,
    title: seed.title,
    businessType: seed.businessType,
    siteType: seed.siteType,
    city: seed.city,
    mainGoal: seed.mainGoal,
    description: profile.description + " Цель проекта: " + seed.mainGoal + ".",
    tags: uniqueTags([...profile.baseTags, ...seed.tags]),
    featured: seed.featured,
    aeoFocus: [...profile.aeoFocus],
    seoFocus: [...profile.seoFocus],
    futureCaseReady: true,
    liveUrl: seed.liveUrl,
    updatedAt: seed.updatedAt,
    status: "Реальный кейс",
    caseData,
  };
};

export const projects: Project[] = projectSeeds.map(createProject);

export const featuredProjects: Project[] = projects
  .filter((project) => project.featured)
  .slice(0, 12);

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  "Автосервис": "Автосервисы",
  "Шиномонтаж": "Шиномонтажи",
  "Детейлинг": "Детейлинг",
  "Кузовной ремонт": "Кузовной ремонт",
  "Диагностика": "Диагностика",
  "Техосмотр": "Техосмотр",
  "Автозапчасти": "Автозапчасти",
  "Смешанный формат": "Смешанные форматы",
};

export const projectCategoryCounts: Record<ProjectCategory, number> = projectCategories.reduce(
  (counts, category) => ({
    ...counts,
    [category]: projects.filter((project) => project.businessType === category).length,
  }),
  {} as Record<ProjectCategory, number>,
);

export const projectFilterLabels: Array<{
  value: ProjectFilterValue;
  label: string;
  count: number;
}> = [
  { value: "all", label: "Все проекты", count: projects.length },
  ...projectCategories.map((category) => ({
    value: category,
    label: projectCategoryLabels[category],
    count: projectCategoryCounts[category],
  })),
];

export const getProjectsByCategory = (
  category: ProjectCategory,
): Project[] => projects.filter((project) => project.businessType === category);

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);
