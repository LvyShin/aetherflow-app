import type { RouteRecordRaw } from 'vue-router'

export const settingsRoute: RouteRecordRaw = {
  path: '/settings',
  name: 'Settings',
  component: () => import('../../modules/settings/views/SettingsIndex.vue'),
  meta: { title: '设置' },
}
