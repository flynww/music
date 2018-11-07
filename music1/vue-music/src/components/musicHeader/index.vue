<template>
  <div class="music-header">
    <div class="icoImg"><img src="~@/assets/image/logo.png" alt=""></div>
    <h3>Water Music</h3>
    <span class="music-icon icon-mine"></span>
  </div>
</template>

<script>
export default {
  name: 'MusicHeader',

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
  .music-header{
    display:flex;
    align-items:center;
    color:@color-theme;
    padding:8px;
    .icoImg{
      flex-grow:1;
      img{
        height:30px;
        width:30px;
        float:right;
        margin-right:5px;
        border-radius:50%;
      }
    }
    h3{
      flex-grow:1;
      font-size: @font-size-large;
      margin-left: 10px;
    }
    span{
      font-size:@font-size-large;
      font-weight:700;
      margin-right: 10px;
    }
  }

</style>

