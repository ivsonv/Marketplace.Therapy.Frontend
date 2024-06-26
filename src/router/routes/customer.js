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
    path: '/sou-paciente/minha-conta',
    name: 'account-customer-details',
    component: () => import('@/views/apps/account/customer/details.vue'),
  },
  {
    path: '/sou-paciente/agendamentos',
    name: 'sou-paciente-appointments',
    component: () => import('@/views/apps/account/customer/index.vue'),
  },
  {
    path: '/sou-paciente/agendamento/:id/finalizado',
    name: 'sou-paciente-appointments-finish',
    component: () => import('@/views/apps/account/customer/appointment-assessment.vue'),
  },
  {
    path: '/sou-paciente/agendamento/:id/recibo',
    name: 'sou-paciente-agendamento-invoice',
    component: () => import('@/views/apps/account/customer/appointment-invoice.vue'),
  },
  {
    path: '/sou-paciente/agendamento/:id/:paciente/video',
    name: 'sou-paciente-agendamento-video',
    component: () => import('@/views/apps/account/video/index.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: false,
      notauthentication: true,
    }
  },
  {
    path: '/sou-paciente/esqueci-minha-senha',
    name: 'sou-paciente-esqueci-minha-senha',
    component: () => import('@/views/pages/authentication/account/customer/ForgotPassword.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: false,
      notauthentication: true,
    },
  }
]