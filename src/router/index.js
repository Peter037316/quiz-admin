import Vue from 'vue'
import VueRouter from 'vue-router'
import { isLoggedIn } from '@/api'
import Layout from '@/layout/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '数据概览' }
      },
      {
        path: 'questions',
        name: 'Questions',
        component: () => import('@/views/question/index.vue'),
        meta: { title: '题目管理' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'records',
        name: 'Records',
        component: () => import('@/views/record/index.vue'),
        meta: { title: '考试记录' }
      }
    ]
  },
  { path: '*', redirect: '/dashboard' }
]

const router = new VueRouter({
  // hash 模式: 部署到 Vercel 静态托管时无需额外的 rewrite 配置
  mode: 'hash',
  routes
})

// 全局前置守卫: 未登录一律回到登录页
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Quiz 后台管理` : 'Quiz 后台管理系统'
  if (to.path === '/login') {
    next()
    return
  }
  if (!isLoggedIn()) {
    next('/login')
    return
  }
  next()
})

export default router
