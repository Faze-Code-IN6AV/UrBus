// src/navigation/MainTabs.jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import BusTrackingScreen from '../features/bus/screens/BusTrackingScreen';
import PostsScreen from '../features/posts/screens/PostsScreen';
import PostDetailScreen from '../features/posts/screens/PostDetailScreen';
import MyStatusScreen from '../features/passenger-status/screens/MyStatusScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';

import { COLORS } from '../shared/constants/theme';

const Tab = createBottomTabNavigator();
const BusStackNav = createNativeStackNavigator();
const PostsStackNav = createNativeStackNavigator();
const MyStatusStackNav = createNativeStackNavigator();

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

function MyStatusStack() {
  return (
    <MyStatusStackNav.Navigator screenOptions={{ headerShown: false }}>
      <MyStatusStackNav.Screen name="MyStatus" component={MyStatusScreen} />
    </MyStatusStackNav.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          height: 60,
          borderTopColor: COLORS.border,
        },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Bus: 'directions-bus',
            Anuncios: 'campaign',
            'Mi Estado': 'how-to-reg',
            Perfil: 'person',
          };
          return <MaterialIcons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Bus" component={BusStack} />
      <Tab.Screen name="Anuncios" component={PostsStack} />
      <Tab.Screen name="Mi Estado" component={MyStatusStack} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ headerShown: true }} />
    </Tab.Navigator>
  );
}
