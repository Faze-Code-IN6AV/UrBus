// src/shared/constants/endpoints.js

export const ENDPOINTS = {
  AUTH: process.env.EXPO_PUBLIC_AUTH_URL || 'http://localhost:5166/api/v1',
  PASSENGER: process.env.EXPO_PUBLIC_PASSENGER_URL || 'http://localhost:3011/urbus/v1',
  POST: process.env.EXPO_PUBLIC_POST_URL || 'http://localhost:5001/urbus/v1',
  LOCATION: process.env.EXPO_PUBLIC_LOCATION_URL || 'http://localhost:3033',
};
