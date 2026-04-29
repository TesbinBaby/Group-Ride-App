import React from 'react';
import { Card, Avatar, IconButton, Icon, OutlinedButton, FilledButton } from '../components/Primitives';
import { TYPE, ELEVATION, ROSTER } from '../theme';

function QRStylized() {
  const cells = [];
  const seed = (i, j) => ((i * 7 + j * 13 + i * j) % 5) > 1;
  for (let i = 0; i < 17; i++) for (let j = 0; j < 17; j++) {
    const inCorner = (i < 4 && j < 4) || (i < 4 && j > 12) || (i > 12 && j < 4);
    if (inCorner) continue;
    if (seed(i, j)) cells.push({ i, j });
  }
  const size = 168, cell = size / 17;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {cells.map((c, k) => (
        <rect key={k} x={c.j * cell + 1} y={c.i * cell + 1}
              width={cell - 2} height={cell - 2} rx={1.5}
              fill="var(--md-sys-color-on-surface)"/>
      ))}
      {[[0,0],[0,13],[13,0]].map(([i,j], k) => (
        <g key={k} transform={`translate(${j*cell},${i*cell})`}>
          <rect width={4*cell} height={4*cell} rx={8} fill="var(--md-sys-color-on-surface)"/>
          <rect x={cell*0.6} y={cell*0.6} width={4*cell - cell*1.2} height={4*cell - cell*1.2} rx={6} fill="var(--md-sys-color-surface-container-lowest)"/>
          <rect x={cell*1.3} y={cell*1.3} width={4*cell - cell*2.6} height={4*cell - cell*2.6} rx={4} fill="var(--md-sys-color-on-surface)"/>
        </g>
      ))}
    </svg>
  );
}

export function Invite() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--md-sys-color-surface)', padding: '16px 16px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0 12px' }}>
        <IconButton icon={<Icon name="close" size={22} color="var(--md-sys-color-on-surface)"/>}/>
        <div style={{ flex: 1, textAlign: 'center', ...TYPE.titleM, color: 'var(--md-sys-color-on-surface)' }}>Invite riders</div>
        <div style={{ width: 40 }}/>
      </div>
      <div style={{ ...TYPE.headlineS, color: 'var(--md-sys-color-on-surface)', textAlign: 'center', padding: '8px 0 0' }}>
        The Coast Run
      </div>
      <div style={{ ...TYPE.bodyM, color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'center', padding: '4px 0 24px' }}>
        Share this code or scan to join
      </div>
      
      {/* QR */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 0 20px' }}>
        <div style={{
          width: 200, height: 200, borderRadius: 24,
          background: 'var(--md-sys-color-surface-container-lowest)', padding: 16,
          boxShadow: ELEVATION[1],
        }}>
          <QRStylized />
        </div>
      </div>
      
      {/* Code */}
      <div style={{
        alignSelf: 'center', padding: '8px 20px', borderRadius: 16,
        background: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)',
        ...TYPE.headlineS, fontFamily: '"Roboto Mono", monospace', letterSpacing: 8,
      }}>RIDE · 7K3M</div>

      {/* Invitees preview */}
      <div style={{ marginTop: 24, ...TYPE.titleS, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase' }}>
        Recent
      </div>
      <Card style={{ marginTop: 8, padding: '4px 0' }}>
        {ROSTER.slice(6, 10).map((r, i, a) => (
          <div key={r.id} style={{
            padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 14,
            borderBottom: i === a.length - 1 ? 'none' : `1px solid var(--md-sys-color-outline-variant)`,
          }}>
            <Avatar rider={r} size={36}/>
            <div style={{ flex: 1 }}>
              <div style={{ ...TYPE.bodyL, color: 'var(--md-sys-color-on-surface)' }}>{r.name}</div>
              <div style={{ ...TYPE.bodyS, color: 'var(--md-sys-color-on-surface-variant)' }}>Rode together 2 weeks ago</div>
            </div>
            <OutlinedButton style={{ height: 32, padding: '0 16px' }}>Invite</OutlinedButton>
          </div>
        ))}
      </Card>

      <div style={{ flex: 1 }}/>
      <div style={{ display: 'flex', gap: 10 }}>
        <OutlinedButton style={{ flex: 1 }}>Copy link</OutlinedButton>
        <FilledButton style={{ flex: 1 }}>Share</FilledButton>
      </div>
    </div>
  );
}
