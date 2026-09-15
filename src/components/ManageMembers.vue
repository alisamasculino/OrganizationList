<template>
  <ion-page>

    <div class="manage-page">

      <!-- Header -->
      <div class="page-header">

        <button
          class="back-button"
          type="button"
          @click="goBack"
        >
          ←
        </button>

        <h1>Manage Member Lists</h1>

        <div></div>

      </div>


      <!-- ==========================================
           ORGANIZATION SELECTION
           ========================================== -->

      <div v-if="!selectedOrganization">

        <div class="section-title">

          <h2>
            Select Organization
          </h2>

          <p>
            Choose an organization to manage its members.
          </p>

        </div>


        <!-- Loading Organizations -->
        <div
          v-if="loadingOrganizations"
          class="message"
        >
          Loading organizations...
        </div>


        <!-- Error -->
        <div
          v-else-if="errorMessage"
          class="message error"
        >
          {{ errorMessage }}
        </div>


        <!-- No Organizations -->
        <div
          v-else-if="organizations.length === 0"
          class="message"
        >
          No organizations found.
        </div>


        <!-- Organizations -->
        <div
          v-else
          class="organization-list"
        >

          <button
            v-for="organization in organizations"
            :key="organization.id"
            class="organization-card"
            type="button"
            @click="selectOrganization(organization)"
          >

            <div class="organization-info">

              <h3>
                {{ organization.name }}
              </h3>

              <p>
                {{ organization.description }}
              </p>

            </div>

            <span class="arrow">
              →
            </span>

          </button>

        </div>

      </div>


      <!-- ==========================================
           MEMBER LIST
           ========================================== -->

      <div v-else>

        <!-- Back to Organizations -->
        <button
          class="organization-back"
          type="button"
          @click="backToOrganizations"
        >
          ← Back to Organizations
        </button>


        <!-- Organization Header -->
        <div class="organization-header">

          <h2>
            {{ selectedOrganization.name }}
          </h2>

          <p>
            {{ selectedOrganization.description }}
          </p>

        </div>


        <!-- Add Member -->
        <button
          class="add-member-button"
          type="button"
          @click="addMember"
        >
          + Add Member
        </button>


        <!-- Loading Members -->
        <div
          v-if="loadingMembers"
          class="message"
        >
          Loading members...
        </div>


        <!-- Error -->
        <div
          v-else-if="errorMessage"
          class="message error"
        >
          {{ errorMessage }}
        </div>


        <!-- No Members -->
        <div
          v-else-if="members.length === 0"
          class="message"
        >
          No members registered in this organization.
        </div>


        <!-- Members -->
        <div
          v-else
          class="member-list"
        >

          <div
            v-for="member in members"
            :key="member.id"
            class="member-card"
          >

            <!-- Member Header -->
            <div class="member-header">

              <div>

                <h3>
                  {{ member.name || 'No Name' }}
                </h3>

                <span class="member-id">
                  ID:
                  {{ member.memberId || 'N/A' }}
                </span>

              </div>

            </div>


            <!-- Member Information -->
            <div class="member-info">

              <div class="info-row">

                <strong>
                  Course:
                </strong>

                <span>
                  {{ member.course || 'N/A' }}
                </span>

              </div>


              <div class="info-row">

                <strong>
                  Year Level:
                </strong>

                <span>
                  {{ member.yearLevel || 'N/A' }}
                </span>

              </div>


              <div class="info-row">

                <strong>
                  Position:
                </strong>

                <span>
                  {{ member.position || 'N/A' }}
                </span>

              </div>


              <div class="info-row">

                <strong>
                  Contact:
                </strong>

                <span>
                  {{ member.contactInformation || 'N/A' }}
                </span>

              </div>

            </div>


            <!-- Actions -->
            <div class="action-buttons">

              <button
                class="edit-button"
                type="button"
                @click="editMember(member)"
              >
                ✏️ Edit
              </button>


              <button
                class="delete-button"
                type="button"
                @click="deleteMember(member)"
              >
                🗑️ Delete
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  </ion-page>
</template>


<script setup lang="ts">

import {
  ref,
  onMounted
} from 'vue'


import {
  IonPage
} from '@ionic/vue'


import {
  ref as firebaseRef,
  get,
  remove
} from 'firebase/database'


import {
  database
} from '@/firebase'


// ==========================================
// INTERFACES
// ==========================================

interface Organization {

  id: string

  name: string

  description: string

}


interface Member {

  id: string

  memberId: string

  name: string

  course: string

  yearLevel: string

  position: string

  contactInformation: string

}


// ==========================================
// EVENTS
// ==========================================

const emit = defineEmits<{

  back: []

  addMember: [organization: Organization]

  editMember: [
    member: Member,
    organization: Organization
  ]

}>()


// ==========================================
// DATA
// ==========================================

const organizations =
  ref<Organization[]>([])


const members =
  ref<Member[]>([])


const selectedOrganization =
  ref<Organization | null>(null)


const loadingOrganizations =
  ref(true)


const loadingMembers =
  ref(false)


const errorMessage =
  ref('')


// ==========================================
// GO BACK TO ADMIN PANEL
// ==========================================

const goBack = () => {

  emit('back')

}


// ==========================================
// LOAD ORGANIZATIONS
// ==========================================

const loadOrganizations = async () => {

  loadingOrganizations.value =
    true

  errorMessage.value = ''

  try {

    const organizationsRef =
      firebaseRef(
        database,
        'organizations'
      )


    const snapshot =
      await get(
        organizationsRef
      )


    if (!snapshot.exists()) {

      organizations.value = []

      return

    }


    const data =
      snapshot.val()


    organizations.value =
      Object.entries(data).map(
        ([id, value]: [string, any]) => ({

          id,

          name:
            value?.name || id,

          description:
            value?.description || ''

        })
      )


    console.log(
      'Organizations loaded:',
      organizations.value
    )


  } catch (error) {

    console.error(
      'Error loading organizations:',
      error
    )


    errorMessage.value =
      'Failed to load organizations.'

  } finally {

    loadingOrganizations.value =
      false

  }

}


// ==========================================
// SELECT ORGANIZATION
// ==========================================

const selectOrganization = async (
  organization: Organization
) => {

  selectedOrganization.value =
    organization


  await loadMembers(
    organization.id
  )

}


// ==========================================
// LOAD MEMBERS
// ==========================================

const loadMembers = async (
  organizationId: string
) => {

  loadingMembers.value =
    true

  errorMessage.value = ''

  try {

    const membersRef =
      firebaseRef(
        database,
        `organizations/${organizationId}/members`
      )


    const snapshot =
      await get(
        membersRef
      )


    if (!snapshot.exists()) {

      members.value = []

      return

    }


    const data =
      snapshot.val()


    members.value =
      Object.entries(data).map(
        ([id, value]: [string, any]) => ({

          id,

          memberId:
            value?.memberId || '',

          name:
            value?.name || '',

          course:
            value?.course || '',

          yearLevel:
            value?.yearLevel || '',

          position:
            value?.position || '',

          contactInformation:
            value?.contactInformation || ''

        })
      )


    console.log(
      'Members loaded:',
      members.value
    )


  } catch (error) {

    console.error(
      'Error loading members:',
      error
    )


    errorMessage.value =
      'Failed to load members.'

  } finally {

    loadingMembers.value =
      false

  }

}


// ==========================================
// BACK TO ORGANIZATIONS
// ==========================================

const backToOrganizations = () => {

  selectedOrganization.value =
    null

  members.value = []

  errorMessage.value = ''

}


// ==========================================
// ADD MEMBER
// ==========================================

const addMember = () => {

  if (!selectedOrganization.value) {

    return

  }


  emit(
    'addMember',
    selectedOrganization.value
  )

}


// ==========================================
// EDIT MEMBER
// ==========================================

const editMember = (
  member: Member
) => {

  if (!selectedOrganization.value) {

    return

  }


  emit(
    'editMember',
    member,
    selectedOrganization.value
  )

}


// ==========================================
// DELETE MEMBER
// ==========================================

const deleteMember = async (
  member: Member
) => {

  if (!selectedOrganization.value) {

    return

  }


  const confirmed =
    window.confirm(
      `Are you sure you want to delete "${member.name}"?`
    )


  if (!confirmed) {

    return

  }


  try {

    const memberRef =
      firebaseRef(
        database,
        `organizations/${selectedOrganization.value.id}/members/${member.id}`
      )


    await remove(
      memberRef
    )


    members.value =
      members.value.filter(
        item =>
          item.id !== member.id
      )


    window.alert(
      'Member deleted successfully.'
    )


  } catch (error) {

    console.error(
      'Error deleting member:',
      error
    )


    window.alert(
      'Failed to delete member. Please check Firebase.'
    )

  }

}


// ==========================================
// INITIAL LOAD
// ==========================================

onMounted(() => {

  loadOrganizations()

})

</script>


<style scoped>

.manage-page {

  width: 100%;

  min-height: 100vh;

  box-sizing: border-box;

  overflow-y: auto;

  padding:
    30px 20px 60px;

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

  letter-spacing: 0.5px;

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
   SECTION TITLE
   ========================================== */

.section-title {

  margin-bottom: 20px;

}


.section-title h2 {

  margin: 0;

  color: white;

  font-size: 19px;

  font-weight: 800;

}


.section-title p {

  margin: 6px 0 0;

  color:
    rgba(255, 255, 255, 0.85);

  font-size: 13px;

}


/* ==========================================
   ORGANIZATION LIST
   ========================================== */

.organization-list {

  display: flex;

  flex-direction: column;

  gap: 15px;

}


.organization-card {

  width: 100%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  box-sizing: border-box;

  padding: 20px;

  border: none;

  border-left: 5px solid #f1c40f;

  border-radius: 16px;

  background:
    rgba(255, 255, 255, 0.97);

  text-align: left;

  box-shadow:
    0 4px 20px
    rgba(0, 0, 0, 0.15);

  cursor: pointer;

}


.organization-card:active {

  transform: scale(0.98);

}


.organization-info {

  flex: 1;

}


.organization-info h3 {

  margin: 0;

  color: #0d4d2b;

  font-size: 18px;

  font-weight: 800;

}


.organization-info p {

  margin: 7px 0 0;

  color: #5a6a62;

  font-size: 13px;

  line-height: 1.5;

}


.arrow {

  color: #1a7a44;

  font-size: 25px;

  font-weight: bold;

}


/* ==========================================
   BACK TO ORGANIZATIONS
   ========================================== */

.organization-back {

  margin-bottom: 18px;

  padding:
    10px 14px;

  border: none;

  border-radius: 10px;

  background:
    rgba(255, 255, 255, 0.18);

  color: white;

  font-size: 13px;

  font-weight: bold;

  cursor: pointer;

}


/* ==========================================
   ORGANIZATION HEADER
   ========================================== */

.organization-header {

  margin-bottom: 18px;

  padding: 20px;

  border-radius: 16px;

  background:
    rgba(255, 255, 255, 0.97);

  box-shadow:
    0 4px 20px
    rgba(0, 0, 0, 0.15);

}


.organization-header h2 {

  margin: 0;

  color: #0d4d2b;

  font-size: 20px;

  font-weight: 800;

}


.organization-header p {

  margin: 7px 0 0;

  color: #5a6a62;

  font-size: 13px;

  line-height: 1.5;

}


/* ==========================================
   ADD MEMBER
   ========================================== */

.add-member-button {

  width: 100%;

  margin-bottom: 18px;

  padding: 13px;

  border: none;

  border-radius: 10px;

  background: #f1c40f;

  color: #333;

  font-size: 14px;

  font-weight: 800;

  cursor: pointer;

}


.add-member-button:active {

  transform: scale(0.98);

}


/* ==========================================
   MEMBER LIST
   ========================================== */

.member-list {

  display: flex;

  flex-direction: column;

  gap: 15px;

}


.member-card {

  padding: 20px;

  border-left: 5px solid #f1c40f;

  border-radius: 16px;

  background:
    rgba(255, 255, 255, 0.97);

  box-shadow:
    0 4px 20px
    rgba(0, 0, 0, 0.15);

}


.member-header {

  margin-bottom: 15px;

}


.member-header h3 {

  margin: 0 0 6px;

  color: #0d4d2b;

  font-size: 18px;

  font-weight: 800;

}


.member-id {

  color: #1a7a44;

  font-size: 12px;

  font-weight: 700;

}


/* ==========================================
   MEMBER INFORMATION
   ========================================== */

.member-info {

  display: flex;

  flex-direction: column;

  gap: 9px;

}


.info-row {

  display: flex;

  justify-content: space-between;

  gap: 15px;

  padding-bottom: 8px;

  border-bottom: 1px solid #eeeeee;

  font-size: 13px;

}


.info-row:last-child {

  border-bottom: none;

  padding-bottom: 0;

}


.info-row strong {

  color: #285943;

}


.info-row span {

  color: #555;

  text-align: right;

  word-break: break-word;

}


/* ==========================================
   ACTION BUTTONS
   ========================================== */

.action-buttons {

  display: flex;

  gap: 10px;

  margin-top: 18px;

}


.edit-button,
.delete-button {

  flex: 1;

  min-height: 42px;

  padding: 10px;

  border: none;

  border-radius: 10px;

  color: white;

  font-size: 13px;

  font-weight: bold;

  cursor: pointer;

}


.edit-button {

  background: #1a7a44;

}


.delete-button {

  background: #d9534f;

}


.edit-button:active {

  background: #146235;

}


.delete-button:active {

  background: #c9302c;

}


/* ==========================================
   MESSAGE
   ========================================== */

.message {

  padding: 25px;

  border-radius: 16px;

  background:
    rgba(255, 255, 255, 0.97);

  text-align: center;

  color: #285943;

  font-weight: 600;

}


.message.error {

  color: #d32f2f;

}


/* ==========================================
   MOBILE
   ========================================== */

@media (max-width: 480px) {

  .manage-page {

    padding:
      20px 14px 60px;

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


  .organization-card {

    padding: 17px;

  }


  .member-card {

    padding: 17px;

  }


  .info-row {

    flex-direction: column;

    gap: 3px;

  }


  .info-row span {

    text-align: left;

  }

}

</style>