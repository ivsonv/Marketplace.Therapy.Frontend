export default [{
    path: '/',
    name: 'home-view',
    component: () => import('@/views/pages/home/index.vue'),
    meta: {
        layout: 'full',
        redirectIfLoggedIn: false,
        notauthentication: true,
    },
}]