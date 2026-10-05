'use strict';

/* ===== TETAPAN WEBSITE (ubah di sini) ===== */
const SITE = {
  name: 'Ammar Naufal',
  tagline: 'Ejen TripCare 360 Takaful',
  wa: '60139292911',
  phone: '013-929 2911',
  agentNo: '', // isi no. pendaftaran/lesen ejen jika ada; akan keluar di footer
  socials: [], // contoh: { label: 'TikTok', short: 'TT', url: 'https://tiktok.com/@...' }
  helpline: '+603-2785 6565',
  claimsLine: '1 300 88 1007',
  oneline: '1300 13 8888'
};

/* ===== KADAR CARUMAN (Brosur TripCare 360 Takaful, Etiqa) =====
   Lajur: [Domestik Area1 | Silver A2 A3 A4 | Gold A2 A3 A4 | Platinum A2 A3 A4]
   Baris: [1-5 hari, 6-10, 11-18, 19-30, setiap minggu tambahan, tahunan]  ('x' = tidak dilindungi) */
const P = s => s.trim().split(/\s+/).map(v => (v === 'x' ? null : parseFloat(v)));

const RATES = {
  ind: [
    P('16.50 25.00 33.50 45.00 41.00 54.50 73.50 54.00 72.00 97.00'),
    P('25.00 36.50 48.50 65.50 59.50 79.50 107.00 78.50 105.00 141.50'),
    P('35.50 57.00 76.00 102.50 93.00 124.00 167.50 123.00 164.00 221.50'),
    P('41.00 67.50 90.00 122.00 110.50 147.00 198.50 146.00 194.50 263.00'),
    P('x 17.50 23.50 32.00 29.00 38.50 52.00 38.00 51.00 69.00'),
    P('132.50 188.00 228.50 272.50 306.50 373.00 444.50 405.00 493.00 587.50')
  ],
  spouse: [
    P('31.50 48.00 63.50 86.00 78.00 104.00 140.50 103.00 137.50 185.50'),
    P('47.50 69.50 93.00 125.50 113.50 151.50 204.50 150.50 200.50 270.50'),
    P('67.50 109.00 145.50 196.00 177.50 237.00 320.00 235.00 313.50 423.00'),
    P('78.50 129.50 172.50 232.50 211.00 281.00 379.50 279.00 371.50 502.00'),
    P('x 34.00 45.00 61.00 55.00 73.50 99.50 73.00 97.50 131.50'),
    P('253.50 359.00 436.50 520.50 585.00 712.00 848.50 774.00 941.50 1122.50')
  ],
  senior: [
    P('53.50 81.50 108.50 146.50 132.50 177.00 239.00 175.50 234.00 316.00'),
    P('80.50 118.50 158.00 213.50 193.50 258.00 348.00 255.50 341.00 460.00'),
    P('115.00 185.50 247.00 333.50 302.50 403.00 544.00 400.00 533.00 719.50'),
    P('133.50 220.00 293.50 396.00 358.50 478.50 645.50 474.50 632.50 854.00'),
    P('x 57.50 77.00 103.50 94.00 125.50 169.00 124.50 165.50 223.50'),
    P('x 610.50 743.00 885.50 995.50 1211.50 1444.00 1316.50 1602.00 1910.00')
  ],
  family: [
    P('39.50 60.50 80.50 108.50 100.00 133.50 180.00 133.50 178.00 240.50'),
    P('59.50 86.50 115.50 155.50 143.50 191.00 258.00 191.50 255.00 344.50'),
    P('85.00 137.50 183.00 247.00 227.50 303.00 409.00 303.50 405.00 546.50'),
    P('98.50 172.50 230.00 310.50 285.50 381.00 514.00 381.50 508.50 686.50'),
    P('x 44.50 59.50 80.00 74.00 98.50 133.00 98.50 131.50 177.50'),
    P('316.50 445.50 542.00 646.50 738.00 897.50 1070.00 985.50 1199.00 1429.00')
  ]
};

/* Aktiviti lasak: lajur sama seperti RATES (tiada jadual untuk warga emas) */
const ADV = {
  ind: [
    P('7.50 15.00 15.00 15.00 24.50 24.50 24.50 32.50 32.50 32.50'),
    P('11.50 22.00 22.00 22.00 36.00 36.00 36.00 47.50 47.50 47.50'),
    P('16.50 34.50 34.50 34.50 56.00 56.00 56.00 74.00 74.00 74.00'),
    P('19.00 41.00 41.00 41.00 66.50 66.50 66.50 87.50 87.50 87.50'),
    P('x 11.00 11.00 11.00 17.50 17.50 17.50 23.00 23.00 23.00'),
    P('36.50 103.00 103.00 103.00 167.50 167.50 167.50 221.50 221.50 221.50')
  ],
  spouse: [
    P('14.50 29.00 29.00 29.00 47.00 47.00 47.00 62.00 62.00 62.00'),
    P('22.00 42.00 42.00 42.00 68.50 68.50 68.50 90.50 90.50 90.50'),
    P('31.00 65.50 65.50 65.50 106.50 106.50 106.50 141.00 141.00 141.00'),
    P('36.00 77.50 77.50 77.50 126.50 126.50 126.50 167.50 167.50 167.50'),
    P('x 20.50 20.50 20.50 33.50 33.50 33.50 44.00 44.00 44.00'),
    P('69.00 196.00 196.00 196.00 319.50 319.50 319.50 422.50 422.50 422.50')
  ],
  family: [
    P('19.00 37.50 37.50 37.50 61.50 61.50 61.50 81.00 81.00 81.00'),
    P('28.50 55.00 55.00 55.00 89.50 89.50 89.50 118.00 118.00 118.00'),
    P('40.50 85.50 85.50 85.50 139.50 139.50 139.50 184.50 184.50 184.50'),
    P('47.00 101.50 101.50 101.50 165.50 165.50 165.50 219.00 219.00 219.00'),
    P('x 27.00 27.00 27.00 43.50 43.50 43.50 57.50 57.50 57.50'),
    P('90.50 256.50 256.50 256.50 418.50 418.50 418.50 553.00 553.00 553.00')
  ]
};

/* COVID-19 (antarabangsa sahaja): lajur [Area2 Area3 Area4], tanpa beza plan */
const COVID = {
  ind: [P('17.50 20.50 28.00'), P('26.00 34.00 47.00'), P('38.50 53.50 74.50'), P('56.00 81.50 113.00'), P('12.50 19.50 27.00'), P('72.50 96.00 121.00')],
  senior: [P('35.00 41.00 56.00'), P('52.00 68.00 94.00'), P('77.00 107.00 149.00'), P('112.00 163.00 226.00'), P('25.00 39.00 54.00'), P('x x x')],
  spouse: [P('31.50 37.00 50.50'), P('47.00 61.00 84.50'), P('69.50 96.50 134.00'), P('101.00 146.50 203.50'), P('22.50 35.00 48.50'), P('138.50 183.50 231.50')],
  family: [P('44.00 51.50 70.00'), P('65.00 85.00 117.50'), P('96.50 134.00 186.50'), P('140.00 204.00 282.50'), P('31.50 49.00 67.50'), P('181.50 240.00 302.50')]
};

/* Extended Home Care (antarabangsa Area 2/3/4, semua kategori sama) */
const HOME = [P('18.50'), P('33.50'), P('50.50'), P('66.50'), P('16.00'), P('x')];

/* Golf: lajur [Domestik, Antarabangsa]. Warga emas guna jadual 'ind' (dewasa 16-80) */
const GOLF = {
  ind: [P('8.00 12.00'), P('11.50 17.50'), P('14.50 22.50'), P('22.50 34.50'), P('x 14.50'), P('x 90.00')],
  spouse: [P('15.00 23.00'), P('21.50 33.00'), P('28.00 43.00'), P('42.50 65.50'), P('x 28.00'), P('x 171.50')],
  family: [P('19.50 30.00'), P('28.00 43.00'), P('36.50 56.50'), P('56.00 86.00'), P('x 36.50'), P('x 224.50')]
};

/* ===== KAWASAN ===== */
const AREA_LABEL = {
  1: 'Domestik (dalam Malaysia)',
  2: 'Area 2 · Negara Asia terpilih',
  3: 'Area 3 · Seluruh dunia kecuali Malaysia, USA & Canada',
  4: 'Area 4 · Seluruh dunia termasuk USA & Canada'
};

const AREA2 = new Set(['Bangladesh', 'Bhutan', 'Brunei', 'Cambodia', 'China', 'Hong Kong', 'India', 'Indonesia', 'Japan', 'Laos', 'Macau', 'Maldives', 'Pakistan', 'Philippines', 'Sikkim', 'Singapore', 'South Korea', 'Sri Lanka', 'Taiwan', 'Thailand', 'Timor Leste', 'Vietnam']);
const AREA4 = new Set(['United States', 'Canada']);
const EXCLUDED = new Set(['Cuba', 'Iran', 'North Korea', 'Syria', 'Ukraine', 'Russia', 'Myanmar', 'Iraq', 'Palestine', 'Afghanistan', 'Belarus', 'Venezuela', 'Sudan', 'South Sudan', 'Israel', 'Antarctica', 'Nepal', 'Libya']);

/* "Nama|alias,alias" — alias dalam Bahasa Melayu / nama bandar popular untuk carian */
const COUNTRIES = ('Afghanistan|Afghanistan;Albania;Algeria|Algeria;Andorra;Angola;Antarctica|Antartika;Antigua and Barbuda;Argentina;Armenia;Australia|Sydney,Melbourne,Perth,Gold Coast;Austria|Vienna,Wien;Azerbaijan|Baku;Bahamas;Bahrain;Bangladesh|Dhaka;Barbados;Belarus;Belgium|Belgium,Brussels;Belize;Benin;Bhutan;Bolivia;Bosnia and Herzegovina|Bosnia,Sarajevo;Botswana;Brazil|Brazil;Brunei|Bandar Seri Begawan;Bulgaria;Burkina Faso;Burundi;Cambodia|Kemboja,Siem Reap,Angkor;Cameroon;Canada|Kanada,Toronto,Vancouver;Cape Verde;Central African Republic;Chad;Chile;China|Cina,Beijing,Shanghai,Guangzhou,Shenzhen,Chengdu;Colombia;Comoros;Congo (Republic);Congo (DR);Costa Rica;Croatia|Croatia,Dubrovnik;Cuba;Cyprus|Cyprus;Czech Republic|Czech,Prague,Praha;Denmark|Denmark,Copenhagen;Djibouti;Dominica;Dominican Republic;Ecuador;Egypt|Mesir,Cairo;El Salvador;Equatorial Guinea;Eritrea;Estonia;Eswatini;Ethiopia;Fiji;Finland|Finland,Helsinki;France|Perancis,Paris;Gabon;Gambia;Georgia|Georgia,Tbilisi;Germany|Jerman,Berlin,Munich;Ghana;Greece|Greece,Athens,Santorini;Grenada;Guatemala;Guinea;Guinea-Bissau;Guyana;Haiti;Honduras;Hong Kong|Hongkong;Hungary|Hungary,Budapest;Iceland|Iceland;India|India,Delhi,Mumbai,Goa;Indonesia|Bali,Jakarta,Lombok,Yogyakarta,Bandung,Medan,Batam;Iran;Iraq;Ireland|Ireland,Dublin;Israel;Italy|Itali,Rome,Venice,Milan;Ivory Coast;Jamaica;Japan|Jepun,Tokyo,Osaka,Kyoto,Hokkaido;Jordan|Jordan,Petra,Amman;Kazakhstan|Almaty;Kenya;Kiribati;Kosovo;Kuwait;Kyrgyzstan|Bishkek;Laos|Vientiane,Luang Prabang;Latvia;Lebanon;Lesotho;Liberia;Libya;Liechtenstein;Lithuania;Luxembourg;Macau|Makau;Madagascar;Malawi;Malaysia|Domestik,Dalam Negara,Langkawi,Sabah,Sarawak,Penang,Pulau Pinang,Kuala Lumpur,Johor,Melaka,Cameron Highlands,Perhentian,Redang,Tioman;Maldives|Maldif;Mali;Malta;Marshall Islands;Mauritania;Mauritius;Mexico|Mexico;Micronesia;Moldova;Monaco;Mongolia;Montenegro;Morocco|Maghribi,Marrakech;Mozambique;Myanmar|Burma,Yangon;Namibia;Nauru;Nepal|Kathmandu,Everest;Netherlands|Belanda,Amsterdam;New Zealand|Auckland,Queenstown;Nicaragua;Niger;Nigeria;North Korea|Korea Utara;North Macedonia;Norway|Norway,Oslo;Oman|Muscat;Pakistan|Pakistan,Lahore,Islamabad;Palau;Palestine|Palestin;Panama;Papua New Guinea;Paraguay;Peru|Peru,Machu Picchu;Philippines|Filipina,Manila,Cebu,Boracay;Poland|Poland,Warsaw,Krakow;Portugal|Portugal,Lisbon;Qatar|Doha;Romania;Russia|Rusia,Moscow;Rwanda;Saint Kitts and Nevis;Saint Lucia;Saint Vincent and the Grenadines;Samoa;San Marino;Sao Tome and Principe;Saudi Arabia|Arab Saudi,Mekah,Makkah,Madinah,Umrah,Jeddah,Riyadh;Senegal;Serbia;Seychelles;Sierra Leone;Sikkim;Singapore|Singapura,JB,Sentosa;Slovakia;Slovenia;Solomon Islands;Somalia;South Africa|Afrika Selatan,Cape Town;South Korea|Korea,Korea Selatan,Seoul,Busan,Jeju;South Sudan;Spain|Sepanyol,Barcelona,Madrid;Sri Lanka|Colombo;Sudan;Suriname;Sweden|Sweden,Stockholm;Switzerland|Swiss,Zurich,Geneva;Syria;Taiwan|Taipei;Tajikistan;Tanzania|Zanzibar,Kilimanjaro;Thailand|Thai,Bangkok,Phuket,Krabi,Pattaya,Chiang Mai,Hatyai,Hat Yai;Timor Leste|East Timor,Dili;Togo;Tonga;Trinidad and Tobago;Tunisia;Turkey|Turki,Turkiye,Istanbul,Cappadocia;Turkmenistan;Tuvalu;Uganda;Ukraine;United Arab Emirates|UAE,Dubai,Abu Dhabi;United Kingdom|UK,Britain,England,London,Scotland,Wales;United States|USA,US,Amerika,America,New York,Los Angeles,Hawaii,California,Las Vegas;Uruguay;Uzbekistan|Tashkent,Samarkand;Vanuatu;Vatican City;Venezuela;Vietnam|Hanoi,Ho Chi Minh,Saigon,Da Nang,Halong;Yemen;Zambia;Zimbabwe')
  .split(';').map(s => {
    const [n, a = ''] = s.split('|');
    return { n, k: (n + ',' + a).toLowerCase() };
  });

/* ===== BENEFIT PENUH =====
   [nama, [Domestik, Silver, Gold, Platinum], [had maksimum keluarga ...] (pilihan)] */
const BEN = [
  { sec: 'A · Kemalangan Peribadi', rows: [
    ['Kematian akibat kemalangan / hilang upaya kekal: dewasa', ['50,000', '100,000', '300,000', '500,000']],
    ['Kematian akibat kemalangan / hilang upaya kekal: kanak-kanak', ['10,000', '40,000', '100,000', '100,000']],
    ['Kematian akibat kemalangan / hilang upaya kekal: warga emas', ['50,000', '100,000', '300,000', '500,000']],
    ['Maksimum per keluarga', ['150,000', '300,000', '900,000', '1,500,000']]
  ] },
  { sec: 'B · Perbelanjaan Perubatan (lebihan RM100)', note: 'Domestik: akibat kemalangan sahaja. Antarabangsa: akibat kemalangan atau penyakit.', rows: [
    ['Perbelanjaan berkaitan perubatan (termasuk rawatan gigi kecemasan, Guarantee Letter untuk kemasukan hospital luar negara)', ['50,000', '100,000', '300,000', '500,000'], ['125,000', '250,000', '750,000', '1,500,000']],
    ['Rawatan susulan (dalam 3 bulan selepas pulang)', ['5,000', '5,000', '10,000', '30,000'], ['12,500', '12,500', '25,000', '75,000']],
    ['Rawatan alternatif (tradisional, osteopath, fisioterapi, kiropraktik)', ['NC', 'NC', 'NC', '1,000'], ['', '', '', '2,500']],
    ['Penjagaan penuh kasih sayang (compassionate care)', ['NC', '5,000', '5,000', '5,000']],
    ['Penjagaan & pemulangan anak', ['NC', '5,000', '5,000', '5,000']],
    ['Elaun hospital sehari (maks. 20 hari)', ['150', '150', '250', '350'], ['375', '375', '625', '875']]
  ] },
  { sec: 'C · Kesulitan Perjalanan', rows: [
    ['Pembatalan / pemendekan perjalanan', ['NC', 'NC', '20,000', '50,000'], ['', '', '50,000', '125,000']],
    ['Kelewatan penerbangan: 2 jam pertama', ['100', '100', '100', '100']],
    ['Kelewatan penerbangan: setiap 6 jam seterusnya', ['n/a', '250 (hingga 1,000)', '250 (hingga 2,000)', '250 (hingga 5,000)'], ['250', '2,500', '5,000', '12,500']],
    ['Kelewatan bagasi: semasa tiba di destinasi', ['500', '500', '800', '1,000'], ['1,250', '1,250', '2,000', '2,500']],
    ['Kelewatan bagasi: semasa pulang ke Malaysia / rumah', ['NC', '100', '150', '200'], ['NC', '250', '375', '500']],
    ['Kesulitan rampasan pesawat (setiap 24 jam)', ['NC', 'NC', '250 (hingga 500)', '250 (hingga 1,000)'], ['', '', '1,250', '2,500']],
    ['Terlepas sambungan perjalanan', ['NC', '400', '500', '600'], ['NC', '1,000', '1,250', '1,500']]
  ] },
  { sec: 'D · Kehilangan / Kerosakan Bagasi & Barang Peribadi (lebihan RM100)', rows: [
    ['Bagasi dan/atau barang peribadi (elektronik: laptop, tablet, telefon ada had kecil)', ['1,000', '1,000', '3,000', '5,000'], ['2,500', '2,500', '7,500', '12,500']],
    ['Wang peribadi (kecurian)', ['NC', 'NC', '500', '1,000'], ['', '', '1,250', '2,500']],
    ['Dokumen perjalanan: pasport / visa (kecurian)', ['NC', 'NC', '1,000', '1,500'], ['', '', '2,500', '3,750']],
    ['Home care (rumah: kebakaran / kecurian semasa anda bercuti)', ['500', '1,000', '1,000', '1,000'], ['1,250', '2,500', '2,500', '2,500']]
  ] },
  { sec: 'E · Liabiliti Peribadi', rows: [
    ['Liabiliti undang-undang terhadap pihak ketiga akibat kecuaian anda', ['200,000', '200,000', '1,000,000', '2,000,000'], ['500,000', '500,000', '2,500,000', '5,000,000']]
  ] },
  { sec: 'F · Perkhidmatan Kecemasan', rows: [
    ['Pemindahan perubatan kecemasan & repatriasi', ['500,000', '500,000', '1,000,000', '1,500,000']],
    ['Repatriasi, pengebumian & pembakaran jenazah', ['500,000', '500,000', '1,000,000', '1,500,000']]
  ] }
];

const HEAD = [
  ['Perubatan', ['RM50,000*', 'RM100,000', 'RM300,000', 'RM500,000']],
  ['Flight delay', ['RM100', 'RM100', 'RM100', 'RM100']],
  ['Pembatalan trip', ['Tiada cover', 'Tiada cover', 'RM20,000', 'RM50,000']],
  ['Bagasi & barang', ['RM1,000', 'RM1,000', 'RM3,000', 'RM5,000']]
];

const ADDONS = [
  { id: 'adv', name: 'Aktiviti Lasak', desc: 'Rafting, selam skuba, ski, hiking gunung & lain-lain (amatur, dengan operator berlesen)' },
  { id: 'covid', name: 'COVID-19 Cover', desc: 'Antarabangsa sahaja: pembatalan, gangguan trip & perubatan akibat COVID-19' },
  { id: 'home', name: 'Extended Home Care', desc: 'Antarabangsa sahaja: kerosakan kandungan rumah akibat curi, kebakaran, air (hingga RM20,000)' },
  { id: 'golf', name: 'Golf Cover', desc: 'Peralatan golf dicuri & yuran green fee tidak terpakai' }
];
