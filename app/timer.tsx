import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import { COLORS } from '@/constants';
import { formatTime } from '@/utils/formatTime';
import { useTimer } from '@/hooks/useTimer';
import { useConfig } from '@/hooks/useConfig';
import { SeriesDots } from '@/components/SeriesDots';

export default function TimerScreen() {
  const router = useRouter();
  const { config } = useConfig();
  const params = useLocalSearchParams<{ durationSeconds: string; totalSeries: string }>();
  const durationSeconds = Number(params.durationSeconds);
  const [totalSeries, setTotalSeries] = useState<number>(Number(params.totalSeries));

  if (config.keepAwake) useKeepAwake();

  const { secondsLeft, currentSerie, running, finished, start, stop } =
    useTimer(durationSeconds, totalSeries, {
      enabled: config.vibrationEnabled,
      finalStrong: config.vibrationFinalStrong,
    });

  const isWarning = secondsLeft <= 3 && running;
  const remaining = totalSeries - (currentSerie - 1);

  const handleSeriesSelect = (n: number): void => {
    setTotalSeries(n + (currentSerie - 1));
  };

  // Flash animation
  const flash = useSharedValue(0);
  const prevSerieRef = useRef(1);

  const triggerFlash = () => {
    flash.value = withSequence(
      withTiming(1, { duration: 80 }),
      withTiming(0, { duration: 420 }),
    );
  };

  useEffect(() => {
    if (currentSerie !== prevSerieRef.current) {
      prevSerieRef.current = currentSerie;
      triggerFlash();
    }
  }, [currentSerie]);

  useEffect(() => {
    if (finished) triggerFlash();
  }, [finished]);

  const bgAnimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(flash.value, [0, 1], [COLORS.bg, COLORS.accent]),
  }));

  const arcAnimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(flash.value, [0, 1], ['transparent', COLORS.bg]),
    borderColor: interpolateColor(flash.value, [0, 1], [isWarning ? COLORS.danger : COLORS.accent, COLORS.bg]),
  }));

  const timeAnimStyle = useAnimatedStyle(() => ({
    color: interpolateColor(flash.value, [0, 1], [isWarning ? COLORS.danger : COLORS.text, COLORS.accent]),
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[StyleSheet.absoluteFill, bgAnimStyle]} />
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backIcon}>‹</Text>
        <Text style={styles.backText}>Retour</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.circleWrap}
          onPress={() => { if (!running && !finished) start(); }}
          activeOpacity={0.85}
          disabled={running || finished}
        >
          <Animated.View style={[styles.arcOuter, arcAnimStyle]}>
            <View style={styles.arcInner}>
              <Animated.Text style={[styles.timeDisplay, timeAnimStyle]}>
                {finished ? '✓' : formatTime(secondsLeft)}
              </Animated.Text>
              {!running && !finished && (
                <Text style={styles.tapLabel}>DÉMARRER</Text>
              )}
              {running && (
                <TouchableOpacity
                  style={styles.stopBtn}
                  onPress={(e) => { e.stopPropagation(); stop(); }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.stopText}>ARRÊTER</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.seriesWrap}>
          <SeriesDots filled={remaining} onSelect={handleSeriesSelect} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1, backgroundColor: COLORS.bg,
    alignItems: 'center', paddingHorizontal: 24, paddingBottom: 36,
  },
  backBtn: {
    flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center',
    paddingTop: 16, paddingBottom: 8, gap: 4,
  },
  backIcon: { fontSize: 22, color: COLORS.muted, lineHeight: 22 },
  backText: { fontSize: 12, color: COLORS.muted },
  content: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'space-around' },
  circleWrap: { width: 290, height: 290, borderRadius: 145, alignItems: 'center', justifyContent: 'center' },
  arcOuter: {
    width: 290, height: 290, borderRadius: 145,
    borderWidth: 5,
    alignItems: 'center', justifyContent: 'center',
  },
  arcInner: { alignItems: 'center' },
  timeDisplay: { fontSize: 62, fontWeight: '300', letterSpacing: -2, lineHeight: 68 },
  tapLabel: { fontSize: 10, color: COLORS.accent, letterSpacing: 2, marginTop: 6 },
  stopBtn: {
    marginTop: 14, paddingVertical: 6, paddingHorizontal: 16, borderRadius: 10,
    backgroundColor: 'rgba(255,95,95,0.08)', borderWidth: 0.5, borderColor: 'rgba(255,95,95,0.25)',
  },
  stopText: { fontSize: 11, color: COLORS.danger, letterSpacing: 1.5 },
  seriesWrap: { width: '100%' },
});
