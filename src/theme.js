import { themeFromSourceColor, argbFromHex, hexFromArgb } from '@material/material-color-utilities';

export const SEEDS = {
  teal:   { hue: 190, name: 'Teal', hex: '#007a83' },
  orange: { hue: 42,  name: 'Sunset', hex: '#d97d00' },
  hivis:  { hue: 90,  name: 'Hi-Vis', hex: '#7fb800' },
  forest: { hue: 150, name: 'Forest', hex: '#008c4a' },
  royal:  { hue: 260, name: 'Royal', hex: '#6200ee' },
};

export function generateM3Theme(seedKey, isDark) {
  const seedHex = SEEDS[seedKey].hex;
  const theme = themeFromSourceColor(argbFromHex(seedHex));
  const scheme = isDark ? theme.schemes.dark : theme.schemes.light;
  
  const toVar = (name, argb) => `--md-sys-color-${name}: ${hexFromArgb(argb)};`;
  const toCss = (name, val) => `--md-sys-color-${name}: ${val};`;

  // We map the MCU scheme to CSS variables, plus some custom map/app colors from the design handoff.
  const customColors = isDark ? {
    success: 'oklch(0.78 0.14 145)',
    warn: 'oklch(0.80 0.16 75)',
    mapBg: `oklch(0.19 0.01 ${SEEDS[seedKey].hue})`,
    mapLand: `oklch(0.22 0.015 ${SEEDS[seedKey].hue+20})`,
    mapWater: `oklch(0.28 0.05 240)`,
    mapRoadMajor: `oklch(0.55 0.01 ${SEEDS[seedKey].hue})`,
    mapRoadMinor: `oklch(0.34 0.008 ${SEEDS[seedKey].hue})`,
    mapRouteLine: hexFromArgb(scheme.primary),
    mapLabel: `oklch(0.78 0.01 ${SEEDS[seedKey].hue})`,
  } : {
    success: 'oklch(0.52 0.14 145)',
    warn: 'oklch(0.65 0.16 60)',
    mapBg: `oklch(0.95 0.008 ${SEEDS[seedKey].hue+20})`,
    mapLand: `oklch(0.955 0.01 ${SEEDS[seedKey].hue+25})`,
    mapWater: `oklch(0.86 0.04 230)`,
    mapRoadMajor: `#fff`,
    mapRoadMinor: `oklch(0.98 0 0)`,
    mapRouteLine: hexFromArgb(scheme.primary),
    mapLabel: `oklch(0.35 0.01 ${SEEDS[seedKey].hue})`,
  };

  const cssVars = [
    toVar('primary', scheme.primary),
    toVar('on-primary', scheme.onPrimary),
    toVar('primary-container', scheme.primaryContainer),
    toVar('on-primary-container', scheme.onPrimaryContainer),
    toVar('secondary', scheme.secondary),
    toVar('on-secondary', scheme.onSecondary),
    toVar('secondary-container', scheme.secondaryContainer),
    toVar('on-secondary-container', scheme.onSecondaryContainer),
    toVar('tertiary', scheme.tertiary),
    toVar('on-tertiary', scheme.onTertiary),
    toVar('tertiary-container', scheme.tertiaryContainer),
    toVar('on-tertiary-container', scheme.onTertiaryContainer),
    toVar('error', scheme.error),
    toVar('on-error', scheme.onError),
    toVar('error-container', scheme.errorContainer),
    toVar('on-error-container', scheme.onErrorContainer),
    toVar('background', scheme.background),
    toVar('on-background', scheme.onBackground),
    toVar('surface', scheme.surface),
    toVar('on-surface', scheme.onSurface),
    toVar('surface-variant', scheme.surfaceVariant),
    toVar('on-surface-variant', scheme.onSurfaceVariant),
    toVar('outline', scheme.outline),
    toVar('outline-variant', scheme.outlineVariant),
    toVar('shadow', scheme.shadow),
    toVar('scrim', scheme.scrim),
    toVar('inverse-surface', scheme.inverseSurface),
    toVar('inverse-on-surface', scheme.inverseOnSurface),
    toVar('inverse-primary', scheme.inversePrimary),
    // Material 3.1 surface container roles (MCU supports them partially, but we will add them manually using palette if missing)
    toVar('surface-dim', isDark ? theme.palettes.neutral.tone(6) : theme.palettes.neutral.tone(87)),
    toVar('surface-bright', isDark ? theme.palettes.neutral.tone(24) : theme.palettes.neutral.tone(98)),
    toVar('surface-container-lowest', isDark ? theme.palettes.neutral.tone(4) : theme.palettes.neutral.tone(100)),
    toVar('surface-container-low', isDark ? theme.palettes.neutral.tone(10) : theme.palettes.neutral.tone(96)),
    toVar('surface-container', isDark ? theme.palettes.neutral.tone(12) : theme.palettes.neutral.tone(94)),
    toVar('surface-container-high', isDark ? theme.palettes.neutral.tone(17) : theme.palettes.neutral.tone(92)),
    toVar('surface-container-highest', isDark ? theme.palettes.neutral.tone(22) : theme.palettes.neutral.tone(90)),
  ];

  for (const [key, val] of Object.entries(customColors)) {
    cssVars.push(toCss(key, val));
  }

  return cssVars.join('\n');
}

export const TYPE = {
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

export const ELEVATION = {
  1: '0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)',
  2: '0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)',
  3: '0 1px 3px rgba(0,0,0,0.3), 0 4px 8px 3px rgba(0,0,0,0.15)',
  4: '0 2px 3px rgba(0,0,0,0.3), 0 6px 10px 4px rgba(0,0,0,0.15)',
  5: '0 4px 4px rgba(0,0,0,0.3), 0 8px 12px 6px rgba(0,0,0,0.15)',
};

export const ROSTER = [
  { id: 'you',   name: 'You',      initial: 'Y', role: 'lead',  color: 'oklch(0.70 0.18 30)',  speed: 58, battery: 88, status: 'riding' },
  { id: 'marcus',name: 'Marcus',   initial: 'M', role: 'rider', color: 'oklch(0.72 0.15 280)', speed: 55, battery: 72, status: 'riding' },
  { id: 'priya', name: 'Priya',    initial: 'P', role: 'rider', color: 'oklch(0.78 0.14 140)', speed: 52, battery: 64, status: 'riding' },
  { id: 'sana',  name: 'Sana',     initial: 'S', role: 'newbie',color: 'oklch(0.72 0.15 50)',  speed: 48, battery: 91, status: 'riding', tag: 'New rider' },
  { id: 'dev',   name: 'Dev',      initial: 'D', role: 'rider', color: 'oklch(0.66 0.17 15)',  speed: 60, battery: 55, status: 'riding' },
  { id: 'ayo',   name: 'Ayo',      initial: 'A', role: 'sweep', color: 'oklch(0.68 0.14 220)', speed: 54, battery: 80, status: 'riding' },
  // Extras
  { id: 'jin',   name: 'Jin',      initial: 'J', role: 'rider', color: 'oklch(0.74 0.12 320)', speed: 56, battery: 60, status: 'riding' },
];
