import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { COLORS } from '@/constants';

interface SeriesDotsProps {
  filled: number;
  maxSlots?: number;
  onSelect?: (n: number) => void;
}

function Dot({ n, active, onPress }: { n: number; active: boolean; onPress?: () => void }) {
  const opacity = useSharedValue(active ? 1 : 0.18);

  useEffect(() => {
    opacity.value = withTiming(active ? 1 : 0.18, { duration: 450 });
  }, [active]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <TouchableOpacity
      style={styles.dotWrap}
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.dot, animStyle]}>
        <Text style={styles.dotNum}>{n}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export function SeriesDots({
  filled,
  maxSlots = 6,
  onSelect,
}: SeriesDotsProps): React.JSX.Element {
  return (
    <View style={styles.row}>
      {Array.from({ length: maxSlots }).map((_, i) => {
        const n = i + 1;
        return (
          <Dot
            key={n}
            n={n}
            active={n <= filled}
            onPress={onSelect ? () => onSelect(n) : undefined}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, alignItems: 'center', flex: 1 },
  dotWrap: { flex: 1, alignItems: 'center' },
  dot: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotNum: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.bg,
  },
});
