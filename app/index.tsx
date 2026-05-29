import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants';
import { formatTime, formatLabel } from '@/utils/formatTime';
import { EditModal } from '@/components/EditModal';
import { useConfig } from '@/hooks/useConfig';

export default function HomeScreen() {
  const router = useRouter();
  const { config, updateChrono } = useConfig();
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleLaunch = (index: number): void => {
    router.push({
      pathname: '/timer',
      params: { durationSeconds: config.chronos[index], totalSeries: 4 },
    });
  };

  const handleSaveChrono = async (seconds: number): Promise<void> => {
    if (editIndex === null) return;
    await updateChrono(editIndex, seconds);
    setEditIndex(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <Text style={styles.title}>
          TimerVibe<Text style={styles.titleAccent}>.</Text>
        </Text>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {config.chronos.map((secs, i) => (
          <TouchableOpacity key={i} style={styles.btn} onPress={() => handleLaunch(i)} activeOpacity={0.7}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setEditIndex(i)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.editIcon}>✎</Text>
            </TouchableOpacity>
            <Text style={styles.btnTime}>{formatTime(secs)}</Text>
            <Text style={styles.btnSub}>{formatLabel(secs)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {editIndex !== null && (
        <EditModal
          visible
          currentSeconds={config.chronos[editIndex]}
          onSave={handleSaveChrono}
          onCancel={() => setEditIndex(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 14, paddingBottom: 10,
  },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  titleAccent: { color: COLORS.accent },
  settingsBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.surface, borderWidth: 0.5, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  settingsIcon: { fontSize: 18, color: COLORS.muted },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 24,
    rowGap: 12,
    paddingBottom: 24,
  },
  btn: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  btnTime: { fontSize: 38, fontWeight: '300', color: COLORS.text, letterSpacing: -1.5 },
  btnSub: { fontSize: 10, color: COLORS.muted, marginTop: 6, letterSpacing: 0.5 },
  editBtn: {
    position: 'absolute', top: 10, right: 12,
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  editIcon: { fontSize: 13, color: COLORS.muted },
});
