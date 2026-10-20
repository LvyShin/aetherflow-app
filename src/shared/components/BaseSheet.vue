<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean
    label: string
    contentClass?: string
  }>(),
  { contentClass: '' },
)

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="sheet-backdrop" @click.self="emit('close')">
        <section
          class="base-sheet"
          :class="contentClass"
          :aria-label="label"
          aria-modal="true"
          role="dialog"
        >
          <slot />
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-backdrop {
  position: fixed;
  z-index: 80;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(11, 15, 25, 0.58);
  backdrop-filter: blur(4px);
}

.base-sheet.centered {
  align-self: center;
  width: min(100% - 32px, 360px);
  max-height: none;
  padding: 18px 20px 22px;
  border-radius: 24px;
  animation: fade-in 0.22s ease-out;
}

.base-sheet {
  width: min(100%, 480px);
  max-height: 92vh;
  padding: 16px 18px calc(20px + env(safe-area-inset-bottom));
  overflow-y: auto;
  border-radius: 28px 28px 0 0;
  background: var(--bg);
  box-shadow: 0 -24px 60px rgba(10, 17, 35, 0.2);
  animation: slide-up 0.24s ease-out;
  scrollbar-width: none;
}

.base-sheet::-webkit-scrollbar {
  display: none;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.2s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

@keyframes slide-up {
  from {
    transform: translateY(28px);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    transform: translateY(10px) scale(0.98);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>
