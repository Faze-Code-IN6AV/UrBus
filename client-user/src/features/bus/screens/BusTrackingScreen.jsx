// src/features/bus/screens/BusTrackingScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useBusTracking } from '../hooks/useBusTracking';
import { EmptyState } from '../../../shared/components/common/Common';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme';

export default function BusTrackingScreen() {
  const { coords, arrived, error } = useBusTracking();

  if (error) {
    return (
      <View style={styles.container}>
        <EmptyState message={error} />
      </View>
    );
  }

  if (!coords) {
    return (
      <View style={styles.container}>
        <EmptyState message="Esperando ubicación del bus" />
      </View>
    );
  }

  const region = {
    latitude: coords.lat,
    longitude: coords.lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      {arrived ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>🚍 El bus llegó a Kinal</Text>
        </View>
      ) : null}

      <MapView style={styles.map} initialRegion={region} region={region}>
        <Marker
          coordinate={{ latitude: coords.lat, longitude: coords.lng }}
          title="Bus UrBus"
          description="Ubicación en tiempo real"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  map: { flex: 1 },
  banner: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 10,
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  bannerText: {
    color: '#ffffff',
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
});
