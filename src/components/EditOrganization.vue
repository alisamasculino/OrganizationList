<template>
  <ion-page>

    <div class="edit-page">

      <!-- Header -->
      <div class="page-header">

        <button
          class="back-button"
          type="button"
          @click="goBack"
        >
          ←
        </button>

        <h1>Edit Organization</h1>

        <div></div>

      </div>


      <!-- Form -->
      <div class="edit-card">

        <div class="form-group">

          <label>
            Organization Name
          </label>

          <input
            v-model="organizationName"
            type="text"
            placeholder="Enter organization name"
          />

        </div>


        <div class="form-group">

          <label>
            Description
          </label>

          <textarea
            v-model="organizationDescription"
            placeholder="Enter organization description"
            rows="5"
          ></textarea>

        </div>


        <button
          class="save-button"
          type="button"
          @click="saveOrganization"
          :disabled="saving"
        >
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>


        <p
          v-if="errorMessage"
          class="error-message"
        >
          {{ errorMessage }}
        </p>

      </div>

    </div>

  </ion-page>
</template>


<script setup lang="ts">

import {
  ref
} from 'vue'

import {
  IonPage
} from '@ionic/vue'

import {
  ref as firebaseRef,
  update
} from 'firebase/database'

import {
  database
} from '@/firebase'


interface Organization {

  id: string

  name: string

  description: string

}


const props = defineProps<{

  organization: Organization

}>()


const emit = defineEmits<{

  back: []

  save: []

}>()


const organizationName =
  ref(props.organization.name)

const organizationDescription =
  ref(props.organization.description)

const saving =
  ref(false)

const errorMessage =
  ref('')


// ==========================================
// BACK
// ==========================================

const goBack = () => {

  emit('back')

}


// ==========================================
// SAVE
// ==========================================

const saveOrganization =
  async () => {

    errorMessage.value = ''


    if (
      !organizationName.value.trim()
    ) {

      errorMessage.value =
        'Please enter an organization name.'

      return

    }


    if (
      !organizationDescription.value.trim()
    ) {

      errorMessage.value =
        'Please enter a description.'

      return

    }


    saving.value = true


    try {

      const organizationRef =
        firebaseRef(
          database,
          `organizations/${props.organization.id}`
        )


      await update(
        organizationRef,
        {
          name:
            organizationName.value.trim(),

          description:
            organizationDescription.value.trim()
        }
      )


      window.alert(
        'Organization updated successfully.'
      )


      emit('save')


    } catch (error) {

      console.error(
        'Error updating organization:',
        error
      )

      errorMessage.value =
        'Failed to update organization.'

    } finally {

      saving.value = false

    }

  }

</script>


<style scoped>

.edit-page {

  width: 100%;

  min-height: 100vh;

  box-sizing: border-box;

  padding: 30px 20px 50px;

  background:
    linear-gradient(
      160deg,
      #0d4d2b 0%,
      #1a7a44 45%,
      #2ecc71 100%
    );

}


/* ==========================================
   HEADER
========================================== */

.page-header {

  display: grid;

  grid-template-columns:
    45px 1fr 45px;

  align-items: center;

  gap: 12px;

  margin-bottom: 30px;

}


.page-header h1 {

  margin: 0;

  text-align: center;

  color: white;

  font-size: 21px;

  font-weight: 800;

  text-shadow:
    0 2px 15px
    rgba(0, 0, 0, 0.3);

}


.back-button {

  width: 45px;

  height: 45px;

  border:
    1.5px solid
    rgba(255, 255, 255, 0.4);

  border-radius: 50%;

  background:
    rgba(255, 255, 255, 0.12);

  color: white;

  font-size: 22px;

  cursor: pointer;

}


/* ==========================================
   CARD
========================================== */

.edit-card {

  max-width: 600px;

  margin: 0 auto;

  padding: 25px;

  background:
    rgba(255, 255, 255, 0.97);

  border-radius: 20px;

  box-shadow:
    0 8px 25px
    rgba(0, 0, 0, 0.15);

}


/* ==========================================
   FORM
========================================== */

.form-group {

  margin-bottom: 20px;

}


.form-group label {

  display: block;

  margin-bottom: 8px;

  color: #0d4d2b;

  font-size: 14px;

  font-weight: 700;

}


.form-group input,
.form-group textarea {

  width: 100%;

  box-sizing: border-box;

  padding: 12px;

  border:
    1px solid #d5d5d5;

  border-radius: 10px;

  background: white;

  color: #333;

  font-size: 14px;

  font-family: Arial, sans-serif;

  outline: none;

}


.form-group input:focus,
.form-group textarea:focus {

  border-color: #1a7a44;

}


.form-group textarea {

  resize: vertical;

}


/* ==========================================
   SAVE BUTTON
========================================== */

.save-button {

  width: 100%;

  padding: 13px;

  border: none;

  border-radius: 10px;

  background: #1a7a44;

  color: white;

  font-size: 15px;

  font-weight: bold;

  cursor: pointer;

}


.save-button:hover {

  background: #146235;

}


.save-button:disabled {

  opacity: 0.6;

  cursor: not-allowed;

}


/* ==========================================
   ERROR
========================================== */

.error-message {

  margin-top: 15px;

  text-align: center;

  color: #d32f2f;

  font-size: 13px;

  font-weight: 600;

}


/* ==========================================
   MOBILE
========================================== */

@media (max-width: 480px) {

  .edit-page {

    padding:
      20px
      14px
      40px;

  }


  .page-header {

    grid-template-columns:
      38px 1fr 38px;

  }


  .back-button {

    width: 38px;

    height: 38px;

    font-size: 20px;

  }


  .page-header h1 {

    font-size: 18px;

  }


  .edit-card {

    padding: 20px;

  }

}

</style>