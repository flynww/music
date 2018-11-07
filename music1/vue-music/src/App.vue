<template>
  <div id="app">
    <!-- 头部公共组件 -->
    <music-header></music-header>
    <!-- 导航公共组件 -->
    <music-nav></music-nav>
    <!-- 路由页面 -->
    <router-view/>
    <!-- 播放歌曲组件 -->
    <player></player>
  </div>
</template>

<script>
  import MusicHeader from "@/components/musicHeader";
  import MusicNav from "@/components/musicNav";
  import Player from "@/components/player";
  export default {
    name: 'App',
    // data(){},
    components:{
      MusicHeader,
      MusicNav,
      Player
    }

  }
</script>

<style lang="less">
  @import '~@/assets/less/index.less';
</style>

