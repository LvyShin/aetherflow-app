<script setup lang="ts">
export type AppIconName =
  | 'search'
  | 'chart'
  | 'settings'
  | 'wallet'
  | 'vehicle'
  | 'record'
  | 'eye'
  | 'eye-off'
  | 'close'
  | 'pencil'
  | 'back'
  | 'plus'
  | 'trash'

withDefaults(defineProps<{ name: AppIconName; size?: number }>(), { size: 20 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.8"
  >
    <template v-if="name === 'search'">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </template>
    <template v-else-if="name === 'chart'">
      <path d="M4 19V9m6 10V5m5 14v-7m5 7V3" />
    </template>
    <template v-else-if="name === 'settings'">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.4-6.4-1.4 1.4M7 17l-1.4 1.4m12.8 0L17 17M7 7 5.6 5.6" />
    </template>
    <template v-else-if="name === 'wallet'">
      <path d="M4 7h16v12H4zM4 10h16M8 15h3" />
    </template>
    <template v-else-if="name === 'vehicle'">
      <path d="m5 11 2-5h10l2 5v6h-2m-10 0H5v-6m2 6v2m10-2v2m-10-2h10" />
    </template>
    <template v-else-if="name === 'record'">
      <path d="M12 5v14M5 12h14" />
    </template>
    <template v-else-if="name === 'eye'">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </template>
    <template v-else-if="name === 'eye-off'">
      <path d="m3 3 18 18M10.6 6.2A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a15.3 15.3 0 0 1-2.3 3M6.4 6.4C4 8.1 2.5 12 2.5 12s3.5 6 9.5 6c1.5 0 2.8-.4 4-1" />
    </template>
    <template v-else-if="name === 'close'">
      <path d="M18 6 6 18M6 6l12 12" />
    </template>
    <template v-else-if="name === 'pencil'">
      <path d="m15 4 5 5L9 20l-5 1 1-5L16 5l-1-1Z" />
    </template>
    <template v-else-if="name === 'back'">
      <path d="m15 18-6-6 6-6" />
    </template>
    <template v-else-if="name === 'plus'">
      <path d="M12 5v14M5 12h14" />
    </template>
    <template v-else-if="name === 'trash'">
      <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" />
    </template>
  </svg>
</template>

<style scoped>
svg {
  display: block;
}
</style>
