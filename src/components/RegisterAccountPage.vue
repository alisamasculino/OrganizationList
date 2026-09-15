<template>
  <div class="register-page">
    <div class="register-card">

      <h1>Create Account</h1>

      <p class="subtitle">
        Mindoro State University
      </p>

      <!-- EMAIL -->
      <div class="form-group">
        <label>Email</label>

        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
        />
      </div>


      <!-- PASSWORD -->
      <div class="form-group">
        <label>Password</label>

        <input
          v-model="password"
          type="password"
          placeholder="Enter your password"
        />
      </div>


      <!-- CONFIRM PASSWORD -->
      <div class="form-group">
        <label>Confirm Password</label>

        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm your password"
        />
      </div>


      <!-- REGISTER BUTTON -->
      <button
        class="register-button"
        @click="registerAccount"
        :disabled="loading"
      >
        {{ loading ? 'Creating Account...' : 'Create Account' }}
      </button>


      <!-- ERROR -->
      <p
        v-if="errorMessage"
        class="error-message"
      >
        {{ errorMessage }}
      </p>


      <!-- SUCCESS -->
      <p
        v-if="successMessage"
        class="success-message"
      >
        {{ successMessage }}
      </p>


      <!-- BACK -->
      <button
        class="back-button"
        @click="goBack"
        :disabled="loading"
      >
        ← Back to Login
      </button>

    </div>
  </div>
</template>


<script setup lang="ts">

import { ref } from 'vue'

import {
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import {
  ref as firebaseRef,
  set
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
}>()


// ==========================================
// FORM DATA
// ==========================================

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const errorMessage = ref('')
const successMessage = ref('')

const loading = ref(false)


// ==========================================
// REGISTER ACCOUNT
// ==========================================

const registerAccount = async () => {

  errorMessage.value = ''
  successMessage.value = ''


  // ========================================
  // CHECK EMPTY FIELDS
  // ========================================

  if (
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {

    errorMessage.value =
      'Please fill in all fields.'

    return
  }


  // ========================================
  // CHECK PASSWORD
  // ========================================

  if (
    password.value !==
    confirmPassword.value
  ) {

    errorMessage.value =
      'Passwords do not match.'

    return
  }


  // ========================================
  // CHECK PASSWORD LENGTH
  // ========================================

  if (password.value.length < 6) {

    errorMessage.value =
      'Password must be at least 6 characters.'

    return
  }


  loading.value = true


  try {

    // ======================================
    // CREATE FIREBASE AUTH ACCOUNT
    // ======================================

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email.value.trim(),
        password.value
      )

    const user =
      userCredential.user


    // ======================================
    // SAVE USER ROLE
    // ======================================

    const userRef =
      firebaseRef(
        database,
        `users/${user.uid}`
      )

    await set(
      userRef,
      {
        role: 'user'
      }
    )


    console.log(
      'User account created:',
      user.email
    )

    console.log(
      'User role saved: user'
    )


    // ======================================
    // LOG OUT NEW ACCOUNT
    // ======================================

    await signOut(auth)


    // ======================================
    // SUCCESS MESSAGE
    // ======================================

    successMessage.value =
      'Account created successfully. You can now log in.'


    // Clear form
    email.value = ''
    password.value = ''
    confirmPassword.value = ''


    // Return to Login after short delay
    setTimeout(() => {

      emit('back')

    }, 1500)


  } catch (error: any) {

    console.error(
      'Registration error:',
      error
    )


    // ======================================
    // FIREBASE ERROR MESSAGES
    // ======================================

    if (
      error.code ===
      'auth/email-already-in-use'
    ) {

      errorMessage.value =
        'This email is already registered.'

    } else if (
      error.code ===
      'auth/invalid-email'
    ) {

      errorMessage.value =
        'Please enter a valid email address.'

    } else if (
      error.code ===
      'auth/weak-password'
    ) {

      errorMessage.value =
        'Password is too weak.'

    } else {

      errorMessage.value =
        'Unable to create account. Please try again.'
    }

  } finally {

    loading.value = false

  }

}


// ==========================================
// BACK TO LOGIN
// ==========================================

const goBack = () => {

  emit('back')

}

</script>


<style scoped>

.register-page {
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


.register-card {
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


/* REGISTER BUTTON */

.register-button {
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


.register-button:hover {
  background: #372337;
}


.register-button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}


/* ERROR MESSAGE */

.error-message {
  color: #d32f2f;

  text-align: center;

  margin-top: 15px;

  font-size: 14px;
}


/* SUCCESS MESSAGE */

.success-message {
  color: #1a7a44;

  text-align: center;

  margin-top: 15px;

  font-size: 14px;

  font-weight: bold;
}


/* BACK BUTTON */

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


.back-button:hover {
  text-decoration: underline;
}


.back-button:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}


/* MOBILE */

@media (max-width: 480px) {

  .register-card {
    padding: 30px 25px;
  }

  h1 {
    font-size: 28px;
  }

}

</style>