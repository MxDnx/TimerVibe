import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig, DEFAULT_CONFIG, STORAGE_KEY } from '@/constants';

interface UseConfigReturn {
  config: AppConfig;
  loaded: boolean;
  updateConfig: (partial: Partial<AppConfig>) => Promise<void>;
  updateChrono: (index: number, seconds: number) => Promise<void>;
  resetConfig: () => Promise<void>;
}

export function useConfig(): UseConfigReturn {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<AppConfig>;
          setConfig({ ...DEFAULT_CONFIG, ...saved });
        }
      } catch (e) {
        console.warn('Erreur chargement config:', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const updateConfig = useCallback(async (partial: Partial<AppConfig>): Promise<void> => {
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((e) =>
        console.warn('Erreur sauvegarde config:', e)
      );
      return next;
    });
  }, []);

  const updateChrono = useCallback(
    async (index: number, seconds: number): Promise<void> => {
      const chronos = [...config.chronos];
      chronos[index] = seconds;
      await updateConfig({ chronos });
    },
    [config.chronos, updateConfig]
  );

  const resetConfig = useCallback(async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setConfig(DEFAULT_CONFIG);
  }, []);

  return { config, loaded, updateConfig, updateChrono, resetConfig };
}
