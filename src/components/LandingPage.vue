<template>
  <div class="landing-page" @click="continueToOrganizations">
    <h1>Mindoro State University</h1>
    <h2>Calapan Campus</h2>
    <p>Tap the screen to continue</p>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  continue: []
}>()

const continueToOrganizations = () => {
  emit('continue')
}
</script>

<style scoped>
.landing-page {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #f3eafa;
  cursor: pointer;
}

h1 {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}

h2 {
  font-size: 23px;
  margin-top: 8px;
}

p {
  margin-top: 50px;
  font-size: 16px;
  color: #666;
}
</style>