/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ItineraryItem, CityInfo, PackingItem, ExpenseItem } from './types';

export const initialItinerary: ItineraryItem[] = [
  {
    id: "hel-lis-flight",
    type: "flight",
    date: "2026-07-02",
    title: "Flight: Helsinki (HEL) to Lisbon (LIS)",
    city: "Lisbon",
    timeLine: "13:00 - 15:50",
    duration: "4h 50m",
    price: 180, // Estimated flight cost, user can adjust
    details: "Helsinki-Vantaa Airport (HEL) direct to Lisbon Humberto Delgado Airport (LIS). Travel crossing 2 timezones.",
    location: "Helsinki Airport (HEL)",
    status: "confirmed"
  },
  {
    id: "lis-hotel-1",
    type: "hotel",
    date: "2026-07-02",
    title: "Avenida Garden Apartments (阿维尼达园公寓酒店)",
    city: "Lisbon",
    timeLine: "Check-in from 15:00",
    price: 260,
    details: "Reserved for 3 nights (July 2 - 5). Located around Avenida da Liberdade, super convenient location with easy access to Avenida Metro Station.",
    location: "Avenida Garden Apartments, Lisbon",
    status: "confirmed"
  },
  {
    id: "lis-porto-out",
    type: "train",
    date: "2026-07-04",
    title: "Train: Lisbon Santa Apolonía to Porto Campanhã",
    city: "Porto",
    timeLine: "06:30 - 09:43",
    duration: "3h 13m",
    price: 24, // Estimated train cost
    details: "Morning day-trip departure representing direct high-speed Alfa Pendular (AP) or Intercidades (IC) train connection.",
    location: "Lisbon Santa Apolónia Railway Station",
    status: "confirmed"
  },
  {
    id: "porto-daytrip",
    type: "daytrip",
    date: "2026-07-04",
    title: "Porto Side Trip (波尔图一日游)",
    city: "Porto",
    timeLine: "09:43 - 19:45",
    duration: "10h 02m",
    price: 0,
    details: "Day Trip in Porto. Recomended stops: Dom Luís I Bridge, Ribeira waterfront, Vila Nova de Gaia wine tasting cellars, and São Bento train station.",
    location: "Porto City Centre",
    status: "confirmed"
  },
  {
    id: "porto-lis-return",
    type: "train",
    date: "2026-07-04",
    title: "Train: Porto Campanhã to Lisbon Santa Apolonía",
    city: "Lisbon",
    timeLine: "19:45 - 23:00",
    duration: "3h 15m",
    price: 24, // Estimated train cost
    details: "Return evening train to Lisbon Santa Apolonía, returning to hotel.",
    location: "Porto Campanhã Railway Station",
    status: "confirmed"
  },
  {
    id: "lis-hotel-2",
    type: "hotel",
    date: "2026-07-05",
    title: "Residencial Sky Lounge (小型双床间)",
    city: "Lisbon",
    timeLine: "Check-in July 5 Noon",
    price: 55,
    details: "1 night stay. Small Twin Room (小型双床间). Standard transit lodging, close to metro and convenient for heading to Lisbon Airport early next morning.",
    location: "Residencial Sky Lounge, Lisbon",
    status: "confirmed"
  },
  {
    id: "lis-prg-flight",
    type: "flight",
    date: "2026-07-06",
    title: "Flight: Lisbon (LIS) to Prague (PRG)",
    city: "Prague",
    timeLine: "06:10 - 10:35",
    duration: "3h 25m",
    price: 135, // Estimated flight cost, user can adjust
    details: "Early departure flight to Prague. Highly recommended to book airport taxi or check night metro schedules. Set alarms early!",
    location: "Lisbon Humberto Delgado Airport (LIS)",
    status: "confirmed"
  },
  {
    id: "prg-hotel",
    type: "hotel",
    date: "2026-07-06",
    title: "Ibis Praha Mala Strana Hotel (布拉格老城宜必思酒店)",
    city: "Prague",
    timeLine: "Check-in July 6 Night",
    price: 115,
    details: "2 nights stay (July 6 - 8). Mala Strana is a highly picturesque historical quarter. Excellent access to Charles Bridge and Prague Castle.",
    location: "ibis Praha Mala Strana, Prague",
    status: "confirmed"
  },
  {
    id: "prg-vie-train",
    type: "train",
    date: "2026-07-08",
    title: "Train Flight: Prague to Vienna (RJ 1035)",
    city: "Vienna",
    timeLine: "13:01 - 17:21",
    duration: "4h 20m",
    price: 25,
    details: "RegioJet Train RJ 1035. Scenic landscape of Central Europe with standard tea, coffee, and Wi-Fi on board.",
    location: "Prague Main Railway Station (Praha hl.n.)",
    status: "confirmed"
  },
  {
    id: "vie-stay",
    type: "hotel",
    date: "2026-07-08",
    title: "Stay in Vienna (Accommodation To Be Reserved)",
    city: "Vienna",
    timeLine: "July 8 - July 11 (3 Nights)",
    price: 150, // Initial estimate for Vienna budget
    details: "Vienna exploration days. Explore palaces, classical symphony halls, traditional cafes, and Saint Stephen's Cathedral. Accommodation needs booking confirmation.",
    location: "Vienna Center Area",
    status: "pending"
  },
  {
    id: "vie-bud-transit",
    type: "train",
    date: "2026-07-11",
    title: "Transit: Vienna to Budapest",
    city: "Budapest",
    timeLine: "Flexible (e.g. 09:42 - 12:19)",
    duration: "2h 37m",
    price: 19, // Estimated EuroCity or Railjet fare
    details: "Cross-border train from Vienna Central Station (Wien Hbf) straight to Budapest Keleti.",
    location: "Wien Hauptbahnhof, Vienna",
    status: "confirmed"
  },
  {
    id: "bud-stay",
    type: "hotel",
    date: "2026-07-11",
    title: "Stay in Budapest (Accommodation To Be Reserved)",
    city: "Budapest",
    timeLine: "July 11 - July 13 (2 Nights)",
    price: 90, // Initial estimate for Budapest budget
    details: "Gaze at the spectacular Parliament at night, try Hungarian goulash, sink into thermal pools, and grab a craft beer inside ruin pubs.",
    location: "Budapest Center Area",
    status: "pending"
  },
  {
    id: "bud-arn-flight",
    type: "flight",
    date: "2026-07-13",
    title: "Flight: Budapest (BUD) to Stockholm (ARN)",
    city: "Stockholm",
    timeLine: "10:10 - 12:35",
    duration: "2h 25m",
    price: 110, // Estimated flight cost, user can adjust
    details: "Departing Budapest Ferenc Liszt Airport (BUD), direct to Stockholm Arlanda Airport (ARN). Check in early.",
    location: "Budapest Airport (BUD)",
    status: "confirmed"
  },
  {
    id: "arn-stay",
    type: "hotel",
    date: "2026-07-13",
    title: "Stay in Stockholm (Accommodation To Be Reserved)",
    city: "Stockholm",
    timeLine: "July 13 - July 14 (1 Night)",
    price: 70, // Initial estimate for 1 night
    details: "Evening walk around Gamla Stan (Stockholm Old Town) and beautiful waterfront promenade views.",
    location: "Stockholm, Sweden",
    status: "pending"
  },
  {
    id: "arn-hel-flight",
    type: "flight",
    date: "2026-07-14",
    title: "Flight: Stockholm (ARN) to Helsinki (HEL)",
    city: "Helsinki",
    timeLine: "07:35 - 09:30",
    duration: "0h 55m",
    price: 75, // Estimated flight cost
    details: "Final flight leg back to Helsinki-Vantaa Airport (HEL). Short flight, rapid duty-free shopping options prior.",
    location: "Stockholm Arlanda Airport (ARN)",
    status: "confirmed"
  }
];

export const cityData: CityInfo[] = [
  {
    id: "lisbon",
    name: "Lisbon",
    chineseName: "里斯本",
    country: "Portugal 🇵🇹",
    currency: "EUR (€)",
    exchangeRate: "Local currency is Euro.",
    description: "Built across 7 majestic hills, Lisbon is one of the oldest cities in the world, blending historical pastel-colored alleys, world-famous custard tarts, and coastal sea breezes.",
    highlights: ["Belém Tower & Jerónimos Monastery", "Ride the historical Tram 28", "Alfama District & Oceanário de Lisboa", "Pastéis de Belém (Custard Tarts)"],
    localTransportation: "Metro, historical yellow trams, urban trains (CP), and taxis (Uber/Bolt) are very cheap and highly convenient here.",
    colorTheme: "from-amber-500 to-amber-700",
    bgGradient: "bg-amber-50"
  },
  {
    id: "porto",
    name: "Porto",
    chineseName: "波尔图",
    country: "Portugal 🇵🇹",
    currency: "EUR (€)",
    exchangeRate: "Local currency is Euro.",
    description: "A compact, atmospheric riverside city famous for its outstanding Port wine cellars, blue-and-white azulejo tiles, and the colossal iron double-decker Dom Luís I Bridge.",
    highlights: ["Dom Luís I Bridge walk", "São Bento Train Station (Tile Murals)", "Ribeira Waterfront stroll", "Lello Bookstore & Clérigos Church"],
    localTransportation: "The Porto Metro is fast and modern. Funiculars, trams, and walkability cover most spots.",
    colorTheme: "from-blue-600 to-blue-800",
    bgGradient: "bg-blue-50"
  },
  {
    id: "prague",
    name: "Prague",
    chineseName: "布拉格",
    country: "Czech Republic 🇨🇿",
    currency: "CZK (Kč) & EUR",
    exchangeRate: "1 EUR ≈ 25 CZK. Card payments are widely accepted, but keeping a few CZK cash holds benefits.",
    description: "The 'City of a Hundred Spires', Prague escaped major World War destruction. Its magical old town represents a perfectly preserved museum of Gothic, Baroque, and Renaissance mastery.",
    highlights: ["Charles Bridge (Karlův most)", "Prague Astronomical Clock show", "Prague Castle (Pražský hrad)", "Wenceslas Square & Trdelník eating"],
    localTransportation: "Excellent integrated tram and metro system. Cheap 24-hour city travel passes are available.",
    colorTheme: "from-rose-600 to-rose-800",
    bgGradient: "bg-rose-50"
  },
  {
    id: "vienna",
    name: "Vienna",
    chineseName: "维也纳",
    country: "Austria 🇦🇹",
    currency: "EUR (€)",
    exchangeRate: "Local currency is Euro.",
    description: "The imperial capital of classical composition, opera, grand architecture, and refined coffeehouse culture. Home to Mozart, Beethoven, and majestic Habsburg Palaces.",
    highlights: ["Schönbrunn & Hofburg Palaces", "St. Stephen's Cathedral (Stephansdom)", "Historic Café Central coffee culture", "Vienna State Opera houses"],
    localTransportation: "U-Bahn (Metro), street trams, and modern S-Bahn trains. Buy single or multi-day network tickets.",
    colorTheme: "from-red-600 to-red-800",
    bgGradient: "bg-red-50"
  },
  {
    id: "budapest",
    name: "Budapest",
    chineseName: "布达佩斯",
    country: "Hungary 🇭🇺",
    currency: "HUF (Ft) & EUR",
    exchangeRate: "1 EUR ≈ 395 HUF. Cards are primary; carry minor HUF cash if visiting local ruin pubs.",
    description: "Commonly called the 'Paris of the East', split by the Danube River. Budapest features grand, castle-crowned hills on the Buda side, and busy, vibrant nightlife and politics on the Pest side.",
    highlights: ["Hungarian Parliament Building at night", "Thermal Spas (Széchenyi / Gellért)", "Fisherman's Bastion sunset views", "Ruin Bars (Szimpla Kert) tour"],
    localTransportation: "Famous vintage yellow Tram Line 2 by the river, historic Metro Line 1 (oldest in mainland Europe), and handy buses.",
    colorTheme: "from-emerald-600 to-emerald-800",
    bgGradient: "bg-emerald-50"
  },
  {
    id: "stockholm",
    name: "Stockholm",
    chineseName: "斯德哥尔摩",
    country: "Sweden 🇸🇪",
    currency: "SEK (kr)",
    exchangeRate: "1 EUR ≈ 11.4 SEK. Stockholm is virtually cashless. You only need standard international cards.",
    description: "Built across 14 islands linked by 57 bridges, Stockholm is a clean, modern, and design-forward capital. Gamla Stan offers medieval cobblestone charm contrasting progressive tech styles.",
    highlights: ["Gamla Stan (Preserved medieval Old Town)", "Vasa Museum (17th-century warship)", "ABBA The Museum", "Stockholm Metro Art station tours"],
    localTransportation: "Stockholm Metro (T-bana), commuter rail, and elegant ferry links across the archipelago.",
    colorTheme: "from-sky-600 to-sky-800",
    bgGradient: "bg-sky-50"
  },
  {
    id: "helsinki",
    name: "Helsinki",
    chineseName: "赫尔辛基",
    country: "Finland 🇫🇮",
    currency: "EUR (€)",
    exchangeRate: "Local currency is Euro.",
    description: "The starting and ending point of your journey. An architectural design capital facing the Baltic sea, highlighting beautiful public saunas, Nordic clean food, and pristine nature.",
    highlights: ["Helsinki Senate Square Cathedral", "Temppeliaukio (Rock Church)", "Löyly Public Finnish Sauna Experience", "Suomenlinna Sea Fortress ferry trip"],
    localTransportation: "HSL municipal trains, classic green trams, metro line, and municipal ferries.",
    colorTheme: "from-emerald-600 to-emerald-800",
    bgGradient: "bg-emerald-50"
  }
];

export const initialPackingList: PackingItem[] = [
  // Documents
  { id: "p1", category: "Documents", name: "护照 (Passport) - Validity > 6 Months", checked: true, essential: true },
  { id: "p2", category: "Documents", name: "申根签证 / 居留许可 (Schengen Visa or RC)", checked: true, essential: true },
  { id: "p3", category: "Documents", name: "电子机票 & 火车票 PDF 备份", checked: false, essential: true },
  { id: "p4", category: "Documents", name: "酒店预订确认信 (住宿打印件/手机截图)", checked: false, essential: true },
  { id: "p5", category: "Documents", name: "信用卡 (VISA/Mastercard - 最好双币卡)", checked: true, essential: true },
  
  // Clothing
  { id: "p6", category: "Clothing", name: "夏季轻便短袖/短裤 / 短裙", checked: false, essential: true },
  { id: "p7", category: "Clothing", name: "防风薄外套 / 皮肤衣 (飞机及北欧夜晚降温用)", checked: false, essential: true },
  { id: "p8", category: "Clothing", name: "舒适步行鞋 / 运动鞋 (欧洲古镇多石子路!)", checked: false, essential: true },
  { id: "p9", category: "Clothing", name: "泳衣/泳裤 (布达佩斯温泉 / 里斯本沙滩)", checked: false, essential: false },
  { id: "p10", category: "Clothing", name: "墨镜 & 遮阳帽", checked: false, essential: false },
  
  // Electronics
  { id: "p11", category: "Electronics", name: "欧标转换插头 (European Adapter Plugs)", checked: false, essential: true },
  { id: "p12", category: "Electronics", name: "移动电源 / 充电宝", checked: false, essential: true },
  { id: "p13", category: "Electronics", name: "手机充电线 & 平板/相机充电器", checked: false, essential: true },
  { id: "p14", category: "Electronics", name: "降噪耳机 (长时间飞行和火车很需要)", checked: false, essential: false },
  
  // Toiletries
  { id: "p15", category: "Toiletries", name: "高倍防晒霜 (南欧 7 月艳阳高照, 极易晒伤)", checked: false, essential: true },
  { id: "p16", category: "Toiletries", name: "旅行装洗发水 / 沐浴露 / 牙塞", checked: false, essential: false },
  { id: "p17", category: "Toiletries", name: "便携纸巾 / 湿纸巾", checked: false, essential: false },
  
  // Miscellaneous
  { id: "p18", category: "Other", name: "折叠雨伞 / 晴雨伞 (天气多变防万一)", checked: false, essential: true },
  { id: "p19", category: "Other", name: "个人常用药 (双黄连、布洛芬、创可贴、晕车药)", checked: false, essential: true },
  { id: "p20", category: "Other", name: "随身小挎包 / 防盗包", checked: false, essential: true }
];

export const initialExpenses: ExpenseItem[] = [
  { id: "e1", title: "Avenida Garden Apartments - Lisbon Stay", amount: 260, category: "Accommodation", date: "2026-07-02" },
  { id: "e2", title: "Residencial Sky Lounge - Lisbon Stay", amount: 55, category: "Accommodation", date: "2026-07-05" },
  { id: "e3", title: "Ibis Praha Mala Strana Hotel - Prague Stay", amount: 115, category: "Accommodation", date: "2026-07-06" },
  { id: "e4", title: "Prague to Vienna RJ 1035 Train Ticket", amount: 25, category: "Transport", date: "2026-07-08" },
  { id: "e5", title: "Helsinki to Lisbon flight (Est.)", amount: 180, category: "Transport", date: "2026-07-02" },
  { id: "e6", title: "Lisbon to Prague flight (Est.)", amount: 135, category: "Transport", date: "2026-07-06" },
  { id: "e7", title: "Budapest to Stockholm flight (Est.)", amount: 110, category: "Transport", date: "2026-07-13" },
  { id: "e8", title: "Stockholm to Helsinki flight (Est.)", amount: 75, category: "Transport", date: "2026-07-14" },
  { id: "e9", title: "Lisbon-Porto round-trip ticket AP/IC train (Est.)", amount: 48, category: "Transport", date: "2026-07-04" },
  { id: "e10", title: "Vienna-Budapest train ticket (Est.)", amount: 19, category: "Transport", date: "2026-07-11" }
];
