<template>
  <div class="organization-page">

    <!-- PAGE HEADER -->
    <div class="page-header">

      <button
        class="exit-button"
        type="button"
        @click="exitPage"
      >
        ←
      </button>

      <div class="header-title">
        <h1>School Organizations</h1>
        <p>Explore student organizations</p>
      </div>

      <div class="header-spacer"></div>

    </div>


    <!-- HERO CARD -->
    <div class="hero-card">

      <div class="hero-icon">
        🏫
      </div>

      <div class="hero-content">
        <h2>
          Mindoro State University
        </h2>

        <p>
          Calapan Campus · Student Organizations
        </p>
      </div>

    </div>


    <!-- STATS TILES -->
    <div class="stats-grid">

      <div class="stat-tile">

        <div class="stat-icon">
          🏢
        </div>

        <div class="stat-content">
          <div class="stat-value">
            {{ organizations.length }}
          </div>

          <div class="stat-label">
            Organizations
          </div>
        </div>

      </div>


      <div class="stat-tile">

        <div class="stat-icon">
          👥
        </div>

        <div class="stat-content">
          <div class="stat-value">
            {{ totalMembers }}
          </div>

          <div class="stat-label">
            Total Members
          </div>
        </div>

      </div>

    </div>


    <!-- SEARCH TILE -->
    <div class="search-card">

      <span class="search-icon">
        🔍
      </span>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search organizations..."
      />

      <button
        v-if="searchQuery"
        class="clear-search"
        type="button"
        @click="searchQuery = ''"
      >
        ✕
      </button>

    </div>


    <!-- SECTION HEADER -->
    <div
      v-if="!loading && filteredOrganizations.length > 0"
      class="section-header"
    >

      <div>
        <h2>Organizations</h2>
        <p>Choose an organization to view its members</p>
      </div>

      <span class="section-count">
        {{ filteredOrganizations.length }}
      </span>

    </div>


    <!-- LOADING TILE -->
    <div
      v-if="loading"
      class="status-tile"
    >
      <div class="status-icon">
        ⏳
      </div>

      <h3>Loading organizations...</h3>

      <p>
        Please wait while we get the organization list.
      </p>
    </div>


    <!-- ORGANIZATION TILES -->
    <div
      v-if="!loading && filteredOrganizations.length > 0"
      class="organization-grid"
    >

      <div
        v-for="(organization, index) in filteredOrganizations"
        :key="organization.id"
        class="organization-tile"
        @click="selectOrganization(organization.id)"
      >

        <!-- TOP -->
        <div class="tile-top">

          <div class="org-number">
            {{ String(index + 1).padStart(2, '0') }}
          </div>

          <div class="org-icon">
            🏛️
          </div>

        </div>


        <!-- CONTENT -->
        <div class="tile-content">

          <h3>
            {{ organization.name }}
          </h3>

          <p>
            {{ organization.description }}
          </p>

        </div>


        <!-- FOOTER -->
        <div class="tile-footer">

          <div class="member-badge">
            👥 {{ organization.memberCount }} Members
          </div>

          <div class="view-button">
            View →
          </div>

        </div>

      </div>

    </div>


    <!-- NO ORGANIZATIONS -->
    <div
      v-if="!loading && organizations.length === 0"
      class="status-tile"
    >

      <div class="status-icon">
        🏢
      </div>

      <h3>
        No organizations available
      </h3>

      <p>
        There are currently no organizations to display.
      </p>

    </div>


    <!-- NO SEARCH RESULTS -->
    <div
      v-if="
        !loading &&
        organizations.length > 0 &&
        filteredOrganizations.length === 0
      "
      class="status-tile"
    >

      <div class="status-icon">
        🔍
      </div>

      <h3>
        No matching organizations
      </h3>

      <p>
        Try searching with a different organization name.
      </p>

      <button
        class="reset-search"
        type="button"
        @click="searchQuery = ''"
      >
        Clear Search
      </button>

    </div>

  </div>
</template>


<script setup lang="ts">

import {
  ref,
  computed,
  onMounted
} from 'vue'

import {
  ref as firebaseRef,
  onValue
} from 'firebase/database'

import { database } from '@/firebase'


// =========================================
// ORGANIZATION STRUCTURE
// =========================================

interface Organization {

  id: string

  name: string

  description: string

  memberCount: number

}


// =========================================
// EMITS
// =========================================

const emit = defineEmits<{

  selectOrganization: [organization: string]

  exit: []

}>()


// =========================================
// ORGANIZATION LIST
// =========================================

const organizations =
  ref<Organization[]>([])


// =========================================
// LOADING STATUS
// =========================================

const loading = ref(true)


// =========================================
// SEARCH QUERY
// =========================================

const searchQuery = ref('')


// =========================================
// TOTAL MEMBERS
// =========================================

const totalMembers = computed(() => {

  return organizations.value.reduce(

    (sum, org) =>
      sum + (org.memberCount || 0),

    0

  )

})


// =========================================
// FILTERED ORGANIZATIONS
// =========================================

const filteredOrganizations = computed(() => {

  const q =
    searchQuery.value
      .trim()
      .toLowerCase()

  if (!q) {

    return organizations.value

  }

  return organizations.value.filter(
    (org) =>

      org.name
        .toLowerCase()
        .includes(q)

      ||

      org.description
        .toLowerCase()
        .includes(q)
  )

})


// =========================================
// GET ORGANIZATIONS FROM FIREBASE
// =========================================

const loadOrganizations = () => {

  const organizationsRef =
    firebaseRef(
      database,
      'organizations'
    )


  onValue(

    organizationsRef,

    (snapshot) => {

      const data =
        snapshot.val()

      const organizationList:
        Organization[] = []


      if (data) {

        Object.keys(data).forEach(
          (key) => {

            const organization =
              data[key]

            const members =
              organization.members || {}


            const memberCount =
              Object.keys(members).length


            organizationList.push({

              id: key,

              name:
                organization.name || key,

              description:
                organization.description || '',

              memberCount

            })

          }
        )

      }


      organizations.value =
        organizationList

      loading.value = false

    },


    (error) => {

      console.error(
        'Error loading organizations:',
        error
      )

      loading.value = false

    }

  )

}


// =========================================
// SELECT ORGANIZATION
// =========================================

const selectOrganization = (
  organization: string
) => {

  console.log(
    'Selected organization:',
    organization
  )

  emit(
    'selectOrganization',
    organization
  )

}


// =========================================
// EXIT PAGE
// =========================================

const exitPage = () => {

  emit('exit')

}


// =========================================
// LOAD ORGANIZATIONS
// =========================================

onMounted(() => {

  loadOrganizations()

})

</script>


<style scoped>

/* =========================================
   MAIN PAGE
========================================= */

.organization-page {

  min-height: 100vh;

  padding: 28px 22px 50px;

  box-sizing: border-box;

  background:
    linear-gradient(
      145deg,
      #0d4d2b 0%,
      #176b3d 45%,
      #2ecc71 100%
    );

  position: relative;

  overflow-x: hidden;

}


/* =========================================
   BACKGROUND DECORATION
========================================= */

.organization-page::before {

  content: '';

  position: fixed;

  width: 420px;

  height: 420px;

  top: -180px;

  right: -150px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(255,255,255,0.12),
      transparent 70%
    );

  pointer-events: none;

}


.organization-page::after {

  content: '';

  position: fixed;

  width: 450px;

  height: 450px;

  bottom: -220px;

  left: -180px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(255,255,255,0.08),
      transparent 70%
    );

  pointer-events: none;

}


/* =========================================
   HEADER
========================================= */

.page-header {

  display: grid;

  grid-template-columns:
    48px 1fr 48px;

  align-items: center;

  gap: 12px;

  margin-bottom: 22px;

  position: relative;

  z-index: 2;

}


.header-title {

  text-align: center;

}


.header-title h1 {

  margin: 0;

  color: white;

  font-size: 22px;

  font-weight: 800;

  letter-spacing: 0.8px;

}


.header-title p {

  margin: 4px 0 0;

  color:
    rgba(255,255,255,0.68);

  font-size: 11px;

  letter-spacing: 1px;

}


.header-spacer {

  width: 48px;

}


/* =========================================
   EXIT BUTTON
========================================= */

.exit-button {

  width: 46px;

  height: 46px;

  border-radius: 14px;

  border:
    1px solid
    rgba(255,255,255,0.35);

  background:
    rgba(255,255,255,0.13);

  color: white;

  font-size: 24px;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0;

  backdrop-filter: blur(8px);

  transition:
    transform 0.25s ease,
    background 0.25s ease;

}


.exit-button:hover {

  background:
    rgba(255,255,255,0.23);

  transform:
    translateX(-3px);

}


.exit-button:active {

  transform: scale(0.94);

}


/* =========================================
   HERO TILE
========================================= */

.hero-card {

  display: flex;

  align-items: center;

  gap: 18px;

  padding: 24px;

  margin-bottom: 18px;

  border-radius: 22px;

  background:
    rgba(255,255,255,0.14);

  border:
    1px solid
    rgba(255,255,255,0.28);

  backdrop-filter: blur(10px);

  box-shadow:
    0 10px 30px
    rgba(0,0,0,0.13);

  position: relative;

  z-index: 1;

}


.hero-icon {

  width: 64px;

  height: 64px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 18px;

  background:
    rgba(255,255,255,0.2);

  font-size: 34px;

  box-shadow:
    0 6px 18px
    rgba(0,0,0,0.15);

}


.hero-content h2 {

  margin: 0;

  color: white;

  font-size: 20px;

  font-weight: 800;

}


.hero-content p {

  margin: 7px 0 0;

  color:
    rgba(255,255,255,0.72);

  font-size: 12px;

}


/* =========================================
   STATS GRID
========================================= */

.stats-grid {

  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 14px;

  margin-bottom: 18px;

  position: relative;

  z-index: 1;

}


.stat-tile {

  display: flex;

  align-items: center;

  gap: 13px;

  padding: 18px;

  border-radius: 18px;

  background:
    rgba(255,255,255,0.96);

  box-shadow:
    0 8px 24px
    rgba(0,0,0,0.13);

  transition:
    transform 0.25s ease;

}


.stat-tile:hover {

  transform:
    translateY(-3px);

}


.stat-icon {

  width: 44px;

  height: 44px;

  border-radius: 13px;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    rgba(46,204,113,0.13);

  font-size: 21px;

}


.stat-value {

  color: #0d4d2b;

  font-size: 23px;

  font-weight: 800;

  line-height: 1;

}


.stat-label {

  margin-top: 5px;

  color: #6c7c73;

  font-size: 10px;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 1px;

}


/* =========================================
   SEARCH CARD
========================================= */

.search-card {

  display: flex;

  align-items: center;

  gap: 11px;

  padding: 14px 18px;

  margin-bottom: 24px;

  border-radius: 17px;

  background:
    rgba(255,255,255,0.97);

  border-left:
    4px solid #f1c40f;

  box-shadow:
    0 8px 24px
    rgba(0,0,0,0.14);

  position: relative;

  z-index: 1;

}


.search-icon {

  font-size: 17px;

  opacity: 0.55;

}


.search-card input {

  flex: 1;

  min-width: 0;

  border: none;

  outline: none;

  background: transparent;

  font-family: inherit;

  color: #0d4d2b;

  font-size: 14px;

}


.search-card input::placeholder {

  color: #9bad9f;

}


.clear-search {

  width: 27px;

  height: 27px;

  border: none;

  border-radius: 50%;

  background:
    rgba(26,122,68,0.12);

  color: #1a7a44;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0;

}


/* =========================================
   SECTION HEADER
========================================= */

.section-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 14px;

  position: relative;

  z-index: 1;

}


.section-header h2 {

  margin: 0;

  color: white;

  font-size: 16px;

  font-weight: 800;

}


.section-header p {

  margin: 4px 0 0;

  color:
    rgba(255,255,255,0.65);

  font-size: 11px;

}


.section-count {

  min-width: 34px;

  height: 30px;

  padding: 0 10px;

  border-radius: 50px;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    rgba(255,255,255,0.17);

  border:
    1px solid
    rgba(255,255,255,0.3);

  color: white;

  font-size: 12px;

  font-weight: 800;

}


/* =========================================
   ORGANIZATION TILE GRID
========================================= */

.organization-grid {

  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 16px;

  position: relative;

  z-index: 1;

}


/* =========================================
   ORGANIZATION TILE
========================================= */

.organization-tile {

  min-height: 230px;

  padding: 20px;

  border-radius: 21px;

  background:
    rgba(255,255,255,0.97);

  box-shadow:
    0 8px 25px
    rgba(0,0,0,0.15);

  cursor: pointer;

  display: flex;

  flex-direction: column;

  box-sizing: border-box;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  border-top:
    4px solid #2ecc71;

}


.organization-tile:hover {

  transform:
    translateY(-6px);

  box-shadow:
    0 14px 35px
    rgba(0,0,0,0.22);

  border-top-color:
    #f1c40f;

}


.organization-tile:active {

  transform:
    translateY(-2px);

}


/* =========================================
   TILE TOP
========================================= */

.tile-top {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 18px;

}


.org-number {

  width: 38px;

  height: 38px;

  border-radius: 11px;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    linear-gradient(
      135deg,
      #0d4d2b,
      #1a7a44
    );

  color: white;

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 1px;

}


.org-icon {

  width: 43px;

  height: 43px;

  border-radius: 13px;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    rgba(46,204,113,0.12);

  font-size: 21px;

}


/* =========================================
   TILE CONTENT
========================================= */

.tile-content {

  flex: 1;

}


.tile-content h3 {

  margin: 0;

  color: #0d4d2b;

  font-size: 17px;

  font-weight: 800;

  line-height: 1.25;

}


.tile-content p {

  margin: 8px 0 0;

  color: #617068;

  font-size: 12.5px;

  line-height: 1.5;

  display: -webkit-box;

  -webkit-line-clamp: 3;

  -webkit-box-orient: vertical;

  overflow: hidden;

}


/* =========================================
   TILE FOOTER
========================================= */

.tile-footer {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 8px;

  margin-top: 18px;

  padding-top: 13px;

  border-top:
    1px solid #edf2ee;

}


.member-badge {

  padding: 6px 10px;

  border-radius: 50px;

  background:
    rgba(46,204,113,0.12);

  color: #1a7a44;

  font-size: 10.5px;

  font-weight: 700;

  white-space: nowrap;

}


.view-button {

  color: #1a7a44;

  font-size: 11px;

  font-weight: 800;

  white-space: nowrap;

  transition:
    transform 0.25s ease;

}


.organization-tile:hover .view-button {

  transform:
    translateX(3px);

}


/* =========================================
   STATUS TILE
========================================= */

.status-tile {

  padding: 35px 25px;

  margin-top: 15px;

  text-align: center;

  border-radius: 20px;

  background:
    rgba(255,255,255,0.14);

  border:
    1px solid
    rgba(255,255,255,0.25);

  backdrop-filter: blur(8px);

  color: white;

  position: relative;

  z-index: 1;

}


.status-icon {

  font-size: 35px;

  margin-bottom: 10px;

}


.status-tile h3 {

  margin: 0;

  font-size: 16px;

}


.status-tile p {

  margin: 7px 0 0;

  color:
    rgba(255,255,255,0.7);

  font-size: 12px;

}


.reset-search {

  margin-top: 16px;

  padding: 9px 18px;

  border: none;

  border-radius: 50px;

  background: #f1c40f;

  color: #0d4d2b;

  font-weight: 800;

  cursor: pointer;

}


/* =========================================
   MOBILE
========================================= */

@media (max-width: 650px) {

  .organization-page {

    padding:
      22px 15px 40px;

  }


  .page-header {

    grid-template-columns:
      42px 1fr 42px;

  }


  .exit-button {

    width: 42px;

    height: 42px;

    border-radius: 12px;

  }


  .header-spacer {

    width: 42px;

  }


  .header-title h1 {

    font-size: 18px;

  }


  .hero-card {

    padding: 19px;

    gap: 14px;

  }


  .hero-icon {

    width: 54px;

    height: 54px;

    font-size: 28px;

    border-radius: 15px;

  }


  .hero-content h2 {

    font-size: 17px;

  }


  .hero-content p {

    font-size: 10.5px;

  }


  .stats-grid {

    gap: 10px;

  }


  .stat-tile {

    padding: 14px;

  }


  .stat-icon {

    width: 38px;

    height: 38px;

    font-size: 18px;

  }


  .stat-value {

    font-size: 20px;

  }


  .stat-label {

    font-size: 9px;

  }


  .organization-grid {

    grid-template-columns: 1fr;

    gap: 13px;

  }


  .organization-tile {

    min-height: 205px;

    padding: 18px;

  }

}


/* =========================================
   SMALL PHONES
========================================= */

@media (max-width: 400px) {

  .organization-page {

    padding:
      18px 12px 35px;

  }


  .header-title h1 {

    font-size: 16px;

  }


  .hero-card {

    padding: 16px;

  }


  .hero-icon {

    width: 48px;

    height: 48px;

    font-size: 24px;

  }


  .hero-content h2 {

    font-size: 15px;

  }


  .hero-content p {

    font-size: 9.5px;

  }


  .stats-grid {

    grid-template-columns: 1fr;

  }


  .stat-tile {

    padding: 13px;

  }


  .organization-tile {

    min-height: 195px;

  }


  .tile-content h3 {

    font-size: 16px;

  }

}


/* =========================================
   ANIMATION
========================================= */

.organization-tile {

  animation:
    tileAppear 0.4s ease both;

}


.organization-tile:nth-child(1) {
  animation-delay: 0.05s;
}


.organization-tile:nth-child(2) {
  animation-delay: 0.10s;
}


.organization-tile:nth-child(3) {
  animation-delay: 0.15s;
}


.organization-tile:nth-child(4) {
  animation-delay: 0.20s;
}


.organization-tile:nth-child(5) {
  animation-delay: 0.25s;
}


@keyframes tileAppear {

  from {

    opacity: 0;

    transform:
      translateY(15px);

  }

  to {

    opacity: 1;

    transform:
      translateY(0);

  }

}

</style>