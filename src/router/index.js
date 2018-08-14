import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import NotFound from '@/components/NotFound'
import PageA from '@/components/PageA'
import PageB from '@/components/PageB'

Vue.use(Router)

export default new Router({
  mode: 'history', //  https://router.vuejs.org/guide/essentials/history-mode.html
  routes: [
    {
      path: '/',
      /* name: 'top', */
      component: Login
    },
    {
      path: '/Login',
      name: 'Login',
      query: { next: '' },
      component: Login
    },
    {
      path: '/PageA',
      name: 'PageA',
      query: { auth: '' },
      component: PageA
    },
    {
      path: '/PageB',
      name: 'PageB',
      query: { auth: '' },
      component: PageB
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})
