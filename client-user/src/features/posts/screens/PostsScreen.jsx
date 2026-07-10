// src/features/posts/screens/PostsScreen.jsx
import React, { useEffect, useCallback, useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { usePosts } from '../hooks/usePosts';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme';

export default function PostsScreen({ navigation }) {
  const { posts, loading, error, fetchPosts } = usePosts();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, [fetchPosts]);

  if (loading && posts.length === 0) {
    return <LoadingSpinner />;
  }

  if (!loading && posts.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState message={error ?? 'No hay anuncios por el momento'} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={posts}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { id: item.id })}>
          <Card style={styles.card}>
            {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.excerpt} numberOfLines={2}>
              {item.content}
            </Text>
          </Card>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.md },
  card: { marginBottom: SPACING.md },
  image: { width: '100%', height: 160, borderRadius: 8, marginBottom: SPACING.sm },
  title: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  excerpt: { fontSize: FONT_SIZE.sm, color: COLORS.textLight },
});
