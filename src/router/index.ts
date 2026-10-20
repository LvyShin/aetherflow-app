import { createRouter, createWebHistory } from 'vue-router'
import { reportsRoute } from './modules/reports'
import { settingsRoute } from './modules/settings'
import { transactionsRoute } from './modules/transactions'
import { vehicleRoute } from './modules/vehicle'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/transactions' },
    transactionsRoute,
    reportsRoute,
    vehicleRoute,
    settingsRoute,
    { path: '/:pathMatch(.*)*', redirect: '/transactions' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
