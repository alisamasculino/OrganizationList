<template>
  <div class="add-organization-page">

    <div class="page-header">
      <h1>Add New Organization</h1>

      <button
        class="back-button"
        type="button"
        @click="goBack"
      >
        ←
      </button>
    </div>

    <div class="form">

      <label>Organization Name</label>
      <input
        type="text"
        placeholder="Enter organization name"
      />

      <label>Description</label>
      <textarea
        placeholder="Enter organization description"
      ></textarea>

      <button
        class="add-button"
        type="button"
        @click="addOrganization"
      >
        Add Organization
      </button>

    </div>

  </div>
</template>

<script setup lang="ts">

const emit = defineEmits<{
  back: []
}>()

const goBack = () => {
  emit('back')
}

const addOrganization = () => {
  // Firebase will be added here later
  emit('back')
}

</script>

<style scoped>

.add-organization-page {
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

.back-button {
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 50%;
  background: #6b4c6e;
  color: white;
  font-size: 25px;
  cursor: pointer;
}

.form {
  background: white;
  padding: 25px;
  border-radius: 12px;
}

label {
  display: block;
  margin-top: 15px;
  margin-bottom: 8px;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 16px;
}

textarea {
  height: 120px;
  resize: none;
}

.add-button {
  width: 100%;
  margin-top: 25px;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background: #6b4c6e;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.add-button:hover {
  opacity: 0.8;
}

</style>