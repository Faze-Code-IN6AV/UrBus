// src/features/profile/screens/ProfileScreen.jsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import authClient from '../../../shared/api/authClient';
import useAuthStore from '../../../shared/store/authStore';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme';

const ROLE_LABELS = {
  USER_ROLE: 'Usuario',
  PASSENGER_ROLE: 'Pasajero',
};

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null); // { uri, name, type }

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: user?.name ?? '',
      surname: user?.surname ?? '',
      phone: user?.phone ?? '',
    },
  });

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tus fotos para cambiar el avatar');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setNewPhoto({
        uri: asset.uri,
        name: asset.fileName ?? 'profile.jpg',
        type: 'image/jpeg',
      });
    }
  };

  const onSave = async (formValues) => {
    setSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', formValues.name);
      formData.append('surname', formValues.surname);
      formData.append('phone', formValues.phone);
      if (newPhoto) {
        formData.append('profilePicture', newPhoto);
      }
      const response = await authClient.put(`/users/${user.id}/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = response.data.data ?? response.data;
      updateUser(data);
      setNewPhoto(null);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    reset({ name: user?.name ?? '', surname: user?.surname ?? '', phone: user?.phone ?? '' });
    setNewPhoto(null);
    setError(null);
    setEditing(false);
  };

  const confirmLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  };

  const avatarUri = newPhoto?.uri ?? (user?.profilePicture?.startsWith('http') ? user.profilePicture : null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={editing ? pickImage : undefined} style={styles.avatarWrapper}>
        <Image
          source={avatarUri ? { uri: avatarUri } : require('../../../../assets/avatarDefault.png')}
          style={styles.avatar}
        />
        {editing ? <Text style={styles.changePhoto}>Cambiar foto</Text> : null}
      </TouchableOpacity>

      <Text style={styles.role}>{ROLE_LABELS[user?.role] ?? user?.role}</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input label="Nombre" value={value} onChangeText={onChange} editable={editing} />
        )}
      />
      <Controller
        control={control}
        name="surname"
        render={({ field: { onChange, value } }) => (
          <Input label="Apellido" value={value} onChangeText={onChange} editable={editing} />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Teléfono"
            value={value}
            onChangeText={onChange}
            editable={editing}
            keyboardType="phone-pad"
          />
        )}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {editing ? (
        <View style={styles.row}>
          <Button title="Cancelar" variant="secondary" onPress={cancelEdit} style={styles.flexBtn} />
          <Button title="Guardar" onPress={handleSubmit(onSave)} loading={saving} style={styles.flexBtn} />
        </View>
      ) : (
        <Button title="Editar perfil" onPress={() => setEditing(true)} />
      )}

      <Button title="Cerrar sesión" variant="secondary" onPress={confirmLogout} style={styles.logoutBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, alignItems: 'stretch' },
  avatarWrapper: { alignSelf: 'center', alignItems: 'center', marginBottom: SPACING.md },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.border },
  changePhoto: { color: COLORS.primary, marginTop: SPACING.xs, fontSize: FONT_SIZE.sm },
  role: { alignSelf: 'center', color: COLORS.textLight, fontSize: FONT_SIZE.md, marginBottom: SPACING.lg },
  error: { color: COLORS.error, marginBottom: SPACING.sm },
  row: { flexDirection: 'row', gap: SPACING.sm },
  flexBtn: { flex: 1 },
  logoutBtn: { marginTop: SPACING.lg },
});
