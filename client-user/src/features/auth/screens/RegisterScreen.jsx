// src/features/auth/screens/RegisterScreen.jsx
import React from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme';

export default function RegisterScreen({ navigation }) {
  const { handleRegister, loading, error } = useAuth();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const onSubmit = async (values) => {
    const result = await handleRegister(values);

    if (!result.success) {
      Alert.alert('No se pudo completar el registro', result.message ?? 'Intenta de nuevo');
      return;
    }

    const message = result.emailVerificationRequired
      ? `${result.message ?? 'Cuenta creada.'} Revisa tu correo para verificar tu cuenta antes de iniciar sesión.`
      : result.message ?? 'Cuenta creada correctamente';

    Alert.alert('Registro exitoso', message, [
      { text: 'Ir a iniciar sesión', onPress: () => navigation.navigate('Login') },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>Regístrate para rastrear tu bus con UrBus</Text>

      <Controller
        control={control}
        name="name"
        rules={{ required: 'El nombre es obligatorio', maxLength: { value: 25, message: 'Máximo 25 caracteres' } }}
        render={({ field: { onChange, value }, fieldState: { error: fe } }) => (
          <Input label="Nombre" value={value} onChangeText={onChange} error={fe?.message} />
        )}
      />

      <Controller
        control={control}
        name="surname"
        rules={{ required: 'El apellido es obligatorio', maxLength: { value: 25, message: 'Máximo 25 caracteres' } }}
        render={({ field: { onChange, value }, fieldState: { error: fe } }) => (
          <Input label="Apellido" value={value} onChangeText={onChange} error={fe?.message} />
        )}
      />

      <Controller
        control={control}
        name="username"
        rules={{ required: 'El usuario es obligatorio' }}
        render={({ field: { onChange, value }, fieldState: { error: fe } }) => (
          <Input label="Usuario" value={value} onChangeText={onChange} autoCapitalize="none" error={fe?.message} />
        )}
      />

      <Controller
        control={control}
        name="email"
        rules={{
          required: 'El correo es obligatorio',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
        }}
        render={({ field: { onChange, value }, fieldState: { error: fe } }) => (
          <Input
            label="Correo electrónico"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="email-address"
            error={fe?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{ required: 'La contraseña es obligatoria', minLength: { value: 8, message: 'Mínimo 8 caracteres' } }}
        render={({ field: { onChange, value }, fieldState: { error: fe } }) => (
          <Input label="Contraseña" value={value} onChangeText={onChange} secureTextEntry error={fe?.message} />
        )}
      />

      <Controller
        control={control}
        name="phone"
        rules={{
          required: 'El teléfono es obligatorio',
          pattern: { value: /^\d{8}$/, message: 'Debe tener exactamente 8 dígitos' },
        }}
        render={({ field: { onChange, value }, fieldState: { error: fe } }) => (
          <Input
            label="Teléfono"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
            maxLength={8}
            error={fe?.message}
          />
        )}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Registrarme" onPress={handleSubmit(onSubmit)} loading={loading} />

      <Button
        title="¿Ya tienes cuenta? Inicia sesión"
        variant="secondary"
        onPress={() => navigation.navigate('Login')}
        style={styles.loginBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SPACING.md,
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
  loginBtn: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
});
