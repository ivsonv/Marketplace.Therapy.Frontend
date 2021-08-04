export default [
    {
        path: '/softphone/login/:clientid?',
        name: 'auth-softphone-login',
        component: () => import('@/views/pages/authentication/softphone/Login.vue'),
        meta: {
            layout: 'full',
            resource: 'Auth',
            redirectIfLoggedIn: false,
            notauthentication: true,
        },
    },
    {
        path: '/softphone',
        name: 'softphone-view',
        component: () => import('@/views/apps/softphone/index.vue'),
        meta: {
            layout: 'full',
        },
    }]