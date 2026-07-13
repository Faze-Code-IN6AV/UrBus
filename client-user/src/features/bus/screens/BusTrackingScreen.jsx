// src/features/bus/screens/BusTrackingScreen.jsx
// Pantalla "Mapa a Tiempo Real" — replica el mockup: encabezado azul con título
// e iconos, mapa de fondo claro y marcador del bus. Para DRIVER_ROLE/ADMIN_ROLE
// agrega los controles "Iniciar Ruta" / "Finalizar Ruta" (portados de
// client-admin, features/location/pages/LocationPage.jsx).
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import OSMMapView from '../components/OSMMapView';
import { useBusTracking } from '../hooks/useBusTracking';
import { EmptyState } from '../../../shared/components/common/Common';
import useAuthStore from '../../../shared/store/authStore';
import { COLORS, SPACING, FONT_SIZE, RADIUS, MANAGER_ROLES } from '../../../shared/constants/theme';

// Coordenadas de Kinal (destino de referencia usado por location-service)
const DEFAULT_REGION = { latitude: 14.6258, longitude: -90.536, latitudeDelta: 0.03, longitudeDelta: 0.03 };

export default function BusTrackingScreen() {
  const user = useAuthStore((state) => state.user);
  const isManager = MANAGER_ROLES.includes(user?.role);

  const { coords, arrived, connected, error, routeActive, startRoute, endRoute } = useBusTracking();

  const region = coords
    ? { latitude: coords.lat, longitude: coords.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 }
    : DEFAULT_REGION;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.headerBlueStart, COLORS.headerBlueEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <View style={styles.headerIconWrap}>
            <MaterialIcons name="forum" size={18} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>Mapa a Tiempo Real</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.statusDot, { backgroundColor: connected ? COLORS.success : '#d1d5db' }]} />
          <MaterialIcons name="search" size={20} color="#fff" />
        </View>
      </LinearGradient>

      {arrived ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>El bus llegó a su destino</Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {!coords && !isManager ? (
        <View style={styles.emptyWrap}>
          <EmptyState message="Esperando ubicación del bus" icon="directions-bus" />
        </View>
      ) : (
        <OSMMapView
          style={styles.map}
          region={region}
          destination={
            coords
              ? {
                  latitude: DEFAULT_REGION.latitude,
                  longitude: DEFAULT_REGION.longitude,
                  title: 'Kinal',
                  description: 'Destino del bus',
                }
              : null
          }
          marker={
            coords
              ? {
                  latitude: coords.lat,
                  longitude: coords.lng,
                  title: 'Bus UrBus',
                  description: 'Ubicación en tiempo real',
                }
              : null
          }
        />
      )}

      {isManager ? (
        <View style={styles.driverControls}>
          <TouchableOpacity
            style={[styles.routeBtn, styles.startBtn, routeActive && styles.btnDisabled]}
            onPress={startRoute}
            disabled={routeActive}
          >
            <MaterialIcons name="play-arrow" size={18} color="#fff" />
            <Text style={styles.routeBtnText}>Iniciar Ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.routeBtn, styles.endBtn, !routeActive && styles.btnDisabled]}
            onPress={endRoute}
            disabled={!routeActive}
          >
            <MaterialIcons name="stop" size={18} color="#fff" />
            <Text style={styles.routeBtnText}>Finalizar Ruta</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 54, paddingBottom: SPACING.md, paddingHorizontal: SPACING.md,
    borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  headerIconWrap: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.25)' },
  headerTitle: { color: '#fff', fontSize: FONT_SIZE.lg, fontWeight: '800' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  statusDot: { width: 9, height: 9, borderRadius: 5 },
  map: { flex: 1 },
  emptyWrap: { flex: 1 },
  banner: {
    position: 'absolute', top: 110, left: SPACING.md, right: SPACING.md, zIndex: 10,
    backgroundColor: COLORS.success, borderRadius: RADIUS.md, paddingVertical: SPACING.sm, alignItems: 'center',
  },
  bannerText: { color: '#fff', fontSize: FONT_SIZE.md, fontWeight: '700' },
  errorBanner: {
    position: 'absolute', top: 110, left: SPACING.md, right: SPACING.md, zIndex: 10,
    backgroundColor: '#fee2e2', borderRadius: RADIUS.md, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md,
  },
  errorText: { color: COLORS.error, fontSize: FONT_SIZE.sm, fontWeight: '600', textAlign: 'center' },
  driverControls: { position: 'absolute', bottom: SPACING.lg, left: SPACING.md, right: SPACING.md, flexDirection: 'row', gap: SPACING.sm },
  routeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: RADIUS.md },
  startBtn: { backgroundColor: COLORS.success },
  endBtn: { backgroundColor: COLORS.error },
  btnDisabled: { opacity: 0.5 },
  routeBtnText: { color: '#fff', fontWeight: '700', fontSize: FONT_SIZE.sm },
});