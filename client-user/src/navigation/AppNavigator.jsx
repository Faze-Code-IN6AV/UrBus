// src/navigation/AppNavigator.jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import useAuthStore from '../shared/store/authStore';
import { LoadingSpinner } from '../shared/components/common/Common';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

export default function AppNavigator() {
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!hasHydrated) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
