<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppIcon, { type AppIconName } from './AppIcon.vue'

defineEmits<{ record: [] }>()

const route = useRoute()
const tabs: Array<{ path: string; label: string; icon: AppIconName }> = [
  { path: '/transactions', label: '记账', icon: 'wallet' },
  { path: '/reports', label: '报表', icon: 'chart' },
  { path: '/vehicle', label: '车主', icon: 'vehicle' },
  { path: '/settings', label: '设置', icon: 'settings' },
]
</script>

<template>
  <nav class="bottom-navigation" aria-label="主导航">
    <RouterLink
      v-for="(tab, index) in tabs"
      :key="tab.path"
      :to="tab.path"
      class="navigation-link"
      :class="{ active: route.path.startsWith(tab.path), 'third-position': index === 2 }"
    >
      <AppIcon :name="tab.icon" />
      <span>{{ tab.label }}</span>
    </RouterLink>
    <button class="record-button" aria-label="记一笔" @click="$emit('record')">
      <span><AppIcon name="record" :size="22" /></span>
      <small>记一笔</small>
    </button>
  </nav>
</template>

<style scoped>
.bottom-navigation {
  position: fixed;
  z-index: 40;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  width: min(100%, 480px);
  min-height: calc(70px + env(safe-area-inset-bottom));
  margin: 0 auto;
  padding: 7px 14px env(safe-area-inset-bottom);
  border-top: 1px solid var(--line);
  background: color-mix(in srgb, var(--surface) 94%, transparent);
  backdrop-filter: blur(20px);
}

.navigation-link {
  display: grid;
  justify-items: center;
  gap: 3px;
  color: var(--muted);
  font-size: 0.61rem;
  font-weight: 700;
  text-decoration: none;
}

.navigation-link.third-position {
  grid-column: 4;
}

.navigation-link.active {
  color: var(--primary);
}

.record-button {
  grid-column: 3;
  grid-row: 1;
  display: grid;
  align-self: end;
  justify-items: center;
  gap: 2px;
  border: 0;
  background: transparent;
  color: var(--primary);
  cursor: pointer;
}

.record-button > span {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  margin-top: -26px;
  border: 5px solid var(--bg);
  border-radius: 18px;
  background: var(--primary);
  box-shadow: 0 10px 22px rgba(56, 85, 224, 0.32);
  color: white;
}

.record-button small {
  font-size: 0.61rem;
  font-weight: 750;
}

@media (min-width: 700px) {
  .bottom-navigation {
    overflow: hidden;
    border-right: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    border-left: 1px solid var(--line);
    border-radius: 0 0 28px 28px;
  }
}
</style>
