<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from './AppIcon.vue'
import { useTransactionSelectionStore } from '../../modules/transactions/stores/use_transaction_selection_store'

const route = useRoute()
const router = useRouter()
const selectionStore = useTransactionSelectionStore()
const title = computed(() => String(route.meta.title ?? '记账'))
const showBack = computed(() => Boolean(route.meta.showBack))
const backLabel = computed(() => String(route.meta.backLabel ?? '上一页'))
const isTransactions = computed(() => route.name === 'Transactions')

watch(
  () => route.name,
  (routeName) => {
    if (routeName !== 'Transactions') selectionStore.cancel()
  },
)

function openYesterdayReview(): void {
  window.dispatchEvent(new CustomEvent('aetherflow:open-yesterday-review'))
}

function openSearch(): void {
  selectionStore.cancel()
  router.push('/transactions/search')
}

function goBack(): void {
  router.push(String(route.meta.backTo ?? '/transactions'))
}
</script>

<template>
  <header class="app-header">
    <div class="header-side header-left">
      <button
        v-if="showBack"
        class="header-action back-action"
        :aria-label="`返回${backLabel}`"
        :title="`返回${backLabel}`"
        @click="goBack"
      >
        <AppIcon name="back" />
      </button>
    </div>

    <h1>{{ title }}</h1>

    <div class="header-side header-right">
      <template v-if="isTransactions">
        <button
          class="header-action"
          aria-label="查看昨日账单核对"
          title="查看昨日账单核对"
          @click="openYesterdayReview"
        >
          <AppIcon name="calendar" />
        </button>
        <button class="header-action" aria-label="搜索记账" title="搜索记账" @click="openSearch">
          <AppIcon name="search" />
        </button>
        <button
          class="header-action"
          :class="{ 'is-active': selectionStore.active }"
          :aria-label="selectionStore.active ? '退出多选' : '多选删除'"
          :title="selectionStore.active ? '退出多选' : '多选删除'"
          @click="selectionStore.toggleMode"
        >
          <AppIcon name="check-square" />
        </button>
      </template>
      <template v-else-if="!showBack">
        <button class="header-action" aria-label="报表" @click="router.push('/reports')">
          <AppIcon name="chart" />
        </button>
        <button class="header-action" aria-label="设置" @click="router.push('/settings')">
          <AppIcon name="settings" />
        </button>
      </template>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: calc(56px + env(safe-area-inset-top));
  padding: env(safe-area-inset-top) 10px 0;
  border-bottom: 1px solid var(--line);
  background: color-mix(in srgb, var(--surface) 94%, transparent);
  backdrop-filter: blur(18px);
}

.app-header h1 {
  position: absolute;
  top: env(safe-area-inset-top);
  bottom: 0;
  left: 50%;
  display: grid;
  place-items: center;
  max-width: calc(100% - 190px);
  overflow: hidden;
  margin: 0;
  transform: translateX(-50%);
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-side {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 2px;
}

.header-left {
  justify-content: flex-start;
}

.header-right {
  justify-content: flex-end;
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

.back-action {
  border: 1px solid var(--line);
  background: var(--surface);
}

.header-action.is-active {
  background: var(--primary-soft);
  color: var(--primary);
}

@media (min-width: 700px) {
  .app-header {
    border-radius: 28px 28px 0 0;
  }
}
</style>
