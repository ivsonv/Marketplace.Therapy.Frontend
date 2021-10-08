import Vue from 'vue'
import VueRouter from 'vue-router'

// Routes
import registrations from './routes/registrations'
import authetication from './routes/authetication'
import defaults from './routes/defaults'
import home from './routes/home'
import providers from './routes/providers'
import customers from './routes/customer'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    { path: '/', redirect: { name: 'home-view' } },
    ...home,
    ...registrations,
    ...authetication,
    ...defaults,
    ...providers,
    ...customers,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach((to, _, next) => {
  if (to.meta && !to.meta.notauthentication) {
    if (!localStorage.getItem("userData")) {
      return next({ name: "auth-login" });
    }
  }
  return next();
})

router.afterEach(() => {
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})
export default router