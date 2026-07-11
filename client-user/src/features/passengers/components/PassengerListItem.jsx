// src/features/passengers/components/PassengerListItem.jsx
// Fila de la lista de pasajeros — replica el diseño del mockup "Lista de Pasajeros".
// Solo incluye acción de eliminar (el backend no permite editar el nombre de un
// pasajero ya vinculado, solo crearlo, listarlo, cambiar su estado o borrarlo).
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Avatar from '../../../shared/components/common/Avatar';
import Checkbox from '../../../shared/components/common/Checkbox';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme';

export default function PassengerListItem({ passenger, canToggle, canDelete, onToggle, onDelete }) {
  const isPresent = passenger.status === 'PRESENT';
  return (
    <View style={styles.row}>
      <Avatar name={passenger.name} size={48} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{passenger.name}</Text>
        <Text style={styles.address} numberOfLines={1}>
          {passenger.address ?? `ID: ${String(passenger._id ?? '').slice(-6)}`}
        </Text>
      </View>
      <Checkbox checked={isPresent} onPress={() => onToggle(passenger)} disabled={!canToggle} />
      {canDelete ? (
        <TouchableOpacity style={styles.iconBtnDanger} onPress={() => onDelete(passenger)}>
          <MaterialIcons name="delete-outline" size={16} color={COLORS.error} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: 14, paddingHorizontal: 18, backgroundColor: COLORS.surface },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  address: { fontSize: 12.5, color: COLORS.textMuted, marginTop: 2 },
  iconBtnDanger: {
    width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fee2e2', marginLeft: SPACING.xs,
  },
});