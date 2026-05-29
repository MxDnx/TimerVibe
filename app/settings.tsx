import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants';
import { formatTime } from '@/utils/formatTime';
import { useConfig } from '@/hooks/useConfig';

export default function SettingsScreen() {
  const router = useRouter();
  const { config, updateConfig, resetConfig } = useConfig();

  const handleReset = (): void => {
    Alert.alert(
      'Réinitialiser les chronos',
      'Remettre les 6 durées par défaut ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Réinitialiser', style: 'destructive', onPress: resetConfig },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backIcon}>‹</Text>
            <Text style={styles.backText}>Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Réglages</Text>
        </View>

        <Text style={styles.sectionLabel}>VIBRATIONS</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowIcon}><Text>📳</Text></View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Vibrations activées</Text>
              <Text style={styles.rowSub}>3 · 2 · 1 · 0 secondes</Text>
            </View>
            <Switch
              value={config.vibrationEnabled}
              onValueChange={(v) => updateConfig({ vibrationEnabled: v })}
              trackColor={{ false: '#2a2a30', true: COLORS.accent }}
              thumbColor="#fff"
            />
          </View>
          <View style={[styles.row, styles.rowLast, !config.vibrationEnabled && styles.rowDisabled]}>
            <View style={styles.rowIcon}><Text>💥</Text></View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Vibration finale plus forte</Text>
              <Text style={styles.rowSub}>À 0 seconde</Text>
            </View>
            <Switch
              value={config.vibrationFinalStrong && config.vibrationEnabled}
              onValueChange={(v) => updateConfig({ vibrationFinalStrong: v })}
              disabled={!config.vibrationEnabled}
              trackColor={{ false: '#2a2a30', true: COLORS.accent }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>AFFICHAGE</Text>
        <View style={styles.card}>
          <View style={[styles.row, styles.rowLast]}>
            <View style={styles.rowIcon}><Text>☀️</Text></View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Garder l'écran allumé</Text>
              <Text style={styles.rowSub}>Pendant le chrono</Text>
            </View>
            <Switch
              value={config.keepAwake}
              onValueChange={(v) => updateConfig({ keepAwake: v })}
              trackColor={{ false: '#2a2a30', true: COLORS.accent }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>DONNÉES</Text>
        <View style={styles.card}>
          <TouchableOpacity style={[styles.row, styles.rowLast]} onPress={handleReset}>
            <View style={styles.rowIcon}><Text>🔄</Text></View>
            <View style={styles.rowBody}>
              <Text style={[styles.rowTitle, styles.rowTitleDanger]}>Réinitialiser les chronos</Text>
              <Text style={styles.rowSub}>Remet les 6 durées par défaut</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>TimerVibe. v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backIcon: { fontSize: 22, color: COLORS.muted, lineHeight: 22 },
  backText: { fontSize: 12, color: COLORS.muted },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  sectionLabel: { fontSize: 10, color: COLORS.muted, letterSpacing: 1.5, marginBottom: 8, marginLeft: 4 },
  card: {
    backgroundColor: COLORS.surface, borderRadius: 18,
    borderWidth: 0.5, borderColor: COLORS.border, overflow: 'hidden', marginBottom: 24,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  rowLast: { borderBottomWidth: 0 },
  rowDisabled: { opacity: 0.4 },
  rowIcon: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: COLORS.surface2, alignItems: 'center', justifyContent: 'center',
  },
  rowBody: { flex: 1 },
  rowTitle: { flex: 1, fontSize: 13, color: COLORS.text },
  rowTitleDanger: { color: COLORS.danger },
  rowSub: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  chevron: { fontSize: 18, color: COLORS.muted },
  chronoInputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.surface2, borderRadius: 10,
    borderWidth: 0.5, borderColor: COLORS.border,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  chronoInput: {
    fontSize: 15, fontWeight: '500', color: COLORS.accent,
    minWidth: 36, textAlign: 'right',
  },
  chronoUnit: { fontSize: 11, color: COLORS.muted },
  chronoFormatted: { fontSize: 11, color: COLORS.muted, minWidth: 36, textAlign: 'right' },
  seriesPicker: { flexDirection: 'row', padding: 12, gap: 6 },
  spDot: {
    flex: 1, height: 38, borderRadius: 10,
    backgroundColor: COLORS.surface2, borderWidth: 0.5, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  spDotSelected: { backgroundColor: 'rgba(200,245,90,0.12)', borderColor: 'rgba(200,245,90,0.4)' },
  spDotText: { fontSize: 13, color: COLORS.muted },
  spDotTextSelected: { color: COLORS.accent },
  version: { textAlign: 'center', fontSize: 10, color: '#333', marginTop: 8 },
});
