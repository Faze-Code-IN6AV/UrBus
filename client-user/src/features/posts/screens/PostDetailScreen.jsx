// src/features/posts/screens/PostDetailScreen.jsx
import React, { useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { usePostDetail } from '../hooks/usePosts';
import { LoadingSpinner, EmptyState } from '../../../shared/components/common/Common';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme';

export default function PostDetailScreen({ route }) {
  const { id } = route.params;
  const { post, loading, error, fetchPost } = usePostDetail(id);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !post) {
    return (
      <View style={styles.container}>
        <EmptyState message={error ?? 'No se encontró el anuncio'} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {post.image ? <Image source={{ uri: post.image }} style={styles.image} /> : null}
      <Text style={styles.title}>{post.title}</Text>
      {post.createdAt ? (
        <Text style={styles.date}>{new Date(post.createdAt).toLocaleDateString('es-GT')}</Text>
      ) : null}
      <Text style={styles.body}>{post.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  image: { width: '100%', height: 220, borderRadius: 8, marginBottom: SPACING.md },
  title: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  date: { fontSize: FONT_SIZE.sm, color: COLORS.textLight, marginBottom: SPACING.md },
  body: { fontSize: FONT_SIZE.md, color: COLORS.text, lineHeight: 22 },
});
