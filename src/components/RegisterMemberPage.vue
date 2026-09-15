<template>
  <ion-page>
    <ion-content>
      <div class="register-page">

        <!-- Header -->
        <div class="page-header">
          <h1>Register New Member</h1>

          <button
            class="exit-button"
            type="button"
            @click="goBack"
          >
            ←
          </button>
        </div>

        <p class="organization-name">
          Organization: {{ organizationName || 'Not selected' }}
        </p>

        <!-- Form -->
        <div class="form">

          <!-- Member ID -->
          <label>Member ID</label>
          <input
            v-model="memberId"
            type="text"
            placeholder="MCC2023-00111"
            maxlength="13"
            @input="handleMemberIdInput"
          />

          <!-- Name -->
          <label>Name</label>
          <input
            v-model="name"
            type="text"
            placeholder="Enter Complete Name"
          />

          <!-- Course -->
          <label>Course</label>
          <select v-model="course">
            <option value="" disabled>
              Select Course
            </option>

            <option value="Bachelor of Science in Information Technology">
              Bachelor of Science in Information Technology
            </option>

            <option value="Bachelor of Science in Criminology">
              Bachelor of Science in Criminology
            </option>

            <option value="Bachelor of Science in Tourism Management">
              Bachelor of Science in Tourism Management
            </option>

            <option value="Bachelor of Secondary Education">
              Bachelor of Secondary Education
            </option>

            <option value="Bachelor of Technical-Vocational Teacher Education">
              Bachelor of Technical-Vocational Teacher Education
            </option>

            <option value="Bachelor of Arts in English Language">
              Bachelor of Arts in English Language
            </option>

            <option value="Bachelor of Arts in Psychology">
              Bachelor of Arts in Psychology
            </option>

            <option value="General Education">
              General Education
            </option>

            <option value="Bachelor of Science in Hospitality Management">
              Bachelor of Science in Hospitality Management
            </option>

            <option value="Bachelor of Technology and Livelihood Education">
              Bachelor of Technology and Livelihood Education
            </option>
          </select>

          <!-- Year Level -->
          <label>Year Level</label>
          <select v-model="yearLevel">
            <option value="" disabled>
              Select Year Level
            </option>

            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <!-- Organization Position -->
          <label>Organization Position</label>
          <select v-model="position">
            <option value="" disabled>
              Select Position
            </option>

            <option value="Chairperson">
              Chairperson
            </option>

            <option value="Vice Chairperson">
              Vice Chairperson
            </option>

            <option value="Secretary">
              Secretary
            </option>

            <option value="Treasurer">
              Treasurer
            </option>

            <option value="Auditor">
              Auditor
            </option>

            <option value="Committee on External Affairs">
              Committee on External Affairs
            </option>

            <option value="Documentation and Evaluation">
              Documentation and Evaluation
            </option>

            <option value="Communication and Public Affairs">
              Communication and Public Affairs
            </option>

            <option value="Research and Extension">
              Research and Extension
            </option>

            <option value="Income-Generating Project">
              Income-Generating Project
            </option>
          </select>

          <!-- Contact Information -->
          <label>Contact Information</label>
          <input
            v-model="contactInformation"
            type="text"
            placeholder="Enter 11-digit contact number"
            maxlength="11"
            inputmode="numeric"
            @input="handleContactInput"
          />

          <!-- Register Button -->
          <button
            class="register-button"
            type="button"
            @click="registerMember"
            :disabled="saving"
          >
            {{ saving ? 'Saving...' : 'Register' }}
          </button>

          <!-- Message -->
          <p
            v-if="message"
            :class="messageType"
          >
            {{ message }}
          </p>

        </div>

      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import {
  computed,
  ref
} from 'vue'

import {
  IonPage,
  IonContent
} from '@ionic/vue'

import {
  ref as firebaseRef,
  push,
  set,
  get
} from 'firebase/database'

import {
  auth,
  database
} from '@/firebase'


/* =========================================
   RECEIVE SELECTED ORGANIZATION
========================================= */

const props = defineProps<{
  organization: string
}>()


/* =========================================
   GET ORGANIZATION NAME
========================================= */

const organizationName = computed(() => {

  return props.organization?.trim() || ''

})


/* =========================================
   SEND EVENT BACK TO HOMEPAGE
========================================= */

const emit = defineEmits<{
  back: []
}>()


/* =========================================
   EXIT / BACK BUTTON
========================================= */

const goBack = () => {

  emit('back')

}


/* =========================================
   FORM FIELDS
========================================= */

const memberId = ref('')
const name = ref('')
const course = ref('')
const yearLevel = ref('')
const position = ref('')
const contactInformation = ref('')


/* =========================================
   MEMBER ID INPUT
========================================= */

const handleMemberIdInput = (event: Event) => {

  const input = event.target as HTMLInputElement

  let value = input.value.toUpperCase()

  value = value.replace(/[^A-Z0-9-]/g, '')

  value = value.slice(0, 13)

  memberId.value = value

}


/* =========================================
   CONTACT NUMBER INPUT
========================================= */

const handleContactInput = (event: Event) => {

  const input = event.target as HTMLInputElement

  let value =
    input.value.replace(/\D/g, '')

  value = value.slice(0, 11)

  contactInformation.value = value

}


/* =========================================
   SAVING STATUS
========================================= */

const saving = ref(false)

const message = ref('')
const messageType = ref('')


/* =========================================
   REGISTER MEMBER
========================================= */

const registerMember = async () => {

  /* =========================================
     CHECK LOGGED-IN USER
  ========================================= */

  const currentUser = auth.currentUser

  if (!currentUser) {

    message.value =
      'You must be logged in to register a member.'

    messageType.value =
      'error'

    return
  }


  /* =========================================
     CHECK ORGANIZATION
  ========================================= */

  if (!organizationName.value) {

    message.value =
      'No organization selected.'

    messageType.value =
      'error'

    console.error(
      'Organization is missing:',
      props.organization
    )

    return
  }


  /* =========================================
     CHECK ALL FORM FIELDS
  ========================================= */

  if (
    !memberId.value.trim() ||
    !name.value.trim() ||
    !course.value ||
    !yearLevel.value ||
    !position.value ||
    !contactInformation.value.trim()
  ) {

    message.value =
      'Please fill in all fields.'

    messageType.value =
      'error'

    return
  }


  /* =========================================
     CHECK MEMBER ID FORMAT
  ========================================= */

  const memberIdPattern =
    /^MCC\d{4}-\d{5}$/

  if (
    !memberIdPattern.test(
      memberId.value.trim()
    )
  ) {

    message.value =
      'Invalid Member ID. Use this format: MCC2023-00111.'

    messageType.value =
      'error'

    return
  }


  /* =========================================
     CHECK CONTACT NUMBER
  ========================================= */

  if (
    !/^\d{11}$/.test(
      contactInformation.value
    )
  ) {

    message.value =
      'Contact Information must contain exactly 11 numbers.'

    messageType.value =
      'error'

    return
  }


  saving.value = true
  message.value = ''


  try {

    /* =========================================
       GET ALL ORGANIZATIONS
    ========================================= */

    const organizationsRef =
      firebaseRef(
        database,
        'organizations'
      )

    const organizationsSnapshot =
      await get(
        organizationsRef
      )

    const organizationsData =
      organizationsSnapshot.val()


    /* =========================================
       CHECK EXISTING DATA
    ========================================= */

    if (organizationsData) {

      for (
        const [orgName, organization]
        of Object.entries(
          organizationsData
        ) as [string, any][]
      ) {

        if (!organization?.members) {
          continue
        }


        const members =
          Object.values(
            organization.members
          ) as any[]


        /* =========================================
           CHECK DUPLICATE MEMBER ID
        ========================================= */

        const duplicateMemberId =
          members.some(
            member =>
              member.memberId
                ?.trim()
                .toUpperCase() ===
              memberId.value
                .trim()
                .toUpperCase()
          )


        if (duplicateMemberId) {

          message.value =
            'This Member ID is already registered and cannot be used again.'

          messageType.value =
            'error'

          saving.value =
            false

          return
        }


        /* =========================================
           CHECK DUPLICATE NAME
        ========================================= */

        const duplicateName =
          members.some(
            member =>
              member.name
                ?.trim()
                .toLowerCase() ===
              name.value
                .trim()
                .toLowerCase()
          )


        if (duplicateName) {

          message.value =
            'This name is already registered and cannot be used again.'

          messageType.value =
            'error'

          saving.value =
            false

          return
        }


        /* =========================================
           CHECK DUPLICATE CONTACT
        ========================================= */

        const duplicateContact =
          members.some(
            member =>
              member.contactInformation
                ?.trim() ===
              contactInformation.value
                .trim()
          )


        if (duplicateContact) {

          message.value =
            'This contact number is already registered and cannot be used again.'

          messageType.value =
            'error'

          saving.value =
            false

          return
        }


        /* =========================================
           CHECK DUPLICATE POSITION
        ========================================= */

        if (
          orgName ===
          organizationName.value
        ) {

          const duplicatePosition =
            members.some(
              member =>
                member.position
                  ?.trim()
                  .toLowerCase() ===
                position.value
                  .trim()
                  .toLowerCase()
            )


          if (duplicatePosition) {

            message.value =
              'This organization position is already occupied.'

            messageType.value =
              'error'

            saving.value =
              false

            return
          }

        }

      }

    }


    /* =========================================
       CREATE MEMBER RECORD
    ========================================= */

    const membersRef =
      firebaseRef(
        database,
        `organizations/${organizationName.value}/members`
      )


    const newMemberRef =
      push(membersRef)


    /* =========================================
       SAVE MEMBER
       
       ownerUid identifies the user who
       registered this member.
    ========================================= */

    await set(
      newMemberRef,
      {

        memberId:
          memberId.value.trim(),

        name:
          name.value.trim(),

        course:
          course.value,

        yearLevel:
          yearLevel.value,

        position:
          position.value,

        contactInformation:
          contactInformation.value.trim(),

        ownerUid:
          currentUser.uid

      }
    )


    /* =========================================
       SUCCESS MESSAGE
    ========================================= */

    message.value =
      'Member registered successfully!'

    messageType.value =
      'success'


    /* =========================================
       CLEAR FORM
    ========================================= */

    memberId.value = ''
    name.value = ''
    course.value = ''
    yearLevel.value = ''
    position.value = ''
    contactInformation.value = ''


    /* =========================================
       RETURN TO ORGANIZATION DETAILS
    ========================================= */

    setTimeout(() => {

      emit('back')

    }, 1000)


  } catch (error) {

    console.error(
      'Error saving member:',
      error
    )

    message.value =
      'Failed to save member. Please check Firebase.'

    messageType.value =
      'error'

  } finally {

    saving.value =
      false

  }

}

</script>


<style scoped>

ion-content {
  --background: transparent;
}


.register-page {
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


.register-page::before {
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


.register-page::after {
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
   HEADER
========================================= */

.page-header {
  display: grid;
  grid-template-columns: 1fr 45px;
  align-items: center;
  gap: 15px;
  max-width: 500px;
  margin: 0 auto 10px;
  position: relative;
  z-index: 1;
}


h1 {
  font-size: 26px;
  margin: 0;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 1px;
  text-shadow:
    0 2px 15px
    rgba(0, 0, 0, 0.3);
  text-align: left;
}


/* =========================================
   EXIT BUTTON
========================================= */

.exit-button {
  width: 45px;
  height: 45px;
  flex-shrink: 0;
  border: 1.5px solid
    rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  background:
    rgba(255, 255, 255, 0.12);
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
   ORGANIZATION NAME
========================================= */

.organization-name {
  text-align: center;
  font-weight: 600;
  color: #ffffff;
  margin: 0 auto 28px;
  max-width: 500px;
  font-size: 14px;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
  padding: 10px 20px;
  border: 1.5px solid
    rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  backdrop-filter: blur(4px);
  background:
    rgba(255, 255, 255, 0.08);
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  box-sizing: border-box;
}


/* =========================================
   FORM
========================================= */

.form {
  max-width: 500px;
  margin: auto;
  background:
    rgba(255, 255, 255, 0.97);
  padding: 28px 26px;
  border-radius: 16px;
  position: relative;
  z-index: 1;
  box-shadow:
    0 4px 20px
    rgba(0, 0, 0, 0.15);
  border-left: 5px solid #2ecc71;
  animation:
    fadeInUp 0.5s ease-out both;
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
select {
  width: 100%;
  padding: 13px 16px;
  border: 1.5px solid
    rgba(26, 122, 68, 0.2);
  border-radius: 10px;
  font-size: 15px;
  box-sizing: border-box;
  background: #f8fdfa;
  color: #2c3e35;
  font-weight: 500;
  transition: all 0.25s ease;
  outline: none;
  font-family: inherit;
}


input::placeholder {
  color: #9db3a7;
  font-weight: 400;
}


input:hover,
select:hover {
  border-color:
    rgba(26, 122, 68, 0.4);
}


input:focus,
select:focus {
  border-color: #2ecc71;
  background: #ffffff;
  box-shadow:
    0 0 0 4px
    rgba(46, 204, 113, 0.15);
}


/* =========================================
   REGISTER BUTTON
========================================= */

.register-button {
  width: 100%;
  margin-top: 28px;
  padding: 15px;
  border: none;
  border-radius: 50px;
  background:
    linear-gradient(
      135deg,
      #0d4d2b 0%,
      #1a7a44 100%
    );
  color: white;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0 6px 20px
    rgba(13, 77, 43, 0.35);
  font-family: inherit;
}


.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 10px 28px
    rgba(13, 77, 43, 0.45);
  background:
    linear-gradient(
      135deg,
      #1a7a44 0%,
      #2ecc71 100%
    );
}


.register-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow:
    0 4px 14px
    rgba(13, 77, 43, 0.35);
}


.register-button:disabled {
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
  background:
    rgba(46, 204, 113, 0.15);
  border: 1.5px solid
    rgba(46, 204, 113, 0.4);
  border-radius: 50px;
  font-size: 13px;
  letter-spacing: 0.5px;
  animation:
    fadeInUp 0.4s ease-out;
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
  background:
    rgba(231, 76, 60, 0.12);
  border: 1.5px solid
    rgba(231, 76, 60, 0.4);
  border-radius: 50px;
  font-size: 13px;
  letter-spacing: 0.5px;
  animation:
    fadeInUp 0.4s ease-out;
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

  .register-page {
    padding: 24px 16px 40px;
  }

  h1 {
    font-size: 20px;
    letter-spacing: 0.5px;
  }

  .page-header {
    grid-template-columns: 1fr 42px;
    gap: 10px;
  }

  .exit-button {
    width: 42px;
    height: 42px;
    font-size: 20px;
  }

  .organization-name {
    font-size: 13px;
    margin-bottom: 22px;
  }

  .form {
    padding: 24px 22px;
  }

  label {
    font-size: 12px;
  }

  input,
  select {
    padding: 12px 14px;
    font-size: 14px;
  }

}


@media (max-width: 480px) {

  .register-page {
    padding: 20px 14px 35px;
  }

  h1 {
    font-size: 17px;
    letter-spacing: 0.3px;
  }

  .page-header {
    grid-template-columns: 1fr 38px;
    gap: 8px;
    margin-bottom: 14px;
  }

  .exit-button {
    width: 38px;
    height: 38px;
    font-size: 19px;
  }

  .organization-name {
    font-size: 12px;
    padding: 8px 16px;
    margin-bottom: 20px;
    letter-spacing: 0.5px;
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
  select {
    padding: 11px 14px;
    font-size: 14px;
    border-radius: 9px;
  }

  .register-button {
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

  .organization-name {
    font-size: 11px;
    padding: 7px 14px;
  }

  .form {
    padding: 18px 15px;
  }

  label {
    font-size: 11px;
  }

  input,
  select {
    padding: 10px 12px;
    font-size: 13px;
  }

}


@media (
  max-height: 500px
) and (
  orientation: landscape
) {

  .register-page {
    padding: 16px 20px 30px;
  }

  .page-header {
    margin-bottom: 10px;
  }

  .organization-name {
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
  select {
    padding: 10px 14px;
  }

  .register-button {
    margin-top: 18px;
    padding: 12px;
  }

}

</style>