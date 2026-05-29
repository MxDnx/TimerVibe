export const COLORS = {
  bg: '#0d0d0f',
  surface: '#161618',
  surface2: '#1e1e22',
  border: 'rgba(255,255,255,0.07)',
  accent: '#c8f55a',
  accentDim: 'rgba(200,245,90,0.12)',
  text: '#f0f0ee',
  muted: '#6b6b72',
  danger: '#ff5f5f',
} as const;

export const DEFAULT_CHRONOS: number[] = [25, 60, 90, 120, 180, 300];

export interface AppConfig {
  chronos: number[];
  defaultSeries: number;
  vibrationEnabled: boolean;
  vibrationFinalStrong: boolean;
  keepAwake: boolean;
}

export const DEFAULT_CONFIG: AppConfig = {
  chronos: DEFAULT_CHRONOS,
  defaultSeries: 4,
  vibrationEnabled: true,
  vibrationFinalStrong: true,
  keepAwake: true,
};

export const STORAGE_KEY = 'rest_config';
