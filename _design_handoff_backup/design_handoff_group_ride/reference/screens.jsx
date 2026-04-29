// Screens for Group Ride — each screen is a standalone renderable.
// They all accept { color, config } so tweaks re-render everything.
// config: { seedKey, dark, mapStyle, riderCount, signatureFeature }

// ───────────────────────────────────────────────────────────
// Utility: build riders list for current count, with positions
// ───────────────────────────────────────────────────────────
function useGroupRiders(count, leadT) {
  return React.useMemo(() => {
    const list = ROSTER.slice(0, count);
    // Place riders along a band behind the lead — lead at leadT, others trail
    return list.map((r, i) => {
      const offset = i === 0 ? 0 : -0.015 - (i * 0.013) + (Math.sin(i * 2.3) * 0.005);
      return { ...r, t: Math.max(0, Math.min(1, leadT + offset)) };
    });
  }, [count, leadT]);
}

// ─────────────────────────────────────────────
// 1. Group Home — "The Coast Run" card, members, next ride
// ─────────────────────────────────────────────
function GroupHomeScreen({ color, config, platform }) {
  const riders = useGroupRiders(config.riderCount, 0);
  const fab = platform === 'ios' ? null : (
    <div style={{ position: 'absolute', right: 16, bottom: 16 }}>
      <FAB color={color} extended
            icon={<Icon name="nav" size={20} color={color.onPrimaryContainer}/>}
            label="Start ride"/>
    </div>
  );
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div className="gr-scroll" style={{ height: '100%', padding: '16px 0 120px' }}>
        {/* Up next: big hero card */}
        <div style={{ padding: '0 16px' }}>
          <Card color={color} style={{ padding: 0, overflow: 'hidden', background: color.primaryContainer }}>
            <div style={{ padding: '20px 20px 0' }}>
              <div style={{ ...TYPE.labelM, color: color.onPrimaryContainer, opacity: 0.7, textTransform: 'uppercase' }}>Saturday · 07:30</div>
              <div style={{ ...TYPE.headlineM, color: color.onPrimaryContainer, margin: '6px 0 4px' }}>The Coast Run</div>
              <div style={{ ...TYPE.bodyM, color: color.onPrimaryContainer, opacity: 0.75 }}>
                Bayview Depot → Harbor Point · 184 km · 4 stops
              </div>
            </div>
            <div style={{ padding: '16px 20px 8px' }}>
              <div style={{ height: 100, position: 'relative', borderRadius: 12, overflow: 'hidden', background: color.surface }}>
                <MiniMap color={color} style={config.mapStyle} height={100}/>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, padding: '8px 20px 20px', alignItems: 'center' }}>
              <div style={{ display: 'flex' }}>
                {riders.slice(0, 5).map((r, i) => (
                  <div key={r.id} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                    <Avatar rider={r} size={30} ring={color.primaryContainer} color={color}/>
                  </div>
                ))}
                {riders.length > 5 && (
                  <div style={{
                    marginLeft: -10, width: 30, height: 30, borderRadius: '50%',
                    background: color.surface, color: color.onSurface,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    ...TYPE.labelS, fontWeight: 700,
                    boxShadow: `0 0 0 3px ${color.primaryContainer}`,
                  }}>+{riders.length - 5}</div>
                )}
              </div>
              <div style={{ flex: 1 }}/>
              <TonalButton color={color} style={{ background: color.surface }}>
                View route
              </TonalButton>
            </div>
          </Card>
        </div>

        {/* Section: Members */}
        <SectionHeader color={color} title="Members" trailing={`${riders.length}`}/>
        <div style={{ padding: '0 16px' }}>
          <Card color={color} style={{ padding: '4px 0' }}>
            {riders.slice(0, 4).map((r, i) => (
              <MemberRow key={r.id} rider={r} color={color} isLast={i === Math.min(3, riders.length - 1)}/>
            ))}
            {riders.length > 4 && (
              <div style={{ padding: '10px 16px', borderTop: `1px solid ${color.outlineVariant}` }}>
                <TextButton color={color}>See all {riders.length}</TextButton>
              </div>
            )}
          </Card>
        </div>

        {/* Upcoming rides */}
        <SectionHeader color={color} title="Upcoming rides"/>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <UpcomingRow color={color} day="Sat" date="26" title="The Coast Run" meta="184 km · 6 riders"/>
          <UpcomingRow color={color} day="Sun" date="04" title="Redwood Loop" meta="92 km · 4 riders"/>
          <UpcomingRow color={color} day="Sat" date="10" title="Canyon Dash" meta="144 km · 8 riders"/>
        </div>

        {/* Signature feature teaser */}
        {config.signatureFeature !== 'none' && (
          <div style={{ padding: '16px' }}>
            <SignatureTeaser color={color} feature={config.signatureFeature}/>
          </div>
        )}
      </div>
      {fab}
    </div>
  );
}

function SectionHeader({ color, title, trailing }) {
  return (
    <div style={{
      padding: '20px 20px 8px', display: 'flex',
      alignItems: 'baseline', justifyContent: 'space-between',
    }}>
      <div style={{ ...TYPE.titleM, color: color.onSurface }}>{title}</div>
      {trailing && <div style={{ ...TYPE.labelM, color: color.onSurfaceVariant }}>{trailing}</div>}
    </div>
  );
}

function MemberRow({ rider, color, isLast }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '10px 16px',
      borderBottom: isLast ? 'none' : `1px solid ${color.outlineVariant}`,
    }}>
      <Avatar rider={rider} size={40}/>
      <div style={{ flex: 1 }}>
        <div style={{ ...TYPE.bodyL, color: color.onSurface, display: 'flex', gap: 8, alignItems: 'center' }}>
          {rider.name}
          {rider.role === 'lead' && <RoleBadge color={color} role="LEAD"/>}
          {rider.role === 'sweep' && <RoleBadge color={color} role="SWEEP"/>}
          {rider.tag && <RoleBadge color={color} role={rider.tag.toUpperCase()} tone="tertiary"/>}
        </div>
        <div style={{ ...TYPE.bodyM, color: color.onSurfaceVariant }}>
          {rider.role === 'lead' ? 'Ride captain' : rider.role === 'sweep' ? 'Tail · keeping everyone together' : 'Rider'}
        </div>
      </div>
      <IconButton color={color} icon={<Icon name="more" size={20} color={color.onSurfaceVariant}/>}/>
    </div>
  );
}

function RoleBadge({ color, role, tone = 'primary' }) {
  const bg = tone === 'tertiary' ? color.tertiaryContainer : color.primaryContainer;
  const fg = color.onPrimaryContainer;
  return (
    <span style={{
      ...TYPE.labelS, background: bg, color: fg,
      padding: '2px 8px', borderRadius: 6, letterSpacing: 0.6,
    }}>{role}</span>
  );
}

function UpcomingRow({ color, day, date, title, meta }) {
  return (
    <Card color={color} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: color.surfaceContainerHigh,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ ...TYPE.labelS, color: color.onSurfaceVariant, textTransform: 'uppercase' }}>{day}</div>
        <div style={{ ...TYPE.titleM, color: color.onSurface, marginTop: -2 }}>{date}</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...TYPE.bodyL, color: color.onSurface }}>{title}</div>
        <div style={{ ...TYPE.bodyM, color: color.onSurfaceVariant }}>{meta}</div>
      </div>
      <Icon name="forward" size={20} color={color.onSurfaceVariant}/>
    </Card>
  );
}

function SignatureTeaser({ color, feature }) {
  const copy = {
    breadcrumb: { title: 'Breadcrumb trail', body: 'Riders see every turn the group has already taken. Nobody gets lost.', icon: 'route' },
    leadSweep:  { title: 'Lead & Sweep', body: 'Auto-regroup when the sweep falls more than 1 km behind.', icon: 'people' },
    voice:      { title: 'Voice channel', body: 'Tap once to talk. Helmet-friendly low-latency relay.', icon: 'mic' },
    pins:       { title: 'Live rider pins', body: 'See speed, battery and heading for every rider in real time.', icon: 'mapPin' },
    waypoints:  { title: 'Shared waypoints', body: 'Everyone gets the stops, refuels, and coffee breaks pushed to their nav.', icon: 'flag' },
  }[feature] || null;
  if (!copy) return null;
  return (
    <Card color={color} style={{ padding: 16, background: color.tertiaryContainer }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: color.surface, color: color.tertiary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={copy.icon} size={22}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...TYPE.titleM, color: color.onSurface }}>{copy.title}</div>
          <div style={{ ...TYPE.bodyM, color: color.onSurfaceVariant, marginTop: 2 }}>{copy.body}</div>
        </div>
      </div>
    </Card>
  );
}

// Small map thumbnail
function MiniMap({ color, style, height = 100 }) {
  return (
    <svg width="100%" height={height} viewBox="0 0 300 100" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="100" fill={color.mapBg}/>
      <path d="M 300 0 L 300 100 L 240 100 C 220 80, 230 50, 260 40 C 280 30, 300 20, 300 0 Z" fill={color.mapLand}/>
      <path d="M 20 20 C 60 40, 40 60, 80 70 S 160 80, 180 60 S 240 70, 280 50"
            fill="none" stroke={color.mapRouteLine} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="20" cy="20" r="4" fill={color.onSurface}/>
      <circle cx="280" cy="50" r="4" fill={color.onSurface}/>
    </svg>
  );
}

// ─────────────────────────────────────────────
// 2A. Live Map — Squad Radar (classic top-down)
// ─────────────────────────────────────────────
function LiveMapSquadScreen({ color, config, platform }) {
  const [leadT, setLeadT] = React.useState(0.35);
  const riders = useGroupRiders(config.riderCount, leadT);

  // Gentle auto-advance so the map feels alive
  React.useEffect(() => {
    const id = setInterval(() => setLeadT(t => Math.min(0.98, t + 0.002)), 120);
    return () => clearInterval(id);
  }, []);

  const statusBarBg = color.primary;
  return (
    <div style={{ position: 'relative', height: '100%', background: color.mapBg }}>
      {/* Map fills screen */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <MapCanvas color={color} style={config.mapStyle} riders={riders}
                   currentT={leadT} showBreadcrumb={config.signatureFeature === 'breadcrumb' || config.signatureFeature !== 'none'}
                   height={platform === 'ios' ? 874 : 892} width={platform === 'ios' ? 402 : 396}/>
      </div>

      {/* Top status strip */}
      <div style={{
        position: 'absolute', top: platform === 'ios' ? 62 : 48, left: 16, right: 16,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: color.surfaceContainerLowest,
          padding: '10px 8px 10px 14px', borderRadius: 22,
          boxShadow: ELEVATION[2],
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: color.success,
                        animation: 'gr-pulse 1.6s ease-in-out infinite' }}/>
          <div style={{ ...TYPE.labelL, color: color.onSurface }}>The Coast Run · Live</div>
          <div style={{ flex: 1 }}/>
          <div style={{ ...TYPE.labelM, color: color.onSurfaceVariant }}>
            {Math.round(leadT * 184)} / 184 km
          </div>
          <IconButton color={color} size={32}
                      icon={<Icon name="more" size={18} color={color.onSurfaceVariant}/>}/>
        </div>

        {/* Regroup banner (conditional) */}
        {config.signatureFeature === 'leadSweep' && (
          <div style={{
            marginTop: 8, padding: '10px 14px', borderRadius: 16,
            background: color.errorContainer,
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: ELEVATION[1],
          }}>
            <Icon name="alert" size={18} color={color.error}/>
            <div style={{ flex: 1 }}>
              <div style={{ ...TYPE.labelL, color: color.onSurface }}>Sana is 1.2 km behind</div>
              <div style={{ ...TYPE.bodyS, color: color.onSurfaceVariant }}>Tap to slow the group</div>
            </div>
            <OutlinedButton color={color} style={{ height: 32, padding: '0 12px' }}>Slow</OutlinedButton>
          </div>
        )}
      </div>

      {/* Side controls */}
      <div style={{
        position: 'absolute', right: 12, top: platform === 'ios' ? 160 : 140,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <CircleFab color={color} icon="compass"/>
        <CircleFab color={color} icon="people"/>
        <CircleFab color={color} icon="volume"/>
      </div>

      {/* Bottom sheet */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <BottomSheet color={color}>
          {/* Active nav instruction */}
          <div style={{ padding: '0 20px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: color.primary, color: color.onPrimary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TurnArrow direction="right"/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...TYPE.headlineS, color: color.onSurface }}>In 420 m</div>
                <div style={{ ...TYPE.bodyL, color: color.onSurfaceVariant }}>Right onto Seagull Ridge</div>
              </div>
              <IconButton color={color} icon={<Icon name="volume" size={22} color={color.onSurfaceVariant}/>}
                          background={color.surfaceContainerHigh}/>
            </div>
          </div>

          {/* Rider strip */}
          <div style={{ padding: '8px 0 0' }}>
            <div style={{ padding: '0 20px', ...TYPE.labelM, color: color.onSurfaceVariant, textTransform: 'uppercase' }}>
              Riders · {riders.length}
            </div>
            <div style={{ display: 'flex', gap: 10, padding: '10px 20px 14px', overflowX: 'auto' }} className="gr-scroll">
              {riders.map(r => (
                <RiderChip key={r.id} rider={r} color={color}/>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: 8, padding: '0 16px 16px' }}>
            <TonalButton color={color} style={{ flex: 1 }} icon={<Icon name="mic" size={18} color={color.onPrimaryContainer}/>}>Ping</TonalButton>
            <TonalButton color={color} style={{ flex: 1 }} icon={<Icon name="coffee" size={18} color={color.onPrimaryContainer}/>}>Break</TonalButton>
            <TonalButton color={color} style={{ flex: 1 }} icon={<Icon name="fuel" size={18} color={color.onPrimaryContainer}/>}>Fuel</TonalButton>
          </div>
        </BottomSheet>
      </div>
    </div>
  );
}

function CircleFab({ color, icon }) {
  return (
    <div style={{
      width: 44, height: 44, borderRadius: 16,
      background: color.surfaceContainerLowest,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: ELEVATION[2],
    }}>
      <Icon name={icon} size={22} color={color.onSurface}/>
    </div>
  );
}

function TurnArrow({ direction }) {
  // Bold chunky arrow used in nav UIs
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M8 24 V18 Q8 12 14 12 H24 M24 12 L20 8 M24 12 L20 16"
            stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function RiderChip({ rider, color }) {
  const isBattLow = rider.battery < 25;
  return (
    <div style={{
      width: 100, flexShrink: 0,
      background: color.surfaceContainerHigh,
      borderRadius: 14, padding: '10px 10px 8px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    }}>
      <Avatar rider={rider} size={36}/>
      <div style={{ ...TYPE.labelM, color: color.onSurface, textAlign: 'center',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
        {rider.name}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <BatteryGlyph level={rider.battery} color={color}/>
        <span style={{ ...TYPE.labelS, color: isBattLow ? color.error : color.onSurfaceVariant }}>
          {rider.battery}%
        </span>
      </div>
      <div style={{ ...TYPE.labelS, color: color.onSurfaceVariant }}>{rider.speed} km/h</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 2B. Live Map — Convoy Strip (novel layout)
// Map on top, convoy strip shows longitudinal order below.
// ─────────────────────────────────────────────
function LiveMapConvoyScreen({ color, config, platform }) {
  const [leadT, setLeadT] = React.useState(0.42);
  const riders = useGroupRiders(config.riderCount, leadT);
  React.useEffect(() => {
    const id = setInterval(() => setLeadT(t => Math.min(0.98, t + 0.002)), 120);
    return () => clearInterval(id);
  }, []);

  const mapH = platform === 'ios' ? 460 : 440;
  return (
    <div style={{ position: 'relative', height: '100%', background: color.surface, display: 'flex', flexDirection: 'column' }}>
      {/* Top status */}
      <div style={{
        padding: platform === 'ios' ? '58px 16px 10px' : '46px 16px 10px',
        background: color.surface, zIndex: 2,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <IconButton color={color} icon={<Icon name="back" size={22} color={color.onSurface}/>}/>
        <div style={{ flex: 1 }}>
          <div style={{ ...TYPE.titleM, color: color.onSurface }}>Coast Run · Live</div>
          <div style={{ ...TYPE.bodyS, color: color.onSurfaceVariant }}>{Math.round(leadT * 184)} km in · ETA 14:22</div>
        </div>
        <IconButton color={color} icon={<Icon name="more" size={22} color={color.onSurface}/>}/>
      </div>

      {/* Map */}
      <div style={{ position: 'relative', height: mapH, margin: '0 16px', borderRadius: 24, overflow: 'hidden', boxShadow: ELEVATION[1] }}>
        <MapCanvas color={color} style={config.mapStyle} riders={riders}
                   currentT={leadT}
                   showBreadcrumb
                   followLead
                   width={platform === 'ios' ? 370 : 364} height={mapH}/>
        {/* Floating next-turn pill */}
        <div style={{
          position: 'absolute', left: 12, top: 12,
          background: color.primary, color: color.onPrimary,
          borderRadius: 18, padding: '8px 14px 8px 8px',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: ELEVATION[2],
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: color.onPrimary + '33',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: color.onPrimary,
          }}>
            <TurnArrow/>
          </div>
          <div>
            <div style={{ ...TYPE.titleS }}>420 m</div>
            <div style={{ ...TYPE.labelS, opacity: 0.8 }}>Right · Seagull Ridge</div>
          </div>
        </div>
      </div>

      {/* Convoy strip */}
      <div style={{ flex: 1, padding: '16px 16px 24px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 10 }}>
          <div style={{ ...TYPE.titleM, color: color.onSurface }}>Convoy</div>
          <div style={{ flex: 1 }}/>
          <div style={{ ...TYPE.labelM, color: color.onSurfaceVariant }}>Spread · 1.8 km</div>
        </div>

        <ConvoyStrip riders={riders} color={color}/>
      </div>
    </div>
  );
}

// Novel component — horizontal timeline of riders along the route
function ConvoyStrip({ riders, color }) {
  const sorted = [...riders].sort((a, b) => b.t - a.t);
  const tMax = sorted[0]?.t ?? 0.5;
  const tMin = sorted[sorted.length - 1]?.t ?? 0.3;
  const pad = 0.04;
  const rangeMin = Math.max(0, tMin - pad);
  const rangeMax = Math.min(1, tMax + pad);

  const xOf = (t) => {
    const r = (t - rangeMin) / (rangeMax - rangeMin);
    return 4 + r * 92;  // percent
  };

  return (
    <div style={{
      position: 'relative', padding: '24px 0 40px',
      background: color.surfaceContainer, borderRadius: 20,
      marginTop: 4,
    }}>
      {/* route line */}
      <div style={{
        position: 'absolute', left: '4%', right: '4%', top: '50%', height: 6, marginTop: -3,
        background: color.surfaceContainerHighest, borderRadius: 3,
      }}/>
      {/* completed portion */}
      <div style={{
        position: 'absolute', left: '4%', width: `${xOf(tMax) - 4}%`, top: '50%', height: 6, marginTop: -3,
        background: color.primary, borderRadius: 3,
      }}/>

      {/* Start / End labels */}
      <div style={{ position: 'absolute', left: 8, top: 8, ...TYPE.labelS, color: color.onSurfaceVariant }}>
        {Math.round(rangeMin * 184)} km
      </div>
      <div style={{ position: 'absolute', right: 8, top: 8, ...TYPE.labelS, color: color.onSurfaceVariant }}>
        {Math.round(rangeMax * 184)} km
      </div>

      {/* Waypoints */}
      {WAYPOINTS.filter(wp => wp.t >= rangeMin && wp.t <= rangeMax).map((wp, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${xOf(wp.t)}%`, top: '50%', transform: 'translate(-50%, -50%)',
          width: 10, height: 10, borderRadius: 5,
          background: color.surface, border: `2px solid ${color.onSurfaceVariant}`,
        }}/>
      ))}

      {/* Riders */}
      {sorted.map((r, i) => (
        <div key={r.id} style={{
          position: 'absolute', left: `${xOf(r.t)}%`, top: '50%',
          transform: `translate(-50%, ${i % 2 === 0 ? 'calc(-100% - 10px)' : '10px'})`,
        }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            {i % 2 === 0 && (
              <>
                <Avatar rider={r} size={30} ring={r.id === 'you' ? color.primary : null} color={color}/>
                <div style={{
                  width: 1.5, height: 8, background: color.onSurfaceVariant, opacity: 0.5,
                }}/>
              </>
            )}
            {i % 2 === 1 && (
              <>
                <div style={{
                  width: 1.5, height: 8, background: color.onSurfaceVariant, opacity: 0.5,
                }}/>
                <Avatar rider={r} size={30} ring={r.id === 'you' ? color.primary : null} color={color}/>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. Plan Ride
// ─────────────────────────────────────────────
function PlanRideScreen({ color, config, platform }) {
  return (
    <div className="gr-scroll" style={{ height: '100%', padding: platform === 'ios' ? '10px 0 100px' : '0 0 100px' }}>
      <div style={{ padding: '8px 16px 16px' }}>
        <div style={{ ...TYPE.labelM, color: color.onSurfaceVariant, textTransform: 'uppercase' }}>New ride</div>
        <input
          defaultValue="The Coast Run"
          style={{
            ...TYPE.headlineM, color: color.onSurface, background: 'transparent',
            border: 'none', outline: 'none', padding: 0, marginTop: 4, width: '100%',
          }}/>
        <div style={{ ...TYPE.bodyM, color: color.onSurfaceVariant, marginTop: 4 }}>
          Saturday, April 26 · 07:30
        </div>
      </div>

      {/* Route preview */}
      <div style={{ margin: '0 16px', borderRadius: 24, overflow: 'hidden', position: 'relative', height: 220 }}>
        <MapCanvas color={color} style={config.mapStyle}
                   riders={[]} currentT={0.4} showBreadcrumb={false}
                   width={platform === 'ios' ? 370 : 364} height={220}/>
      </div>

      {/* Waypoint list */}
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ ...TYPE.titleM, color: color.onSurface, flex: 1 }}>Stops</div>
          <IconButton color={color} icon={<Icon name="plus" size={22} color={color.primary}/>}
                      background={color.primaryContainer}/>
        </div>
      </div>
      <div style={{ padding: '0 16px' }}>
        <div style={{ position: 'relative' }}>
          {/* vertical connector */}
          <div style={{
            position: 'absolute', left: 27, top: 32, bottom: 32,
            width: 2, background: color.outlineVariant,
          }}/>
          {WAYPOINTS.map((wp, i) => (
            <StopRow key={i} wp={wp} color={color} i={i} total={WAYPOINTS.length}/>
          ))}
        </div>
      </div>

      {/* Invitees */}
      <div style={{ padding: '24px 16px 8px' }}>
        <div style={{ ...TYPE.titleM, color: color.onSurface }}>Riders invited</div>
      </div>
      <div style={{ padding: '0 16px' }}>
        <Card color={color} style={{ padding: '4px 0' }}>
          {ROSTER.slice(0, Math.min(6, config.riderCount)).map((r, i, a) => (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '10px 16px',
              borderBottom: i === a.length - 1 ? 'none' : `1px solid ${color.outlineVariant}`,
            }}>
              <Avatar rider={r} size={36}/>
              <div style={{ flex: 1 }}>
                <div style={{ ...TYPE.bodyL, color: color.onSurface }}>{r.name}</div>
                <div style={{ ...TYPE.bodyS, color: color.onSurfaceVariant }}>
                  {i === 0 ? 'Going' : i < 3 ? 'Going' : i === 3 ? 'Maybe' : 'Pending'}
                </div>
              </div>
              <StatusDot status={i === 0 ? 'going' : i < 3 ? 'going' : i === 3 ? 'maybe' : 'pending'} color={color}/>
            </div>
          ))}
        </Card>
      </div>

      {/* Action */}
      <div style={{ padding: '24px 16px 8px', display: 'flex', gap: 8 }}>
        <OutlinedButton color={color} style={{ flex: 1 }}>Save draft</OutlinedButton>
        <FilledButton color={color} style={{ flex: 2 }}>Send invites</FilledButton>
      </div>
    </div>
  );
}

function StopRow({ wp, color, i, total }) {
  const isStart = wp.kind === 'start';
  const isEnd = wp.kind === 'end';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 0' }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: isStart || isEnd ? color.primary : color.surfaceContainerHigh,
        color: isStart || isEnd ? color.onPrimary : color.onSurfaceVariant,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1,
      }}>
        <Icon name={wp.kind === 'rest' ? 'coffee' : wp.kind === 'fuel' ? 'fuel' : isStart ? 'flag' : isEnd ? 'mapPin' : 'star'} size={22}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...TYPE.labelS, color: color.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1 }}>
          {isStart ? 'Start' : isEnd ? 'End' : wp.kind}
        </div>
        <div style={{ ...TYPE.bodyL, color: color.onSurface }}>{wp.name}</div>
        <div style={{ ...TYPE.bodyS, color: color.onSurfaceVariant }}>
          {Math.round(wp.t * 184)} km · {['07:30','09:05','10:40','12:20','14:22'][i]}
        </div>
      </div>
      <IconButton color={color} icon={<Icon name="menu" size={20} color={color.onSurfaceVariant}/>}/>
    </div>
  );
}

function StatusDot({ status, color }) {
  const c = status === 'going' ? color.success : status === 'maybe' ? color.warn : color.onSurfaceVariant;
  return <div style={{ width: 8, height: 8, borderRadius: 4, background: c }}/>;
}

// ─────────────────────────────────────────────
// 4. Chat + Voice
// ─────────────────────────────────────────────
function ChatScreen({ color, config, platform }) {
  const riders = useGroupRiders(config.riderCount, 0.5);
  const messages = [
    { id: 1, from: riders[1], text: 'Everyone fueled up at Drift? I\u2019m topping off.', at: '10:42' },
    { id: 2, from: riders[3], text: 'Coffee here is incredible 🔥', at: '10:43' },
    { id: 3, kind: 'system', text: 'Dev added Miller\u2019s Cove as a fuel stop' },
    { id: 4, from: riders[0], text: 'Pulling out in 10. Sweep on comms?', at: '10:47', mine: true },
    { id: 5, from: riders[5], text: 'Sweep ready. 🏁', at: '10:48' },
    { id: 6, kind: 'voice', from: riders[2], duration: 6, at: '10:49' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: color.surface }}>
      {/* header */}
      <div style={{
        padding: platform === 'ios' ? '58px 8px 10px' : '46px 8px 10px',
        display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: `1px solid ${color.outlineVariant}`,
      }}>
        <IconButton color={color} icon={<Icon name="back" size={22} color={color.onSurface}/>}/>
        <div style={{ display: 'flex', marginLeft: 4 }}>
          {riders.slice(0, 3).map((r, i) => (
            <div key={r.id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
              <Avatar rider={r} size={32} ring={color.surface} color={color}/>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, marginLeft: 8 }}>
          <div style={{ ...TYPE.titleM, color: color.onSurface }}>The Coast Run</div>
          <div style={{ ...TYPE.bodyS, color: color.onSurfaceVariant }}>{riders.length} members · all live</div>
        </div>
        <IconButton color={color} icon={<Icon name="mic" size={22} color={color.onSurface}/>}/>
      </div>

      {/* messages */}
      <div className="gr-scroll" style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map(m => <Message key={m.id} m={m} color={color}/>)}
      </div>

      {/* composer */}
      <div style={{
        padding: '8px 12px', borderTop: `1px solid ${color.outlineVariant}`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <IconButton color={color} icon={<Icon name="plus" size={22} color={color.onSurfaceVariant}/>}
                    background={color.surfaceContainerHigh}/>
        <div style={{
          flex: 1, height: 44, borderRadius: 22,
          background: color.surfaceContainer,
          display: 'flex', alignItems: 'center', padding: '0 16px',
          ...TYPE.bodyL, color: color.onSurfaceVariant,
        }}>Message the group…</div>
        <IconButton color={color} icon={<Icon name="mic" size={22} color={color.onPrimary}/>}
                    background={color.primary}/>
      </div>
    </div>
  );
}

function Message({ m, color }) {
  if (m.kind === 'system') {
    return (
      <div style={{
        alignSelf: 'center', background: color.surfaceContainer,
        padding: '6px 12px', borderRadius: 12,
        ...TYPE.bodyS, color: color.onSurfaceVariant,
      }}>{m.text}</div>
    );
  }
  const mine = m.mine;
  const align = mine ? 'flex-end' : 'flex-start';
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', alignSelf: align, maxWidth: '80%' }}>
      {!mine && <Avatar rider={m.from} size={28}/>}
      <div style={{
        background: mine ? color.primary : color.surfaceContainerHigh,
        color: mine ? color.onPrimary : color.onSurface,
        borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        padding: m.kind === 'voice' ? '8px 12px' : '8px 14px',
        ...TYPE.bodyM,
      }}>
        {!mine && !m.kind && (
          <div style={{ ...TYPE.labelS, color: color.tertiary, marginBottom: 2 }}>{m.from.name}</div>
        )}
        {m.kind === 'voice' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="play" size={16} color={mine ? color.onPrimary : color.onSurface}/>
            <VoiceBars/>
            <span style={{ ...TYPE.labelS }}>0:0{m.duration}</span>
          </div>
        ) : m.text}
      </div>
      {!mine && m.at && <div style={{ ...TYPE.labelS, color: color.onSurfaceVariant }}>{m.at}</div>}
    </div>
  );
}

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

// ─────────────────────────────────────────────
// 5. Turn by turn
// ─────────────────────────────────────────────
function TurnByTurnScreen({ color, config, platform }) {
  const [leadT, setLeadT] = React.useState(0.55);
  const riders = useGroupRiders(config.riderCount, leadT);
  React.useEffect(() => {
    const id = setInterval(() => setLeadT(t => Math.min(0.98, t + 0.003)), 140);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ position: 'relative', height: '100%', background: color.mapBg }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <MapCanvas color={color} style={config.mapStyle} riders={riders}
                   currentT={leadT} showBreadcrumb followLead
                   width={platform === 'ios' ? 402 : 396} height={platform === 'ios' ? 874 : 892}/>
      </div>

      {/* Big turn card */}
      <div style={{
        position: 'absolute', left: 16, right: 16, top: platform === 'ios' ? 60 : 48,
        background: color.primary, color: color.onPrimary,
        borderRadius: 28, padding: 20,
        boxShadow: ELEVATION[3],
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: color.onPrimary + '22',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: color.onPrimary,
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
          background: color.onPrimary + '22',
          display: 'flex', alignItems: 'center', gap: 10,
          ...TYPE.bodyM,
        }}>
          <Icon name="people" size={18} color={color.onPrimary}/>
          <span>Group stays together here — next turn in 6.4 km</span>
        </div>
      </div>

      {/* Bottom eta card */}
      <div style={{
        position: 'absolute', left: 16, right: 16, bottom: platform === 'ios' ? 40 : 32,
        background: color.surfaceContainerLowest, borderRadius: 24,
        padding: 16, boxShadow: ELEVATION[2],
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...TYPE.headlineS, color: color.primary }}>14:22</div>
          <div style={{ ...TYPE.bodyS, color: color.onSurfaceVariant }}>ETA · 2h 14m left</div>
        </div>
        <div>
          <div style={{ ...TYPE.titleM, color: color.onSurface, textAlign: 'right' }}>124 km</div>
          <div style={{ ...TYPE.bodyS, color: color.onSurfaceVariant, textAlign: 'right' }}>to Harbor Point</div>
        </div>
        <IconButton color={color} background={color.errorContainer}
                    icon={<Icon name="close" size={20} color={color.error}/>}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 6. Regroup / Rest stop
// ─────────────────────────────────────────────
function RegroupScreen({ color, config, platform }) {
  const riders = useGroupRiders(config.riderCount, 0.5);
  return (
    <div className="gr-scroll" style={{ height: '100%', padding: platform === 'ios' ? '10px 16px 32px' : '16px 16px 32px' }}>
      <div style={{ padding: '0 0 16px' }}>
        <div style={{ ...TYPE.labelM, color: color.tertiary, textTransform: 'uppercase', letterSpacing: 1 }}>Regroup</div>
        <div style={{ ...TYPE.headlineM, color: color.onSurface }}>Drift Coffee</div>
        <div style={{ ...TYPE.bodyM, color: color.onSurfaceVariant }}>Stop 3 of 5 · 82 km in</div>
      </div>

      {/* Status summary */}
      <Card color={color} style={{ padding: 16, background: color.secondaryContainer }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: color.primary, color: color.onPrimary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="check" size={22}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...TYPE.titleM, color: color.onSurface }}>
              {Math.ceil(riders.length * 0.66)} of {riders.length} arrived
            </div>
            <div style={{ ...TYPE.bodyM, color: color.onSurfaceVariant }}>Sweep 6 min out · Sana 11 min out</div>
          </div>
        </div>
        <div style={{ marginTop: 14, height: 8, borderRadius: 4, background: color.surface, overflow: 'hidden' }}>
          <div style={{ width: '66%', height: '100%', background: color.primary }}/>
        </div>
      </Card>

      {/* Rider arrival list */}
      <div style={{ paddingTop: 20, paddingBottom: 6, ...TYPE.titleM, color: color.onSurface }}>
        Arrivals
      </div>
      <Card color={color} style={{ padding: '4px 0' }}>
        {riders.map((r, i, a) => {
          const arrived = i < Math.ceil(a.length * 0.66);
          return (
            <div key={r.id} style={{
              padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 14,
              borderBottom: i === a.length - 1 ? 'none' : `1px solid ${color.outlineVariant}`,
            }}>
              <Avatar rider={r} size={36}/>
              <div style={{ flex: 1 }}>
                <div style={{ ...TYPE.bodyL, color: color.onSurface }}>{r.name}</div>
                <div style={{ ...TYPE.bodyS, color: color.onSurfaceVariant }}>
                  {arrived ? 'Arrived · '+(i+1)+' min ago' : (i - Math.ceil(a.length*0.66) + 2) + ' min out · '+r.speed+' km/h'}
                </div>
              </div>
              {arrived
                ? <Icon name="check" size={22} color={color.success}/>
                : <div style={{ ...TYPE.labelM, color: color.warn }}>ETA</div>}
            </div>
          );
        })}
      </Card>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, paddingTop: 16 }}>
        <OutlinedButton color={color} style={{ flex: 1 }}>Extend stop</OutlinedButton>
        <FilledButton color={color} style={{ flex: 1 }}>Roll out</FilledButton>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 7. Recap
// ─────────────────────────────────────────────
function RecapScreen({ color, config, platform }) {
  const riders = useGroupRiders(config.riderCount, 0.5);
  return (
    <div className="gr-scroll" style={{ height: '100%', padding: platform === 'ios' ? '10px 0 32px' : '0 0 32px' }}>
      {/* Hero */}
      <div style={{
        margin: '0 16px 16px', borderRadius: 28, overflow: 'hidden',
        background: color.primaryContainer, padding: 20, position: 'relative',
      }}>
        <div style={{ ...TYPE.labelM, color: color.onPrimaryContainer, opacity: 0.7, textTransform: 'uppercase' }}>
          Ride complete
        </div>
        <div style={{ ...TYPE.displayS, color: color.onPrimaryContainer, marginTop: 4, fontWeight: 500 }}>
          The Coast Run
        </div>
        <div style={{ ...TYPE.bodyL, color: color.onPrimaryContainer, opacity: 0.8 }}>Saturday · 6h 52m</div>
        {/* route mini */}
        <div style={{ marginTop: 14, height: 120, borderRadius: 16, overflow: 'hidden', background: color.surface }}>
          <MiniMap color={color} style={config.mapStyle} height={120}/>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <StatCard color={color} label="Distance" value="184" unit="km"/>
        <StatCard color={color} label="Moving time" value="4:38" unit="hrs"/>
        <StatCard color={color} label="Avg speed" value="52" unit="km/h"/>
        <StatCard color={color} label="Elevation" value="1,210" unit="m"/>
      </div>

      {/* Group together-ness */}
      <div style={{ padding: '20px 16px 6px', ...TYPE.titleM, color: color.onSurface }}>
        Group cohesion
      </div>
      <div style={{ padding: '0 16px' }}>
        <Card color={color} style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ ...TYPE.displayS, color: color.primary, fontWeight: 500 }}>94%</div>
            <div style={{ ...TYPE.bodyM, color: color.onSurfaceVariant }}>together time</div>
          </div>
          <CohesionChart color={color}/>
          <div style={{ ...TYPE.bodyS, color: color.onSurfaceVariant, marginTop: 6 }}>
            Max spread 1.8 km (near Miller's Cove)
          </div>
        </Card>
      </div>

      {/* Rider board */}
      <div style={{ padding: '20px 16px 6px', ...TYPE.titleM, color: color.onSurface }}>
        Riders
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {riders.slice(0, 6).map((r, i) => (
          <Card key={r.id} color={color} style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar rider={r} size={40}/>
            <div style={{ flex: 1 }}>
              <div style={{ ...TYPE.bodyL, color: color.onSurface }}>{r.name}</div>
              <div style={{ ...TYPE.bodyS, color: color.onSurfaceVariant }}>{r.speed + 4} km/h avg · {Math.round(184 - i * 0.4) } km</div>
            </div>
            <div style={{
              ...TYPE.labelM, color: color.tertiary,
              background: color.tertiaryContainer,
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

function StatCard({ color, label, value, unit }) {
  return (
    <Card color={color} style={{ padding: 14 }}>
      <div style={{ ...TYPE.labelM, color: color.onSurfaceVariant, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
        <div style={{ ...TYPE.headlineM, color: color.onSurface, fontWeight: 500 }}>{value}</div>
        <div style={{ ...TYPE.bodyS, color: color.onSurfaceVariant }}>{unit}</div>
      </div>
    </Card>
  );
}

function CohesionChart({ color }) {
  // fake cohesion-over-time sparkline
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
      <path d={d} fill="none" stroke={color.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={color.primary} opacity="0.15"/>
    </svg>
  );
}

// ─────────────────────────────────────────────
// 8. Invite
// ─────────────────────────────────────────────
function InviteScreen({ color, config, platform }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: color.surface,
                  padding: platform === 'ios' ? '10px 16px 32px' : '16px 16px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0 12px' }}>
        <IconButton color={color} icon={<Icon name="close" size={22} color={color.onSurface}/>}/>
        <div style={{ flex: 1, textAlign: 'center', ...TYPE.titleM, color: color.onSurface }}>Invite riders</div>
        <div style={{ width: 40 }}/>
      </div>
      <div style={{ ...TYPE.headlineS, color: color.onSurface, textAlign: 'center', padding: '8px 0 0' }}>
        The Coast Run
      </div>
      <div style={{ ...TYPE.bodyM, color: color.onSurfaceVariant, textAlign: 'center', padding: '4px 0 24px' }}>
        Share this code or scan to join
      </div>
      {/* QR */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 0 20px' }}>
        <div style={{
          width: 200, height: 200, borderRadius: 24,
          background: color.surfaceContainerLowest, padding: 16,
          boxShadow: ELEVATION[1],
        }}>
          <QRStylized color={color}/>
        </div>
      </div>
      {/* Code */}
      <div style={{
        alignSelf: 'center', padding: '8px 20px', borderRadius: 16,
        background: color.primaryContainer, color: color.onPrimaryContainer,
        ...TYPE.headlineS, fontFamily: '"Roboto Mono", monospace', letterSpacing: 8,
      }}>RIDE · 7K3M</div>

      {/* Invitees preview */}
      <div style={{ marginTop: 24, ...TYPE.titleS, color: color.onSurfaceVariant, textTransform: 'uppercase' }}>
        Recent
      </div>
      <Card color={color} style={{ marginTop: 8, padding: '4px 0' }}>
        {ROSTER.slice(6, 10).map((r, i, a) => (
          <div key={r.id} style={{
            padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 14,
            borderBottom: i === a.length - 1 ? 'none' : `1px solid ${color.outlineVariant}`,
          }}>
            <Avatar rider={r} size={36}/>
            <div style={{ flex: 1 }}>
              <div style={{ ...TYPE.bodyL, color: color.onSurface }}>{r.name}</div>
              <div style={{ ...TYPE.bodyS, color: color.onSurfaceVariant }}>Rode together 2 weeks ago</div>
            </div>
            <OutlinedButton color={color} style={{ height: 32, padding: '0 16px' }}>Invite</OutlinedButton>
          </div>
        ))}
      </Card>

      <div style={{ flex: 1 }}/>
      <div style={{ display: 'flex', gap: 10 }}>
        <OutlinedButton color={color} style={{ flex: 1 }}>Copy link</OutlinedButton>
        <FilledButton color={color} style={{ flex: 1 }}>Share</FilledButton>
      </div>
    </div>
  );
}

function QRStylized({ color }) {
  // Stylized QR-ish pattern, not a real QR
  const cells = [];
  const seed = (i, j) => ((i * 7 + j * 13 + i * j) % 5) > 1;
  for (let i = 0; i < 17; i++) for (let j = 0; j < 17; j++) {
    // skip reserved corner areas (where finder patterns live)
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
              fill={color.onSurface}/>
      ))}
      {/* finder patterns */}
      {[[0,0],[0,13],[13,0]].map(([i,j], k) => (
        <g key={k} transform={`translate(${j*cell},${i*cell})`}>
          <rect width={4*cell} height={4*cell} rx={8} fill={color.onSurface}/>
          <rect x={cell*0.6} y={cell*0.6} width={4*cell - cell*1.2} height={4*cell - cell*1.2} rx={6} fill={color.surfaceContainerLowest}/>
          <rect x={cell*1.3} y={cell*1.3} width={4*cell - cell*2.6} height={4*cell - cell*2.6} rx={4} fill={color.onSurface}/>
        </g>
      ))}
    </svg>
  );
}

Object.assign(window, {
  GroupHomeScreen, LiveMapSquadScreen, LiveMapConvoyScreen,
  PlanRideScreen, ChatScreen, TurnByTurnScreen,
  RegroupScreen, RecapScreen, InviteScreen, MiniMap,
});
