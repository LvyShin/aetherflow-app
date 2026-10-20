<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from './AppIcon.vue'

const route = useRoute()
const router = useRouter()
const title = computed(() => String(route.meta.title ?? '记账'))
</script>

<template>
  <header class="app-header">
    <button class="header-action" aria-label="搜索" title="搜索将在后续流水模块接入">
      <AppIcon name="search" />
    </button>
    <h1>{{ title }}</h1>
    <div class="header-cluster">
      <button class="header-action" aria-label="报表" @click="router.push('/reports')">
        <AppIcon name="chart" />
      </button>
      <button class="header-action" aria-label="设置" @click="router.push('/settings')">
        <AppIcon name="settings" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: 72px 1fr 72px;
  align-items: center;
  min-height: calc(56px + env(safe-area-inset-top));
  padding: env(safe-area-inset-top) 14px 0;
  border-bottom: 1px solid var(--line);
  background: color-mix(in srgb, var(--surface) 94%, transparent);
  backdrop-filter: blur(18px);
}

.app-header h1 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-align: center;
}

.header-cluster {
  display: flex;
  justify-content: flex-end;
  gap: 2px;
}

.header-action {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--muted-strong);
  cursor: pointer;
}

.header-action:hover {
  background: var(--surface-soft);
}

@media (min-width: 700px) {
  .app-header {
    border-radius: 28px 28px 0 0;
  }
}
</style>
