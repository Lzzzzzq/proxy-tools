import Vue from 'vue'
import Router from 'vue-router'

import changeHosts from '@/components/change-hosts'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/'
    }, {
      path: '/changeHosts',
      component: changeHosts
    }
  ]
})
