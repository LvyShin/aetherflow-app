import type { RouteRecordRaw } from 'vue-router'

export const transactionsRoute: RouteRecordRaw = {
  path: '/transactions',
  name: 'Transactions',
  component: () => import('../../modules/transactions/views/TransactionIndex.vue'),
  meta: { title: '记账' },
}

export const transactionSearchRoute: RouteRecordRaw = {
  path: '/transactions/search',
  name: 'TransactionSearch',
  component: () => import('../../modules/transactions/views/TransactionSearchView.vue'),
  meta: {
    title: '搜索记账',
    showBack: true,
    backTo: '/transactions',
    backLabel: '记账',
  },
}
