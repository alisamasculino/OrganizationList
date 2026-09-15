<template>
  <div class="login-page">
    <div class="login-card">
      <h1>User Login</h1>
      <p class="subtitle">Mindoro State University</p>

      <div class="form-group">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
        />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter your password"
        />
      </div>

      <button
        class="login-button"
        @click="login"
        :disabled="loading"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <button class="back-button" @click="goBack">
        ← Back
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase'

const emit = defineEmits<{
  back: []
  loginSuccess: []
}>()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const login = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }

  loading.value = true

  try {
    await signInWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    )

    emit('loginSuccess')
  } catch (error) {
    console.error('User login error:', error)
    errorMessage.value = 'Invalid email or password.'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  emit('back')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #c596c5, #e6cde6);
  padding: 20px;
}

.login-card {
  width: 400px;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

h1 {
  text-align: center;
  color: #4b304b;
  margin-bottom: 5px;
}

.subtitle {
  text-align: center;
  color: #777;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #4b304b;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

.login-button {
  width: 100%;
  padding: 13px;
  border: none;
  border-radius: 8px;
  background: #4b304b;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

.login-button:hover {
  background: #372337;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-button {
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  border: none;
  background: transparent;
  color: #4b304b;
  font-size: 15px;
  cursor: pointer;
}

.error-message {
  color: #d32f2f;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}
</style>