// src/shared/components/common/Common.jsx
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../constants/theme';

export function LoadingSpinner() {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

export function EmptyState({ message, icon = 'info-outline' }) {
  return (
    <View style={styles.emptyContainer}>
      <MaterialIcons name={icon} size={48} color={COLORS.textLight} />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    ...SHADOWS.card,
  },
});
