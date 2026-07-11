// src/shared/components/common/Checkbox.jsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export default function Checkbox({ checked, onPress, disabled }) {
    return (
        <TouchableOpacity
            onPress={disabled ? undefined : onPress}
            activeOpacity={0.7}
            disabled={disabled}
            style={[styles.box, checked ? styles.checked : styles.unchecked, disabled && styles.disabled]}
        >
            {checked ? <MaterialIcons name="check" size={17} color="#fff" /> : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    box: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
    checked: { backgroundColor: COLORS.presentGreen },
    unchecked: { backgroundColor: '#fff', borderWidth: 2, borderColor: COLORS.border },
    disabled: { opacity: 0.6 },
});