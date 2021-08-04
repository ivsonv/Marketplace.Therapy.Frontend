export default [
  {
    path: '/forgot/:token',
    name: 'auth-forgot-password-token',
    component: () => import('@/views/pages/authentication/ForgotPassword.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      notauthentication: true,
    },
  },
  {
    path: '/forgot',
    name: 'auth-forgot-password',
    component: () => import('@/views/pages/authentication/ForgotPassword.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      notauthentication: true,
    },
  }]
