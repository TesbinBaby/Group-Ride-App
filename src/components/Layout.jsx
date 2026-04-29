import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from './Primitives';
import { TYPE } from '../theme';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Group', icon: 'people' },
    { path: '/live', label: 'Live', icon: 'mapPin' },
    { path: '/plan', label: 'Plan', icon: 'route' },
    { path: '/chat', label: 'Chat', icon: 'chat' }
  ];

  // Some screens hide bottom nav (e.g. Nav, Invite, Regroup, Recap)
  const hideNav = ['/nav', '/invite', '/recap', '/regroup'].includes(location.pathname);

  return (
    <div className="app-container">
      {/* Main Content Area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      {!hideNav && (
        <div style={{
          height: 80,
          background: 'var(--md-sys-color-surface-container)',
          borderTop: '1px solid var(--md-sys-color-outline-variant)',
          padding: '12px 16px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          zIndex: 100
        }}>
          {tabs.map(t => {
            const selected = location.pathname === t.path;
            return (
              <div key={t.path} onClick={() => navigate(t.path)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                cursor: 'pointer', flex: 1
              }}>
                <div className="gr-press" style={{
                  width: 64, height: 32, borderRadius: 16,
                  background: selected ? 'var(--md-sys-color-secondary-container)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: selected ? 'var(--md-sys-color-on-surface)' : 'var(--md-sys-color-on-surface-variant)'
                }}>
                  <Icon name={t.icon} size={24} color="currentColor" />
                </div>
                <div style={{
                  ...TYPE.labelS,
                  color: selected ? 'var(--md-sys-color-on-surface)' : 'var(--md-sys-color-on-surface-variant)'
                }}>
                  {t.label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
