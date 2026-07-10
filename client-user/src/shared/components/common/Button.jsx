// src/shared/components/common/Button.jsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) {
  const isSecondary = variant === 'secondary';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        isSecondary ? styles.secondary : styles.primary,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? COLORS.primary : '#ffffff'} />
      ) : (
        <Text style={[styles.text, isSecondary ? styles.textSecondary : styles.textPrimary]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  textPrimary: {
    color: '#ffffff',
  },
  textSecondary: {
    color: COLORS.primary,
  },
});
