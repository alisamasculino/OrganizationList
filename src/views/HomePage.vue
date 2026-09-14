<template>
  <ion-page>
    <LandingPage
      v-if="currentPage === 'landing'"
      @continue="currentPage = 'organizations'"
    />

    <OrganizationPage
      v-else-if="currentPage === 'organizations'"
      @select-organization="currentPage = 'details'"
       @add-organization="currentPage = 'addOrganization'"
    />
    <AddOrganization
  v-else-if="currentPage === 'addOrganization'"
  @back="currentPage = 'organizations'"
/>

    <OrganizationDetailsPage
      v-else-if="currentPage === 'details'"
      @register="currentPage = 'register'"
    />

    <RegisterMemberPage
      v-else
      @back="currentPage = 'details'"
/>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage } from '@ionic/vue'

import LandingPage from '@/components/LandingPage.vue'
import OrganizationPage from '@/components/OrganizationPage.vue'
import OrganizationDetailsPage from '@/components/OrganizationDetailsPage.vue'
import RegisterMemberPage from '@/components/RegisterMemberPage.vue'
import AddOrganization from '@/components/AddOrganization.vue'


const currentPage = ref('landing')
</script>