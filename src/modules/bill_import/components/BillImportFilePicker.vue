<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ parsing: boolean }>()
const emit = defineEmits<{ select: [file: File] }>()
const input = ref<HTMLInputElement | null>(null)

function openPicker(): void {
  input.value?.click()
}

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) emit('select', file)
  target.value = ''
}

function handleDrop(event: DragEvent): void {
  const file = event.dataTransfer?.files[0]
  if (file) emit('select', file)
}
</script>

<template>
  <section
    class="file-picker"
    :class="{ parsing }"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <span class="file-icon">⇧</span>
    <strong>{{ parsing ? '正在本地解析账单…' : '选择账单文件' }}</strong>
    <p>从微信或支付宝导出官方账单，文件不会上传到服务器。</p>
    <button type="button" :disabled="parsing" @click="openPicker">选择文件</button>
    <small>支持 XLSX、XLS、CSV，单文件不超过 1MB</small>
    <input
      ref="input"
      accept=".xlsx,.xls,.csv"
      class="file-input"
      type="file"
      @change="handleInput"
    />
  </section>
</template>

<style scoped>
.file-picker {
  display: grid;
  justify-items: center;
  gap: 9px;
  padding: 34px 22px;
  border: 1.5px dashed color-mix(in srgb, var(--primary) 42%, var(--line));
  border-radius: 24px;
  background: var(--surface);
  text-align: center;
}

.file-picker.parsing {
  opacity: 0.72;
}

.file-icon {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 1.5rem;
  font-weight: 800;
}

strong {
  font-size: 0.9rem;
}

p,
small {
  margin: 0;
  color: var(--muted);
  font-size: 0.68rem;
}

button {
  margin-top: 4px;
  padding: 9px 18px;
  border: 0;
  border-radius: 999px;
  background: var(--primary);
  color: white;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 750;
}

.file-input {
  display: none;
}
</style>
