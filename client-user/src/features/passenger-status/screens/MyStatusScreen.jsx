// src/features/passenger-status/screens/MyStatusScreen.jsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useMyStatus } from '../hooks/useMyStatus';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme';

export default function MyStatusScreen() {
  const { status, loading, error, notLinked, fetchStatus, toggleStatus } = useMyStatus();

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (loading && !status) {
    return <LoadingSpinner />;
  }

  if (notLinked) {
    return (
      <View style={styles.container}>
        <EmptyState message="Aún no estás vinculado como pasajero, contacta al administrador" />
      </View>
    );
  }

  if (error && !status) {
    return (
      <View style={styles.container}>
        <EmptyState message={error} />
      </View>
    );
  }

  const isPresent = status?.status === 'PRESENT';

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.label}>Tu estado actual</Text>
        <Text style={[styles.status, { color: isPresent ? COLORS.success : COLORS.warning }]}>
          {isPresent ? 'PRESENTE' : 'AUSENTE'}
        </Text>
        <Button
          title={isPresent ? 'Marcar como ausente' : 'Marcar como presente'}
          onPress={toggleStatus}
          loading={loading}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
  card: { alignItems: 'center', padding: SPACING.lg },
  label: { fontSize: FONT_SIZE.md, color: COLORS.textLight, marginBottom: SPACING.xs },
  status: { fontSize: FONT_SIZE.xl, fontWeight: '800', marginBottom: SPACING.lg },
});
