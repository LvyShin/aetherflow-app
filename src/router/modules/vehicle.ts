import type { RouteRecordRaw } from 'vue-router'

export const vehicleRoute: RouteRecordRaw = {
  path: '/vehicle',
  name: 'Vehicle',
  component: () => import('../../modules/vehicle/views/VehicleIndex.vue'),
  meta: { title: '车主模式' },
}
