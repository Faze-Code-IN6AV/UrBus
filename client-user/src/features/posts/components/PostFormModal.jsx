// src/features/posts/components/PostFormModal.jsx
// Modal para crear/editar un anuncio — portado de client-admin
// (features/post/components/PostModal.jsx), con selector de imagen nativo.
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../../../shared/constants/theme';

export default function PostFormModal({ visible, post, loading, onClose, onSubmit }) {
  const isEdit = Boolean(post);
  const [title, setTitle] = useState(post?.title ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(post?.image ?? null);

  useEffect(() => {
    if (visible) {
      setTitle(post?.title ?? '');
      setContent(post?.content ?? '');
      setImage(null);
      setPreview(post?.image ?? null);
    }
  }, [visible, post]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setImage({ uri: asset.uri, name: asset.fileName ?? 'post.jpg', type: 'image/jpeg' });
      setPreview(asset.uri);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    if (image) formData.append('image', image);
    onSubmit(formData);
  };

  const disabled = !title.trim() || !content.trim();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{isEdit ? 'Editar anuncio' : 'Nuevo anuncio'}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <Input label="Título" placeholder="Ej: El bus está a punto de llegar" value={title} onChangeText={setTitle} />
          <Input
            label="Contenido"
            placeholder="Escribe el mensaje del anuncio..."
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Imagen (opcional)</Text>
          {preview ? (
            <View style={styles.previewWrap}>
              <Image source={{ uri: preview }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removeImageBtn} onPress={() => { setImage(null); setPreview(null); }}>
                <MaterialIcons name="close" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
              <MaterialIcons name="image" size={18} color={COLORS.textLight} />
              <Text style={styles.uploadText}>Subir imagen</Text>
            </TouchableOpacity>
          )}

          <View style={styles.row}>
            <Button title="Cancelar" variant="secondary" onPress={onClose} style={styles.flexBtn} />
            <Button title={isEdit ? 'Guardar cambios' : 'Publicar'} onPress={handleSubmit} loading={loading} disabled={disabled} style={styles.flexBtn} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  card: { backgroundColor: COLORS.surface, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.lg, paddingBottom: SPACING.xl, maxHeight: '88%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  title: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.text },
  label: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  previewWrap: { alignSelf: 'flex-start', marginBottom: SPACING.md },
  previewImage: { width: 90, height: 90, borderRadius: RADIUS.md },
  removeImageBtn: { position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.error, alignItems: 'center', justifyContent: 'center' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed', borderRadius: RADIUS.md, paddingVertical: 12, paddingHorizontal: 16, marginBottom: SPACING.md, alignSelf: 'flex-start' },
  uploadText: { color: COLORS.textLight, fontWeight: '600', fontSize: FONT_SIZE.sm },
  row: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  flexBtn: { flex: 1 },
});