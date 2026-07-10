// src/shared/components/common/Input.jsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

export default function Input({ label, error, style, editable = true, ...rest }) {
  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          !editable && styles.inputDisabled,
          error && styles.inputError,
        ]}
        placeholderTextColor={COLORS.textLight}
        editable={editable}
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  inputDisabled: {
    backgroundColor: COLORS.background,
    color: COLORS.textLight,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});
