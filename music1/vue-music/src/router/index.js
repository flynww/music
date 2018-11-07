import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/views/recommend'
import RecommendDetail from '@/views/recommend/details'
import Singer from '@/views/singer'
import SingerDetails from '@/views/singer/singerDetails'
import Rank from '@/views/rank'
import RankDetails from '@/views/rank/rankDetails'
import Search from '@/views/search'

Vue.use(Router)

export default new Router({
  routes: [
    { //重定向
      path: '/',
      redirect: '/recommend',
    },
    {
      path: '/recommend',
      component: Recommend,
      children:[
        {
          path:'/recommend/:id',
          component:RecommendDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children:[
        {
          path:'/singer/:id',
          component:SingerDetails
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children:[
        {
          path:'/rank/:id',
          component:RankDetails
        }
      ]
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
