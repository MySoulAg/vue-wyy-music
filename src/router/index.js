import Vue from 'vue'
import VueRouter from 'vue-router'
const VuexDemo = () => import('@/views/VuexDemo')

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    name: 'VuexDemo',
    component: VuexDemo
  }
]

const router = new VueRouter({
  routes
})

export default router