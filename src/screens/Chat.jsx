import React from 'react';
import { IconButton, Icon, Avatar } from '../components/Primitives';
import { TYPE } from '../theme';
import { useAppState } from '../Store';

function VoiceBars() {
  const heights = [4, 10, 14, 8, 18, 10, 14, 6, 12, 8, 16, 10, 12, 6];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {heights.map((h, i) => (
        <div key={i} style={{ width: 2, height: h, borderRadius: 1, background: 'currentColor', opacity: i < 6 ? 1 : 0.5 }}/>
      ))}
    </div>
  );
}

function Message({ m }) {
  if (m.kind === 'system') {
    return (
      <div style={{
        alignSelf: 'center', background: 'var(--md-sys-color-surface-container)',
        padding: '6px 12px', borderRadius: 12,
        ...TYPE.bodyS, color: 'var(--md-sys-color-on-surface-variant)',
      }}>{m.text}</div>
    );
  }
  const mine = m.mine;
  const align = mine ? 'flex-end' : 'flex-start';
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', alignSelf: align, maxWidth: '80%' }}>
      {!mine && <Avatar rider={m.from} size={28}/>}
      <div style={{
        background: mine ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-container-high)',
        color: mine ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)',
        borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        padding: m.kind === 'voice' ? '8px 12px' : '8px 14px',
        ...TYPE.bodyM,
      }}>
        {!mine && !m.kind && (
          <div style={{ ...TYPE.labelS, color: 'var(--md-sys-color-tertiary)', marginBottom: 2 }}>{m.from.name}</div>
        )}
        {m.kind === 'voice' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="play" size={16} color="currentColor"/>
            <VoiceBars/>
            <span style={{ ...TYPE.labelS }}>0:0{m.duration}</span>
          </div>
        ) : m.text}
      </div>
      {!mine && m.at && <div style={{ ...TYPE.labelS, color: 'var(--md-sys-color-on-surface-variant)' }}>{m.at}</div>}
    </div>
  );
}

export function Chat() {
  const { riders } = useAppState();
  
  const messages = [
    { id: 1, from: riders[1], text: 'Everyone fueled up at Drift? I\u2019m topping off.', at: '10:42' },
    { id: 2, from: riders[3], text: 'Coffee here is incredible 🔥', at: '10:43' },
    { id: 3, kind: 'system', text: 'Dev added Miller\u2019s Cove as a fuel stop' },
    { id: 4, from: riders[0], text: 'Pulling out in 10. Sweep on comms?', at: '10:47', mine: true },
    { id: 5, from: riders[5], text: 'Sweep ready. 🏁', at: '10:48' },
    { id: 6, kind: 'voice', from: riders[2], duration: 6, at: '10:49' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--md-sys-color-surface)' }}>
      {/* header */}
      <div style={{
        padding: '46px 8px 10px',
        display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: `1px solid var(--md-sys-color-outline-variant)`,
      }}>
        <IconButton icon={<Icon name="back" size={22} color="var(--md-sys-color-on-surface)"/>}/>
        <div style={{ display: 'flex', marginLeft: 4 }}>
          {riders.slice(0, 3).map((r, i) => (
            <div key={r.id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
              <Avatar rider={r} size={32} ring="var(--md-sys-color-surface)"/>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, marginLeft: 8 }}>
          <div style={{ ...TYPE.titleM, color: 'var(--md-sys-color-on-surface)' }}>The Coast Run</div>
          <div style={{ ...TYPE.bodyS, color: 'var(--md-sys-color-on-surface-variant)' }}>{riders.length} members · all live</div>
        </div>
        <IconButton icon={<Icon name="mic" size={22} color="var(--md-sys-color-on-surface)"/>}/>
      </div>

      {/* messages */}
      <div className="gr-scroll" style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map(m => <Message key={m.id} m={m} />)}
      </div>

      {/* composer */}
      <div style={{
        padding: '8px 12px', borderTop: `1px solid var(--md-sys-color-outline-variant)`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <IconButton icon={<Icon name="plus" size={22} color="var(--md-sys-color-on-surface-variant)"/>}
                    background="var(--md-sys-color-surface-container-high)"/>
        <div style={{
          flex: 1, height: 44, borderRadius: 22,
          background: 'var(--md-sys-color-surface-container)',
          display: 'flex', alignItems: 'center', padding: '0 16px',
          ...TYPE.bodyL, color: 'var(--md-sys-color-on-surface-variant)',
        }}>Message the group…</div>
        <IconButton icon={<Icon name="mic" size={22} color="var(--md-sys-color-on-primary)"/>}
                    background="var(--md-sys-color-primary)"/>
      </div>
    </div>
  );
}
