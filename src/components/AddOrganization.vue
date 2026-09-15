<template>
  <div class="add-organization-page">

    <div class="page-header">
      <h1>Add New Organization</h1>

      <button
        class="back-button"
        type="button"
        @click="goBack"
      >
        ←
      </button>
    </div>

    <div class="form">

      <label>Organization Name</label>
      <input
        v-model="organizationName"
        type="text"
        placeholder="Enter organization name"
      />

      <label>Description</label>
      <textarea
        v-model="description"
        placeholder="Enter organization description"
      ></textarea>

      <button
        class="add-button"
        type="button"
        @click="addOrganization"
        :disabled="saving"
      >
        {{ saving ? 'Saving...' : 'Add Organization' }}
      </button>

      <p v-if="message" :class="messageType">
        {{ message }}
      </p>

    </div>

  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { ref as firebaseRef, get, set } from 'firebase/database'
import { database } from '@/firebase'

const emit = defineEmits<{
  back: []
}>()

// Form values
const organizationName = ref('')
const description = ref('')

// Saving status
const saving = ref(false)

// Message
const message = ref('')
const messageType = ref('')


// Back button
const goBack = () => {
  emit('back')
}


// Add organization
const addOrganization = async () => {

  const name = organizationName.value.trim()
  const desc = description.value.trim()

  // Check if fields are empty
  if (!name || !desc) {
    message.value = 'Please fill in all fields.'
    messageType.value = 'error'
    return
  }

  // Convert name to uppercase
  const organizationKey = name.toUpperCase()

  saving.value = true
  message.value = ''

  try {

    // Firebase path
    const organizationRef = firebaseRef(
      database,
      `organizations/${organizationKey}`
    )

    // Check if organization already exists
    const snapshot = await get(organizationRef)

    if (snapshot.exists()) {
      message.value = 'Organization already exists.'
      messageType.value = 'error'
      saving.value = false
      return
    }

    // Save organization to Firebase
    await set(organizationRef, {
      name: organizationKey,
      description: desc
    })

    message.value = 'Organization added successfully!'
    messageType.value = 'success'

    // Clear form
    organizationName.value = ''
    description.value = ''

    // Go back to OrganizationPage
    setTimeout(() => {
      emit('back')
    }, 800)

  } catch (error) {

    console.error('Error adding organization:', error)

    message.value =
      'Failed to add organization. Please check Firebase.'

    messageType.value = 'error'

  } finally {

    saving.value = false

  }
}

</script>

<style scoped>

.add-organization-page {

  min-height: 100vh;

  padding: 30px 20px 50px;

  background: linear-gradient(160deg, #0d4d2b 0%, #1a7a44 45%, #2ecc71 100%);

  box-sizing: border-box;

  position: relative;

  overflow-x: hidden;

}


/* Decorative background circles */

.add-organization-page::before {

  content: '';

  position: fixed;

  top: -100px;

  right: -100px;

  width: 350px;

  height: 350px;

  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);

  border-radius: 50%;

  pointer-events: none;

  z-index: 0;

}


.add-organization-page::after {

  content: '';

  position: fixed;

  bottom: -120px;

  left: -120px;

  width: 400px;

  height: 400px;

  background: radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%);

  border-radius: 50%;

  pointer-events: none;

  z-index: 0;

}


/* =========================================
   HEADER
========================================= */

.page-header {

  display: grid;

  grid-template-columns: 1fr 45px;

  align-items: center;

  gap: 15px;

  max-width: 500px;

  margin: 0 auto 30px;

  position: relative;

  z-index: 1;

}


h1 {

  margin: 0;

  font-size: 26px;

  font-weight: 800;

  color: #ffffff;

  letter-spacing: 1px;

  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);

  text-align: left;

}


/* =========================================
   BACK BUTTON
========================================= */

.back-button {

  width: 45px;

  height: 45px;

  flex-shrink: 0;

  border: 1.5px solid rgba(255, 255, 255, 0.4);

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.12);

  color: white;

  font-size: 22px;

  cursor: pointer;

  backdrop-filter: blur(6px);

  transition: all 0.3s ease;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0;

  line-height: 1;

}


.back-button:hover {

  background: rgba(255, 255, 255, 0.25);

  border-color: rgba(255, 255, 255, 0.7);

  transform: scale(1.08);

}


.back-button:active {

  transform: scale(0.95);

}


/* =========================================
   FORM
========================================= */

.form {

  max-width: 500px;

  margin: auto;

  background: rgba(255, 255, 255, 0.97);

  padding: 28px 26px;

  border-radius: 16px;

  position: relative;

  z-index: 1;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  border-left: 5px solid #2ecc71;

  animation: fadeInUp 0.5s ease-out both;

}


label {

  display: block;

  margin-top: 16px;

  margin-bottom: 8px;

  font-weight: 700;

  color: #0d4d2b;

  font-size: 13px;

  letter-spacing: 0.8px;

  text-transform: uppercase;

}


label:first-child {

  margin-top: 0;

}


input,
textarea {

  width: 100%;

  padding: 13px 16px;

  border: 1.5px solid rgba(26, 122, 68, 0.2);

  border-radius: 10px;

  box-sizing: border-box;

  font-size: 15px;

  background: #f8fdfa;

  color: #2c3e35;

  font-weight: 500;

  transition: all 0.25s ease;

  outline: none;

  font-family: inherit;

}


input::placeholder,
textarea::placeholder {

  color: #9db3a7;

  font-weight: 400;

}


input:hover,
textarea:hover {

  border-color: rgba(26, 122, 68, 0.4);

}


input:focus,
textarea:focus {

  border-color: #2ecc71;

  background: #ffffff;

  box-shadow: 0 0 0 4px rgba(46, 204, 113, 0.15);

}


textarea {

  height: 130px;

  resize: none;

  line-height: 1.5;

}


/* =========================================
   ADD BUTTON
========================================= */

.add-button {

  width: 100%;

  margin-top: 28px;

  padding: 15px;

  border: none;

  border-radius: 50px;

  background: linear-gradient(135deg, #0d4d2b 0%, #1a7a44 100%);

  color: white;

  font-size: 16px;

  font-weight: 700;

  letter-spacing: 1.5px;

  text-transform: uppercase;

  cursor: pointer;

  transition: all 0.3s ease;

  box-shadow: 0 6px 20px rgba(13, 77, 43, 0.35);

  font-family: inherit;

}


.add-button:hover:not(:disabled) {

  transform: translateY(-2px);

  box-shadow: 0 10px 28px rgba(13, 77, 43, 0.45);

  background: linear-gradient(135deg, #1a7a44 0%, #2ecc71 100%);

}


.add-button:active:not(:disabled) {

  transform: translateY(0);

  box-shadow: 0 4px 14px rgba(13, 77, 43, 0.35);

}


.add-button:disabled {

  opacity: 0.65;

  cursor: not-allowed;

  box-shadow: none;

}


/* =========================================
   MESSAGES
========================================= */

.success {

  text-align: center;

  color: #0d4d2b;

  font-weight: 700;

  margin-top: 18px;

  padding: 12px 20px;

  background: rgba(46, 204, 113, 0.15);

  border: 1.5px solid rgba(46, 204, 113, 0.4);

  border-radius: 50px;

  font-size: 13px;

  letter-spacing: 0.5px;

  animation: fadeInUp 0.4s ease-out;

}


.success::before {

  content: '✓ ';

  font-weight: 900;

}


.error {

  text-align: center;

  color: #a01e1e;

  font-weight: 700;

  margin-top: 18px;

  padding: 12px 20px;

  background: rgba(231, 76, 60, 0.12);

  border: 1.5px solid rgba(231, 76, 60, 0.4);

  border-radius: 50px;

  font-size: 13px;

  letter-spacing: 0.5px;

  animation: fadeInUp 0.4s ease-out;

}


.error::before {

  content: '⚠ ';

  font-weight: 900;

}


/* =========================================
   ANIMATIONS
========================================= */

@keyframes fadeInUp {

  from {

    opacity: 0;

    transform: translateY(20px);

  }

  to {

    opacity: 1;

    transform: translateY(0);

  }

}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 768px) {

  .add-organization-page {

    padding: 24px 16px 40px;

  }

  h1 {

    font-size: 20px;

    letter-spacing: 0.5px;

  }

  .page-header {

    grid-template-columns: 1fr 42px;

    gap: 10px;

    margin-bottom: 24px;

  }

  .back-button {

    width: 42px;

    height: 42px;

    font-size: 20px;

  }

  .form {

    padding: 24px 22px;

  }

  label {

    font-size: 12px;

  }

  input,
  textarea {

    padding: 12px 14px;

    font-size: 14px;

  }

  textarea {

    height: 115px;

  }

}


@media (max-width: 480px) {

  .add-organization-page {

    padding: 20px 14px 35px;

  }

  h1 {

    font-size: 17px;

    letter-spacing: 0.3px;

  }

  .page-header {

    grid-template-columns: 1fr 38px;

    gap: 8px;

    margin-bottom: 20px;

  }

  .back-button {

    width: 38px;

    height: 38px;

    font-size: 19px;

  }

  .form {

    padding: 20px 18px;

    border-radius: 14px;

    border-left-width: 4px;

  }

  label {

    font-size: 11.5px;

    margin-top: 14px;

    margin-bottom: 6px;

  }

  input,
  textarea {

    padding: 11px 14px;

    font-size: 14px;

    border-radius: 9px;

  }

  textarea {

    height: 105px;

  }

  .add-button {

    padding: 13px;

    font-size: 14px;

    margin-top: 22px;

    letter-spacing: 1px;

  }

  .success,
  .error {

    font-size: 12px;

    padding: 10px 16px;

    margin-top: 15px;

  }

}


@media (max-width: 360px) {

  h1 {

    font-size: 15px;

  }

  .form {

    padding: 18px 15px;

  }

  label {

    font-size: 11px;

  }

  input,
  textarea {

    padding: 10px 12px;

    font-size: 13px;

  }

  textarea {

    height: 95px;

  }

}


/* Landscape orientation for short screens */

@media (max-height: 500px) and (orientation: landscape) {

  .add-organization-page {

    padding: 16px 20px 30px;

  }

  .page-header {

    margin-bottom: 16px;

  }

  .form {

    padding: 18px 22px;

  }

  label {

    margin-top: 10px;

    margin-bottom: 5px;

  }

  input,
  textarea {

    padding: 10px 14px;

  }

  textarea {

    height: 80px;

  }

  .add-button {

    margin-top: 18px;

    padding: 12px;

  }

}

</style>