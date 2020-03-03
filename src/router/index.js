import Vue from 'vue'
import VueRouter from 'vue-router'
const VuexDemo = () => import('@/views/VuexDemo')
const Playing = () => import('@/views/playing/Playing')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Playing',
    component: Playing
  },
  {
    path: '/VuexDemo',
    name: 'VuexDemo',
    component: VuexDemo
  },
]

const router = new VueRouter({
  routes
})

export default router