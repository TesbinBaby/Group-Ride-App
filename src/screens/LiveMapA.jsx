import React, { useState, useEffect } from 'react';
import { MapCanvas } from '../components/MapCanvas';
import { BottomSheet, IconButton, Icon, TonalButton, OutlinedButton, Avatar, BatteryGlyph } from '../components/Primitives';
import { TYPE, ELEVATION } from '../theme';
import { useAppState } from '../Store';

function CircleFab({ icon }) {
  return (
    <div style={{
      width: 44, height: 44, borderRadius: 16,
      background: 'var(--md-sys-color-surface-container-lowest)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: ELEVATION[2],
    }}>
      <Icon name={icon} size={22} color="var(--md-sys-color-on-surface)"/>
    </div>
  );
}

function TurnArrow() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M8 24 V18 Q8 12 14 12 H24 M24 12 L20 8 M24 12 L20 16"
            stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function RiderChip({ rider }) {
  const isBattLow = rider.battery < 25;
  return (
    <div style={{
      width: 100, flexShrink: 0,
      background: 'var(--md-sys-color-surface-container-high)',
      borderRadius: 14, padding: '10px 10px 8px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    }}>
      <Avatar rider={rider} size={36}/>
      <div style={{ ...TYPE.labelM, color: 'var(--md-sys-color-on-surface)', textAlign: 'center',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
        {rider.name}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <BatteryGlyph level={rider.battery} />
        <span style={{ ...TYPE.labelS, color: isBattLow ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-on-surface-variant)' }}>
          {rider.battery}%
        </span>
      </div>
      <div style={{ ...TYPE.labelS, color: 'var(--md-sys-color-on-surface-variant)' }}>{rider.speed} km/h</div>
    </div>
  );
}

export function LiveMapA() {
  const { riders, signatureFeature } = useAppState();
  
  // Use the lead rider's t position for the UI
  const leadT = riders.length > 0 ? Math.max(...riders.map(r => r.t)) : 0.35;

  return (
    <div style={{ position: 'relative', height: '100%', background: 'var(--md-sys-color-mapBg)' }}>
      {/* Map fills screen */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <MapCanvas riders={riders} currentT={leadT} showBreadcrumb={signatureFeature === 'breadcrumb' || signatureFeature !== 'none'} />
      </div>

      {/* Top status strip */}
      <div style={{
        position: 'absolute', top: 48, left: 16, right: 16,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--md-sys-color-surface-container-lowest)',
          padding: '10px 8px 10px 14px', borderRadius: 22,
          boxShadow: ELEVATION[2],
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--md-sys-color-success)',
                        animation: 'gr-pulse 1.6s ease-in-out infinite' }}/>
          <div style={{ ...TYPE.labelL, color: 'var(--md-sys-color-on-surface)' }}>The Coast Run · Live</div>
          <div style={{ flex: 1 }}/>
          <div style={{ ...TYPE.labelM, color: 'var(--md-sys-color-on-surface-variant)' }}>
            {Math.round(leadT * 184)} / 184 km
          </div>
          <IconButton size={32}
                      icon={<Icon name="more" size={18} color="var(--md-sys-color-on-surface-variant)"/>}/>
        </div>

        {/* Regroup banner (conditional) */}
        {signatureFeature === 'leadSweep' && (
          <div style={{
            marginTop: 8, padding: '10px 14px', borderRadius: 16,
            background: 'var(--md-sys-color-error-container)',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: ELEVATION[1],
          }}>
            <Icon name="alert" size={18} color="var(--md-sys-color-error)"/>
            <div style={{ flex: 1 }}>
              <div style={{ ...TYPE.labelL, color: 'var(--md-sys-color-on-surface)' }}>Sana is 1.2 km behind</div>
              <div style={{ ...TYPE.bodyS, color: 'var(--md-sys-color-on-surface-variant)' }}>Tap to slow the group</div>
            </div>
            <OutlinedButton style={{ height: 32, padding: '0 12px' }}>Slow</OutlinedButton>
          </div>
        )}
      </div>

      {/* Side controls */}
      <div style={{
        position: 'absolute', right: 12, top: 140,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <CircleFab icon="compass"/>
        <CircleFab icon="people"/>
        <CircleFab icon="volume"/>
      </div>

      {/* Bottom sheet */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <BottomSheet>
          {/* Active nav instruction */}
          <div style={{ padding: '0 20px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TurnArrow/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...TYPE.headlineS, color: 'var(--md-sys-color-on-surface)' }}>In 420 m</div>
                <div style={{ ...TYPE.bodyL, color: 'var(--md-sys-color-on-surface-variant)' }}>Right onto Seagull Ridge</div>
              </div>
              <IconButton icon={<Icon name="volume" size={22} color="var(--md-sys-color-on-surface-variant)"/>}
                          background="var(--md-sys-color-surface-container-high)"/>
            </div>
          </div>

          {/* Rider strip */}
          <div style={{ padding: '8px 0 0' }}>
            <div style={{ padding: '0 20px', ...TYPE.labelM, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase' }}>
              Riders · {riders.length}
            </div>
            <div style={{ display: 'flex', gap: 10, padding: '10px 20px 14px', overflowX: 'auto' }} className="gr-scroll">
              {riders.map(r => (
                <RiderChip key={r.id} rider={r} />
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: 8, padding: '0 16px 16px' }}>
            <TonalButton style={{ flex: 1 }} icon={<Icon name="mic" size={18} color="var(--md-sys-color-on-secondary-container)"/>}>Ping</TonalButton>
            <TonalButton style={{ flex: 1 }} icon={<Icon name="coffee" size={18} color="var(--md-sys-color-on-secondary-container)"/>}>Break</TonalButton>
            <TonalButton style={{ flex: 1 }} icon={<Icon name="fuel" size={18} color="var(--md-sys-color-on-secondary-container)"/>}>Fuel</TonalButton>
          </div>
        </BottomSheet>
      </div>
    </div>
  );
}
