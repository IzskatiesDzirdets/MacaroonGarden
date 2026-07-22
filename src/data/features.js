// Six features, each tied to a physical piece of the macaron as it comes apart.
// piece: which mesh in MacaronScene this card is paired with
// direction: unit-ish vector the piece flies toward when exploded (world space)
export const FEATURES = [
  {
    id: 'shell-top',
    piece: 'shellTop',
    direction: [-2.6, 1.6, 0.8],
    eyebrow: 'Virsčaumala',
    title: 'Rokām veidots, ne štancēts',
    body: 'Katra čaumala tiek pipota ar roku un žāvēta 24 stundas pirms cepšanas — tāpēc katrā makarūnā ir sava, nelīdzena, dzīva forma.',
  },
  {
    id: 'shell-bottom',
    piece: 'shellBottom',
    direction: [2.6, 1.4, -0.6],
    eyebrow: 'Apakšējā čaumala',
    title: 'Franču mandeļu milti',
    body: 'Tikai smalki maltas franču mandeles un dabīgi pigmenti — bez mākslīgo krāsvielu pēcgaršas, bez saīsinājumiem receptē.',
  },
  {
    id: 'filling',
    piece: 'filling',
    direction: [0, -2.4, 1.6],
    eyebrow: 'Pildījums',
    title: 'Katra garša — sava kompozīcija',
    body: 'Ganāša, krēms vai augļu konfitūra tiek veidota katrai garšai atsevišķi, lai pildījums un čaumala sabalansētos, nevis konkurētu.',
  },
  {
    id: 'crumb-rose',
    piece: 'crumbRose',
    direction: [-2.2, -1.8, -1.4],
    eyebrow: 'Rozes smarža',
    title: 'Pēc tavas pasūtījuma',
    body: 'Izvēlies garšas, krāsas un daudzumu savā kastītē — katrs pasūtījums tiek komplektēts individuāli, ne no gatavas veidnes.',
  },
  {
    id: 'crumb-pistachio',
    piece: 'crumbPistachio',
    direction: [2.4, -1.2, 1.8],
    eyebrow: 'Pistācijas notis',
    title: 'Dāvanu ateljē',
    body: 'Kāzām, dzimšanas dienām, korporatīvām dāvanām — kastīte tiek noformēta atbilstoši reizei, ne pēc vienas veidnes visiem.',
  },
  {
    id: 'crumb-cocoa',
    piece: 'crumbCocoa',
    direction: [0.2, 2.6, -1.8],
    eyebrow: 'Kakao skaidiņas',
    title: 'Svaigi, ne no saldētavas',
    body: 'Makarūni tiek cepti pasūtījuma nedēļā un piegādāti Rīgā tajā pašā vai nākamajā dienā — nekad no ilgtermiņa krājuma.',
  },
]
