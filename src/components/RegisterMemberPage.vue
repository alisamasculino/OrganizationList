<template>
  <ion-page>
    <ion-content>
      <div class="register-page">

        <h1>Register New Member</h1>

        <div class="form">

          <label>School ID</label>
          <input
            v-model="schoolId"
            type="text"
            placeholder="Enter School ID"
          />

          <label>Name</label>
          <input
            v-model="name"
            type="text"
            placeholder="Enter Name"
          />

          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Enter Email"
          />

          <label>Contact Number</label>
          <input
            v-model="contact"
            type="text"
            placeholder="Enter Contact Number"
          />

          <label>Position</label>
          <input
            v-model="position"
            type="text"
            placeholder="Enter Position"
          />

          <button class="register-button" @click="registerMember">
            Register
          </button>

        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  IonPage,
  IonContent
} from '@ionic/vue'

const emit = defineEmits<{
  back: []
}>()

const schoolId = ref('')
const name = ref('')
const email = ref('')
const contact = ref('')
const position = ref('')

const registerMember = () => {
  emit('back')
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  padding: 30px 20px;
  background: #f3eafa;
}

h1 {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
}

.form {
  max-width: 500px;
  margin: auto;
  background: white;
  padding: 25px;
  border-radius: 15px;
}

label {
  display: block;
  margin-top: 15px;
  margin-bottom: 6px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.register-button {
  width: 100%;
  margin-top: 25px;
  padding: 13px;
  border: none;
  border-radius: 8px;
  background: #6b4c6e;
  color: white;
  font-size: 17px;
  cursor: pointer;
}
</style>