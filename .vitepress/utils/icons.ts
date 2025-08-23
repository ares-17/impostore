// Tipi per le configurazioni delle icone
export interface IconConfig {
  path: string;
  viewBox: string;
  strokeWidth?: number;
}

// Configurazioni predefinite per le icone
export const ICONS = {
  PLUS: {
    path: 'M12 5V19M5 12H19',
    viewBox: '0 0 24 24',
    strokeWidth: 2
  },
  COPY: {
    path: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
    viewBox: '0 0 24 24',
    strokeWidth: 2
  },
  MINUS: {
    path: 'M5 12H19',
    viewBox: '0 0 24 24',
    strokeWidth: 2
  },
  EDIT: {
    path: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    viewBox: '0 0 24 24',
    strokeWidth: 2
  },
  DELETE: {
    path: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    viewBox: '0 0 24 24',
    strokeWidth: 2
  }
} as const;

// Configurazioni predefinite per i colori
export const COLOR_SCHEMES = {
  PRIMARY: {
    bg: 'var(--vp-c-brand)',
    hoverBg: 'var(--vp-c-brand-soft)',
    icon: 'white',
    hoverIcon: 'var(--vp-c-brand)'
  },
  SECONDARY: {
    bg: 'var(--vp-c-gray-2)',
    hoverBg: 'white',
    icon: 'var(--vp-c-text-1)',
    hoverIcon: 'var(--vp-c-gray-2)'
  },
  DANGER: {
    bg: 'var(--vp-c-red-1)',
    hoverBg: 'white',
    icon: 'white',
    hoverIcon: 'var(--vp-c-red-1)'
  },
  SUCCESS: {
    bg: 'var(--vp-c-green)',
    hoverBg: 'white',
    icon: 'white',
    hoverIcon: 'var(--vp-c-green)'
  },
  WARNING: {
    bg: 'var(--vp-c-yellow)',
    hoverBg: 'white',
    icon: 'white',
    hoverIcon: 'var(--vp-c-yellow)'
  }
} as const;

// Tipo per lo schema colore
export type ColorScheme = keyof typeof COLOR_SCHEMES;

export const TOAST_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
} as const;