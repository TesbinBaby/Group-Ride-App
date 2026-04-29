import React, { useMemo } from 'react';
import { TYPE } from '../theme';

export const ROUTE_D = 'M 60 40 C 90 70, 70 110, 110 150 S 180 200, 160 260 C 140 310, 200 340, 220 390 S 180 460, 230 510 C 260 550, 300 560, 310 610 S 280 680, 330 700';

export function useRouteSamples() {
  return useMemo(() => {
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

export const WAYPOINTS = [
  { t: 0.00, name: 'Bayview Depot',  kind: 'start'  },
  { t: 0.22, name: 'Cliff Overlook', kind: 'stop'   },
  { t: 0.45, name: 'Drift Coffee',   kind: 'rest'   },
  { t: 0.70, name: 'Miller\u2019s Cove',kind: 'fuel'   },
  { t: 1.00, name: 'Harbor Point',   kind: 'end'    },
];

export function pointAt(samples, t) {
  if (!samples.points.length) return { x: 0, y: 0 };
  const i = Math.max(0, Math.min(samples.points.length - 1, Math.round(t * (samples.points.length - 1))));
  return samples.points[i];
}

export function MapCanvas({
  style = 'realistic',
  riders = [],
  currentT = 0.35,
  showBreadcrumb = true,
  showLabels = true,
  followLead = false,
  width = 400,
  height = 720,
}) {
  const samples = useRouteSamples();
  const leadPt = samples.points.length ? pointAt(samples, currentT) : { x: 200, y: 360 };

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

  const coastline = 'M 400 0 L 400 720 L 340 720 C 320 700, 300 660, 320 620 C 340 580, 380 560, 370 500 C 360 450, 320 420, 340 380 C 360 340, 400 320, 380 260 C 360 210, 330 180, 360 140 C 380 100, 400 80, 400 0 Z';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--md-sys-color-mapBg)' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
        <defs>
          <pattern id={`tex-${style}`} x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="var(--md-sys-color-mapLand)"/>
            <circle cx="3" cy="3" r="0.4" fill="var(--md-sys-color-outline-variant)" opacity="0.3"/>
          </pattern>
          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--md-sys-color-mapWater)" stopOpacity="1"/>
            <stop offset="1" stopColor="var(--md-sys-color-mapWater)" stopOpacity="0.7"/>
          </linearGradient>
        </defs>

        <g transform={`translate(${tx},${ty}) scale(${scale})`}>
          <rect width={width} height={height} fill={style === 'schematic' ? 'var(--md-sys-color-mapBg)' : 'url(#waterGrad)'}/>

          {style !== 'schematic' && (
            <path
              d={`M 0 0 L 400 0 ${coastline.replace('M 400 0 ', '')}`}
              fill={style === 'stylized' ? 'var(--md-sys-color-mapLand)' : `url(#tex-${style})`}
            />
          )}

          {style === 'realistic' && (
            <>
              <path d="M 20 220 C 60 210, 130 230, 170 280 C 140 320, 70 310, 30 290 Z"
                    fill="var(--md-sys-color-primary)" opacity="0.15" />
              <path d="M 40 470 C 80 460, 150 470, 190 510 C 160 550, 80 560, 50 540 Z"
                    fill="var(--md-sys-color-primary)" opacity="0.1" />
            </>
          )}

          {style !== 'schematic' && minorRoads.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="var(--md-sys-color-mapRoadMinor)"
                  strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
          ))}
          {style !== 'schematic' && minorRoads.slice(0, 5).map((d, i) => (
            <path key={`o${i}`} d={d} fill="none" stroke="var(--md-sys-color-outline-variant)"
                  strokeWidth="3.5" strokeLinecap="round" opacity="0.25"/>
          ))}

          {style !== 'schematic' && (
            <path d={ROUTE_D} fill="none" stroke="var(--md-sys-color-mapRoadMajor)"
                  strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"
                  opacity="0.95"/>
          )}

          <path d={ROUTE_D} fill="none" stroke="var(--md-sys-color-mapRouteLine)"
                strokeWidth={style === 'schematic' ? 5 : 4.5}
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={style === 'schematic' ? '10 6' : undefined}
                filter={style === 'schematic' ? undefined : 'url(#routeGlow)'}/>

          {showBreadcrumb && samples.points.length > 0 && (
            <BreadcrumbTrail samples={samples} upTo={currentT} />
          )}

          {showLabels && labels.map((l, i) => (
            <text key={i} x={l.x} y={l.y}
                  fontFamily="'Roboto Flex', Roboto, system-ui"
                  fontSize={l.size}
                  fontWeight={l.weight || 400}
                  fontStyle={l.italic ? 'italic' : 'normal'}
                  fill="var(--md-sys-color-mapLabel)"
                  letterSpacing={l.weight ? 1.2 : 0}
                  opacity="0.8">
              {l.text}
            </text>
          ))}

          {samples.points.length > 0 && WAYPOINTS.map((wp, i) => {
            const pt = pointAt(samples, wp.t);
            const isEnd = wp.kind === 'start' || wp.kind === 'end';
            return (
              <g key={i} transform={`translate(${pt.x},${pt.y})`}>
                {isEnd ? (
                  <>
                    <circle r="9" fill="var(--md-sys-color-on-surface)" />
                    <circle r="5" fill="var(--md-sys-color-surface)" />
                    <circle r="2.5" fill="var(--md-sys-color-on-surface)" />
                  </>
                ) : (
                  <>
                    <circle r="6" fill="var(--md-sys-color-surface)" stroke="var(--md-sys-color-on-surface)" strokeWidth="2"/>
                    <circle r="2" fill="var(--md-sys-color-on-surface)"/>
                  </>
                )}
              </g>
            );
          })}

          {samples.points.length > 0 && riders.map((r) => {
            const pt = pointAt(samples, r.t);
            return <RiderPin key={r.id} x={pt.x} y={pt.y} rider={r}
                             isYou={r.id === 'you'} small={riders.length > 10}/>;
          })}
        </g>
      </svg>

      {style !== 'schematic' && (
        <div style={{
          position: 'absolute', right: 8, bottom: 8,
          ...TYPE.labelS, color: 'var(--md-sys-color-on-surface-variant)',
          background: 'color-mix(in srgb, var(--md-sys-color-surface-container-lowest) 80%, transparent)',
          padding: '2px 6px', borderRadius: 4,
        }}>© GroupRide · Map data</div>
      )}
    </div>
  );
}

function BreadcrumbTrail({ samples, upTo }) {
  const pts = [];
  const n = Math.floor(upTo * samples.points.length);
  for (let i = 0; i < n; i += 6) pts.push(samples.points[i]);
  return (
    <g>
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.8"
                fill="var(--md-sys-color-primary)" opacity={0.4 + 0.5 * (i / pts.length)}/>
      ))}
    </g>
  );
}

function RiderPin({ x, y, rider, isYou, small }) {
  const r = small ? 8 : 11;
  return (
    <g transform={`translate(${x},${y})`}>
      {isYou && <circle r={r + 8} fill={rider.color} opacity="0.22"/>}
      {isYou && <circle r={r + 4} fill={rider.color} opacity="0.35"/>}
      <ellipse cy={r + 2} rx={r * 0.7} ry="1.5" fill="#000" opacity="0.25"/>
      <circle r={r} fill={rider.color} stroke="var(--md-sys-color-surface)" strokeWidth="2.2"/>
      <text y={small ? 2.5 : 3.5}
            textAnchor="middle"
            fontFamily="'Roboto Flex', Roboto, system-ui"
            fontSize={small ? 8 : 11}
            fontWeight="700"
            fill="#fff">{rider.initial}</text>
    </g>
  );
}
