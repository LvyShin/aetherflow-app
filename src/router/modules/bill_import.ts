import type { RouteRecordRaw } from 'vue-router'

export const billImportRoute: RouteRecordRaw = {
  path: '/settings/import',
  name: 'BillImport',
  component: () => import('../../modules/bill_import/views/BillImportIndex.vue'),
  meta: {
    title: '导入账单',
    showBack: true,
    backTo: '/settings',
    backLabel: '设置',
  },
}
