<template>

  <ion-page>

    <ion-content>

      <div class="details-page">

        <!-- Header -->
        <div class="page-header">

          <!-- Exit Button -->
          <button
            class="exit-button"
            type="button"
            @click="exitPage"
          >
            ←
          </button>

          <h1>
            {{ organization }} Details
          </h1>

          <!-- Add Member Button -->
          <button
            class="add-button"
            type="button"
            @click="registerMember"
          >
            +
          </button>

        </div>


        <!-- Organization Information -->
        <div class="organization-info">

          <div class="info-row">

            <span class="info-label">
              Details
            </span>

            <span class="info-value details-text">
              {{ organizationDetails || 'No description available.' }}
            </span>

          </div>


          <div class="info-row">

            <span class="info-label">
              Total Members
            </span>

            <span class="info-value">
              {{ members.length }}
            </span>

          </div>

        </div>


        <!-- Student List -->
        <h2>
          Student List
        </h2>


        <!-- Table -->
        <div class="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  Member ID
                </th>

                <th>
                  Name
                </th>

                <th>
                  Course
                </th>

                <th>
                  Year Level
                </th>

                <th>
                  Organization Position
                </th>

                <th>
                  Contact Information
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              <!-- Display Members -->
              <tr
                v-for="member in members"
                :key="member.id"
              >

                <td>
                  {{ member.memberId }}
                </td>

                <td>
                  {{ member.name }}
                </td>

                <td>
                  {{ member.course }}
                </td>

                <td>
                  {{ member.yearLevel }}
                </td>

                <td>
                  {{ member.position }}
                </td>

                <td>
                  {{ member.contactInformation }}
                </td>


                <!-- Actions -->
                <td class="actions-cell">

                  <!-- Own Member -->
                  <template
                    v-if="isOwnMember(member)"
                  >

                    <button
                      class="edit-button"
                      type="button"
                      @click="editMember(member)"
                    >
                      Edit
                    </button>

                    <button
                      class="delete-button"
                      type="button"
                      @click="deleteMember(member)"
                    >
                      Delete
                    </button>

                  </template>


                  <!-- Other Members -->
                  <span
                    v-else
                    class="view-only"
                  >
                    View Only
                  </span>

                </td>

              </tr>


              <!-- No Members -->
              <tr
                v-if="members.length === 0"
              >

                <td
                  colspan="7"
                  class="no-members"
                >
                  No registered members yet.
                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </ion-content>

  </ion-page>

</template>


<script setup lang="ts">

import {
  ref,
  onMounted,
  onUnmounted
} from 'vue'

import {
  IonPage,
  IonContent
} from '@ionic/vue'

import {
  ref as firebaseRef,
  onValue,
  remove
} from 'firebase/database'

import {
  onAuthStateChanged,
  type Unsubscribe
} from 'firebase/auth'

import {
  auth,
  database
} from '@/firebase'


/* =========================================
   RECEIVE ORGANIZATION FROM HOMEPAGE
========================================= */

const props = defineProps<{
  organization: string
}>()


/* =========================================
   SEND EVENTS TO HOMEPAGE
========================================= */

const emit = defineEmits<{
  register: []
  exit: []
  edit: [member: any]
}>()


/* =========================================
   MEMBERS LIST
========================================= */

const members = ref<any[]>([])


/* =========================================
   ORGANIZATION DETAILS
========================================= */

const organizationDetails = ref('')


/* =========================================
   CURRENT USER UID
========================================= */

const currentUserUid = ref('')


let unsubscribeAuth: Unsubscribe | null = null


/* =========================================
   OPEN REGISTER MEMBER PAGE
========================================= */

const registerMember = () => {

  emit('register')

}


/* =========================================
   EXIT AND RETURN TO ORGANIZATION PAGE
========================================= */

const exitPage = () => {

  emit('exit')

}


/* =========================================
   CHECK IF MEMBER BELONGS TO CURRENT USER
========================================= */

const isOwnMember = (member: any): boolean => {

  if (!currentUserUid.value) {
    return false
  }

  if (!member.ownerUid) {
    return false
  }

  return member.ownerUid === currentUserUid.value

}


/* =========================================
   OPEN EDIT MEMBER PAGE
========================================= */

const editMember = (member: any) => {

  // Security check:
  // User can only edit their own member record.

  if (!isOwnMember(member)) {

    alert(
      'You can only edit your own member information.'
    )

    return

  }

  emit('edit', member)

}


/* =========================================
   DELETE MEMBER
========================================= */

const deleteMember = async (
  member: any
) => {

  // Security check:
  // User can only delete their own member record.

  if (!isOwnMember(member)) {

    alert(
      'You can only delete your own member information.'
    )

    return

  }


  const confirmDelete = confirm(
    `Are you sure you want to delete ${member.name}?`
  )


  if (!confirmDelete) {
    return
  }


  try {

    const memberRef = firebaseRef(
      database,
      `organizations/${props.organization}/members/${member.id}`
    )


    await remove(memberRef)


    alert(
      'Member deleted successfully!'
    )


  } catch (error) {

    console.error(
      'Error deleting member:',
      error
    )


    alert(
      'Failed to delete member.'
    )

  }

}


/* =========================================
   GET MEMBERS AND ORGANIZATION DETAILS
   FROM FIREBASE
========================================= */

onMounted(() => {


  /* =========================================
     CHECK FIREBASE AUTHENTICATION
  ========================================= */

  unsubscribeAuth = onAuthStateChanged(
    auth,
    (user) => {

      if (user) {

        currentUserUid.value = user.uid

        console.log(
          'Current logged-in user UID:',
          user.uid
        )

      } else {

        currentUserUid.value = ''

        console.log(
          'No user is currently logged in.'
        )

      }

    }
  )


  /* =========================================
     GET MEMBERS FROM FIREBASE
  ========================================= */

  const membersRef = firebaseRef(
    database,
    `organizations/${props.organization}/members`
  )


  onValue(
    membersRef,
    (snapshot) => {

      const data = snapshot.val()


      if (data) {

        members.value =
          Object.entries(data).map(
            ([id, member]: [string, any]) => ({

              id,

              ...member

            })
          )

      } else {

        members.value = []

      }

    }
  )


  /* =========================================
     GET ORGANIZATION DESCRIPTION
  ========================================= */

  const organizationRef = firebaseRef(
    database,
    `organizations/${props.organization}`
  )


  onValue(
    organizationRef,
    (snapshot) => {

      const data = snapshot.val()


      if (data) {

        organizationDetails.value =
          data.description || ''

      } else {

        organizationDetails.value = ''

      }

    }
  )

})


/* =========================================
   CLEAN UP AUTH LISTENER
========================================= */

onUnmounted(() => {

  if (unsubscribeAuth) {

    unsubscribeAuth()

  }

})

</script>


<style scoped>

/* =========================================
   ION CONTENT
========================================= */

ion-content {
  --background: transparent;
}


/* =========================================
   MAIN PAGE
========================================= */

.details-page {

  min-height: 100vh;

  padding: 30px 20px 50px;

  background: linear-gradient(
    160deg,
    #0d4d2b 0%,
    #1a7a44 45%,
    #2ecc71 100%
  );

  box-sizing: border-box;

  position: relative;

  overflow-x: hidden;

}


/* =========================================
   DECORATIVE BACKGROUND CIRCLES
========================================= */

.details-page::before {

  content: '';

  position: fixed;

  top: -100px;

  right: -100px;

  width: 350px;

  height: 350px;

  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 70%
  );

  border-radius: 50%;

  pointer-events: none;

  z-index: 0;

}


.details-page::after {

  content: '';

  position: fixed;

  bottom: -120px;

  left: -120px;

  width: 400px;

  height: 400px;

  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.06) 0%,
    transparent 70%
  );

  border-radius: 50%;

  pointer-events: none;

  z-index: 0;

}


/* =========================================
   PAGE HEADER
========================================= */

.page-header {

  display: grid;

  grid-template-columns:
    45px 1fr 45px;

  align-items: center;

  gap: 10px;

  margin-bottom: 25px;

  position: relative;

  z-index: 1;

}


.page-header h1 {

  font-size: 26px;

  margin: 0;

  text-align: center;

  font-weight: 800;

  color: #ffffff;

  letter-spacing: 1px;

  text-shadow:
    0 2px 15px
    rgba(0, 0, 0, 0.3);

  word-break: break-word;

}


/* =========================================
   EXIT BUTTON
========================================= */

.exit-button {

  width: 45px;

  height: 45px;

  flex-shrink: 0;

  border:
    1.5px solid
    rgba(255, 255, 255, 0.4);

  border-radius: 50%;

  background:
    rgba(255, 255, 255, 0.12);

  color: white;

  font-size: 22px;

  cursor: pointer;

  backdrop-filter: blur(6px);

  transition:
    all 0.3s ease;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0;

  line-height: 1;

}


.exit-button:hover {

  background:
    rgba(255, 255, 255, 0.25);

  border-color:
    rgba(255, 255, 255, 0.7);

  transform: scale(1.08);

}


.exit-button:active {

  transform: scale(0.95);

}


/* =========================================
   ADD MEMBER BUTTON
========================================= */

.add-button {

  width: 45px;

  height: 45px;

  flex-shrink: 0;

  border:
    1.5px solid
    rgba(255, 255, 255, 0.4);

  border-radius: 50%;

  background: #f1c40f;

  color: #0d4d2b;

  font-size: 28px;

  font-weight: bold;

  cursor: pointer;

  transition:
    all 0.3s ease;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0;

  line-height: 1;

  box-shadow:
    0 4px 15px
    rgba(241, 196, 15, 0.4);

}


.add-button:hover {

  background: #ffd633;

  transform: scale(1.08);

  box-shadow:
    0 6px 20px
    rgba(241, 196, 15, 0.6);

}


.add-button:active {

  transform: scale(0.95);

}


/* =========================================
   ORGANIZATION INFORMATION CARD
========================================= */

.organization-info {

  width: 100%;

  background:
    rgba(255, 255, 255, 0.97);

  border-radius: 16px;

  padding: 20px 24px;

  margin-bottom: 30px;

  position: relative;

  z-index: 1;

  box-shadow:
    0 4px 20px
    rgba(0, 0, 0, 0.15);

  border-left:
    5px solid #f1c40f;

  transition:
    box-shadow 0.3s ease;

  animation:
    fadeInUp
    0.5s
    ease-out
    both;

  box-sizing: border-box;

}


.organization-info:hover {

  box-shadow:
    0 10px 30px
    rgba(0, 0, 0, 0.25);

}


.info-row {

  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 15px;

  padding: 14px 0;

  border-bottom:
    1px solid
    rgba(26, 122, 68, 0.1);

}


.info-row:last-child {

  border-bottom: none;

  padding-bottom: 0;

}


.info-row:first-child {

  padding-top: 0;

}


.info-label {

  font-size: 12px;

  font-weight: 700;

  color: #4a5a52;

  letter-spacing: 1px;

  text-transform: uppercase;

  flex-shrink: 0;

  padding-top: 2px;

}


.info-value {

  font-size: 15px;

  font-weight: 700;

  color: #0d4d2b;

  text-align: right;

  word-break: break-word;

  max-width: 65%;

}


/* =========================================
   DETAILS DESCRIPTION
========================================= */

.details-text {

  font-weight: 500;

  font-size: 14px;

  color: #2c3e35;

  line-height: 1.55;

  text-align: right;

}


/* =========================================
   STUDENT LIST HEADING
========================================= */

h2 {

  font-size: 22px;

  margin:
    0 0 20px 0;

  color: #ffffff;

  font-weight: 700;

  letter-spacing: 1.5px;

  text-transform: uppercase;

  position: relative;

  z-index: 1;

  padding-bottom: 12px;

}


h2::after {

  content: '';

  display: block;

  width: 60px;

  height: 3px;

  background: #f1c40f;

  margin-top: 10px;

  border-radius: 2px;

}


/* =========================================
   TABLE CONTAINER
========================================= */

.table-container {

  width: 100%;

  overflow-x: auto;

  background:
    rgba(255, 255, 255, 0.97);

  border-radius: 16px;

  position: relative;

  z-index: 1;

  box-shadow:
    0 4px 20px
    rgba(0, 0, 0, 0.15);

  border-left:
    5px solid #2ecc71;

  transition:
    box-shadow 0.3s ease;

  scrollbar-width: thin;

  scrollbar-color:
    #1a7a44
    rgba(0, 0, 0, 0.05);

}


.table-container:hover {

  box-shadow:
    0 10px 30px
    rgba(0, 0, 0, 0.25);

}


/* =========================================
   SCROLLBAR
========================================= */

.table-container::-webkit-scrollbar {

  height: 8px;

}


.table-container::-webkit-scrollbar-track {

  background:
    rgba(0, 0, 0, 0.05);

  border-radius: 10px;

}


.table-container::-webkit-scrollbar-thumb {

  background: #1a7a44;

  border-radius: 10px;

}


.table-container::-webkit-scrollbar-thumb:hover {

  background: #0d4d2b;

}


/* =========================================
   TABLE
========================================= */

table {

  width: 100%;

  border-collapse: collapse;

  min-width: 1150px;

}


th,
td {

  padding: 14px 16px;

  text-align: left;

  border: none;

  border-bottom:
    1px solid
    rgba(26, 122, 68, 0.12);

}


th {

  background: linear-gradient(
    135deg,
    #0d4d2b 0%,
    #1a7a44 100%
  );

  color: white;

  font-weight: 700;

  font-size: 13px;

  letter-spacing: 1px;

  text-transform: uppercase;

  white-space: nowrap;

  position: sticky;

  top: 0;

  z-index: 2;

}


th:first-child {

  border-top-left-radius: 16px;

}


th:last-child {

  border-top-right-radius: 16px;

}


td {

  background: transparent;

  color: #2c3e35;

  font-size: 14px;

  font-weight: 500;

  vertical-align: top;

}


tbody tr {

  transition:
    background 0.25s ease;

}


tbody tr:hover td {

  background:
    rgba(46, 204, 113, 0.08);

}


tbody tr:last-child td {

  border-bottom: none;

}


/* =========================================
   FIRST COLUMN
========================================= */

td:first-child {

  font-weight: 700;

  color: #0d4d2b;

}


/* =========================================
   POSITION COLUMN
========================================= */

td:nth-child(5) {

  font-weight: 600;

  color: #1a7a44;

}


/* =========================================
   ACTIONS
========================================= */

.actions-cell {

  white-space: nowrap;

}


.edit-button,
.delete-button {

  border: none;

  border-radius: 8px;

  padding: 8px 12px;

  margin-right: 6px;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;

  transition:
    all 0.2s ease;

}


.edit-button {

  background: #f1c40f;

  color: #0d4d2b;

}


.edit-button:hover {

  background: #ffd633;

  transform:
    translateY(-1px);

}


.edit-button:active {

  transform:
    scale(0.95);

}


.delete-button {

  background: #e74c3c;

  color: white;

}


.delete-button:hover {

  background: #c0392b;

  transform:
    translateY(-1px);

}


.delete-button:active {

  transform:
    scale(0.95);

}


/* =========================================
   VIEW ONLY
========================================= */

.view-only {

  color: #7f8c8d;

  font-size: 11px;

  font-weight: 700;

  font-style: italic;

}


/* =========================================
   NO MEMBERS
========================================= */

.no-members {

  text-align: center;

  color: #4a5a52 !important;

  padding:
    40px 20px !important;

  font-size: 14px;

  font-weight: 500;

  letter-spacing: 0.5px;

  font-style: italic;

}


.no-members::before {

  content: '📋';

  display: block;

  font-size: 32px;

  margin-bottom: 10px;

  font-style: normal;

  opacity: 0.6;

}


/* =========================================
   ANIMATION
========================================= */

@keyframes fadeInUp {

  from {

    opacity: 0;

    transform:
      translateY(20px);

  }

  to {

    opacity: 1;

    transform:
      translateY(0);

  }

}


/* =========================================
   RESPONSIVE - TABLET
========================================= */

@media (max-width: 768px) {

  .details-page {

    padding:
      24px 16px 40px;

  }

  .page-header h1 {

    font-size: 19px;

    letter-spacing: 0.5px;

  }

  .page-header {

    grid-template-columns:
      42px 1fr 42px;

    margin-bottom: 22px;

  }

  .exit-button,
  .add-button {

    width: 42px;

    height: 42px;

  }

  .organization-info {

    padding:
      18px 20px;

    margin-bottom: 26px;

  }

  .info-label {

    font-size: 11px;

  }

  .info-value {

    font-size: 14px;

  }

  .details-text {

    font-size: 13px;

  }

  h2 {

    font-size: 17px;

    letter-spacing: 1px;

  }

  th,
  td {

    padding:
      11px 13px;

    font-size: 13px;

  }

  th {

    font-size: 11px;

    letter-spacing: 0.6px;

  }

  .edit-button,
  .delete-button {

    padding:
      7px 10px;

    font-size: 11px;

  }

}


/* =========================================
   RESPONSIVE - MOBILE
========================================= */

@media (max-width: 480px) {

  .details-page {

    padding:
      20px 14px 35px;

  }

  .page-header h1 {

    font-size: 15px;

    letter-spacing: 0.3px;

  }

  .page-header {

    grid-template-columns:
      38px 1fr 38px;

    gap: 8px;

    margin-bottom: 20px;

  }

  .exit-button,
  .add-button {

    width: 38px;

    height: 38px;

  }

  .exit-button {

    font-size: 20px;

  }

  .add-button {

    font-size: 24px;

  }

  .organization-info {

    padding:
      16px 18px;

    margin-bottom: 22px;

    border-radius: 14px;

    border-left-width: 4px;

  }

  .info-row {

    padding:
      12px 0;

    gap: 10px;

  }

  .info-label {

    font-size: 10px;

    letter-spacing: 0.6px;

  }

  .info-value {

    font-size: 13px;

    max-width: 62%;

  }

  .details-text {

    font-size: 12.5px;

    line-height: 1.5;

  }

  h2 {

    font-size: 15px;

    margin-bottom: 16px;

  }

  h2::after {

    width: 45px;

    height: 2px;

  }

  .table-container {

    border-radius: 14px;

    border-left-width: 4px;

  }

  th,
  td {

    padding:
      10px 12px;

    font-size: 12px;

  }

  th {

    font-size: 10px;

  }

  .no-members {

    padding:
      30px 15px !important;

    font-size: 13px;

  }

  .edit-button,
  .delete-button {

    padding:
      6px 9px;

    font-size: 10px;

    margin-right: 4px;

  }

}


/* =========================================
   RESPONSIVE - SMALL MOBILE
========================================= */

@media (max-width: 360px) {

  .page-header h1 {

    font-size: 13px;

  }

  .organization-info {

    padding:
      14px 15px;

  }

  .info-label {

    font-size: 9.5px;

  }

  .info-value {

    font-size: 12px;

  }

  .details-text {

    font-size: 11.5px;

  }

  h2 {

    font-size: 14px;

  }

  th,
  td {

    padding:
      8px 10px;

    font-size: 11px;

  }

}


/* =========================================
   LANDSCAPE
========================================= */

@media (
  max-height: 500px
) and (
  orientation: landscape
) {

  .details-page {

    padding:
      16px 20px 30px;

  }

  .page-header {

    margin-bottom: 16px;

  }

  .organization-info {

    padding:
      14px 20px;

    margin-bottom: 18px;

  }

  .info-row {

    padding:
      10px 0;

  }

  h2 {

    margin-bottom: 12px;

  }

}

</style>