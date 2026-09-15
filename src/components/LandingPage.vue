<template>
  <div class="landing-page">

    <h1>Mindoro State University</h1>
    <h2>School Organization List</h2>

    <button class="login-button" @click.stop="goToLogin">
      Login
    </button>

  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  login: []
}>()

const goToLogin = () => {
  emit('login')
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
  background: linear-gradient(135deg, #0d4d2b 0%, #1a7a44 40%, #2ecc71 100%);
  cursor: default;
  position: relative;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}

/* Decorative circles */
.landing-page::before {
  content: '';
  position: absolute;
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

.landing-page::after {
  content: '';
  position: absolute;
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

h1 {
  font-size: 42px;
  font-weight: 800;
  margin: 0;
  color: #ffffff;
  letter-spacing: 2px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  z-index: 1;
  line-height: 1.2;
  animation: fadeInDown 0.8s ease-out;
  position: relative;
}

h2 {
  font-size: 26px;
  margin-top: 14px;
  color: #a8e6cf;
  font-weight: 400;
  letter-spacing: 4px;
  text-transform: uppercase;
  z-index: 1;
  animation: fadeInDown 0.8s ease-out 0.2s both;
  position: relative;
}

h2::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: #f1c40f;
  margin: 18px auto 0;
  border-radius: 2px;
}

/* Login Button */
.login-button {
  margin-top: 60px;
  padding: 13px 40px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 16px;
  letter-spacing: 1px;
  cursor: pointer;
  z-index: 2;
  position: relative;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.login-button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.05);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-25px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  h1 {
    font-size: 32px;
    letter-spacing: 1px;
  }

  h2 {
    font-size: 20px;
    letter-spacing: 3px;
  }

  .login-button {
    margin-top: 45px;
    font-size: 15px;
    padding: 12px 34px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 24px;
    padding: 0 10px;
  }

  h2 {
    font-size: 16px;
    letter-spacing: 2px;
  }

  h2::after {
    width: 45px;
    height: 2px;
    margin-top: 12px;
  }

  .login-button {
    margin-top: 35px;
    font-size: 14px;
    padding: 11px 30px;
  }

  .landing-page::before,
  .landing-page::after {
    width: 250px;
    height: 250px;
  }
}

@media (max-width: 360px) {
  h1 {
    font-size: 20px;
  }

  h2 {
    font-size: 14px;
  }

  .login-button {
    font-size: 13px;
    padding: 10px 26px;
  }
}

@media (max-height: 500px) {
  h1 {
    font-size: 26px;
  }

  h2 {
    font-size: 18px;
    margin-top: 8px;
  }

  .login-button {
    margin-top: 25px;
    font-size: 13px;
  }
}
</style>