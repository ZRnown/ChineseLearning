import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/classics/:id',
      name: 'classic-detail',
      component: () => import('../views/ClassicDetail.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login');
  } else if ((to.path === '/login' || to.path === '/register') && userStore.isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router; 