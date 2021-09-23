export default [
  {
    path: '/sou-psicologo',
    name: 'auth-login-psicologo',
    component: () => import('@/views/pages/authentication/account/provider/Login.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
      notauthentication: true,
    },
  },
  {
    path: '/sou-psicologo-quero-me-cadastrar',
    name: 'auth-quero-cadastrar-psicologo',
    component: () => import('@/views/pages/authentication/account/provider/register.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: false,
      notauthentication: true,
    },
  },
  {
    path: '/account/appointments',
    name: 'account-appointments',
    component: () => import('@/views/apps/account/provider/index.vue'),
  },
  {
    path: '/account/details',
    name: 'account-details',
    component: () => import('@/views/apps/account/provider/details.vue'),
  },
  {
    path: '/account/schedules',
    name: 'account-schedules',
    component: () => import('@/views/apps/account/provider/schedules.vue'),
  },
  {
    path: '/account/reports',
    name: 'account-reports',
    component: () => import('@/views/apps/account/provider/reports.vue'),
  },
  {
    path: '/account/appointment/:id/invoice',
    name: 'sou-provider-agendamento-invoice',
    component: () => import('@/views/apps/account/provider/schedule-invoice.vue'),
  }]