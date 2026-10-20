import type { RouteRecordRaw } from 'vue-router'

export const transactionsRoute: RouteRecordRaw = {
  path: '/transactions',
  name: 'Transactions',
  component: () => import('../../modules/transactions/views/TransactionIndex.vue'),
  meta: { title: '记账' },
}
