import React from 'react';
import { Card, Avatar, TonalButton, Icon, TextButton, IconButton, FAB } from '../components/Primitives';
import { TYPE } from '../theme';
import { useAppState } from '../Store';
import { ROUTE_D } from '../components/MapCanvas';

function MiniMap({ height = 100 }) {
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

function SectionHeader({ title, trailing }) {
  return (
    <div style={{
      padding: '20px 20px 8px', display: 'flex',
      alignItems: 'baseline', justifyContent: 'space-between',
    }}>
      <div style={{ ...TYPE.titleM, color: 'var(--md-sys-color-on-surface)' }}>{title}</div>
      {trailing && <div style={{ ...TYPE.labelM, color: 'var(--md-sys-color-on-surface-variant)' }}>{trailing}</div>}
    </div>
  );
}

function RoleBadge({ role, tone = 'primary' }) {
  const bg = tone === 'tertiary' ? 'var(--md-sys-color-tertiary-container)' : 'var(--md-sys-color-primary-container)';
  const fg = tone === 'tertiary' ? 'var(--md-sys-color-on-tertiary-container)' : 'var(--md-sys-color-on-primary-container)';
  return (
    <span style={{
      ...TYPE.labelS, background: bg, color: fg,
      padding: '2px 8px', borderRadius: 6, letterSpacing: 0.6,
    }}>{role}</span>
  );
}

function MemberRow({ rider, isLast }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '10px 16px',
      borderBottom: isLast ? 'none' : `1px solid var(--md-sys-color-outline-variant)`,
    }}>
      <Avatar rider={rider} size={40}/>
      <div style={{ flex: 1 }}>
        <div style={{ ...TYPE.bodyL, color: 'var(--md-sys-color-on-surface)', display: 'flex', gap: 8, alignItems: 'center' }}>
          {rider.name}
          {rider.role === 'lead' && <RoleBadge role="LEAD"/>}
          {rider.role === 'sweep' && <RoleBadge role="SWEEP"/>}
          {rider.tag && <RoleBadge role={rider.tag.toUpperCase()} tone="tertiary"/>}
        </div>
        <div style={{ ...TYPE.bodyM, color: 'var(--md-sys-color-on-surface-variant)' }}>
          {rider.role === 'lead' ? 'Ride captain' : rider.role === 'sweep' ? 'Tail · keeping everyone together' : 'Rider'}
        </div>
      </div>
      <IconButton icon={<Icon name="more" size={20} color="var(--md-sys-color-on-surface-variant)"/>}/>
    </div>
  );
}

function UpcomingRow({ day, date, title, meta }) {
  return (
    <Card style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: 'var(--md-sys-color-surface-container-high)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ ...TYPE.labelS, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase' }}>{day}</div>
        <div style={{ ...TYPE.titleM, color: 'var(--md-sys-color-on-surface)', marginTop: -2 }}>{date}</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...TYPE.bodyL, color: 'var(--md-sys-color-on-surface)' }}>{title}</div>
        <div style={{ ...TYPE.bodyM, color: 'var(--md-sys-color-on-surface-variant)' }}>{meta}</div>
      </div>
      <Icon name="forward" size={20} color="var(--md-sys-color-on-surface-variant)"/>
    </Card>
  );
}

function SignatureTeaser({ feature }) {
  const copy = {
    breadcrumb: { title: 'Breadcrumb trail', body: 'Riders see every turn the group has already taken. Nobody gets lost.', icon: 'route' },
    leadSweep:  { title: 'Lead & Sweep', body: 'Auto-regroup when the sweep falls more than 1 km behind.', icon: 'people' },
    voice:      { title: 'Voice channel', body: 'Tap once to talk. Helmet-friendly low-latency relay.', icon: 'mic' },
    pins:       { title: 'Live rider pins', body: 'See speed, battery and heading for every rider in real time.', icon: 'mapPin' },
    waypoints:  { title: 'Shared waypoints', body: 'Everyone gets the stops, refuels, and coffee breaks pushed to their nav.', icon: 'flag' },
  }[feature] || null;
  if (!copy) return null;
  return (
    <Card style={{ padding: 16, background: 'var(--md-sys-color-tertiary-container)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'var(--md-sys-color-surface)', color: 'var(--md-sys-color-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={copy.icon} size={22} color="currentColor" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...TYPE.titleM, color: 'var(--md-sys-color-on-surface)' }}>{copy.title}</div>
          <div style={{ ...TYPE.bodyM, color: 'var(--md-sys-color-on-surface-variant)', marginTop: 2 }}>{copy.body}</div>
        </div>
      </div>
    </Card>
  );
}

export function GroupHome() {
  const { riders, signatureFeature } = useAppState();

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div className="gr-scroll" style={{ height: '100%', padding: '16px 0 120px' }}>
        {/* Up next: big hero card */}
        <div style={{ padding: '0 16px' }}>
          <Card style={{ padding: 0, overflow: 'hidden', background: 'var(--md-sys-color-primary-container)' }}>
            <div style={{ padding: '20px 20px 0' }}>
              <div style={{ ...TYPE.labelM, color: 'var(--md-sys-color-on-primary-container)', opacity: 0.7, textTransform: 'uppercase' }}>Saturday · 07:30</div>
              <div style={{ ...TYPE.headlineM, color: 'var(--md-sys-color-on-primary-container)', margin: '6px 0 4px' }}>The Coast Run</div>
              <div style={{ ...TYPE.bodyM, color: 'var(--md-sys-color-on-primary-container)', opacity: 0.75 }}>
                Bayview Depot → Harbor Point · 184 km · 4 stops
              </div>
            </div>
            <div style={{ padding: '16px 20px 8px' }}>
              <div style={{ height: 100, position: 'relative', borderRadius: 12, overflow: 'hidden', background: 'var(--md-sys-color-surface)' }}>
                <MiniMap height={100}/>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, padding: '8px 20px 20px', alignItems: 'center' }}>
              <div style={{ display: 'flex' }}>
                {riders.slice(0, 5).map((r, i) => (
                  <div key={r.id} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                    <Avatar rider={r} size={30} ring="var(--md-sys-color-primary-container)"/>
                  </div>
                ))}
                {riders.length > 5 && (
                  <div style={{
                    marginLeft: -10, width: 30, height: 30, borderRadius: '50%',
                    background: 'var(--md-sys-color-surface)', color: 'var(--md-sys-color-on-surface)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    ...TYPE.labelS, fontWeight: 700,
                    boxShadow: `0 0 0 3px var(--md-sys-color-primary-container)`,
                  }}>+{riders.length - 5}</div>
                )}
              </div>
              <div style={{ flex: 1 }}/>
              <TonalButton style={{ background: 'var(--md-sys-color-surface)' }}>
                View route
              </TonalButton>
            </div>
          </Card>
        </div>

        {/* Section: Members */}
        <SectionHeader title="Members" trailing={`${riders.length}`}/>
        <div style={{ padding: '0 16px' }}>
          <Card style={{ padding: '4px 0' }}>
            {riders.slice(0, 4).map((r, i) => (
              <MemberRow key={r.id} rider={r} isLast={i === Math.min(3, riders.length - 1)}/>
            ))}
            {riders.length > 4 && (
              <div style={{ padding: '10px 16px', borderTop: `1px solid var(--md-sys-color-outline-variant)` }}>
                <TextButton>See all {riders.length}</TextButton>
              </div>
            )}
          </Card>
        </div>

        {/* Upcoming rides */}
        <SectionHeader title="Upcoming rides"/>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <UpcomingRow day="Sat" date="26" title="The Coast Run" meta="184 km · 6 riders"/>
          <UpcomingRow day="Sun" date="04" title="Redwood Loop" meta="92 km · 4 riders"/>
          <UpcomingRow day="Sat" date="10" title="Canyon Dash" meta="144 km · 8 riders"/>
        </div>

        {/* Signature feature teaser */}
        {signatureFeature !== 'none' && (
          <div style={{ padding: '16px' }}>
            <SignatureTeaser feature={signatureFeature}/>
          </div>
        )}
      </div>

      {/* Extended FAB for Android-like feel */}
      <div style={{ position: 'absolute', right: 16, bottom: 16 }}>
        <FAB extended
             icon={<Icon name="nav" size={20} color="var(--md-sys-color-on-primary-container)"/>}
             label="Start ride"/>
      </div>
    </div>
  );
}
