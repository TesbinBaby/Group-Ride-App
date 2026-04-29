import React from 'react';
import { Card, Avatar, Icon, OutlinedButton, FilledButton } from '../components/Primitives';
import { TYPE } from '../theme';
import { useAppState } from '../Store';

export function Regroup() {
  const { riders } = useAppState();

  return (
    <div className="gr-scroll" style={{ height: '100%', padding: '16px 16px 32px', background: 'var(--md-sys-color-surface)' }}>
      <div style={{ padding: '0 0 16px' }}>
        <div style={{ ...TYPE.labelM, color: 'var(--md-sys-color-tertiary)', textTransform: 'uppercase', letterSpacing: 1 }}>Regroup</div>
        <div style={{ ...TYPE.headlineM, color: 'var(--md-sys-color-on-surface)' }}>Drift Coffee</div>
        <div style={{ ...TYPE.bodyM, color: 'var(--md-sys-color-on-surface-variant)' }}>Stop 3 of 5 · 82 km in</div>
      </div>

      {/* Status summary */}
      <Card style={{ padding: 16, background: 'var(--md-sys-color-secondary-container)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="check" size={22}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...TYPE.titleM, color: 'var(--md-sys-color-on-surface)' }}>
              {Math.ceil(riders.length * 0.66)} of {riders.length} arrived
            </div>
            <div style={{ ...TYPE.bodyM, color: 'var(--md-sys-color-on-surface-variant)' }}>Sweep 6 min out · Sana 11 min out</div>
          </div>
        </div>
        <div style={{ marginTop: 14, height: 8, borderRadius: 4, background: 'var(--md-sys-color-surface)', overflow: 'hidden' }}>
          <div style={{ width: '66%', height: '100%', background: 'var(--md-sys-color-primary)' }}/>
        </div>
      </Card>

      {/* Rider arrival list */}
      <div style={{ paddingTop: 20, paddingBottom: 6, ...TYPE.titleM, color: 'var(--md-sys-color-on-surface)' }}>
        Arrivals
      </div>
      <Card style={{ padding: '4px 0' }}>
        {riders.map((r, i, a) => {
          const arrived = i < Math.ceil(a.length * 0.66);
          return (
            <div key={r.id} style={{
              padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 14,
              borderBottom: i === a.length - 1 ? 'none' : `1px solid var(--md-sys-color-outline-variant)`,
            }}>
              <Avatar rider={r} size={36}/>
              <div style={{ flex: 1 }}>
                <div style={{ ...TYPE.bodyL, color: 'var(--md-sys-color-on-surface)' }}>{r.name}</div>
                <div style={{ ...TYPE.bodyS, color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {arrived ? 'Arrived · '+(i+1)+' min ago' : (i - Math.ceil(a.length*0.66) + 2) + ' min out · '+r.speed+' km/h'}
                </div>
              </div>
              {arrived
                ? <Icon name="check" size={22} color="var(--md-sys-color-success)"/>
                : <div style={{ ...TYPE.labelM, color: 'var(--md-sys-color-warn)' }}>ETA</div>}
            </div>
          );
        })}
      </Card>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, paddingTop: 16 }}>
        <OutlinedButton style={{ flex: 1 }}>Extend stop</OutlinedButton>
        <FilledButton style={{ flex: 1 }}>Roll out</FilledButton>
      </div>
    </div>
  );
}
