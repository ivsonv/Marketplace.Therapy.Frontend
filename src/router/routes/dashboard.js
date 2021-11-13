export default [
  {
    path: '/dashboard/overview',
    name: 'dashboard-overview-list',
    component: () => import('@/views/apps/dashboard/overview/index.vue'),
  },
  {
    path: '/dashboard/sales/list',
    name: 'dashboard-sales-list',
    component: () => import('@/views/apps/dashboard/sales/index.vue'),
  },
  {
    path: '/dashboard/sales/:id',
    name: 'dashboard-sales-details',
    component: () => import('@/views/apps/dashboard/sales/sale-details.vue')
  },
  {
    path: '/dashboard/sales/:id/invoice',
    name: 'dashboard-sales-invoice',
    component: () => import('@/views/apps/dashboard/sales/sale-invoice.vue')
  }]