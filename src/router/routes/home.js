export default [{
    path: '/',
    name: 'home-view',
    component: () => import('@/views/pages/home/index.vue'),
    meta: {
        layout: 'full',
        redirectIfLoggedIn: false,
        notauthentication: true,
    },
},
{
    path: '/pesquisa',
    name: 'merchants-view',
    component: () => import('@/views/pages/home/merchants-list/index.vue'),
    meta: {
        layout: 'full',
        redirectIfLoggedIn: false,
        notauthentication: true,
    },
},
{
    path: '/psicologos/:link?',
    name: 'merchants-details',
    component: () => import('@/views/pages/home/merchants-details/index.vue'),
    meta: {
        layout: 'full',
        redirectIfLoggedIn: false,
        notauthentication: true,
    },
},
{
    path: '/checkout',
    name: 'checkout-details',
    component: () => import('@/views/pages/home/merchant-checkout/index.vue'),
    meta: {
        layout: 'full',
        redirectIfLoggedIn: false,
        notauthentication: true,
    },
},
{
    path: '/payment/:code?',
    name: 'merchants-payment-return',
    component: () => import('@/views/pages/home/merchant-checkout/payment-return.vue'),
    meta: {
        layout: 'full',
        redirectIfLoggedIn: false,
        notauthentication: true,
    },
},
{
    path: '/precisa-de-ajuda',
    name: 'need-for-help',
    component: () => import('@/views/pages/faq/Faq.vue'),
    meta: {
        layout: 'full',
        redirectIfLoggedIn: false,
        notauthentication: true,
    },
}]