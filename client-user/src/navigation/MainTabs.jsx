// src/navigation/MainTabs.jsx
// Navegación inferior de 4 pestañas — replica el mockup: Pasajeros, Mapa,
// Anuncios y Perfil, con el ícono activo resaltado en amarillo.
import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import PassengersScreen from '../features/passengers/screens/PassengersScreen';
import BusTrackingScreen from '../features/bus/screens/BusTrackingScreen';
import PostsScreen from '../features/posts/screens/PostsScreen';
import PostDetailScreen from '../features/posts/screens/PostDetailScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';

import { COLORS } from '../shared/constants/theme';

const Tab = createBottomTabNavigator();
const PassengersStackNav = createNativeStackNavigator();
const BusStackNav = createNativeStackNavigator();
const PostsStackNav = createNativeStackNavigator();

function PassengersStack() {
  return (
    <PassengersStackNav.Navigator screenOptions={{ headerShown: false }}>
      <PassengersStackNav.Screen name="PassengersList" component={PassengersScreen} />
    </PassengersStackNav.Navigator>
  );
}

function BusStack() {
  return (
    <BusStackNav.Navigator screenOptions={{ headerShown: false }}>
      <BusStackNav.Screen name="BusTracking" component={BusTrackingScreen} />
    </BusStackNav.Navigator>
  );
}

function PostsStack() {
  return (
    <PostsStackNav.Navigator screenOptions={{ headerShown: false }}>
      <PostsStackNav.Screen name="PostsList" component={PostsScreen} />
      <PostsStackNav.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ headerShown: true, title: 'Anuncio' }}
      />
    </PostsStackNav.Navigator>
  );
}

const ICONS = {
  Pasajeros: 'people-alt',
  Mapa: 'map',
  Anuncios: 'campaign',
  Perfil: 'person',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.accentDark,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          height: 64,
          paddingTop: 6,
          borderTopColor: COLORS.border,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color, focused }) => (
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: focused ? '#FFF3CC' : 'transparent',
            }}
          >
            <MaterialIcons name={ICONS[route.name]} size={22} color={color} />
          </View>
        ),
      })}
    >
      <Tab.Screen name="Pasajeros" component={PassengersStack} />
      <Tab.Screen name="Mapa" component={BusStack} />
      <Tab.Screen name="Anuncios" component={PostsStack} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}