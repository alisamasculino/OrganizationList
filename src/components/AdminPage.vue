<template>
  <ion-page>

    <div class="admin-page">

      <!-- Header -->
      <div class="page-header">

        <button
          class="back-button"
          type="button"
          @click="goBack"
        >
          ←
        </button>

        <h1>Admin Panel</h1>

        <button
          class="logout-button"
          type="button"
          @click="logout"
        >
          Logout
        </button>

      </div>


      <!-- Admin Options -->
      <div class="admin-card">

        <h2>Administration</h2>

        <p class="subtitle">
          Manage organizations and their members
        </p>


        <!-- Add Organization -->
        <button
          class="admin-option"
          type="button"
          @click="addOrganization"
        >

          <span class="option-icon">
            ➕
          </span>

          <span class="option-text">

            <strong>
              Add Organization
            </strong>

            <small>
              Create a new school organization
            </small>

          </span>

          <span class="arrow">
            →
          </span>

        </button>


        <!-- Manage Organizations -->
        <button
          class="admin-option"
          type="button"
          @click="manageOrganizations"
        >

          <span class="option-icon">
            🏢
          </span>

          <span class="option-text">

            <strong>
              Manage Organizations
            </strong>

            <small>
              View organizations and manage their members
            </small>

          </span>

          <span class="arrow">
            →
          </span>

        </button>

      </div>

    </div>

  </ion-page>
</template>


<script setup lang="ts">

import {
  IonPage
} from '@ionic/vue'

import {
  signOut
} from 'firebase/auth'

import {
  auth
} from '@/firebase'


// ==========================================
// EVENTS
// ==========================================

const emit = defineEmits<{
  manageOrganizations: []
  addOrganization: []
  back: []
  logout: []
}>()


// ==========================================
// ADD ORGANIZATION
// ==========================================

const addOrganization = () => {

  emit('addOrganization')

}


// ==========================================
// MANAGE ORGANIZATIONS
// ==========================================

const manageOrganizations = () => {

  emit('manageOrganizations')

}


// ==========================================
// BACK
// ==========================================

const goBack = () => {

  emit('back')

}


// ==========================================
// LOGOUT
// ==========================================

const logout = async () => {

  try {

    await signOut(auth)

    emit('logout')

  } catch (error) {

    console.error(
      'Logout error:',
      error
    )

  }

}

</script>


<style scoped>

.admin-page {

  width: 100%;

  min-height: 100vh;

  box-sizing: border-box;

  padding: 30px 20px 60px;

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
    45px 1fr auto;

  align-items: center;

  gap: 12px;

  margin-bottom: 35px;

}


.page-header h1 {

  margin: 0;

  text-align: center;

  color: white;

  font-size: 22px;

  font-weight: 800;

  text-shadow:
    0 2px 15px
    rgba(0, 0, 0, 0.3);

}


.back-button {

  width: 45px;

  height: 45px;

  border: 1.5px solid
    rgba(255, 255, 255, 0.4);

  border-radius: 50%;

  background:
    rgba(255, 255, 255, 0.12);

  color: white;

  font-size: 22px;

  cursor: pointer;

}


.back-button:active {

  transform: scale(0.95);

}


/* ==========================================
   LOGOUT BUTTON
   ========================================== */

.logout-button {

  padding: 10px 14px;

  border: 1px solid
    rgba(255, 255, 255, 0.35);

  border-radius: 10px;

  background:
    rgba(255, 255, 255, 0.12);

  color: white;

  font-size: 12px;

  font-weight: bold;

  cursor: pointer;

}


.logout-button:active {

  transform: scale(0.95);

}


/* ==========================================
   ADMIN CARD
   ========================================== */

.admin-card {

  max-width: 600px;

  margin: 0 auto;

  padding: 25px;

  border-radius: 20px;

  background:
    rgba(255, 255, 255, 0.97);

  box-shadow:
    0 8px 25px
    rgba(0, 0, 0, 0.15);

}


.admin-card h2 {

  margin: 0;

  color: #0d4d2b;

  font-size: 21px;

  font-weight: 800;

  text-align: center;

}


.subtitle {

  margin:
    8px 0 25px;

  color: #5a6a62;

  font-size: 13px;

  text-align: center;

}


/* ==========================================
   ADMIN OPTIONS
   ========================================== */

.admin-option {

  width: 100%;

  display: flex;

  align-items: center;

  gap: 14px;

  margin-bottom: 15px;

  padding: 18px;

  box-sizing: border-box;

  border: 1px solid #e2e2e2;

  border-radius: 15px;

  background: white;

  text-align: left;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

}


.admin-option:last-child {

  margin-bottom: 0;

}


.admin-option:hover {

  box-shadow:
    0 5px 15px
    rgba(0, 0, 0, 0.08);

  transform:
    translateY(-1px);

}


.admin-option:active {

  transform:
    scale(0.98);

}


/* ==========================================
   ICON
   ========================================== */

.option-icon {

  width: 48px;

  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 12px;

  background: #eaf7ef;

  font-size: 24px;

}


/* ==========================================
   TEXT
   ========================================== */

.option-text {

  flex: 1;

  display: flex;

  flex-direction: column;

  gap: 5px;

}


.option-text strong {

  color: #0d4d2b;

  font-size: 15px;

  font-weight: 800;

}


.option-text small {

  color: #6a756f;

  font-size: 12px;

  line-height: 1.4;

}


/* ==========================================
   ARROW
   ========================================== */

.arrow {

  color: #1a7a44;

  font-size: 24px;

  font-weight: bold;

}


/* ==========================================
   MOBILE
   ========================================== */

@media (max-width: 480px) {

  .admin-page {

    padding:
      20px 14px 50px;

  }


  .page-header {

    grid-template-columns:
      38px 1fr auto;

  }


  .back-button {

    width: 38px;

    height: 38px;

    font-size: 20px;

  }


  .page-header h1 {

    font-size: 18px;

  }


  .logout-button {

    padding:
      8px 10px;

    font-size: 11px;

  }


  .admin-card {

    padding: 20px;

  }


  .admin-option {

    padding: 15px;

  }


  .option-icon {

    width: 42px;

    height: 42px;

    font-size: 21px;

  }

}

</style>