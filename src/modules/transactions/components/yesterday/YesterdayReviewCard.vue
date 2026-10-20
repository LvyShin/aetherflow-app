<script setup lang="ts">
defineProps<{
  count: number
  expense: string
  income: string
  dateLabel: string
  privacyMode: boolean
}>()

defineEmits<{ open: [] }>()
</script>

<template>
  <button class="yesterday-card" type="button" @click="$emit('open')">
    <span class="calendar-mark">{{ dateLabel }}</span>
    <span class="yesterday-copy">
      <strong v-if="count > 0">昨日共有 {{ count }} 笔账单，请核对</strong>
      <strong v-else>昨日暂无账单</strong>
      <small>
        <template v-if="count > 0">支 {{ privacyMode ? '****' : `¥${expense}` }} · 收 {{ privacyMode ? '****' : `¥${income}` }}</template>
        <template v-else>点击查看昨日明细</template>
      </small>
    </span>
    <span class="open-label">查看昨日账单 ›</span>
  </button>
</template>

<style scoped>
.yesterday-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 11px;
  align-items: center;
  width: 100%;
  padding: 14px;
  border: 1px solid #dce7fb;
  border-radius: 20px;
  background: linear-gradient(135deg, #eef5ff, #f9fbff);
  color: var(--text);
  text-align: left;
  cursor: pointer;
}

.calendar-mark {
  display: grid;
  place-items: center;
  min-width: 48px;
  height: 42px;
  padding: 0 7px;
  border-radius: 13px;
  background: #dceaff;
  color: #2869c7;
  font-size: 0.62rem;
  font-weight: 800;
}

.yesterday-copy {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.yesterday-copy strong {
  overflow: hidden;
  font-size: 0.75rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yesterday-copy small {
  color: #66758c;
  font-size: 0.61rem;
}

.open-label {
  color: #2869c7;
  font-size: 0.61rem;
  font-weight: 750;
}

@media (prefers-color-scheme: dark) {
  .yesterday-card {
    border-color: #253a5e;
    background: linear-gradient(135deg, #17233a, #141b2a);
  }

  .calendar-mark {
    background: #20395f;
    color: #8bb6ff;
  }

  .yesterday-copy small {
    color: var(--muted);
  }

  .open-label {
    color: #8bb6ff;
  }
}

@media (max-width: 360px) {
  .open-label {
    display: none;
  }
}
</style>
