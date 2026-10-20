import { createRouter, createWebHistory } from 'vue-router'
import { billImportRoute } from './modules/bill_import'
import { reportsRoute } from './modules/reports'
import { settingsRoute } from './modules/settings'
import { transactionSearchRoute, transactionsRoute } from './modules/transactions'
import { vehicleRoute } from './modules/vehicle'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/transactions' },
    transactionsRoute,
    transactionSearchRoute,
    reportsRoute,
    vehicleRoute,
    settingsRoute,
    billImportRoute,
    { path: '/:pathMatch(.*)*', redirect: '/transactions' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
