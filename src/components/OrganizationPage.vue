<template>
  <div class="organization-page">

    <div class="page-header">
      <h1>School Organizations</h1>

      <button
        class="add-button"
        type="button"
        @click="addOrganization"
      >
        +
      </button>
    </div>

    <div
      class="organization"
      @click="selectOrganization"
    >
      LEGITS
    </div>

    <div
      class="organization"
      @click="selectOrganization"
    >
      BAANAW
    </div>

    <div
      class="organization"
      @click="selectOrganization"
    >
      Math Society
    </div>

    <div
      class="organization"
      @click="selectOrganization"
    >
      Science Club
    </div>

    <div
      class="organization"
      @click="selectOrganization"
    >
      BSED Club
    </div>

  </div>
</template>

<script setup lang="ts">

const emit = defineEmits<{
  selectOrganization: []
  addOrganization: []
}>()

const selectOrganization = () => {
  emit('selectOrganization')
}

const addOrganization = () => {
  emit('addOrganization')
}

</script>

<style scoped>

.organization-page {
  min-height: 100vh;
  padding: 30px 20px;
  background: #f3eafa;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

h1 {
  margin: 0;
  font-size: 26px;
}

.add-button {
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 50%;
  background: #6b4c6e;
  color: white;
  font-size: 30px;
  cursor: pointer;
}

.add-button:hover {
  opacity: 0.8;
}

.organization {
  background: white;
  padding: 20px;
  margin: 15px 0;
  border-radius: 12px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

</style>