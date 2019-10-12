import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/form',
      name: 'form',
      // lazy-loaded when the route is visited.
      component: () => import('./views/Form.vue')
    },
    {
      path: '/view',
      name: 'view',
      component: () => import('./views/DataBrowser.vue')
    },
    { path: '/tools',
      name: 'tools',
      component: () => import('./views/Tools.vue')
    }
  ]
})
