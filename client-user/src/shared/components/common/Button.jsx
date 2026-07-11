// src/shared/components/common/Button.jsx
// Botón principal con degradado amarillo (igual al de los mockups Login/Registro).
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOWS } from '../../constants/theme';

export default function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) {
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';
  const isDisabled = disabled || loading;

  if (isSecondary || isDanger) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[styles.base, isDanger ? styles.dangerOutline : styles.secondary, isDisabled && styles.disabled, style]}
      >
        {loading ? (
          <ActivityIndicator color={isDanger ? COLORS.error : COLORS.primary} />
        ) : (
          <Text style={[styles.text, isDanger ? styles.textDanger : styles.textSecondary]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.85} style={[styles.shadowWrap, style]}>
      <LinearGradient
        colors={isDisabled ? ['#e5c56b', '#d8b45a'] : [COLORS.accent, COLORS.accentDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.base}
      >
        {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={[styles.text, styles.textPrimary]}>{title}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadowWrap: { borderRadius: RADIUS.xl, ...SHADOWS.card },
  base: { minHeight: 50, borderRadius: RADIUS.xl, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  secondary: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
  dangerOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.error },
  disabled: { opacity: 0.6 },
  text: { fontSize: FONT_SIZE.md, fontWeight: '700' },
  textPrimary: { color: '#ffffff' },
  textSecondary: { color: COLORS.primary },
  textDanger: { color: COLORS.error },
});