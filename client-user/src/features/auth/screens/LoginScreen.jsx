// src/features/auth/screens/LoginScreen.jsx
import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme';

export default function LoginScreen({ navigation }) {
  const { handleLogin, loading, error } = useAuth();
  const { control, handleSubmit } = useForm({
    defaultValues: { emailOrUsername: '', password: '' },
  });

  const onSubmit = async (values) => {
    await handleLogin(values);
    // Si el login fue exitoso, authStore.isAuthenticated cambia y
    // AppNavigator navega automáticamente a MainTabs.
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../../../assets/urbus-logo.png')} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Bienvenido a UrBus</Text>
      <Text style={styles.subtitle}>Inicia sesión para rastrear tu bus</Text>

      <Controller
        control={control}
        name="emailOrUsername"
        rules={{ required: 'Ingresa tu correo o usuario' }}
        render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
          <Input
            label="Correo o usuario"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            error={fieldError?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{ required: 'Ingresa tu contraseña' }}
        render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
          <Input
            label="Contraseña"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            error={fieldError?.message}
          />
        )}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Iniciar sesión" onPress={handleSubmit(onSubmit)} loading={loading} />

      <Button
        title="¿No tienes cuenta? Regístrate"
        variant="secondary"
        onPress={() => navigation.navigate('Register')}
        style={styles.registerBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  registerBtn: {
    marginTop: SPACING.md,
  },
});
