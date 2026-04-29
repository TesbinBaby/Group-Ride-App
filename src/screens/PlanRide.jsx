import React from 'react';
import { MapCanvas, WAYPOINTS } from '../components/MapCanvas';
import { Card, Avatar, IconButton, Icon, OutlinedButton, FilledButton } from '../components/Primitives';
import { TYPE } from '../theme';
import { useAppState } from '../Store';

function StopRow({ wp, i }) {
  const isStart = wp.kind === 'start';
  const isEnd = wp.kind === 'end';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 0' }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: isStart || isEnd ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-container-high)',
        color: isStart || isEnd ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1,
      }}>
        <Icon name={wp.kind === 'rest' ? 'coffee' : wp.kind === 'fuel' ? 'fuel' : isStart ? 'flag' : isEnd ? 'mapPin' : 'star'} size={22} color="currentColor"/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...TYPE.labelS, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: 1 }}>
          {isStart ? 'Start' : isEnd ? 'End' : wp.kind}
        </div>
        <div style={{ ...TYPE.bodyL, color: 'var(--md-sys-color-on-surface)' }}>{wp.name}</div>
        <div style={{ ...TYPE.bodyS, color: 'var(--md-sys-color-on-surface-variant)' }}>
          {Math.round(wp.t * 184)} km · {['07:30','09:05','10:40','12:20','14:22'][i]}
        </div>
      </div>
      <IconButton icon={<Icon name="menu" size={20} color="var(--md-sys-color-on-surface-variant)"/>}/>
    </div>
  );
}

function StatusDot({ status }) {
  const c = status === 'going' ? 'var(--md-sys-color-success)' : status === 'maybe' ? 'var(--md-sys-color-warn)' : 'var(--md-sys-color-on-surface-variant)';
  return <div style={{ width: 8, height: 8, borderRadius: 4, background: c }}/>;
}

export function PlanRide() {
  const { riders } = useAppState();
  
  return (
    <div className="gr-scroll" style={{ height: '100%', padding: '10px 0 100px' }}>
      <div style={{ padding: '8px 16px 16px' }}>
        <div style={{ ...TYPE.labelM, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase' }}>New ride</div>
        <input
          defaultValue="The Coast Run"
          style={{
            ...TYPE.headlineM, color: 'var(--md-sys-color-on-surface)', background: 'transparent',
            border: 'none', outline: 'none', padding: 0, marginTop: 4, width: '100%',
          }}/>
        <div style={{ ...TYPE.bodyM, color: 'var(--md-sys-color-on-surface-variant)', marginTop: 4 }}>
          Saturday, April 26 · 07:30
        </div>
      </div>

      {/* Route preview */}
      <div style={{ margin: '0 16px', borderRadius: 24, overflow: 'hidden', position: 'relative', height: 220 }}>
        <MapCanvas riders={[]} currentT={0.4} showBreadcrumb={false} />
      </div>

      {/* Waypoint list */}
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ ...TYPE.titleM, color: 'var(--md-sys-color-on-surface)', flex: 1 }}>Stops</div>
          <IconButton icon={<Icon name="plus" size={22} color="var(--md-sys-color-primary)"/>}
                      background="var(--md-sys-color-primary-container)"/>
        </div>
      </div>
      <div style={{ padding: '0 16px' }}>
        <div style={{ position: 'relative' }}>
          {/* vertical connector */}
          <div style={{
            position: 'absolute', left: 27, top: 32, bottom: 32,
            width: 2, background: 'var(--md-sys-color-outline-variant)',
          }}/>
          {WAYPOINTS.map((wp, i) => (
            <StopRow key={i} wp={wp} i={i} />
          ))}
        </div>
      </div>

      {/* Invitees */}
      <div style={{ padding: '24px 16px 8px' }}>
        <div style={{ ...TYPE.titleM, color: 'var(--md-sys-color-on-surface)' }}>Riders invited</div>
      </div>
      <div style={{ padding: '0 16px' }}>
        <Card style={{ padding: '4px 0' }}>
          {riders.slice(0, 6).map((r, i, a) => (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '10px 16px',
              borderBottom: i === a.length - 1 ? 'none' : `1px solid var(--md-sys-color-outline-variant)`,
            }}>
              <Avatar rider={r} size={36}/>
              <div style={{ flex: 1 }}>
                <div style={{ ...TYPE.bodyL, color: 'var(--md-sys-color-on-surface)' }}>{r.name}</div>
                <div style={{ ...TYPE.bodyS, color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {i === 0 ? 'Going' : i < 3 ? 'Going' : i === 3 ? 'Maybe' : 'Pending'}
                </div>
              </div>
              <StatusDot status={i === 0 ? 'going' : i < 3 ? 'going' : i === 3 ? 'maybe' : 'pending'} />
            </div>
          ))}
        </Card>
      </div>

      {/* Action */}
      <div style={{ padding: '24px 16px 8px', display: 'flex', gap: 8 }}>
        <OutlinedButton style={{ flex: 1 }}>Save draft</OutlinedButton>
        <FilledButton style={{ flex: 2 }}>Send invites</FilledButton>
      </div>
    </div>
  );
}
