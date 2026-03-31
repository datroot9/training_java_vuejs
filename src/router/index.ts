import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import ScreenList from '@/components/ScreenList.vue'
import ScreenRegisterUpdate from '@/components/ScreenRegisterUpdate.vue'

const router = createRouter({
  // Sử dụng HTML5 history mode để url sạch đẹp không có dấu #
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login' // Tự động lái về login khi mới vào web
    },
    {
      path: '/login',
      name: 'login',
      component: LoginForm
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterForm
    },
    {
      path: '/screens',
      name: 'screens',
      component: ScreenList
    },
    {
      // Utilizing an optional parameter (?) so this single route massively securely supports both Create (empty) and Update (ID provided) logic chains!
      path: '/student/setup/:id?',
      name: 'student-setup',
      component: ScreenRegisterUpdate
    }
  ]
})

import { AUTH_USER_KEY } from '@/utils/constants'

// Configure Global Route Guards to securely handle authenticated session redirects
router.beforeEach((to, from, next) => {
  // Check if our user token exists dynamically in browser memory
  const isLoggedIn = !!localStorage.getItem(AUTH_USER_KEY);

  if (isLoggedIn && (to.path === '/login' || to.path === '/register' || to.path === '/')) {
    // Prevent authenticated users from visiting the login or register pages natively
    next('/screens');
  } else if (!isLoggedIn && (to.path === '/screens' || to.name === 'student-setup')) {
    // Block unauthenticated guests from bypassing the login page directly into the dashboard!
    next('/login');
  } else {
    // Safely execute all other normal paths
    next();
  }
});

export default router
