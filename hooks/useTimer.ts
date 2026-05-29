import { useState, useEffect, useRef, useCallback } from 'react';
import * as Haptics from 'expo-haptics';

interface VibConfig {
  enabled: boolean;
  finalStrong: boolean;
}

interface UseTimerReturn {
  secondsLeft: number;
  currentSerie: number;
  running: boolean;
  finished: boolean;
  start: () => void;
  restart: () => void;
  stop: () => void;
}

export function useTimer(
  durationSeconds: number,
  totalSeries: number,
  vibConfig: VibConfig
): UseTimerReturn {
  const [secondsLeft, setSecondsLeft] = useState<number>(durationSeconds);
  const [currentSerie, setCurrentSerie] = useState<number>(1);
  const [running, setRunning] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef<number>(durationSeconds);
  const serieRef = useRef<number>(1);
  const totalSeriesRef = useRef<number>(totalSeries);
  const vibConfigRef = useRef<VibConfig>(vibConfig);

  useEffect(() => { totalSeriesRef.current = totalSeries; }, [totalSeries]);
  useEffect(() => { vibConfigRef.current = vibConfig; }, [vibConfig]);

  useEffect(() => {
    if (!running) {
      secondsRef.current = durationSeconds;
      setSecondsLeft(durationSeconds);
    }
  }, [durationSeconds, running]);

  const vibrate = useCallback((isFinal: boolean = false): void => {
    const { enabled, finalStrong } = vibConfigRef.current;
    if (!enabled) return;
    if (isFinal && finalStrong) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  const clearTimer = useCallback((): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback((): void => {
    secondsRef.current -= 1;
    const s = secondsRef.current;

    if (s === 3 || s === 2 || s === 1) vibrate(false);
    if (s === 0) vibrate(true);

    setSecondsLeft(s);

    if (s <= 0) {
      clearTimer();
      if (serieRef.current >= totalSeriesRef.current) {
        setRunning(false);
        setFinished(true);
        return;
      }
      serieRef.current += 1;
      setCurrentSerie(serieRef.current);
      secondsRef.current = durationSeconds;
      setSecondsLeft(durationSeconds);
      setRunning(false);
    }
  }, [durationSeconds, vibrate, clearTimer]);

  const start = useCallback((): void => {
    if (running) return;
    clearTimer();
    setRunning(true);
    setFinished(false);
    intervalRef.current = setInterval(tick, 1000);
  }, [running, tick, clearTimer]);

  const restart = useCallback((): void => {
    clearTimer();
    secondsRef.current = durationSeconds;
    setSecondsLeft(durationSeconds);
    setRunning(true);
    setFinished(false);
    intervalRef.current = setInterval(tick, 1000);
  }, [durationSeconds, tick, clearTimer]);

  const stop = useCallback((): void => {
    clearTimer();
    setRunning(false);
    secondsRef.current = durationSeconds;
    setSecondsLeft(durationSeconds);
  }, [durationSeconds, clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return { secondsLeft, currentSerie, running, finished, start, restart, stop };
}
