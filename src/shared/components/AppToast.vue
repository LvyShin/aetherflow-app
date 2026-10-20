<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <Transition name="toast">
    <div v-if="message" class="toast-message" role="status">{{ message }}</div>
  </Transition>
</template>

<style scoped>
.toast-message {
  position: fixed;
  z-index: 100;
  bottom: calc(88px + env(safe-area-inset-bottom));
  left: 50%;
  width: max-content;
  max-width: calc(100% - 36px);
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(25, 31, 44, 0.92);
  color: white;
  box-shadow: 0 9px 26px rgba(0, 0, 0, 0.22);
  font-size: 0.72rem;
  font-weight: 650;
  transform: translateX(-50%);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}

@media (prefers-color-scheme: dark) {
  .toast-message {
    background: rgba(235, 239, 251, 0.94);
    color: #171b25;
  }
}
</style>
