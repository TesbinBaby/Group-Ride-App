// Map canvas — realistic SVG map for Group Ride.
// Draws coastline, land, roads, labels, the planned route, and rider pins.
// Supports 3 map styles: 'realistic' | 'stylized' | 'schematic'.
// Route is a sampled polyline we can measure for "position along route".

// Route path (scenic coast road) — normalized to a 400×720 viewbox.
// d commands build a winding coastal highway.
const ROUTE_D = 'M 60 40 C 90 70, 70 110, 110 150 S 180 200, 160 260 C 140 310, 200 340, 220 390 S 180 460, 230 510 C 260 550, 300 560, 310 610 S 280 680, 330 700';

// Build evenly-sampled points along the route so we can place riders,
// waypoints, draw the breadcrumb, and the convoy strip.
function useRouteSamples() {
  return React.useMemo(() => {
    // Create an offscreen SVG path to sample lengths.
    if (typeof document === 'undefined') return { points: [], length: 0 };
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', ROUTE_D);
    const len = p.getTotalLength();
    const N = 200;
    const points = [];
    for (let i = 0; i <= N; i++) {
      const pt = p.getPointAtLength((i / N) * len);
      points.push({ x: pt.x, y: pt.y, t: i / N });
    }
    return { points, length: len };
  }, []);
}

// Placed waypoints (fraction along route 0..1)
const WAYPOINTS = [
  { t: 0.00, name: 'Bayview Depot',  kind: 'start'  },
  { t: 0.22, name: 'Cliff Overlook', kind: 'stop'   },
  { t: 0.45, name: 'Drift Coffee',   kind: 'rest'   },
  { t: 0.70, name: 'Miller\u2019s Cove',kind: 'fuel'   },
  { t: 1.00, name: 'Harbor Point',   kind: 'end'    },
];

function pointAt(samples, t) {
  const i = Math.max(0, Math.min(samples.points.length - 1, Math.round(t * (samples.points.length - 1))));
  return samples.points[i] || { x: 0, y: 0 };
}

// ────────────────────────────────────────────────────────────
// Main <MapCanvas/> — shows the map backdrop, route, waypoints,
// breadcrumb trail, and rider positions. Rider positions are
// determined by a base t offset per rider + small jitter.
// ────────────────────────────────────────────────────────────
function MapCanvas({
  color,
  style = 'realistic',
  riders = [],
  currentT = 0.35,           // "lead rider" position for camera focus
  showBreadcrumb = true,
  showLabels = true,
  followLead = false,        // zoom-follow the lead rider
  width = 400,
  height = 720,
}) {
  const samples = useRouteSamples();
  const leadPt = samples.points.length ? pointAt(samples, currentT) : { x: 200, y: 360 };

  // Camera transform for follow mode
  const scale = followLead ? 1.8 : 1;
  const tx = followLead ? (width / 2 - leadPt.x * scale) : 0;
  const ty = followLead ? (height / 2 - leadPt.y * scale) : 0;

  const labels = style === 'schematic' ? [] : [
    { x: 50, y: 30, text: 'BAY POINT', size: 9, weight: 700 },
    { x: 280, y: 120, text: 'Pacific Ocean', size: 13, italic: true },
    { x: 50, y: 270, text: 'REDWOOD PRESERVE', size: 10, weight: 700 },
    { x: 270, y: 340, text: 'Fog Bay', size: 11, italic: true },
    { x: 80, y: 520, text: 'HILLSIDE', size: 9, weight: 700 },
    { x: 280, y: 600, text: 'CANNERY ROW', size: 9, weight: 700 },
    { x: 300, y: 670, text: 'HARBOR', size: 9, weight: 700 },
  ];

  // Secondary roads
  const minorRoads = [
    'M 20 80 L 220 100 L 280 130',
    'M 120 180 L 300 190 L 380 240',
    'M 30 250 L 170 280 L 260 330',
    'M 40 400 L 180 420 L 340 400',
    'M 20 500 L 220 540 L 380 520',
    'M 50 630 L 240 650 L 380 620',
    'M 100 110 L 140 150 L 120 200',
    'M 240 200 L 280 260 L 260 310',
    'M 200 440 L 240 490 L 200 540',
    'M 320 450 L 360 500 L 320 560',
  ];

  // Coastline path (runs along the right)
  const coastline = 'M 400 0 L 400 720 L 340 720 C 320 700, 300 660, 320 620 C 340 580, 380 560, 370 500 C 360 450, 320 420, 340 380 C 360 340, 400 320, 380 260 C 360 210, 330 180, 360 140 C 380 100, 400 80, 400 0 Z';

  return (
    <div style={{ position: 'relative', width, height, overflow: 'hidden', background: color.mapBg }}>
      <svg width={width} height={height} viewBox={`0 0 400 720`} style={{ display: 'block' }}>
        <defs>
          <pattern id={`tex-${style}`} x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill={color.mapLand}/>
            <circle cx="3" cy="3" r="0.4" fill={color.outlineVariant} opacity="0.3"/>
          </pattern>
          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={color.mapWater} stopOpacity="1"/>
            <stop offset="1" stopColor={color.mapWater} stopOpacity="0.7"/>
          </linearGradient>
        </defs>

        <g transform={`translate(${tx},${ty}) scale(${scale})`}>
          {/* water/ocean backdrop */}
          <rect width="400" height="720" fill={style === 'schematic' ? color.mapBg : 'url(#waterGrad)'}/>

          {/* land mass */}
          {style !== 'schematic' && (
            <path
              d={`M 0 0 L 400 0 ${coastline.replace('M 400 0 ', '')}`}
              fill={style === 'stylized' ? color.mapLand : `url(#tex-${style})`}
            />
          )}

          {/* park / green patches */}
          {style === 'realistic' && (
            <>
              <path d="M 20 220 C 60 210, 130 230, 170 280 C 140 320, 70 310, 30 290 Z"
                    fill="oklch(0.90 0.05 140 / 0.55)" />
              <path d="M 40 470 C 80 460, 150 470, 190 510 C 160 550, 80 560, 50 540 Z"
                    fill="oklch(0.90 0.05 140 / 0.45)" />
            </>
          )}

          {/* minor roads */}
          {style !== 'schematic' && minorRoads.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={color.mapRoadMinor}
                  strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
          ))}
          {style !== 'schematic' && minorRoads.slice(0, 5).map((d, i) => (
            <path key={`o${i}`} d={d} fill="none" stroke={color.outlineVariant}
                  strokeWidth="3.5" strokeLinecap="round" opacity="0.25"/>
          ))}

          {/* main road casing */}
          {style !== 'schematic' && (
            <path d={ROUTE_D} fill="none" stroke={color.mapRoadMajor}
                  strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"
                  opacity="0.95"/>
          )}

          {/* planned route line */}
          <path d={ROUTE_D} fill="none" stroke={color.mapRouteLine}
                strokeWidth={style === 'schematic' ? 5 : 4.5}
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={style === 'schematic' ? '10 6' : undefined}
                filter={style === 'schematic' ? undefined : 'url(#routeGlow)'}/>

          {/* already-ridden section (up to lead rider) */}
          {showBreadcrumb && samples.points.length > 0 && (
            <BreadcrumbTrail samples={samples} upTo={currentT} color={color}/>
          )}

          {/* labels */}
          {showLabels && labels.map((l, i) => (
            <text key={i} x={l.x} y={l.y}
                  fontFamily="'Roboto Flex', Roboto, system-ui"
                  fontSize={l.size}
                  fontWeight={l.weight || 400}
                  fontStyle={l.italic ? 'italic' : 'normal'}
                  fill={color.mapLabel}
                  letterSpacing={l.weight ? 1.2 : 0}
                  opacity="0.8">
              {l.text}
            </text>
          ))}

          {/* waypoints */}
          {samples.points.length > 0 && WAYPOINTS.map((wp, i) => {
            const pt = pointAt(samples, wp.t);
            const isEnd = wp.kind === 'start' || wp.kind === 'end';
            return (
              <g key={i} transform={`translate(${pt.x},${pt.y})`}>
                {isEnd ? (
                  <>
                    <circle r="9" fill={color.onSurface} />
                    <circle r="5" fill={color.surface} />
                    <circle r="2.5" fill={color.onSurface} />
                  </>
                ) : (
                  <>
                    <circle r="6" fill={color.surface} stroke={color.onSurface} strokeWidth="2"/>
                    <circle r="2" fill={color.onSurface}/>
                  </>
                )}
              </g>
            );
          })}

          {/* rider pins */}
          {samples.points.length > 0 && riders.map((r, i) => {
            const pt = pointAt(samples, r.t);
            return <RiderPin key={r.id} x={pt.x} y={pt.y} rider={r} color={color}
                              isYou={r.id === 'you'} small={riders.length > 10}/>;
          })}
        </g>
      </svg>

      {/* Attribution chip — reinforces "realistic map" feel */}
      {style !== 'schematic' && (
        <div style={{
          position: 'absolute', right: 8, bottom: 8,
          ...TYPE.labelS, color: color.onSurfaceVariant,
          background: color.surfaceContainerLowest + 'cc',
          padding: '2px 6px', borderRadius: 4, opacity: 0.7,
        }}>© GroupRide · Map data</div>
      )}
    </div>
  );
}

function BreadcrumbTrail({ samples, upTo, color }) {
  // Dotted trail from start to upTo
  const pts = [];
  const n = Math.floor(upTo * samples.points.length);
  for (let i = 0; i < n; i += 6) pts.push(samples.points[i]);
  return (
    <g>
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.8"
                fill={color.primary} opacity={0.4 + 0.5 * (i / pts.length)}/>
      ))}
    </g>
  );
}

function RiderPin({ x, y, rider, color, isYou, small }) {
  const r = small ? 8 : 11;
  return (
    <g transform={`translate(${x},${y})`}>
      {/* halo */}
      {isYou && <circle r={r + 8} fill={rider.color} opacity="0.22"/>}
      {isYou && <circle r={r + 4} fill={rider.color} opacity="0.35"/>}
      {/* pin teardrop shadow */}
      <ellipse cy={r + 2} rx={r * 0.7} ry="1.5" fill="#000" opacity="0.25"/>
      {/* pin body */}
      <circle r={r} fill={rider.color} stroke={color.surface} strokeWidth="2.2"/>
      <text y={small ? 2.5 : 3.5}
            textAnchor="middle"
            fontFamily="'Roboto Flex', Roboto, system-ui"
            fontSize={small ? 8 : 11}
            fontWeight="700"
            fill="#fff">{rider.initial}</text>
    </g>
  );
}

Object.assign(window, { MapCanvas, useRouteSamples, pointAt, WAYPOINTS, ROUTE_D });
