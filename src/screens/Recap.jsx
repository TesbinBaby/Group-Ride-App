import React from 'react';
import { Card, Avatar } from '../components/Primitives';
import { TYPE } from '../theme';
import { useAppState } from '../Store';

function StatCard({ label, value, unit }) {
  return (
    <Card style={{ padding: 14 }}>
      <div style={{ ...TYPE.labelM, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
        <div style={{ ...TYPE.headlineM, color: 'var(--md-sys-color-on-surface)', fontWeight: 500 }}>{value}</div>
        <div style={{ ...TYPE.bodyS, color: 'var(--md-sys-color-on-surface-variant)' }}>{unit}</div>
      </div>
    </Card>
  );
}

function CohesionChart() {
  const pts = [95, 96, 98, 94, 90, 85, 78, 82, 90, 94, 96, 95, 93, 94];
  const max = 100, min = 70;
  const w = 300, h = 56;
  const d = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ marginTop: 10 }}>
      <path d={d} fill="none" stroke="var(--md-sys-color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="var(--md-sys-color-primary)" opacity="0.15"/>
    </svg>
  );
}

function MiniMap({ height = 120 }) {
  return (
    <svg width="100%" height={height} viewBox="0 0 300 100" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <rect width="300" height="100" fill="var(--md-sys-color-mapBg)"/>
      <path d="M 300 0 L 300 100 L 240 100 C 220 80, 230 50, 260 40 C 280 30, 300 20, 300 0 Z" fill="var(--md-sys-color-mapLand)"/>
      <path d="M 20 20 C 60 40, 40 60, 80 70 S 160 80, 180 60 S 240 70, 280 50"
            fill="none" stroke="var(--md-sys-color-mapRouteLine)" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="20" cy="20" r="4" fill="var(--md-sys-color-on-surface)"/>
      <circle cx="280" cy="50" r="4" fill="var(--md-sys-color-on-surface)"/>
    </svg>
  );
}

export function Recap() {
  const { riders } = useAppState();
  return (
    <div className="gr-scroll" style={{ height: '100%', padding: '0 0 32px', background: 'var(--md-sys-color-surface)' }}>
      {/* Hero */}
      <div style={{
        margin: '0 16px 16px', borderRadius: 28, overflow: 'hidden',
        background: 'var(--md-sys-color-primary-container)', padding: 20, position: 'relative',
      }}>
        <div style={{ ...TYPE.labelM, color: 'var(--md-sys-color-on-primary-container)', opacity: 0.7, textTransform: 'uppercase' }}>
          Ride complete
        </div>
        <div style={{ ...TYPE.displayS, color: 'var(--md-sys-color-on-primary-container)', marginTop: 4, fontWeight: 500 }}>
          The Coast Run
        </div>
        <div style={{ ...TYPE.bodyL, color: 'var(--md-sys-color-on-primary-container)', opacity: 0.8 }}>Saturday · 6h 52m</div>
        {/* route mini */}
        <div style={{ marginTop: 14, height: 120, borderRadius: 16, overflow: 'hidden', background: 'var(--md-sys-color-surface)' }}>
          <MiniMap height={120}/>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <StatCard label="Distance" value="184" unit="km"/>
        <StatCard label="Moving time" value="4:38" unit="hrs"/>
        <StatCard label="Avg speed" value="52" unit="km/h"/>
        <StatCard label="Elevation" value="1,210" unit="m"/>
      </div>

      {/* Group together-ness */}
      <div style={{ padding: '20px 16px 6px', ...TYPE.titleM, color: 'var(--md-sys-color-on-surface)' }}>
        Group cohesion
      </div>
      <div style={{ padding: '0 16px' }}>
        <Card style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ ...TYPE.displayS, color: 'var(--md-sys-color-primary)', fontWeight: 500 }}>94%</div>
            <div style={{ ...TYPE.bodyM, color: 'var(--md-sys-color-on-surface-variant)' }}>together time</div>
          </div>
          <CohesionChart />
          <div style={{ ...TYPE.bodyS, color: 'var(--md-sys-color-on-surface-variant)', marginTop: 6 }}>
            Max spread 1.8 km (near Miller's Cove)
          </div>
        </Card>
      </div>

      {/* Rider board */}
      <div style={{ padding: '20px 16px 6px', ...TYPE.titleM, color: 'var(--md-sys-color-on-surface)' }}>
        Riders
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {riders.slice(0, 6).map((r, i) => (
          <Card key={r.id} style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar rider={r} size={40}/>
            <div style={{ flex: 1 }}>
              <div style={{ ...TYPE.bodyL, color: 'var(--md-sys-color-on-surface)' }}>{r.name}</div>
              <div style={{ ...TYPE.bodyS, color: 'var(--md-sys-color-on-surface-variant)' }}>{r.speed + 4} km/h avg · {Math.round(184 - i * 0.4) } km</div>
            </div>
            <div style={{
              ...TYPE.labelM, color: 'var(--md-sys-color-tertiary)',
              background: 'var(--md-sys-color-tertiary-container)',
              padding: '4px 10px', borderRadius: 8,
            }}>
              {['Lead','Smooth','Fast','Steady','New PR','Sweep'][i]}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
