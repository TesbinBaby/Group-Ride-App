import React, { useState, useEffect } from 'react';
import { MapCanvas } from '../components/MapCanvas';
import { IconButton, Icon } from '../components/Primitives';
import { TYPE, ELEVATION } from '../theme';
import { useAppState } from '../Store';

function TurnArrow() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M8 24 V18 Q8 12 14 12 H24 M24 12 L20 8 M24 12 L20 16"
            stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function TurnByTurn() {
  const { riders } = useAppState();
  const leadT = riders.length > 0 ? Math.max(...riders.map(r => r.t)) : 0.55;

  return (
    <div style={{ position: 'relative', height: '100%', background: 'var(--md-sys-color-mapBg)' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <MapCanvas riders={riders} currentT={leadT} showBreadcrumb followLead />
      </div>

      {/* Big turn card */}
      <div style={{
        position: 'absolute', left: 16, right: 16, top: 48,
        background: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)',
        borderRadius: 28, padding: 20,
        boxShadow: ELEVATION[3],
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'color-mix(in srgb, var(--md-sys-color-on-primary) 22%, transparent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--md-sys-color-on-primary)',
          }}>
            <TurnArrow/>
          </div>
          <div>
            <div style={{ ...TYPE.displayS, fontWeight: 500 }}>420 m</div>
            <div style={{ ...TYPE.titleM, opacity: 0.85 }}>Right · Seagull Ridge</div>
          </div>
        </div>
        <div style={{
          marginTop: 16, padding: '10px 12px', borderRadius: 14,
          background: 'color-mix(in srgb, var(--md-sys-color-on-primary) 22%, transparent)',
          display: 'flex', alignItems: 'center', gap: 10,
          ...TYPE.bodyM,
        }}>
          <Icon name="people" size={18} color="var(--md-sys-color-on-primary)"/>
          <span>Group stays together here — next turn in 6.4 km</span>
        </div>
      </div>

      {/* Bottom eta card */}
      <div style={{
        position: 'absolute', left: 16, right: 16, bottom: 32,
        background: 'var(--md-sys-color-surface-container-lowest)', borderRadius: 24,
        padding: 16, boxShadow: ELEVATION[2],
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...TYPE.headlineS, color: 'var(--md-sys-color-primary)' }}>14:22</div>
          <div style={{ ...TYPE.bodyS, color: 'var(--md-sys-color-on-surface-variant)' }}>ETA · 2h 14m left</div>
        </div>
        <div>
          <div style={{ ...TYPE.titleM, color: 'var(--md-sys-color-on-surface)', textAlign: 'right' }}>124 km</div>
          <div style={{ ...TYPE.bodyS, color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'right' }}>to Harbor Point</div>
        </div>
        <IconButton background="var(--md-sys-color-error-container)"
                    icon={<Icon name="close" size={20} color="var(--md-sys-color-error)"/>}/>
      </div>
    </div>
  );
}
