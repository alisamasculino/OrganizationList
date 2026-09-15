<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Login</h1>
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

      <!-- Create Account -->
      <button
        class="register-button"
        @click="goToRegisterAccount"
      >
        Create Account
      </button>

      <!-- Back -->
      <button
        class="back-button"
        @click="goBack"
      >
        ← Back
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'

import {
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import {
  ref as firebaseRef,
  get
} from 'firebase/database'

import {
  auth,
  database
} from '@/firebase'


// ==========================================
// EVENTS
// ==========================================

const emit = defineEmits<{
  back: []
  loginSuccess: [role: string]
  register: []
}>()


// ==========================================
// FORM DATA
// ==========================================

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)


// ==========================================
// LOGIN
// ==========================================

const login = async () => {

  errorMessage.value = ''

  if (!email.value || !password.value) {

    errorMessage.value =
      'Please enter your email and password.'

    return
  }

  loading.value = true

  try {

    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email.value.trim(),
        password.value
      )

    const user =
      userCredential.user


    // ======================================
    // GET USER ROLE
    // ======================================

    const userRoleRef =
      firebaseRef(
        database,
        `users/${user.uid}/role`
      )

    const snapshot =
      await get(userRoleRef)

    const role =
      snapshot.val()


    // ======================================
    // CHECK VALID ROLE
    // ======================================

    if (
      role !== 'admin' &&
      role !== 'user'
    ) {

      await signOut(auth)

      errorMessage.value =
        'Access denied. This account does not have a valid user role.'

      return
    }


    // ======================================
    // LOGIN SUCCESS
    // ======================================

    console.log(
      'Login successful:',
      user.email,
      'Role:',
      role
    )

    emit(
      'loginSuccess',
      role
    )

  } catch (error) {

    console.error(
      'Login error:',
      error
    )

    errorMessage.value =
      'Invalid email or password.'

  } finally {

    loading.value = false
  }
}


// ==========================================
// GO TO REGISTER ACCOUNT
// ==========================================

const goToRegisterAccount = () => {

  emit('register')

}


// ==========================================
// GO BACK
// ==========================================

const goBack = () => {

  emit('back')

}

</script>

<style scoped>

.login-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  background: linear-gradient(
    135deg,
    #0d4d2b,
    #1a7a44,
    #2ecc71
  );

  padding: 20px;
  box-sizing: border-box;
}


.login-card {
  width: 400px;
  max-width: 100%;

  background: white;

  padding: 40px;

  border-radius: 20px;

  box-shadow:
    0 10px 25px
    rgba(0, 0, 0, 0.15);

  box-sizing: border-box;
}


h1 {
  text-align: center;
  color: #4b304b;

  margin: 0 0 5px;
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

  outline: none;
}


.form-group input:focus {
  border-color: #1a7a44;
}


/* LOGIN BUTTON */

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


/* CREATE ACCOUNT BUTTON */

.register-button {
  width: 100%;

  padding: 12px;

  margin-top: 15px;

  border: 1px solid #4b304b;

  border-radius: 8px;

  background: white;

  color: #4b304b;

  font-size: 15px;

  cursor: pointer;
}


.register-button:hover {
  background: #f8f0f8;
}


/* BACK BUTTON */

.back-button {
  width: 100%;

  padding: 12px;

  margin-top: 10px;

  border: none;

  background: transparent;

  color: #4b304b;

  font-size: 15px;

  cursor: pointer;
}


.back-button:hover {
  text-decoration: underline;
}


/* ERROR MESSAGE */

.error-message {
  color: #d32f2f;

  text-align: center;

  margin-top: 15px;

  font-size: 14px;
}


/* MOBILE */

@media (max-width: 480px) {

  .login-card {
    padding: 30px 25px;
  }

  h1 {
    font-size: 28px;
  }

}

</style>