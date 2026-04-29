import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateM3Theme, SEEDS } from './theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [seedKey, setSeedKey] = useState('teal');
  const [isDark, setIsDark] = useState(false); // Can be tied to system preference

  useEffect(() => {
    const cssVars = generateM3Theme(seedKey, isDark);
    const styleId = 'm3-theme-vars';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `:root {\n${cssVars}\n}`;
  }, [seedKey, isDark]);

  return (
    <ThemeContext.Provider value={{ seedKey, setSeedKey, isDark, setIsDark, SEEDS }}>
      <div
        className={`theme-root ${isDark ? 'dark' : 'light'}`}
        style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
