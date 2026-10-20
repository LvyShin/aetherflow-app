<script setup lang="ts">
defineProps<{ saving: boolean }>()
const emit = defineEmits<{ press: [key: string]; save: [] }>()
</script>

<template>
  <div class="keypad" aria-label="金额键盘">
    <button @click="emit('press', '1')">1</button>
    <button @click="emit('press', '2')">2</button>
    <button @click="emit('press', '3')">3</button>
    <button class="keypad-secondary" @click="emit('press', 'del')">⌫</button>
    <button @click="emit('press', '4')">4</button>
    <button @click="emit('press', '5')">5</button>
    <button @click="emit('press', '6')">6</button>
    <button class="keypad-secondary" @click="emit('press', 'clear')">清空</button>
    <button @click="emit('press', '7')">7</button>
    <button @click="emit('press', '8')">8</button>
    <button @click="emit('press', '9')">9</button>
    <button class="save-key" :disabled="saving" @click="emit('save')">
      {{ saving ? '保存中' : '保存' }}
    </button>
    <button @click="emit('press', '0')">0</button>
    <button @click="emit('press', '.')">.</button>
    <button @click="emit('press', '00')">00</button>
  </div>
</template>

<style scoped>
.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-top: 11px;
}

button {
  min-height: 43px;
  border: 0;
  border-radius: 12px;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 720;
}

button:active {
  transform: translateY(1px);
  background: var(--surface-soft);
}

.keypad-secondary {
  background: var(--surface-soft);
  color: var(--muted-strong);
  font-size: 0.72rem;
}

.save-key {
  grid-row: span 2;
  background: var(--primary);
  color: white;
  box-shadow: 0 8px 18px rgba(56, 85, 224, 0.25);
  font-size: 0.8rem;
}
</style>
