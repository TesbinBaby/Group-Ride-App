// Material 3 tokens for Group Ride
// One accent seed; derive primary/container colors from it.
// Uses oklch so swapping seed hue re-tints the whole app.

const SEEDS = {
  teal:   { hue: 190, name: 'Teal' },
  orange: { hue: 42,  name: 'Sunset' },
  hivis:  { hue: 90,  name: 'Hi-Vis' },
  forest: { hue: 150, name: 'Forest' },
  royal:  { hue: 260, name: 'Royal' },
};

function m3(seedKey, dark) {
  const h = SEEDS[seedKey].hue;
  const c = 0.12;           // chroma for primaries
  const cLow = 0.04;        // low-chroma for surfaces
  if (dark) return {
    primary:          `oklch(0.82 ${c} ${h})`,
    onPrimary:        `oklch(0.22 ${c} ${h})`,
    primaryContainer: `oklch(0.38 ${c} ${h})`,
    onPrimaryContainer:`oklch(0.92 ${c*0.6} ${h})`,
    secondary:        `oklch(0.80 ${c*0.4} ${h+10})`,
    secondaryContainer:`oklch(0.32 ${c*0.4} ${h+10})`,
    tertiary:         `oklch(0.80 ${c*0.6} ${(h+60)%360})`,
    tertiaryContainer:`oklch(0.32 ${c*0.5} ${(h+60)%360})`,
    surface:          `oklch(0.16 ${cLow*0.5} ${h})`,
    surfaceDim:       `oklch(0.12 ${cLow*0.5} ${h})`,
    surfaceBright:    `oklch(0.24 ${cLow*0.5} ${h})`,
    surfaceContainerLowest: `oklch(0.10 ${cLow*0.5} ${h})`,
    surfaceContainerLow:  `oklch(0.18 ${cLow*0.5} ${h})`,
    surfaceContainer:     `oklch(0.21 ${cLow*0.5} ${h})`,
    surfaceContainerHigh: `oklch(0.24 ${cLow*0.5} ${h})`,
    surfaceContainerHighest:`oklch(0.28 ${cLow*0.5} ${h})`,
    onSurface:        `oklch(0.93 ${cLow*0.3} ${h})`,
    onSurfaceVariant: `oklch(0.78 ${cLow*0.4} ${h})`,
    outline:          `oklch(0.60 ${cLow*0.5} ${h})`,
    outlineVariant:   `oklch(0.36 ${cLow*0.5} ${h})`,
    scrim:            '#000',
    error:            'oklch(0.72 0.18 25)',
    errorContainer:   'oklch(0.36 0.14 25)',
    success:          'oklch(0.78 0.14 145)',
    warn:             'oklch(0.80 0.16 75)',
    // map
    mapBg:            `oklch(0.19 0.01 ${h})`,
    mapLand:          `oklch(0.22 0.015 ${h+20})`,
    mapWater:         `oklch(0.28 0.05 240)`,
    mapRoadMajor:     `oklch(0.55 0.01 ${h})`,
    mapRoadMinor:     `oklch(0.34 0.008 ${h})`,
    mapRouteLine:     `oklch(0.82 ${c} ${h})`,
    mapLabel:         `oklch(0.78 0.01 ${h})`,
  };
  // light
  return {
    primary:          `oklch(0.52 ${c} ${h})`,
    onPrimary:        `#fff`,
    primaryContainer: `oklch(0.90 ${c*0.5} ${h})`,
    onPrimaryContainer:`oklch(0.22 ${c} ${h})`,
    secondary:        `oklch(0.50 ${c*0.35} ${h+10})`,
    secondaryContainer:`oklch(0.90 ${c*0.2} ${h+10})`,
    tertiary:         `oklch(0.55 ${c*0.6} ${(h+60)%360})`,
    tertiaryContainer:`oklch(0.92 ${c*0.4} ${(h+60)%360})`,
    surface:          `oklch(0.985 ${cLow*0.2} ${h})`,
    surfaceDim:       `oklch(0.90 ${cLow*0.3} ${h})`,
    surfaceBright:    `oklch(0.99 ${cLow*0.2} ${h})`,
    surfaceContainerLowest: `#fff`,
    surfaceContainerLow:  `oklch(0.97 ${cLow*0.3} ${h})`,
    surfaceContainer:     `oklch(0.95 ${cLow*0.4} ${h})`,
    surfaceContainerHigh: `oklch(0.93 ${cLow*0.4} ${h})`,
    surfaceContainerHighest:`oklch(0.91 ${cLow*0.4} ${h})`,
    onSurface:        `oklch(0.17 ${cLow*0.3} ${h})`,
    onSurfaceVariant: `oklch(0.38 ${cLow*0.4} ${h})`,
    outline:          `oklch(0.55 ${cLow*0.4} ${h})`,
    outlineVariant:   `oklch(0.82 ${cLow*0.3} ${h})`,
    scrim:            '#000',
    error:            'oklch(0.52 0.2 25)',
    errorContainer:   'oklch(0.92 0.08 25)',
    success:          'oklch(0.52 0.14 145)',
    warn:             'oklch(0.65 0.16 60)',
    // map
    mapBg:            `oklch(0.95 0.008 ${h+20})`,
    mapLand:          `oklch(0.955 0.01 ${h+25})`,
    mapWater:         `oklch(0.86 0.04 230)`,
    mapRoadMajor:     `#fff`,
    mapRoadMinor:     `oklch(0.98 0 0)`,
    mapRouteLine:     `oklch(0.52 ${c} ${h})`,
    mapLabel:         `oklch(0.35 0.01 ${h})`,
  };
}

// Material 3 typography (Roboto Flex-ish). Pixel sizes per M3 spec.
const TYPE = {
  displayL:   { fontSize: 57, lineHeight: '64px', letterSpacing: -0.25, fontWeight: 400 },
  displayM:   { fontSize: 45, lineHeight: '52px', fontWeight: 400 },
  displayS:   { fontSize: 36, lineHeight: '44px', fontWeight: 400 },
  headlineL:  { fontSize: 32, lineHeight: '40px', fontWeight: 400 },
  headlineM:  { fontSize: 28, lineHeight: '36px', fontWeight: 400 },
  headlineS:  { fontSize: 24, lineHeight: '32px', fontWeight: 500 },
  titleL:     { fontSize: 22, lineHeight: '28px', fontWeight: 500 },
  titleM:     { fontSize: 16, lineHeight: '24px', fontWeight: 500, letterSpacing: 0.15 },
  titleS:     { fontSize: 14, lineHeight: '20px', fontWeight: 500, letterSpacing: 0.1 },
  bodyL:      { fontSize: 16, lineHeight: '24px', fontWeight: 400, letterSpacing: 0.15 },
  bodyM:      { fontSize: 14, lineHeight: '20px', fontWeight: 400, letterSpacing: 0.25 },
  bodyS:      { fontSize: 12, lineHeight: '16px', fontWeight: 400, letterSpacing: 0.4 },
  labelL:     { fontSize: 14, lineHeight: '20px', fontWeight: 500, letterSpacing: 0.1 },
  labelM:     { fontSize: 12, lineHeight: '16px', fontWeight: 500, letterSpacing: 0.5 },
  labelS:     { fontSize: 11, lineHeight: '16px', fontWeight: 500, letterSpacing: 0.5 },
};

const ELEVATION = {
  1: '0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)',
  2: '0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)',
  3: '0 1px 3px rgba(0,0,0,0.3), 0 4px 8px 3px rgba(0,0,0,0.15)',
  4: '0 2px 3px rgba(0,0,0,0.3), 0 6px 10px 4px rgba(0,0,0,0.15)',
  5: '0 4px 4px rgba(0,0,0,0.3), 0 8px 12px 6px rgba(0,0,0,0.15)',
};

// Fixed cast — 20 possible riders but we only show as many as riderCount.
const ROSTER = [
  { id: 'you',   name: 'You',      initial: 'Y', role: 'lead',  color: 'oklch(0.70 0.18 30)',  speed: 58, battery: 88, status: 'riding' },
  { id: 'marcus',name: 'Marcus',   initial: 'M', role: 'rider', color: 'oklch(0.72 0.15 280)', speed: 55, battery: 72, status: 'riding' },
  { id: 'priya', name: 'Priya',    initial: 'P', role: 'rider', color: 'oklch(0.78 0.14 140)', speed: 52, battery: 64, status: 'riding' },
  { id: 'sana',  name: 'Sana',     initial: 'S', role: 'newbie',color: 'oklch(0.72 0.15 50)',  speed: 48, battery: 91, status: 'riding', tag: 'New rider' },
  { id: 'dev',   name: 'Dev',      initial: 'D', role: 'rider', color: 'oklch(0.66 0.17 15)',  speed: 60, battery: 55, status: 'riding' },
  { id: 'ayo',   name: 'Ayo',      initial: 'A', role: 'sweep', color: 'oklch(0.68 0.14 220)', speed: 54, battery: 80, status: 'riding' },
  // extras for 20-rider tweak
  { id: 'jin',   name: 'Jin',      initial: 'J', role: 'rider', color: 'oklch(0.74 0.12 320)', speed: 56, battery: 60, status: 'riding' },
  { id: 'ravi',  name: 'Ravi',     initial: 'R', role: 'rider', color: 'oklch(0.70 0.15 100)', speed: 53, battery: 77, status: 'riding' },
  { id: 'elena', name: 'Elena',    initial: 'E', role: 'rider', color: 'oklch(0.74 0.15 350)', speed: 57, battery: 69, status: 'riding' },
  { id: 'tomas', name: 'Tomas',    initial: 'T', role: 'rider', color: 'oklch(0.64 0.15 200)', speed: 59, battery: 48, status: 'riding' },
  { id: 'mira',  name: 'Mira',     initial: 'M', role: 'rider', color: 'oklch(0.76 0.13 60)',  speed: 55, battery: 82, status: 'riding' },
  { id: 'kai',   name: 'Kai',      initial: 'K', role: 'rider', color: 'oklch(0.70 0.14 170)', speed: 58, battery: 75, status: 'riding' },
  { id: 'zoe',   name: 'Zoe',      initial: 'Z', role: 'rider', color: 'oklch(0.72 0.16 330)', speed: 51, battery: 58, status: 'riding' },
  { id: 'omar',  name: 'Omar',     initial: 'O', role: 'rider', color: 'oklch(0.68 0.14 250)', speed: 54, battery: 86, status: 'riding' },
  { id: 'ben',   name: 'Ben',      initial: 'B', role: 'rider', color: 'oklch(0.66 0.16 20)',  speed: 56, battery: 71, status: 'riding' },
  { id: 'nia',   name: 'Nia',      initial: 'N', role: 'rider', color: 'oklch(0.72 0.15 130)', speed: 52, battery: 63, status: 'riding' },
  { id: 'leo',   name: 'Leo',      initial: 'L', role: 'rider', color: 'oklch(0.74 0.12 290)', speed: 55, battery: 79, status: 'riding' },
  { id: 'amir',  name: 'Amir',     initial: 'A', role: 'rider', color: 'oklch(0.70 0.15 180)', speed: 53, battery: 66, status: 'riding' },
  { id: 'saki',  name: 'Saki',     initial: 'S', role: 'rider', color: 'oklch(0.76 0.13 40)',  speed: 57, battery: 74, status: 'riding' },
  { id: 'raul',  name: 'Raul',     initial: 'R', role: 'rider', color: 'oklch(0.68 0.14 260)', speed: 54, battery: 68, status: 'riding' },
];

Object.assign(window, { SEEDS, m3, TYPE, ELEVATION, ROSTER });
