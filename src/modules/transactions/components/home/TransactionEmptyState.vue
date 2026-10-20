<script setup lang="ts">
defineEmits<{ create: [] }>()
</script>

<template>
  <div class="state-panel empty-state">
    <span class="empty-icon">🧾</span>
    <strong>这一天从第一笔开始</strong>
    <p>当前筛选下还没有流水。</p>
    <button class="primary-button" @click="$emit('create')">记一笔</button>
  </div>
</template>

<style scoped>
.state-panel {
  display: grid;
  place-items: center;
  gap: 10px;
  min-height: 260px;
  margin-top: 18px;
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--surface);
  color: var(--muted);
  font-size: 0.76rem;
  text-align: center;
}

.empty-state strong {
  color: var(--text);
  font-size: 1rem;
}

.empty-state p {
  margin: -4px 0 8px;
}

.empty-icon {
  font-size: 2.4rem;
}

.primary-button {
  padding: 10px 22px;
  border: 0;
  border-radius: 999px;
  background: var(--primary);
  color: white;
  cursor: pointer;
  font-weight: 750;
}
</style>
