<template>
  <div class="music-nav">
      <router-link  to="/recommend"><span >推荐</span></router-link>
      <router-link   to="/singer"><span >歌手</span></router-link>
      <router-link  to="/rank"><span >排行</span></router-link>
      <router-link  to="/search"><span >搜索</span></router-link>
    </div>
</template>

<script>
export default {
  name: 'MusicNav',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
  .music-nav{
    display:flex;
    a{
      color:@color-text-ll;
      flex-grow:1;
      padding:5px;
      padding-top: 13px;
      margin-bottom:10px;
      text-align:center;
      text-decoration:none;
      &.router-link-active span{
        color:@color-theme;
        padding-bottom:5px;
        border-bottom:2px solid @color-theme;
      }
    }
  }

</style>

