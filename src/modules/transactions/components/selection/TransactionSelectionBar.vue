<script setup lang="ts">
import AppIcon from '../../../../shared/components/AppIcon.vue'

defineProps<{ count: number; deleting: boolean; allSelected: boolean }>()
defineEmits<{ cancel: []; delete: []; toggleAll: [] }>()
</script>

<template>
  <div class="selection-bar">
    <div class="selection-actions">
      <button class="ghost" @click="$emit('cancel')">
        <AppIcon name="close" :size="15" />
        取消
      </button>
      <button class="ghost" @click="$emit('toggleAll')">
        <AppIcon name="check-square" :size="15" />
        {{ allSelected ? '取消全选' : '全选' }}
      </button>
    </div>
    <span>已选择 <strong>{{ count }}</strong> 笔</span>
    <button class="delete" :disabled="count === 0 || deleting" @click="$emit('delete')">
      <AppIcon name="trash" :size="15" />
      {{ deleting ? '删除中' : '删除' }}
    </button>
  </div>
</template>

<style scoped>
.selection-bar {
  position: fixed;
  z-index: 35;
  right: 12px;
  bottom: calc(78px + env(safe-area-inset-bottom));
  left: 12px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  width: min(calc(100% - 24px), 456px);
  margin: 0 auto;
  padding: 9px 10px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface) 96%, transparent);
  box-shadow: 0 12px 30px rgba(22, 30, 55, 0.16);
  backdrop-filter: blur(16px);
}

.selection-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

button {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.68rem;
  font-weight: 720;
  white-space: nowrap;
}

.ghost {
  padding: 7px 8px;
  background: var(--surface-soft);
  color: var(--muted-strong);
}

.delete {
  padding: 8px 11px;
  background: var(--danger);
  color: white;
}

span {
  overflow: hidden;
  color: var(--muted);
  font-size: 0.68rem;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

strong {
  color: var(--text);
}

@media (max-width: 380px) {
  .ghost {
    padding: 7px 6px;
  }

  button {
    font-size: 0.63rem;
  }
}
</style>
