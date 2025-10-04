'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

export function ForceLightTheme() {
  const { setTheme, theme } = useTheme();
  const originalThemeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (originalThemeRef.current === undefined) {
      originalThemeRef.current = theme;
    }

    if (theme !== 'light') {
      setTheme('light');
    }

    return () => {
      if (originalThemeRef.current && theme !== originalThemeRef.current) {
        setTheme(originalThemeRef.current);
      }
    };
  }, [theme, setTheme]);

  return null;
}
