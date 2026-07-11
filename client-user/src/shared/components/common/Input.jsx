// src/shared/components/common/Input.jsx
// Input tipo "pill" con icono a la izquierda, igual al de los mockups de Login/Registro.
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOWS } from '../../constants/theme';

export default function Input({ label, error, style, inputStyle, editable = true, icon, multiline, ...rest }) {
  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          multiline && styles.inputWrapperMultiline,
          !editable && styles.inputDisabled,
          error && styles.inputError,
        ]}
      >
        {icon ? (
          <MaterialIcons 
            name={icon} 
            size={20} 
            color={COLORS.textMuted} 
            style={[styles.icon, multiline && styles.iconMultiline]} 
          />
        ) : null}
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline, inputStyle]}
          placeholderTextColor={COLORS.textMuted}
          editable={editable}
          multiline={multiline}
          {...rest}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md },
  label: { fontSize: FONT_SIZE.sm, color: COLORS.text, marginBottom: SPACING.xs, fontWeight: '600' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.xl, paddingHorizontal: SPACING.md, backgroundColor: COLORS.surface, ...SHADOWS.soft,
  },
  inputWrapperMultiline: { alignItems: 'flex-start', paddingVertical: SPACING.sm },
  
  // Se eliminó el marginTop: 13 para que quede centrado verticalmente
  icon: { marginRight: SPACING.sm }, 
  // Se agregó este estilo para alinear el icono correctamente si el input es multilínea
  iconMultiline: { marginTop: 8 }, 

  input: { flex: 1, paddingVertical: 13, fontSize: FONT_SIZE.md, color: COLORS.text },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top', paddingTop: 6 },
  inputDisabled: { backgroundColor: COLORS.background },
  inputError: { borderColor: COLORS.error },
  errorText: { fontSize: FONT_SIZE.xs, color: COLORS.error, marginTop: SPACING.xs, marginLeft: SPACING.sm },
});