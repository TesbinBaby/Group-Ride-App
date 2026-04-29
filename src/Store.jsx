import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROSTER } from './theme';

const AppStateContext = createContext();

export function AppStateProvider({ children }) {
  const [riders, setRiders] = useState(
    ROSTER.map((r, i) => ({
      ...r,
      t: Math.max(0, 0.35 - i * 0.04 - Math.random() * 0.02) // Distribute riders along the route
    }))
  );
  
  const [meId] = useState('you');
  const [signatureFeature, setSignatureFeature] = useState('leadSweep'); // For conditional regroup banner

  // Simulation tick to make riders move
  useEffect(() => {
    const timer = setInterval(() => {
      setRiders(prev => prev.map(r => {
        let newT = r.t + (r.speed / 100000);
        if (newT > 1) newT = 1;
        return { ...r, t: newT };
      }));
    }, 120); // roughly 120ms tick
    return () => clearInterval(timer);
  }, []);

  return (
    <AppStateContext.Provider value={{ riders, meId, signatureFeature, setSignatureFeature }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}
