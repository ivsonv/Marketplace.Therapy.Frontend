export default [
  {
    path: '/sou-paciente',
    name: 'auth-login-paciente',
    component: () => import('@/views/pages/authentication/account/customer/Login.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
      notauthentication: true,
    },
  },
  {
    path: '/sou-paciente-quero-me-cadastrar',
    name: 'auth-quero-cadastrar-paciente',
    component: () => import('@/views/pages/authentication/account/customer/register.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: false,
      notauthentication: true,
    },
  },
  {
    path: '/sou-paciente/agendamentos',
    name: 'sou-paciente-appointments',
    component: () => import('@/views/apps/account/customer/index.vue'),
  },
  {
    path: '/sou-paciente/agendamento/:id/recibo',
    name: 'sou-paciente-agendamento-invoice',
    component: () => import('@/views/apps/account/customer/appointment-invoice.vue'),
  }
]