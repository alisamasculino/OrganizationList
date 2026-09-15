<template>
  <ion-page>

    <ion-content :fullscreen="true">

      <div class="manage-page">

        <!-- =========================================
             HEADER
        ========================================== -->

        <div class="page-header">

          <button
            class="back-button"
            type="button"
            @click="goBack"
          >
            ←
          </button>

          <div class="header-title">
            <h1>Manage Organizations</h1>
            <p>Manage organizations and their members</p>
          </div>

          <div class="header-space"></div>

        </div>


        <!-- =========================================
             LOADING
        ========================================== -->

        <div
          v-if="loading"
          class="message-card"
        >

          <div class="loading-icon">
            ⟳
          </div>

          <h3>Loading Organizations</h3>

          <p>
            Please wait while we load the organizations.
          </p>

        </div>


        <!-- =========================================
             ERROR
        ========================================== -->

        <div
          v-else-if="errorMessage"
          class="message-card error-card"
        >

          <div class="message-icon">
            ⚠
          </div>

          <h3>Unable to Load Organizations</h3>

          <p>
            {{ errorMessage }}
          </p>

        </div>


        <!-- =========================================
             NO ORGANIZATIONS
        ========================================== -->

        <div
          v-else-if="organizations.length === 0"
          class="message-card"
        >

          <div class="message-icon">
            🏢
          </div>

          <h3>No Organizations Found</h3>

          <p>
            There are currently no organizations available.
          </p>

        </div>


        <!-- =========================================
             ORGANIZATION LIST
        ========================================== -->

        <div
          v-else-if="!selectedOrganization"
          class="content-container"
        >

          <div class="section-intro">

            <div>

              <h2>Organizations</h2>

              <p>
                Select an organization to manage its members.
              </p>

            </div>

            <div class="organization-count">
              {{ organizations.length }}
              <span>
                {{ organizations.length === 1
                  ? 'Organization'
                  : 'Organizations'
                }}
              </span>
            </div>

          </div>


          <div class="organization-list">

            <div
              v-for="organization in organizations"
              :key="organization.id"
              class="organization-card"
              @click="selectOrganization(organization)"
            >

              <!-- Organization Icon -->

              <div class="organization-icon">
                🏢
              </div>


              <!-- Organization Information -->

              <div class="organization-info">

                <h3>
                  {{ organization.name }}
                </h3>

                <p
                  v-if="organization.description"
                >
                  {{ organization.description }}
                </p>

                <p
                  v-else
                  class="no-description"
                >
                  No description available.
                </p>

              </div>


              <!-- Arrow -->

              <div class="organization-arrow">
                →
              </div>

            </div>

          </div>

        </div>


        <!-- =========================================
             SELECTED ORGANIZATION
        ========================================== -->

        <div
          v-else
          class="content-container selected-container"
        >


          <!-- =======================================
               ORGANIZATION HEADER CARD
          ======================================== -->

          <div class="organization-header-card">

            <div class="organization-header-icon">
              🏢
            </div>

            <div class="organization-header-info">

              <span class="small-label">
                ORGANIZATION
              </span>

              <h2>
                {{ selectedOrganization.name }}
              </h2>

              <p
                v-if="selectedOrganization.description"
              >
                {{ selectedOrganization.description }}
              </p>

              <p
                v-else
                class="no-description"
              >
                No description available.
              </p>

            </div>

          </div>


          <!-- =======================================
               MEMBERS SECTION
          ======================================== -->

          <div class="members-section">

            <div class="section-header">

              <div class="section-heading">

                <h2>Members</h2>

                <span class="member-count">
                  {{ members.length }}
                  {{ members.length === 1
                    ? 'Member'
                    : 'Members'
                  }}
                </span>

              </div>


              <button
                class="add-member-button"
                type="button"
                @click="addMember"
              >
                <span>+</span>
                Add Member
              </button>

            </div>


            <!-- ===================================
                 NO MEMBERS
            ==================================== -->

            <div
              v-if="members.length === 0"
              class="no-members"
            >

              <div class="no-members-icon">
                👤
              </div>

              <h3>No Members Yet</h3>

              <p>
                This organization does not have any members yet.
              </p>

              <button
                class="empty-add-button"
                type="button"
                @click="addMember"
              >
                + Add First Member
              </button>

            </div>


            <!-- ===================================
                 MEMBER LIST
            ==================================== -->

            <div
              v-else
              class="member-list"
            >

              <div
                v-for="member in members"
                :key="member.id"
                class="member-card"
              >

                <!-- Member Top -->

                <div class="member-top">

                  <div class="member-avatar">
                    {{ member.name
                      ? member.name.charAt(0).toUpperCase()
                      : '?' }}
                  </div>

                  <div class="member-name">

                    <h3>
                      {{ member.name }}
                    </h3>

                    <span>
                      {{ member.memberId || 'No Member ID' }}
                    </span>

                  </div>

                </div>


                <!-- Member Details -->

                <div class="member-details">

                  <div class="detail-item">

                    <span class="detail-label">
                      Course
                    </span>

                    <span class="detail-value">
                      {{ member.course || '—' }}
                    </span>

                  </div>


                  <div class="detail-item">

                    <span class="detail-label">
                      Year Level
                    </span>

                    <span class="detail-value">
                      {{ member.yearLevel || '—' }}
                    </span>

                  </div>


                  <div class="detail-item">

                    <span class="detail-label">
                      Position
                    </span>

                    <span class="position-badge">
                      {{ member.position || '—' }}
                    </span>

                  </div>


                  <div class="detail-item">

                    <span class="detail-label">
                      Contact
                    </span>

                    <span class="detail-value">
                      {{ member.contactInformation || '—' }}
                    </span>

                  </div>

                </div>


                <!-- Member Actions -->

                <div class="member-actions">

                  <button
                    class="edit-member-button"
                    type="button"
                    @click="editMember(member)"
                  >
                    <span>✏</span>
                    Edit
                  </button>

                  <button
                    class="delete-member-button"
                    type="button"
                    @click="deleteMember(member)"
                  >
                    <span>🗑</span>
                    Delete
                  </button>

                </div>

              </div>

            </div>

          </div>


          <!-- =======================================
               DELETE ORGANIZATION
          ======================================== -->

          <div class="danger-zone">

            <div class="danger-info">

              <h3>
                Delete Organization
              </h3>

              <p>
                This will permanently delete the organization
                and all of its members.
              </p>

            </div>

            <button
              class="delete-organization-button"
              type="button"
              @click="deleteOrganization(selectedOrganization)"
            >
              🗑 Delete Organization
            </button>

          </div>

        </div>

      </div>

    </ion-content>

  </ion-page>
</template>


<script setup lang="ts">

import {
  ref,
  onMounted
} from 'vue'

import {
  IonPage,
  IonContent
} from '@ionic/vue'

import {
  ref as firebaseRef,
  get,
  remove
} from 'firebase/database'

import {
  database
} from '@/firebase'


interface Organization {

  id: string

  name: string

  description: string

}


interface Member {

  id: string

  memberId?: string

  name: string

  course: string

  yearLevel: string

  position: string

  contactInformation: string

}


const emit = defineEmits<{

  back: []

  addMember: [
    organization: Organization
  ]

  editMember: [
    member: Member,
    organization: Organization
  ]

}>()


const organizations =
  ref<Organization[]>([])

const selectedOrganization =
  ref<Organization | null>(null)

const members =
  ref<Member[]>([])

const loading =
  ref(true)

const errorMessage =
  ref('')


// ==========================================
// BACK
// ==========================================

const goBack = () => {

  emit('back')

}


// ==========================================
// LOAD ORGANIZATIONS
// ==========================================

const loadOrganizations =
  async () => {

    loading.value = true

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
          ([id, value]: [string, any]) => {

            return {

              id,

              name:
                value?.name || id,

              description:
                value?.description || ''

            }

          }
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

      loading.value = false

    }

  }


// ==========================================
// SELECT ORGANIZATION
// ==========================================

const selectOrganization =
  async (
    organization: Organization
  ) => {

    selectedOrganization.value =
      organization

    await loadMembers(
      organization
    )

  }


// ==========================================
// LOAD MEMBERS
// ==========================================

const loadMembers =
  async (
    organization: Organization
  ) => {

    try {

      const membersRef =
        firebaseRef(
          database,
          `organizations/${organization.id}/members`
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
          ([id, value]: [string, any]) => {

            return {

              id,

              memberId:
                value?.memberId || id,

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

            }

          }
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

      window.alert(
        'Failed to load members.'
      )

    }

  }


// ==========================================
// CLEAR SELECTION
// ==========================================

const clearSelection = () => {

  selectedOrganization.value =
    null

  members.value = []

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

const deleteMember =
  async (
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
        'Failed to delete member.'
      )

    }

  }


// ==========================================
// DELETE ORGANIZATION
// ==========================================

const deleteOrganization =
  async (
    organization: Organization
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${organization.name}" and all of its members?`
      )


    if (!confirmed) {

      return

    }


    try {

      const organizationRef =
        firebaseRef(
          database,
          `organizations/${organization.id}`
        )


      await remove(
        organizationRef
      )


      organizations.value =
        organizations.value.filter(
          item =>
            item.id !== organization.id
        )


      selectedOrganization.value =
        null

      members.value = []


      window.alert(
        'Organization deleted successfully.'
      )

    } catch (error) {

      console.error(
        'Error deleting organization:',
        error
      )

      window.alert(
        'Failed to delete organization. Please check Firebase.'
      )

    }

  }


// ==========================================
// LOAD
// ==========================================

onMounted(() => {

  loadOrganizations()

})

</script>


<style scoped>

/* ==========================================
   IONIC PAGE
========================================== */

ion-content {
  --background: transparent;
}


/* ==========================================
   MAIN PAGE
========================================== */

.manage-page {

  min-height: 100%;

  box-sizing: border-box;

  padding: 30px 25px 70px;

  background:
    linear-gradient(
      135deg,
      #073b20 0%,
      #0d5c32 35%,
      #198754 70%,
      #2ecc71 100%
    );

  position: relative;

  overflow: hidden;

}


/* ==========================================
   DECORATIVE BACKGROUND
========================================== */

.manage-page::before {

  content: '';

  position: fixed;

  width: 500px;

  height: 500px;

  top: -250px;

  right: -180px;

  border-radius: 50%;

  background:
    rgba(255,255,255,0.07);

  box-shadow:
    0 0 100px
    rgba(255,255,255,0.08);

  pointer-events: none;

}


.manage-page::after {

  content: '';

  position: fixed;

  width: 450px;

  height: 450px;

  bottom: -250px;

  left: -200px;

  border-radius: 50%;

  background:
    rgba(255,255,255,0.06);

  pointer-events: none;

}


/* ==========================================
   HEADER
========================================== */

.page-header {

  max-width: 1000px;

  margin: 0 auto 35px;

  display: grid;

  grid-template-columns: 50px 1fr 50px;

  align-items: center;

  gap: 15px;

  position: relative;

  z-index: 2;

}


.header-title {

  text-align: center;

}


.header-title h1 {

  margin: 0;

  color: white;

  font-size: 28px;

  font-weight: 900;

  letter-spacing: 0.5px;

  text-shadow:
    0 3px 15px
    rgba(0,0,0,0.25);

}


.header-title p {

  margin: 6px 0 0;

  color:
    rgba(255,255,255,0.75);

  font-size: 12px;

}


.header-space {

  width: 50px;

}


/* ==========================================
   BACK BUTTON
========================================== */

.back-button {

  width: 50px;

  height: 50px;

  border: 1px solid
    rgba(255,255,255,0.35);

  border-radius: 15px;

  background:
    rgba(255,255,255,0.12);

  color: white;

  font-size: 24px;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  backdrop-filter: blur(10px);

  transition: all 0.25s ease;

}


.back-button:hover {

  background:
    rgba(255,255,255,0.22);

  transform:
    translateX(-3px);

}


.back-button:active {

  transform: scale(0.94);

}


/* ==========================================
   CONTENT
========================================== */

.content-container {

  width: 100%;

  max-width: 1000px;

  margin: 0 auto;

  position: relative;

  z-index: 1;

}


/* ==========================================
   ORGANIZATION SECTION HEADER
========================================== */

.section-intro {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 22px;

}


.section-intro h2 {

  margin: 0;

  color: white;

  font-size: 23px;

  font-weight: 900;

}


.section-intro p {

  margin: 5px 0 0;

  color:
    rgba(255,255,255,0.75);

  font-size: 12px;

}


.organization-count {

  min-width: 85px;

  padding: 10px 15px;

  border-radius: 14px;

  background:
    rgba(255,255,255,0.13);

  border:
    1px solid
    rgba(255,255,255,0.2);

  color: white;

  font-size: 20px;

  font-weight: 900;

  text-align: center;

  backdrop-filter: blur(10px);

}


.organization-count span {

  display: block;

  margin-top: 2px;

  color:
    rgba(255,255,255,0.7);

  font-size: 9px;

  text-transform: uppercase;

  letter-spacing: 0.7px;

}


/* ==========================================
   ORGANIZATION TILE GRID
========================================== */

.organization-list {

  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 18px;

}


/* ==========================================
   ORGANIZATION TILE
========================================== */

.organization-card {

  min-height: 190px;

  padding: 22px;

  box-sizing: border-box;

  border-radius: 20px;

  background:
    rgba(255,255,255,0.97);

  border:
    1px solid
    rgba(255,255,255,0.9);

  box-shadow:
    0 10px 30px
    rgba(0,0,0,0.15);

  cursor: pointer;

  position: relative;

  overflow: hidden;

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

}


/* Tile decorative line */

.organization-card::before {

  content: '';

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 5px;

  background:
    #f1c40f;

}


.organization-card::after {

  content: '';

  position: absolute;

  width: 110px;

  height: 110px;

  right: -45px;

  top: -45px;

  border-radius: 50%;

  background:
    #eaf8ef;

}


.organization-card:hover {

  transform:
    translateY(-5px);

  box-shadow:
    0 16px 35px
    rgba(0,0,0,0.22);

}


.organization-card:active {

  transform: scale(0.98);

}


/* ==========================================
   ORGANIZATION ICON
========================================== */

.organization-icon {

  width: 58px;

  height: 58px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 17px;

  background:
    linear-gradient(
      135deg,
      #e9f8ef,
      #d5f1df
    );

  font-size: 28px;

  margin-bottom: 15px;

  position: relative;

  z-index: 1;

}


/* ==========================================
   ORGANIZATION INFO
========================================== */

.organization-info {

  position: relative;

  z-index: 1;

}


.organization-info h3 {

  margin: 0;

  color: #0d4d2b;

  font-size: 18px;

  font-weight: 900;

}


.organization-info p {

  margin: 7px 0 0;

  color: #68766f;

  font-size: 12px;

  line-height: 1.5;

}


.organization-info .no-description {

  color: #a0aaa5;

  font-style: italic;

}


/* ==========================================
   ORGANIZATION ARROW
========================================== */

.organization-arrow {

  position: absolute;

  right: 20px;

  bottom: 20px;

  width: 38px;

  height: 38px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    #0d4d2b;

  color: white;

  font-size: 20px;

  font-weight: bold;

  z-index: 2;

  transition:
    transform 0.25s ease;

}


.organization-card:hover
.organization-arrow {

  transform:
    translateX(4px);

}


/* ==========================================
   SELECTED ORGANIZATION
========================================== */

.selected-container {

  max-width: 1000px;

}


/* ==========================================
   BACK TO LIST
========================================== */

.back-to-list {

  margin-bottom: 15px;

  padding: 8px 0;

  border: none;

  background: transparent;

  color: white;

  font-size: 13px;

  font-weight: 800;

  cursor: pointer;

}


.back-to-list:hover {

  text-decoration: underline;

}


/* ==========================================
   ORGANIZATION HERO TILE
========================================== */

.organization-header-card {

  min-height: 150px;

  padding: 25px;

  border-radius: 22px;

  background:
    rgba(255,255,255,0.97);

  box-shadow:
    0 12px 35px
    rgba(0,0,0,0.18);

  display: flex;

  align-items: center;

  gap: 20px;

  position: relative;

  overflow: hidden;

}


.organization-header-card::after {

  content: '';

  position: absolute;

  width: 190px;

  height: 190px;

  right: -70px;

  top: -80px;

  border-radius: 50%;

  background:
    #eaf8ef;

}


.organization-header-icon {

  width: 75px;

  height: 75px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 20px;

  background:
    linear-gradient(
      135deg,
      #dff5e7,
      #c6ead2
    );

  font-size: 36px;

  position: relative;

  z-index: 1;

}


.organization-header-info {

  position: relative;

  z-index: 1;

}


.small-label {

  display: block;

  margin-bottom: 5px;

  color: #839089;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1.2px;

}


.organization-header-info h2 {

  margin: 0;

  color: #0d4d2b;

  font-size: 25px;

  font-weight: 900;

}


.organization-header-info p {

  max-width: 650px;

  margin: 7px 0 0;

  color: #69766f;

  font-size: 12px;

  line-height: 1.5;

}


/* ==========================================
   MEMBERS TILE
========================================== */

.members-section {

  margin-top: 20px;

  padding: 24px;

  border-radius: 22px;

  background:
    rgba(255,255,255,0.97);

  box-shadow:
    0 12px 35px
    rgba(0,0,0,0.17);

}


/* ==========================================
   MEMBERS HEADER
========================================== */

.section-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  margin-bottom: 22px;

}


.section-heading {

  display: flex;

  align-items: center;

  gap: 10px;

}


.section-heading h2 {

  margin: 0;

  color: #0d4d2b;

  font-size: 21px;

  font-weight: 900;

}


.member-count {

  padding: 6px 10px;

  border-radius: 20px;

  background:
    #e9f8ef;

  color:
    #176638;

  font-size: 10px;

  font-weight: 900;

}


/* ==========================================
   ADD MEMBER BUTTON
========================================== */

.add-member-button {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  padding: 11px 16px;

  border: none;

  border-radius: 11px;

  background:
    #1a7a44;

  color: white;

  font-size: 12px;

  font-weight: 900;

  cursor: pointer;

  box-shadow:
    0 5px 13px
    rgba(26,122,68,0.2);

  transition:
    all 0.2s ease;

}


.add-member-button span {

  font-size: 18px;

}


.add-member-button:hover {

  background:
    #0d5c32;

  transform:
    translateY(-2px);

}


/* ==========================================
   MEMBER TILE GRID
========================================== */

.member-list {

  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 15px;

}


/* ==========================================
   MEMBER TILE
========================================== */

.member-card {

  padding: 18px;

  border-radius: 16px;

  background:
    #f9fcfa;

  border:
    1px solid
    #dfeae3;

  box-shadow:
    0 4px 12px
    rgba(13,77,43,0.05);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

}


.member-card:hover {

  transform:
    translateY(-3px);

  border-color:
    #b8d9c5;

  box-shadow:
    0 9px 20px
    rgba(13,77,43,0.10);

}


/* ==========================================
   MEMBER TOP
========================================== */

.member-top {

  display: flex;

  align-items: center;

  gap: 12px;

  padding-bottom: 15px;

  border-bottom:
    1px solid #e5eee8;

}


.member-avatar {

  width: 48px;

  height: 48px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 15px;

  background:
    linear-gradient(
      135deg,
      #0d4d2b,
      #2ecc71
    );

  color: white;

  font-size: 18px;

  font-weight: 900;

  box-shadow:
    0 4px 10px
    rgba(13,77,43,0.2);

}


.member-name {

  min-width: 0;

}


.member-name h3 {

  margin: 0;

  color: #0d4d2b;

  font-size: 16px;

  font-weight: 900;

}


.member-name span {

  display: inline-block;

  margin-top: 4px;

  padding: 4px 7px;

  border-radius: 6px;

  background:
    #edf3ef;

  color: #75827c;

  font-size: 9px;

  font-weight: 700;

}


/* ==========================================
   MEMBER DETAILS
========================================== */

.member-details {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 11px;

  padding: 16px 0;

}


.detail-item {

  min-width: 0;

}


.detail-label {

  display: block;

  margin-bottom: 4px;

  color: #909b96;

  font-size: 8px;

  font-weight: 900;

  text-transform: uppercase;

  letter-spacing: 0.7px;

}


.detail-value {

  display: block;

  color: #394b41;

  font-size: 11px;

  line-height: 1.45;

  word-break: break-word;

}


.position-badge {

  display: inline-block;

  max-width: 100%;

  padding: 5px 8px;

  border-radius: 7px;

  background:
    #e4f5ea;

  color:
    #176638;

  font-size: 9px;

  font-weight: 800;

  line-height: 1.3;

}


/* ==========================================
   MEMBER ACTIONS
========================================== */

.member-actions {

  display: flex;

  gap: 8px;

  padding-top: 14px;

  border-top:
    1px solid #e5eee8;

}


.edit-member-button,
.delete-member-button {

  flex: 1;

  min-height: 38px;

  border: none;

  border-radius: 9px;

  color: white;

  font-size: 11px;

  font-weight: 900;

  cursor: pointer;

  transition:
    all 0.2s ease;

}


.edit-member-button {

  background:
    #1a7a44;

}


.delete-member-button {

  background:
    #d9534f;

}


.edit-member-button:hover {

  background:
    #0d5c32;

  transform:
    translateY(-1px);

}


.delete-member-button:hover {

  background:
    #c9302c;

  transform:
    translateY(-1px);

}


/* ==========================================
   NO MEMBERS TILE
========================================== */

.no-members {

  padding: 40px 20px;

  border:
    2px dashed #d4e3da;

  border-radius: 16px;

  background:
    #f8fbf9;

  text-align: center;

}


.no-members-icon {

  width: 60px;

  height: 60px;

  margin: 0 auto 12px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 18px;

  background:
    #e9f8ef;

  font-size: 28px;

}


.no-members h3 {

  margin: 0;

  color: #285943;

  font-size: 17px;

  font-weight: 900;

}


.no-members p {

  margin: 6px auto 17px;

  color: #7c8983;

  font-size: 12px;

}


/* ==========================================
   EMPTY ADD BUTTON
========================================== */

.empty-add-button {

  padding: 10px 15px;

  border: none;

  border-radius: 9px;

  background:
    #1a7a44;

  color: white;

  font-size: 11px;

  font-weight: 900;

  cursor: pointer;

}


/* ==========================================
   DANGER ZONE TILE
========================================== */

.danger-zone {

  margin-top: 20px;

  padding: 20px;

  border:
    1px solid
    rgba(217,83,79,0.22);

  border-radius: 18px;

  background:
    rgba(255,247,247,0.98);

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

}


.danger-info {

  flex: 1;

}


.danger-info h3 {

  margin: 0;

  color:
    #a52d2a;

  font-size: 15px;

  font-weight: 900;

}


.danger-info p {

  margin: 5px 0 0;

  color:
    #896866;

  font-size: 11px;

  line-height: 1.5;

}


.delete-organization-button {

  flex-shrink: 0;

  padding: 12px 17px;

  border: none;

  border-radius: 10px;

  background:
    #d9534f;

  color: white;

  font-size: 11px;

  font-weight: 900;

  cursor: pointer;

  transition:
    all 0.2s ease;

}


.delete-organization-button:hover {

  background:
    #c9302c;

  transform:
    translateY(-1px);

}


/* ==========================================
   MESSAGE CARD
========================================== */

.message-card {

  max-width: 500px;

  margin: 70px auto;

  padding: 40px 25px;

  border-radius: 20px;

  background:
    rgba(255,255,255,0.97);

  text-align: center;

  box-shadow:
    0 12px 35px
    rgba(0,0,0,0.18);

  position: relative;

  z-index: 1;

}


.loading-icon,
.message-icon {

  width: 65px;

  height: 65px;

  margin: 0 auto 15px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 18px;

  background:
    #e9f8ef;

  font-size: 30px;

}


.loading-icon {

  animation:
    spin 1s linear infinite;

}


@keyframes spin {

  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }

}


.message-card h3 {

  margin: 0;

  color:
    #0d4d2b;

  font-size: 18px;

  font-weight: 900;

}


.message-card p {

  margin: 7px 0 0;

  color:
    #718078;

  font-size: 12px;

  line-height: 1.5;

}


.error-card .message-icon {

  background:
    #fff0f0;

}


.error-card h3 {

  color:
    #b83232;

}


/* ==========================================
   TABLET
========================================== */

@media (max-width: 750px) {

  .organization-list {

    grid-template-columns:
      1fr;

  }


  .member-list {

    grid-template-columns:
      1fr;

  }

}


/* ==========================================
   MOBILE
========================================== */

@media (max-width: 600px) {

  .manage-page {

    padding:
      20px
      14px
      55px;

  }


  .page-header {

    grid-template-columns:
      42px
      1fr
      42px;

    margin-bottom: 25px;

  }


  .back-button {

    width: 42px;

    height: 42px;

    border-radius: 13px;

    font-size: 21px;

  }


  .header-space {

    width: 42px;

  }


  .header-title h1 {

    font-size: 19px;

  }


  .header-title p {

    font-size: 10px;

  }


  .section-intro {

    align-items: flex-start;

  }


  .section-intro h2 {

    font-size: 19px;

  }


  .section-intro p {

    max-width: 210px;

    font-size: 11px;

  }


  .organization-count {

    min-width: 65px;

    padding: 8px;

    font-size: 16px;

  }


  .organization-count span {

    font-size: 8px;

  }


  .organization-card {

    min-height: 175px;

    padding: 19px;

    border-radius: 18px;

  }


  .organization-icon {

    width: 52px;

    height: 52px;

    border-radius: 15px;

    font-size: 25px;

  }


  .organization-info h3 {

    font-size: 16px;

  }


  .organization-info p {

    font-size: 11px;

  }


  .organization-header-card {

    padding: 18px;

    gap: 13px;

    border-radius: 18px;

  }


  .organization-header-icon {

    width: 52px;

    height: 52px;

    border-radius: 14px;

    font-size: 25px;

  }


  .organization-header-info h2 {

    font-size: 18px;

  }


  .organization-header-info p {

    font-size: 10px;

  }


  .members-section {

    padding: 18px;

    border-radius: 18px;

  }


  .section-header {

    align-items: stretch;

    flex-direction: column;

  }


  .section-heading {

    justify-content: space-between;

  }


  .add-member-button {

    width: 100%;

  }


  .member-card {

    padding: 16px;

  }


  .member-details {

    grid-template-columns:
      1fr;

  }


  .member-actions {

    flex-direction: column;

  }


  .edit-member-button,
  .delete-member-button {

    width: 100%;

  }


  .danger-zone {

    align-items: stretch;

    flex-direction: column;

    padding: 17px;

  }


  .delete-organization-button {

    width: 100%;

  }

}


/* ==========================================
   SMALL PHONES
========================================== */

@media (max-width: 380px) {

  .manage-page {

    padding-left: 11px;

    padding-right: 11px;

  }


  .header-title h1 {

    font-size: 17px;

  }


  .header-title p {

    display: none;

  }


  .organization-count {

    display: none;

  }


  .organization-card {

    min-height: 165px;

  }


  .members-section {

    padding: 15px;

  }

}

</style>