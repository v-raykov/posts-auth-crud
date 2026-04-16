<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">{{ isLogin ? 'Sign In' : 'Sign Up' }}</button>
    </form>
    <p @click="isLogin = !isLogin">
      {{ isLogin ? 'Need an account? Register' : 'Have an account? Login' }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { authApi } from '../api';

const emit = defineEmits(['auth-success']);
const email = ref('');
const password = ref('');
const isLogin = ref(true);

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      const { data } = await authApi.login(email.value, password.value);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ email: email.value }));
    } else {
      await authApi.register(email.value, password.value);
      const { data } = await authApi.login(email.value, password.value);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ email: email.value }));
    }
    emit('auth-success');
  } catch (err) {
    alert(err.response?.data?.error || 'Authentication failed');
  }
};
</script>