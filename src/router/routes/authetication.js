export default [{
  path: '/login-operador',
  name: 'auth-login',
  component: () => import('@/views/pages/authentication/Login.vue'),
  meta: {
    layout: 'full',
    resource: 'Auth',
    redirectIfLoggedIn: true,
    notauthentication: true,
  },
},
{
  path: '/login/redirect/:redirect',
  name: 'auth-login-redirect',
  component: () => import('@/views/pages/authentication/Login.vue'),
  meta: {
    layout: 'full',
    resource: 'Auth',
    redirectIfLoggedIn: true,
    notauthentication: true,
  },
}]
