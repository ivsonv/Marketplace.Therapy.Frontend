export default [
  {
    path: '/registrations/group-permissions',
    name: 'registrations-group-list',
    component: () => import('@/views/apps/registrations/group-permissions/index.vue'),
  },
  {
    path: '/registrations/group-permission/:id',
    name: 'registrations-group-save',
    component: () => import('@/views/apps/registrations/group-permissions/group-permissions.vue'),
  },
  {
    path: '/registrations/users',
    name: 'registrations-users-list',
    component: () => import('@/views/apps/registrations/users/index.vue'),
  },
  {
    path: '/registrations/user/:id',
    name: 'registrations-users-save',
    component: () => import('@/views/apps/registrations/users/user.vue'),
  },
  {
    path: '/registrations/topics',
    name: 'registrations-topics-list',
    component: () => import('@/views/apps/registrations/topics/index.vue'),
  },
  {
    path: '/registrations/topic/:id',
    name: 'registrations-topic-salvar',
    component: () => import('@/views/apps/registrations/topics/topic.vue'),
  },
  {
    path: '/registrations/banks',
    name: 'registrations-banks-list',
    component: () => import('@/views/apps/registrations/banks/index.vue'),
  },
  {
    path: '/registrations/bank/:id',
    name: 'registrations-banks-salvar',
    component: () => import('@/views/apps/registrations/banks/bank.vue'),
  },
  {
    path: '/registrations/faq',
    name: 'registrations-faq-list',
    component: () => import('@/views/apps/registrations/Faq/index.vue'),
  },
  {
    path: '/registrations/faq/:id',
    name: 'registrations-faq-save',
    component: () => import('@/views/apps/registrations/Faq/faq.vue'),
  },
  {
    path: '/registrations/banners',
    name: 'registrations-banner-list',
    component: () => import('@/views/apps/registrations/Banners/index.vue'),
  },
  {
    path: '/registrations/banner/:id',
    name: 'registrations-banner-save',
    component: () => import('@/views/apps/registrations/Banners/banner.vue'),
  }]