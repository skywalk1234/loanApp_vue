import { createRouter, createWebHistory } from 'vue-router'

// 页面组件
const Login = () => import('@/views/login.vue')
const Register = () => import('@/views/register.vue')
const MainLayout = () => import('@/layouts/MainLayout.vue')
const Home = () => import('@/views/Home.vue')
const Loan = () => import('@/views/Loan.vue')
const Message = () => import('@/views/Message.vue')
const Profile = () => import('@/views/Profile.vue')
const Repayment = () => import('@/views/Repayment.vue')
const LoanRecords = () => import('@/views/LoanRecords.vue')
const RepaymentRecords = () => import('@/views/RepaymentRecords.vue')
const RealNameAuth = () => import('@/views/RealNameAuth.vue')

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/loan-records',
    name: 'LoanRecords',
    component: LoanRecords,
    meta: { requiresAuth: true }
  },
  {
    path: '/repayment-records',
    name: 'RepaymentRecords',
    component: RepaymentRecords,
    meta: { requiresAuth: true }
  },
  {
    path: '/repayment',
    name: 'Repayment',
    component: Repayment,
    meta: { requiresAuth: true }
  },
  {
    path: '/real-name-auth',
    name: 'RealNameAuth',
    component: RealNameAuth,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home,
        meta: { title: '首页' }
      },
      {
        path: 'loan',
        name: 'Loan',
        component: Loan,
        meta: { title: '贷款' }
      },
      {
        path: 'message',
        name: 'Message',
        component: Message,
        meta: { title: '消息' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: { title: '个人' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('accessToken')
  
  if (to.path === '/login' || to.path === '/register') {
    next()
  } else if (!isAuthenticated && to.path !== '/login' && to.path !== '/register') {
    next('/login')
  } else {
    next()
  }
})

export default router