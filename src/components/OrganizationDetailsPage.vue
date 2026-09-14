<template>
  <ion-page>
    <ion-content>
      <div class="details-page">

        <div class="page-header">
          <h1>Organization Details</h1>

          <button
            class="add-button"
            type="button"
            @click="registerMember"
          >
            +
          </button>
        </div>

        <h2>Student List</h2>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>School ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Position</th>
              </tr>
            </thead>

            <tbody>
            </tbody>
          </table>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'

const emit = defineEmits<{
  register: []
}>()

const registerMember = () => {
  emit('register')
}
</script>

<style scoped>
.details-page {
  min-height: 100vh;
  padding: 20px;
  background: #f3eafa;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 26px;
  margin: 0;
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

h2 {
  font-size: 22px;
  margin-bottom: 15px;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

th,
td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background: #6b4c6e;
  color: white;
}

td {
  background: white;
}
</style>