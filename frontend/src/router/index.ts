import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthForm from '../views/AuthForm.vue'
import Account from '../views/Account.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/:id/diary',
      name: 'home',
      component: HomeView,
      props: true,
    },
    {
      path: '/login',
      name: 'login',
      component: AuthForm,
    },
    {
      path: '/:id/profile',
      name: 'profile',
      component: Account,
      props: true,
    },
  ],
})

export default router
