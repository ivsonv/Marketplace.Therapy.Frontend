export default [
  {
    path: '/controls/providers',
    name: 'registrations-providers-list',
    component: () => import('@/views/apps/controls/providers/index.vue'),
  },
  {
    path: '/controls/provider/:id',
    name: 'registrations-providers-save',
    component: () => import('@/views/apps/controls/providers/provider.vue'),
  },
  {
    path: '/controls/customers',
    name: 'constrols-customers-list',
    component: () => import('@/views/apps/controls/customers/index.vue'),
  },
  {
    path: '/controls/customer/:id',
    name: 'registrations-customers-save',
    component: () => import('@/views/apps/controls/customers/customer.vue'),
  }
]