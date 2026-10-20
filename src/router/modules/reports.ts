import type { RouteRecordRaw } from 'vue-router'

export const reportsRoute: RouteRecordRaw = {
  path: '/reports',
  name: 'Reports',
  component: () => import('../../modules/reports/views/ReportIndex.vue'),
  meta: { title: '收支报表' },
}
