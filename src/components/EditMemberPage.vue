<template>
  <ion-page>
    <ion-content>
      <div class="edit-page">

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
            Edit Member
          </h1>

          <div></div>

        </div>

        <!-- Form Card -->
        <div class="form-card">

          <div class="form-title">
            {{ props.organization }} Member Information
          </div>

          <!-- Member ID -->
          <div class="form-group">
            <label>Member ID</label>

            <input
              v-model="form.memberId"
              type="text"
              placeholder="MCC2023-00111"
              maxlength="13"
              @input="handleMemberIdInput"
            />
          </div>

          <!-- Name -->
          <div class="form-group">
            <label>Name</label>

            <input
              v-model="form.name"
              type="text"
              placeholder="Enter full name"
            />
          </div>

          <!-- Course -->
          <div class="form-group">
            <label>Course</label>

            <select
              v-model="form.course"
            >
              <option value="" disabled>
                Select Course
              </option>

              <option
                v-for="course in courses"
                :key="course"
                :value="course"
              >
                {{ course }}
              </option>
            </select>
          </div>

          <!-- Year Level -->
          <div class="form-group">
            <label>Year Level</label>

            <select
              v-model="form.yearLevel"
            >
              <option value="" disabled>
                Select Year Level
              </option>

              <option
                v-for="year in yearLevels"
                :key="year"
                :value="year"
              >
                {{ year }}
              </option>
            </select>
          </div>

          <!-- Organization Position -->
          <div class="form-group">
            <label>Organization Position</label>

            <select
              v-model="form.position"
            >
              <option value="" disabled>
                Select Organization Position
              </option>

              <option
                v-for="position in positions"
                :key="position"
                :value="position"
              >
                {{ position }}
              </option>
            </select>
          </div>

          <!-- Contact Information -->
          <div class="form-group">
            <label>Contact Information</label>

            <input
              v-model="form.contactInformation"
              type="text"
              placeholder="Enter 11-digit contact number"
              maxlength="11"
              inputmode="numeric"
              @input="handleContactInput"
            />
          </div>

          <!-- Save Button -->
          <button
            class="save-button"
            type="button"
            @click="saveChanges"
          >
            Save Changes
          </button>

        </div>

      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import {
  reactive
} from 'vue'

import {
  IonPage,
  IonContent
} from '@ionic/vue'

import {
  ref as firebaseRef,
  update,
  get
} from 'firebase/database'

import {
  auth,
  database
} from '@/firebase'


/* =========================================
   RECEIVE MEMBER INFORMATION
========================================= */

const props = defineProps<{
  organization: string
  member: any
  adminMode?: boolean
}>()


/* =========================================
   SEND EVENTS TO HOMEPAGE
========================================= */

const emit = defineEmits<{
  save: []
  exit: []
}>()


/* =========================================
   COURSE OPTIONS
========================================= */

const courses = [

  'Bachelor of Science in Information Technology',

  'Bachelor of Science in Criminology',

  'Bachelor of Science in Tourism Management',

  'Bachelor of Secondary Education',

  'Bachelor of Technical-Vocational Teacher Education',

  'Bachelor of Arts in English Language',

  'Bachelor of Arts in Psychology',

  'General Education',

  'Bachelor of Science in Hospitality Management',

  'Bachelor of Technology and Livelihood Education'

]


/* =========================================
   YEAR LEVEL OPTIONS
========================================= */

const yearLevels = [

  '1st Year',

  '2nd Year',

  '3rd Year',

  '4th Year'

]


/* =========================================
   ORGANIZATION POSITION OPTIONS
========================================= */

const positions = [

  'Chairperson',

  'Vice Chairperson',

  'Secretary',

  'Treasurer',

  'Auditor',

  'Committee on External Affairs',

  'Documentation and Evaluation',

  'Communication and Public Affairs',

  'Research and Extension',

  'Income-Generating Project'

]


/* =========================================
   EDIT FORM
========================================= */

const form = reactive({

  memberId:
    props.member?.memberId || '',

  name:
    props.member?.name || '',

  course:
    props.member?.course || '',

  yearLevel:
    props.member?.yearLevel || '',

  position:
    props.member?.position || '',

  contactInformation:
    props.member?.contactInformation || ''

})


/* =========================================
   MEMBER ID INPUT
========================================= */

const handleMemberIdInput = (event: Event) => {

  const input =
    event.target as HTMLInputElement

  let value =
    input.value.toUpperCase()

  value =
    value.replace(
      /[^A-Z0-9-]/g,
      ''
    )

  value =
    value.slice(0, 13)

  form.memberId = value

}


/* =========================================
   CONTACT INPUT
========================================= */

const handleContactInput = (event: Event) => {

  const input =
    event.target as HTMLInputElement

  let value =
    input.value.replace(/\D/g, '')

  value =
    value.slice(0, 11)

  form.contactInformation = value

}


/* =========================================
   EXIT
========================================= */

const exitPage = () => {

  emit('exit')

}


/* =========================================
   SAVE CHANGES
========================================= */

const saveChanges = async () => {

  const currentUser =
    auth.currentUser


  /* -----------------------------------------
     CHECK LOGIN
  ----------------------------------------- */

  if (!currentUser) {

    alert(
      'Please log in before editing member information.'
    )

    return

  }


  /* -----------------------------------------
     CHECK MEMBER OWNERSHIP
     FOR REGULAR USER
  ----------------------------------------- */

  if (!props.adminMode) {

    if (
      props.member?.ownerUid !==
      currentUser.uid
    ) {

      alert(
        'You can only edit your own member information.'
      )

      return

    }

  }


  /* =========================================
     CHECK ALL REQUIRED FIELDS
  ========================================= */

  if (
    !form.memberId.trim() ||
    !form.name.trim() ||
    !form.course ||
    !form.yearLevel ||
    !form.position ||
    !form.contactInformation.trim()
  ) {

    alert(
      'Please complete all member information.'
    )

    return

  }


  /* =========================================
     CHECK MEMBER ID FORMAT
  ========================================= */

  const memberIdPattern =
    /^MCC\d{4}-\d{5}$/

  if (
    !memberIdPattern.test(
      form.memberId.trim()
    )
  ) {

    alert(
      'Invalid Member ID. Use this format: MCC2023-00111.'
    )

    return

  }


  /* =========================================
     CHECK CONTACT NUMBER
  ========================================= */

  if (
    !/^\d{11}$/.test(
      form.contactInformation.trim()
    )
  ) {

    alert(
      'Contact Information must contain exactly 11 numbers.'
    )

    return

  }


  try {

    /* -----------------------------------------
       GET ALL ORGANIZATIONS
    ----------------------------------------- */

    const organizationsRef =
      firebaseRef(
        database,
        'organizations'
      )

    const organizationsSnapshot =
      await get(organizationsRef)

    const organizationsData =
      organizationsSnapshot.val()


    /* =========================================
       CHECK DUPLICATES
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
          Object.entries(
            organization.members
          ) as [string, any][]


        for (
          const [memberKey, member]
          of members
        ) {

          /* ---------------------------------
             SKIP CURRENT MEMBER
          --------------------------------- */

          if (
            orgName === props.organization &&
            memberKey === props.member.id
          ) {

            continue

          }


          /* ---------------------------------
             MEMBER ID
             UNIQUE ACROSS ALL ORGANIZATIONS
          --------------------------------- */

          const duplicateMemberId =
            member?.memberId
              ?.trim()
              .toUpperCase() ===
            form.memberId
              .trim()
              .toUpperCase()

          if (duplicateMemberId) {

            alert(
              'This Member ID is already registered and cannot be used again.'
            )

            return

          }


          /* ---------------------------------
             NAME
             UNIQUE ACROSS ALL ORGANIZATIONS
          --------------------------------- */

          const duplicateName =
            member?.name
              ?.trim()
              .toLowerCase() ===
            form.name
              .trim()
              .toLowerCase()

          if (duplicateName) {

            alert(
              'This name is already registered and cannot be used again.'
            )

            return

          }


          /* ---------------------------------
             CONTACT
             UNIQUE ACROSS ALL ORGANIZATIONS
          --------------------------------- */

          const duplicateContact =
            member?.contactInformation
              ?.trim() ===
            form.contactInformation
              .trim()

          if (duplicateContact) {

            alert(
              'This contact number is already registered and cannot be used again.'
            )

            return

          }


          /* ---------------------------------
             POSITION
             UNIQUE WITHIN SAME ORGANIZATION
          --------------------------------- */

          if (
            orgName === props.organization
          ) {

            const duplicatePosition =
              member?.position
                ?.trim()
                .toLowerCase() ===
              form.position
                .trim()
                .toLowerCase()

            if (duplicatePosition) {

              alert(
                'This organization position is already occupied.'
              )

              return

            }

          }

        }

      }

    }


    /* =========================================
       UPDATE MEMBER
    ========================================= */

    const memberRef =
      firebaseRef(
        database,
        `organizations/${props.organization}/members/${props.member.id}`
      )


    await update(
      memberRef,
      {

        memberId:
          form.memberId.trim(),

        name:
          form.name.trim(),

        course:
          form.course,

        yearLevel:
          form.yearLevel,

        position:
          form.position,

        contactInformation:
          form.contactInformation.trim()

      }
    )


    /* =========================================
       SUCCESS
    ========================================= */

    alert(
      'Member information updated successfully!'
    )


    emit('save')


  } catch (error) {

    console.error(
      'Error updating member:',
      error
    )

    alert(
      'Failed to update member information. Please check Firebase.'
    )

  }

}

</script>


<style scoped>

ion-content {
  --background: transparent;
}


.edit-page {

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

}


.edit-page::before {

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

}


.edit-page::after {

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

}


/* =========================================
   HEADER
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

  margin: 0;

  text-align: center;

  color: white;

  font-size: 26px;

  font-weight: 800;

  letter-spacing: 1px;

}


/* =========================================
   EXIT BUTTON
========================================= */

.exit-button {

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

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0;

  transition: all 0.3s ease;

}


.exit-button:hover {

  background:
    rgba(255, 255, 255, 0.25);

  transform: scale(1.08);

}


/* =========================================
   FORM CARD
========================================= */

.form-card {

  width: 100%;

  max-width: 700px;

  margin: 0 auto;

  padding: 30px;

  background:
    rgba(255, 255, 255, 0.97);

  border-radius: 18px;

  box-shadow:
    0 8px 30px
    rgba(0, 0, 0, 0.2);

  position: relative;

  z-index: 1;

  box-sizing: border-box;

}


.form-title {

  color: #0d4d2b;

  font-size: 20px;

  font-weight: 800;

  text-align: center;

  margin-bottom: 25px;

}


/* =========================================
   FORM GROUP
========================================= */

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
.form-group select {

  width: 100%;

  padding: 13px 14px;

  border: 1px solid
    rgba(26, 122, 68, 0.3);

  border-radius: 10px;

  background: white;

  color: #2c3e35;

  font-size: 14px;

  box-sizing: border-box;

  outline: none;

}


.form-group input:focus,
.form-group select:focus {

  border-color: #1a7a44;

  box-shadow:
    0 0 0 3px
    rgba(46, 204, 113, 0.12);

}


/* =========================================
   SAVE BUTTON
========================================= */

.save-button {

  width: 100%;

  padding: 14px;

  margin-top: 10px;

  border: none;

  border-radius: 10px;

  background: #f1c40f;

  color: #0d4d2b;

  font-size: 15px;

  font-weight: 800;

  cursor: pointer;

  transition: all 0.3s ease;

  box-shadow:
    0 4px 15px
    rgba(241, 196, 15, 0.35);

}


.save-button:hover {

  background: #ffd633;

  transform: translateY(-1px);

  box-shadow:
    0 6px 20px
    rgba(241, 196, 15, 0.5);

}


.save-button:active {

  transform: scale(0.98);

}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 768px) {

  .edit-page {

    padding: 24px 16px 40px;

  }

  .page-header h1 {

    font-size: 20px;

  }

  .form-card {

    padding: 24px 20px;

  }

}


@media (max-width: 480px) {

  .edit-page {

    padding: 20px 14px 35px;

  }

  .page-header {

    grid-template-columns:
      38px 1fr 38px;

    gap: 8px;

  }

  .page-header h1 {

    font-size: 17px;

  }

  .exit-button {

    width: 38px;

    height: 38px;

    font-size: 20px;

  }

  .form-card {

    padding: 20px 16px;

    border-radius: 14px;

  }

  .form-title {

    font-size: 17px;

  }

}

</style>