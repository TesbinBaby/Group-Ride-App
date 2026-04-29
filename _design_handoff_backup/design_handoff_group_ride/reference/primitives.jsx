// Shared Material 3 primitives + icon set for Group Ride.
// Roboto Flex via Google Fonts; M3 state layers; standard component specs.

// Inject global styles once
if (typeof document !== 'undefined' && !document.getElementById('gr-global')) {
  const s = document.createElement('style');
  s.id = 'gr-global';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,400;8..144,500;8..144,600;8..144,700&family=Roboto+Mono:wght@400;500&display=swap');
    .gr-root, .gr-root * { font-family: 'Roboto Flex', Roboto, system-ui, sans-serif; box-sizing: border-box; }
    .gr-scroll { overflow-y: auto; scrollbar-width: none; }
    .gr-scroll::-webkit-scrollbar { display: none; }
    .gr-press { transition: transform .1s ease, background .15s ease; }
    .gr-press:active { transform: scale(.97); }
    @keyframes gr-pulse {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 0.25; transform: scale(1.4); }
    }
    @keyframes gr-ping {
      0% { opacity: 0.8; transform: scale(1); }
      100% { opacity: 0; transform: scale(2.4); }
    }
    @keyframes gr-dash {
      to { stroke-dashoffset: -40; }
    }
    .gr-route-dash { stroke-dasharray: 6 10; animation: gr-dash 1.2s linear infinite; }
  `;
  document.head.appendChild(s);
}

// ─────────────────────────────────────────────────
// Icons — monoline, 24 stroke, easy to tint
// ─────────────────────────────────────────────────
const Icon = ({ name, size = 24, color = 'currentColor', strokeWidth = 2 }) => {
  const p = {
    mapPin: 'M12 22s7-7.5 7-13a7 7 0 0 0-14 0c0 5.5 7 13 7 13z M12 9v.01 M12 9a3 3 0 1 1 0 0',
    nav:   'M3 11l18-8-8 18-2-8-8-2z',
    bike:  'M5 18a3 3 0 1 1 0-6 3 3 0 0 1 0 6z M19 18a3 3 0 1 1 0-6 3 3 0 0 1 0 6z M6 15l4-7h4l2 4M10 8l-2-4h-2 M14 8h3',
    people:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    chat:  'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    mic:   'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8',
    plus:  'M12 5v14 M5 12h14',
    close: 'M18 6L6 18 M6 6l12 12',
    back:  'M19 12H5 M12 19l-7-7 7-7',
    forward:'M5 12h14 M12 5l7 7-7 7',
    share: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13',
    coffee:'M6 8h12v6a6 6 0 0 1-12 0V8z M18 8h2a3 3 0 0 1 0 6h-2 M6 2v2 M10 2v2 M14 2v2',
    fuel:  'M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17 M3 22h12 M15 8h2a2 2 0 0 1 2 2v6a2 2 0 0 0 2 2V9l-3-3',
    flag:  'M4 22V4 M4 4l9 4-9 4 M4 4l14 2-2 6-12-2',
    clock: 'M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z M12 6v6l4 2',
    battery:'M2 8h16v8H2zM18 11v2h2v-2z',
    signal:'M2 20h4V10H2zM8 20h4V4H8zM14 20h4v-7h-4z',
    settings:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
    search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35',
    star:  'M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z',
    edit:  'M11 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7 M18 2l4 4-10 10H8v-4z',
    play:  'M5 3l14 9-14 9z',
    pause: 'M6 4h4v16H6z M14 4h4v16h-4z',
    stop:  'M5 5h14v14H5z',
    volume:'M11 5L6 9H2v6h4l5 4zM15 9a3 3 0 0 1 0 6 M19 6a8 8 0 0 1 0 12',
    alert: 'M12 2l10 18H2zM12 9v4 M12 17v.01',
    check: 'M5 12l5 5 9-11',
    menu:  'M3 6h18 M3 12h18 M3 18h18',
    more:  'M12 6h.01 M12 12h.01 M12 18h.01',
    route: 'M6 3v12 M6 19v.01 M18 5v.01 M18 9v12 M6 3c4 0 8 2 12 0 M6 15c4 0 8 2 12 0',
    compass:'M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z M16 8l-2 6-6 2 2-6z',
    bell:  'M18 16H6l2-2v-4a4 4 0 1 1 8 0v4z M10 20a2 2 0 0 0 4 0',
    arrow: 'M12 5v14 M5 12l7-7 7 7',
    leaf:  'M17 7c-9 0-12 5-12 10 0 0 9 0 12-5s5-10 5-10-2 5-5 5z',
  }[name];
  // Some icons have holes we want filled (mic, battery). Default to stroke.
  const fillOnly = ['play','pause','stop','star','bike'].includes(name);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth={strokeWidth}
         strokeLinecap="round" strokeLinejoin="round">
      <path d={p} fill={fillOnly ? color : 'none'}/>
    </svg>
  );
};

// ─────────────────────────────────────────────────
// Buttons
// ─────────────────────────────────────────────────
function FilledButton({ children, onClick, color, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} className="gr-press" style={{
      height: 40, padding: '0 24px', borderRadius: 20, border: 'none',
      background: disabled ? color.surfaceContainerHigh : color.primary,
      color: disabled ? color.onSurfaceVariant : color.onPrimary,
      ...TYPE.labelL, cursor: 'pointer', ...style,
    }}>{children}</button>
  );
}

function TonalButton({ children, onClick, color, style = {}, icon }) {
  return (
    <button onClick={onClick} className="gr-press" style={{
      height: 40, padding: icon ? '0 24px 0 16px' : '0 24px', borderRadius: 20, border: 'none',
      background: color.secondaryContainer, color: color.onPrimaryContainer,
      ...TYPE.labelL, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, ...style,
    }}>{icon}{children}</button>
  );
}

function TextButton({ children, onClick, color, style = {} }) {
  return (
    <button onClick={onClick} className="gr-press" style={{
      height: 40, padding: '0 12px', borderRadius: 20, border: 'none',
      background: 'transparent', color: color.primary,
      ...TYPE.labelL, cursor: 'pointer', ...style,
    }}>{children}</button>
  );
}

function OutlinedButton({ children, onClick, color, style = {} }) {
  return (
    <button onClick={onClick} className="gr-press" style={{
      height: 40, padding: '0 24px', borderRadius: 20,
      border: `1px solid ${color.outline}`,
      background: 'transparent', color: color.primary,
      ...TYPE.labelL, cursor: 'pointer', ...style,
    }}>{children}</button>
  );
}

// Icon button
function IconButton({ icon, onClick, color, background, size = 40, style = {} }) {
  return (
    <button onClick={onClick} className="gr-press" style={{
      width: size, height: size, borderRadius: size / 2, border: 'none',
      background: background || 'transparent',
      color: color.onSurface,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', ...style,
    }}>{icon}</button>
  );
}

// ─────────────────────────────────────────────────
// FAB
// ─────────────────────────────────────────────────
function FAB({ icon, label, onClick, color, extended, style = {} }) {
  return (
    <button onClick={onClick} className="gr-press" style={{
      height: 56, minWidth: 56,
      padding: extended ? '0 16px 0 16px' : 0,
      borderRadius: 16, border: 'none',
      background: color.primaryContainer, color: color.onPrimaryContainer,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      boxShadow: ELEVATION[3], cursor: 'pointer',
      ...TYPE.labelL, ...style,
    }}>
      {icon}{extended && <span>{label}</span>}
    </button>
  );
}

// ─────────────────────────────────────────────────
// Chip
// ─────────────────────────────────────────────────
function Chip({ children, selected, onClick, color, leading, style = {} }) {
  return (
    <button onClick={onClick} className="gr-press" style={{
      height: 32, padding: leading ? '0 16px 0 8px' : '0 16px',
      borderRadius: 8,
      border: selected ? 'none' : `1px solid ${color.outline}`,
      background: selected ? color.secondaryContainer : 'transparent',
      color: selected ? color.onPrimaryContainer : color.onSurfaceVariant,
      ...TYPE.labelL, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 8, ...style,
    }}>{leading}{children}</button>
  );
}

// ─────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────
function Card({ children, color, elevated, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      borderRadius: 12,
      background: elevated ? color.surfaceContainerLow : color.surfaceContainerHighest,
      boxShadow: elevated ? ELEVATION[1] : 'none',
      ...style,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────────────
function Avatar({ rider, size = 40, ring, color }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: rider.color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.42, fontWeight: 700, letterSpacing: -0.2,
      flexShrink: 0,
      boxShadow: ring ? `0 0 0 3px ${color.surface}, 0 0 0 5px ${ring}` : 'none',
      position: 'relative',
    }}>{rider.initial}</div>
  );
}

// ─────────────────────────────────────────────────
// Bottom sheet (docked)
// ─────────────────────────────────────────────────
function BottomSheet({ children, color, style = {} }) {
  return (
    <div style={{
      background: color.surfaceContainerLow,
      borderRadius: '28px 28px 0 0',
      boxShadow: ELEVATION[3],
      paddingTop: 8,
      ...style,
    }}>
      <div style={{
        width: 32, height: 4, borderRadius: 2,
        background: color.onSurfaceVariant, opacity: 0.4,
        margin: '0 auto 12px',
      }}/>
      {children}
    </div>
  );
}

// Segmented buttons
function Segmented({ options, value, onChange, color }) {
  return (
    <div style={{ display: 'flex', border: `1px solid ${color.outline}`, borderRadius: 20, overflow: 'hidden' }}>
      {options.map((o, i) => {
        const selected = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} className="gr-press" style={{
            flex: 1, height: 40, border: 'none',
            borderLeft: i === 0 ? 'none' : `1px solid ${color.outline}`,
            background: selected ? color.secondaryContainer : 'transparent',
            color: selected ? color.onPrimaryContainer : color.onSurfaceVariant,
            ...TYPE.labelL, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>{selected && <Icon name="check" size={18}/>}{o.label}</button>
        );
      })}
    </div>
  );
}

// Battery glyph with fill level
function BatteryGlyph({ level, color }) {
  const lvl = Math.max(0, Math.min(1, level / 100));
  const warn = level < 25;
  return (
    <svg width="18" height="12" viewBox="0 0 18 12">
      <rect x="0.5" y="0.5" width="14" height="11" rx="2" fill="none" stroke={color.onSurfaceVariant} strokeWidth="1"/>
      <rect x="15" y="4" width="2.5" height="4" rx="1" fill={color.onSurfaceVariant}/>
      <rect x="2" y="2" width={11 * lvl} height="8" rx="1"
            fill={warn ? color.error : color.primary}/>
    </svg>
  );
}

Object.assign(window, {
  Icon, FilledButton, TonalButton, TextButton, OutlinedButton, IconButton,
  FAB, Chip, Card, Avatar, BottomSheet, Segmented, BatteryGlyph,
});
