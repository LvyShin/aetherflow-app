<script setup lang="ts">
const emit = defineEmits<{ delete: []; edit: [] }>()
</script>

<template>
  <footer class="detail-actions">
    <button class="danger" type="button" @click="emit('delete')">删除</button>
    <span />
    <button type="button" @click="emit('edit')">编辑</button>
  </footer>
</template>

<style scoped>
.detail-actions {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 4px;
  margin: 4px -18px 0;
  border-top: 1px solid var(--line);
}

button {
  padding: 14px;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 750;
}

.danger {
  color: var(--danger);
}

span {
  background: var(--line);
}
</style>
