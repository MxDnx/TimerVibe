import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { COLORS, DEFAULT_CHRONOS } from '@/constants';
import { formatTime, formatLabel } from '@/utils/formatTime';

interface EditModalProps {
  visible: boolean;
  currentSeconds: number;
  onSave: (seconds: number) => void;
  onCancel: () => void;
}

export function EditModal({
  visible,
  currentSeconds,
  onSave,
  onCancel,
}: EditModalProps): React.JSX.Element {
  const [selected, setSelected] = useState<number>(currentSeconds);

  const mins = Math.floor(selected / 60);
  const secs = selected % 60;

  const [minsText, setMinsText] = useState<string>(String(mins));
  const [secsText, setSecsText] = useState<string>(String(secs).padStart(2, '0'));

  useEffect(() => {
    setMinsText(String(Math.floor(selected / 60)));
    setSecsText(String(selected % 60).padStart(2, '0'));
  }, [selected]);

  const adjust = (delta: number): void => {
    setSelected((s) => Math.max(5, Math.min(3600, s + delta)));
  };

  const commitMins = (): void => {
    const m = Math.max(0, Math.min(59, parseInt(minsText, 10) || 0));
    const total = Math.max(5, m * 60 + secs);
    setSelected(total);
  };

  const commitSecs = (): void => {
    const s = Math.max(0, Math.min(59, parseInt(secsText, 10) || 0));
    const total = Math.max(5, mins * 60 + s);
    setSelected(total);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>Modifier le chrono</Text>
        <Text style={styles.sheetSub}>actuellement {formatTime(currentSeconds)}</Text>
        <Text style={[styles.display, selected !== currentSeconds && styles.displayChanged]}>
          {formatTime(selected)}
        </Text>
        <Text style={styles.displayLabel}>{formatLabel(selected)}</Text>
        <Text style={styles.presetsLabel}>DURÉES RAPIDES</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsScroll}>
          <View style={styles.presets}>
            {DEFAULT_CHRONOS.map((secs) => (
              <TouchableOpacity
                key={secs}
                style={[styles.preset, selected === secs && styles.presetSelected]}
                onPress={() => setSelected(secs)}
              >
                <Text style={[styles.presetText, selected === secs && styles.presetTextSelected]}>
                  {formatTime(secs)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={styles.adjustRow}>
          <TouchableOpacity style={styles.adjustBtn} onPress={() => adjust(-5)}>
            <Text style={styles.adjustText}>−</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.adjustPart}
            value={minsText}
            onChangeText={setMinsText}
            onBlur={commitMins}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
          />
          <Text style={styles.adjustSep}>:</Text>
          <TextInput
            style={styles.adjustPart}
            value={secsText}
            onChangeText={setSecsText}
            onBlur={commitSecs}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
          />
          <TouchableOpacity style={styles.adjustBtn} onPress={() => adjust(5)}>
            <Text style={styles.adjustText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnCancel} onPress={onCancel}>
            <Text style={styles.btnCancelText}>ANNULER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSave} onPress={() => {
          const m = Math.max(0, Math.min(59, parseInt(minsText, 10) || 0));
          const s = Math.max(0, Math.min(59, parseInt(secsText, 10) || 0));
          onSave(Math.max(5, m * 60 + s));
        }}>
            <Text style={styles.btnSaveText}>SAUVEGARDER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    backgroundColor: '#18181c',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  handle: {
    width: 36, height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2, alignSelf: 'center',
    marginTop: 12, marginBottom: 20,
  },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  sheetSub: { fontSize: 11, color: COLORS.muted, marginBottom: 20 },
  display: { fontSize: 56, fontWeight: '300', color: COLORS.text, textAlign: 'center', letterSpacing: -2 },
  displayChanged: { color: COLORS.accent },
  displayLabel: { fontSize: 11, color: COLORS.muted, textAlign: 'center', marginTop: 4, marginBottom: 24, letterSpacing: 0.5 },
  presetsLabel: { fontSize: 10, color: COLORS.muted, letterSpacing: 1.5, marginBottom: 10 },
  presetsScroll: { marginBottom: 20 },
  presets: { flexDirection: 'row', gap: 8 },
  preset: { backgroundColor: COLORS.surface2, borderWidth: 0.5, borderColor: COLORS.border, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
  presetSelected: { backgroundColor: 'rgba(200,245,90,0.1)', borderColor: 'rgba(200,245,90,0.5)' },
  presetText: { fontSize: 13, color: COLORS.muted },
  presetTextSelected: { color: COLORS.accent },
  adjustRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 28 },
  adjustBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.surface2, borderWidth: 0.5, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  adjustText: { fontSize: 24, color: COLORS.text, lineHeight: 28 },
  adjustPart: {
    fontSize: 28, fontWeight: '300', color: COLORS.accent,
    minWidth: 44, textAlign: 'center', letterSpacing: -1,
  },
  adjustSep: { fontSize: 28, fontWeight: '300', color: COLORS.text, letterSpacing: -1 },
  actions: { flexDirection: 'row', gap: 10 },
  btnCancel: { flex: 1, height: 50, borderRadius: 16, backgroundColor: COLORS.surface2, borderWidth: 0.5, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  btnCancelText: { fontSize: 12, color: COLORS.muted, letterSpacing: 1 },
  btnSave: { flex: 2, height: 50, borderRadius: 16, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  btnSaveText: { fontSize: 13, fontWeight: '500', color: COLORS.bg, letterSpacing: 1 },
});
