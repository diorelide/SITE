<template>
  <v-dialog v-model="visible" max-width="400px">
    <v-card>
      <v-card-title>Вход для водителей</v-card-title>
      <v-card-text>
        <v-text-field v-model="login" label="Логин" outlined></v-text-field>
        <v-text-field v-model="password" label="Пароль" type="password" outlined></v-text-field>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="close">Отмена</v-btn>
        <v-btn color="primary" @click="handleLogin">Войти</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuth } from '../composables/useAuth';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'logged-in']);

const visible = ref(props.modelValue);
const login = ref('');
const password = ref('');
const error = ref('');
const { setUser } = useAuth();

watch(() => props.modelValue, (val) => { visible.value = val; });
watch(visible, (val) => { emit('update:modelValue', val); });

const close = () => {
  visible.value = false;
  error.value = '';
};

const handleLogin = async () => {
  error.value = '';
  try {
    const res = await fetch('http://localhost:3010/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: login.value, password: password.value }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Неверный логин или пароль');
    }
    const data = await res.json();
    // data.user должен содержать role
    setUser(data.user, data.token);
    emit('logged-in');
    close();
  } catch (err) {
    error.value = err.message;
  }
};
</script>