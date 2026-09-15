<template>
  <ion-page>

    <!-- Firebase Status -->
    <div class="firebase-status">
      <span v-if="firebaseConnected" class="connected">
        🟢 Firebase Connected
      </span>

      <span v-else class="disconnected">
        🔴 Firebase Disconnected
      </span>
    </div>

    <!-- Landing Page -->
    <LandingPage
      v-if="currentPage === 'landing'"
      @login="goToLogin"
    />

    <!-- Login Page -->
    <LoginPage
      v-else-if="currentPage === 'login'"
      @back="goToLanding"
      @login-success="handleLoginSuccess"
      @register="goToRegisterAccount"
    />

    <!-- Register Account Page -->
    <RegisterAccountPage
      v-else-if="currentPage === 'registerAccount'"
      @back="goToLogin"
    />

    <!-- Admin Page -->
    <AdminPage
      v-else-if="currentPage === 'admin'"
      @manage-organizations="goToManageOrganizations"
      @add-organization="goToAddOrganization"
      @back="logoutAndGoToLanding"
      @logout="logoutAndGoToLanding"
    />

    <!-- Manage Organizations -->
    <ManageOrganizations
      v-else-if="currentPage === 'manageOrganizations'"
      @back="goToAdmin"
      @add-member="goToRegisterFromAdmin"
      @edit-member="goToEditMemberFromAdmin"
    />

    <!-- Add Organization -->
    <AddOrganization
      v-else-if="currentPage === 'addOrganization'"
      @back="goToAdmin"
    />

    <!-- Organization List -->
    <OrganizationPage
      v-else-if="currentPage === 'organizations'"
      @select-organization="selectOrganization"
      @exit="logoutAndGoToLanding"
    />

    <!-- Organization Details -->
    <OrganizationDetailsPage
      v-else-if="currentPage === 'details'"
      :organization="selectedOrganization"
      @register="goToRegister"
      @exit="goToOrganizations"
      @edit="goToEditMember"
    />

    <!-- Register Member -->
    <RegisterMemberPage
      v-else-if="currentPage === 'register'"
      :organization="selectedOrganization"
      @back="goToDetails"
    />

    <!-- Edit Member -->
    <EditMemberPage
      v-else-if="currentPage === 'edit'"
      :organization="selectedOrganization"
      :member="selectedMember"
      :admin-mode="adminMemberMode"
      @save="goToDetailsAfterEdit"
      @exit="goToDetailsAfterEdit"
    />

  </ion-page>
</template>

<script setup lang="ts">

import { ref, watch, onMounted } from 'vue'
import { IonPage } from '@ionic/vue'

import LandingPage from '@/components/LandingPage.vue'
import LoginPage from '@/components/LoginPage.vue'
import RegisterAccountPage from '@/components/RegisterAccountPage.vue'

import OrganizationPage from '@/components/OrganizationPage.vue'
import OrganizationDetailsPage from '@/components/OrganizationDetailsPage.vue'
import RegisterMemberPage from '@/components/RegisterMemberPage.vue'
import EditMemberPage from '@/components/EditMemberPage.vue'

import AdminPage from '@/components/AdminPage.vue'
import ManageOrganizations from '@/components/ManageOrganizations.vue'
import AddOrganization from '@/components/AddOrganization.vue'

import {
  ref as firebaseRef,
  get
} from 'firebase/database'

import {
  onAuthStateChanged,
  signOut
} from 'firebase/auth'

import {
  auth,
  database
} from '@/firebase'


// ==========================================
// PAGE STATE
// ==========================================

const currentPage = ref(
  localStorage.getItem('currentPage') || 'landing'
)

const selectedOrganization = ref(
  localStorage.getItem('selectedOrganization') || ''
)

const selectedMember = ref<any>(null)

const adminMemberMode = ref(false)

const firebaseConnected = ref(false)

const isAdmin = ref(false)


// ==========================================
// SAVE PAGE STATE
// ==========================================

watch(currentPage, (newPage) => {
  localStorage.setItem('currentPage', newPage)
})

watch(selectedOrganization, (newOrganization) => {
  localStorage.setItem(
    'selectedOrganization',
    newOrganization
  )
})


// ==========================================
// LOGIN / LANDING
// ==========================================

const goToLogin = () => {
  currentPage.value = 'login'
}

const goToLanding = () => {
  currentPage.value = 'landing'
}


// ==========================================
// LOGIN SUCCESS
// ==========================================

const handleLoginSuccess = (role: string) => {

  console.log('Logged in role:', role)

  if (role === 'admin') {

    isAdmin.value = true
    currentPage.value = 'admin'

  } else if (role === 'user') {

    isAdmin.value = false
    currentPage.value = 'organizations'

  } else {

    console.error('Invalid user role:', role)

    currentPage.value = 'landing'
  }
}


// ==========================================
// REGISTER ACCOUNT
// ==========================================

const goToRegisterAccount = () => {
  currentPage.value = 'registerAccount'
}


// ==========================================
// LOGOUT
// ==========================================

const logoutAndGoToLanding = async () => {

  try {

    await signOut(auth)

    console.log('User logged out.')

  } catch (error) {

    console.error('Logout error:', error)

  }

  selectedMember.value = null
  selectedOrganization.value = ''
  adminMemberMode.value = false
  isAdmin.value = false

  currentPage.value = 'landing'
}


// ==========================================
// ADMIN NAVIGATION
// ==========================================

const goToAdmin = () => {
  currentPage.value = 'admin'
}

const goToManageOrganizations = () => {
  currentPage.value = 'manageOrganizations'
}

const goToAddOrganization = () => {
  currentPage.value = 'addOrganization'
}


// ==========================================
// ORGANIZATION LIST
// ==========================================

const goToOrganizations = () => {
  currentPage.value = 'organizations'
}


// ==========================================
// SELECT ORGANIZATION
// ==========================================

const selectOrganization = (organization: string) => {

  console.log(
    'Selected organization:',
    organization
  )

  selectedOrganization.value = organization

  currentPage.value = 'details'
}


// ==========================================
// REGISTER MEMBER - USER
// ==========================================

const goToRegister = () => {

  console.log(
    'Registering member for:',
    selectedOrganization.value
  )

  if (!selectedOrganization.value) {

    console.error(
      'No organization selected!'
    )

    return
  }

  adminMemberMode.value = false

  currentPage.value = 'register'
}


// ==========================================
// REGISTER MEMBER - ADMIN
// ==========================================

const goToRegisterFromAdmin = (
  organization: any
) => {

  console.log(
    'Admin adding member to:',
    organization.name
  )

  selectedOrganization.value =
    organization.id

  selectedMember.value = null

  adminMemberMode.value = true

  currentPage.value = 'register'
}


// ==========================================
// BACK FROM REGISTER MEMBER
// ==========================================

const goToDetails = () => {

  selectedMember.value = null

  if (adminMemberMode.value) {

    adminMemberMode.value = false

    currentPage.value =
      'manageOrganizations'

    return
  }

  currentPage.value = 'details'
}


// ==========================================
// EDIT MEMBER - USER
// ==========================================

const goToEditMember = (
  member: any
) => {

  console.log(
    'Editing member:',
    member
  )

  if (!member) {

    console.error(
      'No member selected!'
    )

    return
  }

  adminMemberMode.value = false

  selectedMember.value = member

  currentPage.value = 'edit'
}


// ==========================================
// EDIT MEMBER - ADMIN
// ==========================================

const goToEditMemberFromAdmin = (
  member: any,
  organization: any
) => {

  console.log(
    'Admin editing member:',
    member
  )

  if (!member) {

    console.error(
      'No member selected!'
    )

    return
  }

  selectedOrganization.value =
    organization.id

  selectedMember.value = member

  adminMemberMode.value = true

  currentPage.value = 'edit'
}


// ==========================================
// AFTER EDIT
// ==========================================

const goToDetailsAfterEdit = () => {

  selectedMember.value = null

  if (adminMemberMode.value) {

    adminMemberMode.value = false

    currentPage.value =
      'manageOrganizations'

    return
  }

  currentPage.value = 'details'
}


// ==========================================
// FIREBASE CONNECTION CHECK
// ==========================================

onMounted(async () => {

  try {

    const organizationsRef =
      firebaseRef(
        database,
        'organizations'
      )

    await get(organizationsRef)

    firebaseConnected.value = true

    console.log(
      'Firebase connection successful.'
    )

  } catch (error) {

    firebaseConnected.value = false

    console.error(
      'Firebase connection failed:',
      error
    )
  }
})


// ==========================================
// CHECK CURRENT USER ROLE
// ==========================================

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      isAdmin.value = false

      console.log(
        'No user currently logged in.'
      )

      return
    }

    try {

      const roleRef =
        firebaseRef(
          database,
          `users/${user.uid}/role`
        )

      const snapshot =
        await get(roleRef)

      const role =
        snapshot.exists()
          ? snapshot.val()
          : null

      console.log(
        'Current user role:',
        role
      )

      if (role === 'admin') {

        isAdmin.value = true

      } else if (role === 'user') {

        isAdmin.value = false

      } else {

        isAdmin.value = false

        console.warn(
          'User has no valid role.'
        )
      }

    } catch (error) {

      console.error(
        'Error checking user role:',
        error
      )

      isAdmin.value = false
    }
  }
)

</script>


<style scoped>

.firebase-status {
  position: fixed;
  top: 10px;
  right: 15px;
  z-index: 9999;

  padding: 6px 12px;

  border-radius: 20px;

  background: white;

  box-shadow:
    0 2px 8px
    rgba(0, 0, 0, 0.15);

  font-size: 12px;

  font-weight: 600;
}

.connected {
  color: green;
}

.disconnected {
  color: red;
}

</style>