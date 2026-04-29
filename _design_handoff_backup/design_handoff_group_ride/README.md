# Handoff: Group Ride

A Material 3 mobile app for motorcycle riders to plan group rides, navigate together, and stay together on the road. Designed for both iOS and Android.

## About the Design Files

The files in `reference/` and `Group Ride.html` are **design references created in HTML/React-in-Babel**. They are prototypes showing intended look, layout, and behavior — **not production code to copy verbatim**. Your task is to **recreate these designs in the target codebase's existing environment** (React Native, Flutter, SwiftUI + Jetpack Compose, etc.), using its established patterns, components, navigation, and state management. If no environment exists yet, pick the most appropriate cross-platform framework (recommended: **React Native** with `react-native-paper` or **Flutter** with Material 3 widgets — both have first-class M3 support).

The map in the prototype is hand-rolled SVG. **In production, use a real map SDK** (Mapbox, Google Maps, or Apple MapKit). Match the prototype's *visual treatment* (route line weight, rider pin style, breadcrumb dots, label hierarchy) — not its SVG implementation.

## Fidelity

**High-fidelity.** Final colors (oklch-derived from a single seed hue), Material 3 typography scale, M3 component specs (corner radii, elevation, state layers), exact spacing. Recreate pixel-perfectly using the codebase's component library where possible; only the map rendering itself should be re-implemented against a real map SDK.

## Tech assumptions

- **Design system:** Material 3 (Material You), dynamic color from a single seed hue.
- **Typography:** Roboto Flex (variable). Roboto Mono for the invite code.
- **Color model:** All colors in the prototype use `oklch()` and are derived from a seed hue + the M3 tonal palette algorithm. In production, generate the full tonal palette using Material's HCT/Material Color Utilities (`@material/material-color-utilities`) so iOS/Android stay in sync.
- **Map:** Mapbox GL Native or Google Maps. Custom style JSON to match the design's land/water/road treatment.
- **Real-time:** WebSocket or Firebase Realtime DB for rider positions; ~2s update cadence; client-side interpolation between updates.

---

## Screens

The prototype contains **9 screens**, each rendered in both an iOS and an Android frame. Layout structure is identical across platforms; chrome (status bar, app bar, nav) follows each platform's conventions.

### 1. Group Home (`home`)
**Purpose:** Landing screen for a group. See the next ride at a glance, members, upcoming rides, and a teaser for the group's signature feature.

- **App bar:** standard M3 small top app bar (56 height); back + overflow.
- **Hero card** (`primaryContainer` background, 12px radius):
  - Eyebrow: "SATURDAY · 07:30" (labelM, uppercase, 70% opacity).
  - Title: "The Coast Run" (headlineM).
  - Sub: "Bayview Depot → Harbor Point · 184 km · 4 stops" (bodyM, 75% opacity).
  - Embedded mini-map (100h, 12px radius, `surface` bg, route as a single curved stroke).
  - Avatar stack (5 avatars, 30px, -10px overlap, 3px ring in container color, "+N" pill if more) + "View route" tonal button on `surface`.
- **Members list** (Card, `surfaceContainerHighest`, 12px radius):
  - 40px avatars, name + role badge (LEAD / SWEEP / NEW RIDER) + "Ride captain"/"Tail"/"Rider" subline.
  - Role badges: 6px radius pill, labelS uppercase, 0.6 letter-spacing. LEAD/SWEEP use `primaryContainer`; NEW RIDER uses `tertiaryContainer`.
- **Upcoming rides:** day/date tile (48×48, 12px radius) + title + meta + chevron.
- **Signature teaser:** `tertiaryContainer` card with icon-on-`surface` square, title + body.
- **FAB (Android only):** Extended FAB ("Start ride", 56 high, 16px radius, `primaryContainer`, elevation 3), bottom-right, 16px margin.

### 2. Live Map — A: Squad Radar (`mapA`) — Variation A
**Purpose:** Classic top-down map view with all riders pinned, breadcrumb trail, and a docked bottom sheet showing the active turn + rider chips.

- **Full-bleed map** with the planned route line (`primary` color, 4.5px stroke, soft glow), riders as colored teardrop circles with white initials, and a breadcrumb of dots showing the path already ridden.
- **Top status pill:** white card, `surfaceContainerLowest`, 22px radius, elevation 2 — pulsing live dot, ride name, distance progress (`Math.round(t * 184) / 184 km`), overflow icon.
- **Conditional regroup banner** (only when `signatureFeature === 'leadSweep'`): `errorContainer` bg, alert icon, "Sana is 1.2 km behind" + "Slow" outlined button.
- **Side controls (right edge):** stacked 44×44 squircle FABs, 16px radius — compass / people / volume.
- **Bottom sheet** (28px top radius, elevation 3, `surfaceContainerLow`):
  - Drag handle (32×4, 50% opacity).
  - Active turn row: 56px square primary tile with arrow + "In 420 m" headline + "Right onto Seagull Ridge" body + mute icon button.
  - Rider chips (horizontal scroll): 100px wide chip — avatar + name + battery glyph + speed.
  - Quick-action row: Ping / Break / Fuel — three tonal buttons, equal flex.

### 3. Live Map — B: Convoy Strip (`mapB`) — Variation B (novel)
**Purpose:** Same data, different mental model. Top half is a smaller follow-the-lead map; bottom half is a horizontal "convoy strip" showing every rider's longitudinal position along the route. Best for understanding *spread* at a glance.

- **App bar:** standard back + ride name + "X km in · ETA HH:MM".
- **Map (460h iOS / 440h Android):** 24px radius, elevation 1, follow-lead camera at 1.8× zoom. Floating next-turn pill (top-left): primary bg, 18px radius, 36px square sub-icon with arrow + "420 m" / "Right · Seagull Ridge".
- **Convoy strip** (`surfaceContainer`, 20px radius, 24px top / 40px bottom padding):
  - Track: full-width 6px-tall pill, 3px radius, `surfaceContainerHighest`. Filled portion (start → leader) in `primary`.
  - Waypoints: 10px circles on the track, `surface` fill + 2px outline.
  - Riders: 30px avatars positioned along the strip by their `t` value, alternating top/bottom of the track with a 1.5px connector line. "You" gets a `primary` ring.
  - Range labels (top-left/top-right): start/end km of the visible window in labelS.

### 4. Plan Ride (`plan`)
**Purpose:** Build a new ride — name, route preview, ordered stops, invitee list.

- **Header:** "NEW RIDE" eyebrow + editable headlineM title input + date/time bodyM.
- **Route preview map:** 220h, 24px radius, no rider pins, no breadcrumb.
- **Stops:** vertical timeline. 56×56 tile (`primary` for start/end, `surfaceContainerHigh` for stops) with kind icon (flag / coffee / fuel / star / mapPin). Vertical 2px connector line in `outlineVariant`. Each row: kind label (uppercase, labelS) + name + "X km · HH:MM" + drag handle.
- **Riders invited list:** 36px avatar + name + status text + status dot. Status dot colors: Going = `success`, Maybe = `warn`, Pending = `onSurfaceVariant`.
- **Footer actions:** "Save draft" outlined + "Send invites" filled (flex 1 : 2).

### 5. Turn-by-Turn Navigation (`nav`)
**Purpose:** Active navigation. Big, glanceable instruction; minimal chrome.

- **Top instruction card** (`primary` bg, 28px radius, elevation 3, 16px side margins):
  - 72×72 sub-tile (20px radius, 13% white bg) with bold turn arrow.
  - "420 m" — displayS, weight 500.
  - "Right · Seagull Ridge" — titleM, 85% opacity.
  - Group context strip below: 13% white bg, 14px radius, people icon + "Group stays together here — next turn in 6.4 km".
- **Map** fills the rest (full-bleed under the cards, follow-lead camera, breadcrumb on).
- **Bottom ETA card** (`surfaceContainerLowest`, 24px radius, elevation 2): ETA "14:22" + "ETA · 2h 14m left" (left) | "124 km" + "to Harbor Point" (right) | red close icon button to end nav.

### 6. Chat + Voice Ping (`chat`)
**Purpose:** Group comms while riding. Voice messages are first-class.

- **Header:** back + 32px avatar trio (-8px overlap, 2px `surface` ring) + "The Coast Run" title + "X members · all live" sub + voice icon button.
- **Message list:**
  - Other people: 28px avatar, bubble `surfaceContainerHigh`, 18/18/18/4 radius, sender name in `tertiary` labelS above body.
  - Mine: bubble `primary` / `onPrimary`, 18/18/4/18 radius, no name.
  - System messages: centered pill, `surfaceContainer`, bodyS.
  - **Voice messages**: play icon + waveform (14 bars, varying heights, played portion full opacity) + duration. Built once, used for any voice message.
- **Composer:** + icon button (`surfaceContainerHigh`) + pill text field (`surfaceContainer`, 22px radius, 44h) + mic icon button (`primary` bg, white icon).

### 7. Regroup at Stop (`regroup`)
**Purpose:** Coordination at a rest stop — who's arrived, who's still incoming, when to roll out.

- **Header:** "REGROUP" eyebrow (tertiary, uppercase) + "Drift Coffee" headlineM + "Stop 3 of 5 · 82 km in" sub.
- **Status card** (`secondaryContainer`, 12px radius): 44px primary check circle + "X of N arrived" titleM + "Sweep 6 min out · Sana 11 min out" sub. 8px progress bar at bottom (`surface` track, `primary` fill).
- **Arrivals list:** for each rider — avatar + name + "Arrived · X min ago" or "X min out · Y km/h". Trailing: green check (arrived) or "ETA" warn label (incoming).
- **Footer:** "Extend stop" outlined + "Roll out" filled.

### 8. Invite (`invite`)
**Purpose:** Add riders to a planned ride.

- **Header:** close + centered "Invite riders" title.
- **Body:** "The Coast Run" headlineS + "Share this code or scan to join" sub.
- **QR card:** 200×200, 24px radius, 16px padding, elevation 1. Use a real QR library in production (e.g. `qrcode.react`). The mock uses a stylized 17×17 pattern with three rounded finder corners.
- **Code chip:** centered pill, `primaryContainer`, 16px radius, headlineS in Roboto Mono, 8px letter-spacing — e.g. "RIDE · 7K3M".
- **Recents:** card list — 36px avatar + name + "Rode together 2 weeks ago" + "Invite" outlined button (32h).
- **Footer:** "Copy link" outlined + "Share" filled.

### 9. Post-Ride Recap (`recap`)
**Purpose:** Celebrate the ride. Stats, group cohesion chart, rider board.

- **Hero:** `primaryContainer` 28px radius card. "RIDE COMPLETE" eyebrow + "The Coast Run" displayS (weight 500) + "Saturday · 6h 52m" + 120h embedded mini-map.
- **Stats grid:** 2×2, 10px gap. Each cell: label (uppercase, labelM, onSurfaceVariant) + value (headlineM, 500) + unit (bodyS). Stats: Distance 184 km / Moving time 4:38 hrs / Avg speed 52 km/h / Elevation 1,210 m.
- **Group cohesion card:** "94%" displayS in `primary` + "together time" body + sparkline (14 sample points, primary stroke, 15% primary fill area) + "Max spread 1.8 km (near Miller's Cove)" footnote.
- **Rider board:** card per rider — avatar + name + "Xkm/h avg · Y km" + role pill (`tertiaryContainer` bg, `tertiary` text, 8px radius): "Lead / Smooth / Fast / Steady / New PR / Sweep".

---

## Cross-cutting components

### Bottom navigation (Material 3)
- 80px tall, `surfaceContainer` bg, 1px `outlineVariant` top border, 12px top / 16px bottom padding.
- 4 tabs: **Group** (people), **Live** (mapPin), **Plan** (route), **Chat** (chat).
- Selected tab: 64×32 pill in `secondaryContainer` around the icon, label in `onSurface`.
- Unselected: transparent pill, icon + label in `onSurfaceVariant`.

### Avatar
- Color-per-rider (saved on the rider record). White initials. Optional 3px outer ring (used to highlight "You" or to separate against same-color backgrounds — actually rendered as `0 0 0 3px surface, 0 0 0 5px ring`).

### Buttons (M3 spec)
| Style | Height | Padding | Radius | Bg | Fg |
|---|---|---|---|---|---|
| Filled | 40 | 0 24 | 20 | `primary` | `onPrimary` |
| Tonal | 40 | 0 24 (16 if leading icon) | 20 | `secondaryContainer` | `onPrimaryContainer` |
| Outlined | 40 | 0 24 | 20 | transparent + 1px `outline` | `primary` |
| Text | 40 | 0 12 | 20 | transparent | `primary` |
| Icon | 40 | — | 20 (full) | optional | `onSurface` |
| FAB | 56 | 0 16 | 16 | `primaryContainer` | `onPrimaryContainer` (elev 3) |

All buttons get `transform: scale(0.97)` on `:active` for press feedback (100ms).

### Chip
32px tall, 8px radius, labelL. Selected = `secondaryContainer` + `onPrimaryContainer` (no border). Unselected = transparent + 1px `outline` + `onSurfaceVariant`.

### Card
12px radius. Default bg `surfaceContainerHighest`. Elevated variant uses `surfaceContainerLow` + elevation 1.

### Bottom sheet (docked)
28px top radius, `surfaceContainerLow`, elevation 3. 32×4 drag handle (50% `onSurfaceVariant`), 8px top / 12px bottom of handle.

---

## Design tokens

### Color (M3, derived from a seed hue via oklch)

The prototype supports five accent seeds. **In production, generate full tonal palettes from the seed using Material Color Utilities** rather than the lightweight oklch approximation in `tokens.jsx`.

| Seed | Hue |
|---|---|
| Teal (default) | 190 |
| Sunset | 42 |
| Hi-Vis | 90 |
| Forest | 150 |
| Royal | 260 |

Roles used (light theme, teal seed shown for reference):

| Role | Approx |
|---|---|
| primary | oklch(0.52 0.12 190) ≈ #007a83 |
| onPrimary | #ffffff |
| primaryContainer | oklch(0.90 0.06 190) ≈ #b9ebee |
| onPrimaryContainer | oklch(0.22 0.12 190) ≈ #003133 |
| secondary / secondaryContainer | hue-shifted +10, lower chroma |
| tertiary / tertiaryContainer | hue +60 |
| surface | oklch(0.985 0.002 190) ≈ #f7fbfb |
| surfaceContainerLowest..Highest | 5 steps from 1.00 → 0.91 lightness |
| onSurface | oklch(0.17 0.003 190) ≈ #0e1818 |
| onSurfaceVariant | oklch(0.38 0.005 190) ≈ #3d4849 |
| outline / outlineVariant | 0.55 / 0.82 lightness |
| error / errorContainer | hue 25, standard M3 |
| success | oklch(0.52 0.14 145) (custom — used for arrival/Going dots) |
| warn | oklch(0.65 0.16 60) (custom — used for ETA/Maybe) |

Dark theme: same hues, lightness inverted per M3 dark spec. See `reference/tokens.jsx` for exact values.

### Map colors (per theme)
- `mapBg`, `mapLand`, `mapWater`, `mapRoadMajor` (white/light), `mapRoadMinor`, `mapRouteLine` (= `primary`), `mapLabel`. When integrating with Mapbox/Google, generate a style JSON from these.

### Typography (Material 3 scale, Roboto Flex)
| Token | px / lh / weight |
|---|---|
| displayL | 57 / 64 / 400, ls -0.25 |
| displayM | 45 / 52 / 400 |
| displayS | 36 / 44 / 400 |
| headlineL | 32 / 40 / 400 |
| headlineM | 28 / 36 / 400 |
| headlineS | 24 / 32 / 500 |
| titleL | 22 / 28 / 500 |
| titleM | 16 / 24 / 500, ls 0.15 |
| titleS | 14 / 20 / 500, ls 0.1 |
| bodyL | 16 / 24 / 400, ls 0.15 |
| bodyM | 14 / 20 / 400, ls 0.25 |
| bodyS | 12 / 16 / 400, ls 0.4 |
| labelL | 14 / 20 / 500, ls 0.1 |
| labelM | 12 / 16 / 500, ls 0.5 |
| labelS | 11 / 16 / 500, ls 0.5 |

### Spacing
4-point base scale. Common values: 4, 8, 10, 12, 14, 16, 20, 24, 28. Card padding standard = 16. Screen edge gutters = 16.

### Radius
4 (small chips/dots), 8 (chips), 12 (cards, tiles), 14, 16 (FAB, hero tiles), 20 (buttons, sheets), 22, 24 (large cards, map containers), 28 (bottom sheet top, hero recap card), 50% (avatars, dots).

### Elevation
Standard M3 levels 1–5. See `reference/tokens.jsx` `ELEVATION`.

---

## Interactions & behavior

- **Auto-advance on Live + Nav screens:** lead rider's `t` increments every ~120ms in the prototype to make the map feel alive. In production, drive this from real GPS updates, interpolated client-side.
- **Group cohesion banner:** in the prototype, "Sana is 1.2 km behind" is shown when `signatureFeature === 'leadSweep'`. Real logic: trigger when sweep–lead distance > threshold (default 1 km, user-configurable).
- **Voice ping:** mic button on chat header & map sheet. In production: WebRTC, helmet-bluetooth-friendly low-latency.
- **Breadcrumb:** dotted trail behind the lead rider, fading toward the start. Implementation: store the lead's GPS history as a polyline, render every Nth point.
- **Press feedback:** `transform: scale(0.97)` on `:active`, 100ms.
- **Live dot:** pulses (`opacity 0.7→0.25, scale 1→1.4`, 1.6s ease-in-out infinite).
- **Status dots:** Going = success, Maybe = warn, Pending = onSurfaceVariant.

## State

Per-group state needed:
- `ride` — { id, name, date, route (waypoints + polyline), invitees }
- `riders` — [{ id, name, color, role: 'lead' | 'sweep' | 'rider' | 'newbie', position: {lat, lng, t}, speed, battery, status }]
- `me` — current user id
- `chat` — [{ id, fromId, kind: 'text'|'voice'|'system', text|audioUrl, sentAt }]

App-level config (the prototype's tweaks):
- `seedKey` — current accent
- `dark` — boolean
- `mapStyle` — 'realistic' | 'stylized' | 'schematic' (in production: 2 styles probably enough — day/night or detailed/minimal)

## Assets

- **Fonts:** Roboto Flex (Google Fonts), Roboto Mono (invite code only).
- **Icons:** prototype uses a custom monoline 24px set (see `Icon` in `reference/primitives.jsx`). In production, use **Material Symbols** (rounded, weight 400, fill 0 → 1 for selected). Mapping: `mapPin` → `location_on`, `bike` → `motorcycle`, `nav` → `navigation`, etc.
- **Map tiles:** Mapbox or Google Maps; build a custom style to match the visual treatment.
- **No proprietary art** is used; rider avatars in the mocks are colored initial circles. The production app will use real user-uploaded avatars + the same color-per-rider as a fallback.

## Files in this bundle

```
design_handoff_group_ride/
├── README.md                  ← this file
├── Group Ride.html            ← open in a browser to see all 9 screens × 2 platforms
└── reference/
    ├── tokens.jsx             ← exact token values (color/type/elevation/roster)
    ├── primitives.jsx         ← M3 components (buttons, FAB, chip, card, avatar, sheet, segmented, battery glyph) + icon set
    ├── map-canvas.jsx         ← SVG map renderer (route polyline, waypoints, breadcrumb, rider pins)
    └── screens.jsx            ← all 9 screens
```

To preview locally: open `Group Ride.html` directly in a browser (works offline; loads React + Babel from a CDN). To pixel-pick: use the browser inspector against any rendered element.

---

## Recommended implementation order

1. **Tokens & theming** — generate the M3 palette from a seed (Material Color Utilities), wire light/dark.
2. **Map integration** — Mapbox/Google Maps + custom style + rider pin marker component.
3. **Live Map A (Squad Radar)** — most complex screen; nails the core experience.
4. **Plan Ride** + **Invite** — gets a ride into the system.
5. **Turn-by-turn** — extends Live Map.
6. **Chat + voice** — separate stack; can be parallelized.
7. **Regroup** + **Recap** — leverage existing components.
8. **Live Map B (Convoy Strip)** — ship as an alternate view in settings or a tab toggle on Live Map.
