<template>
  <div class="loading">
    <img src="./loading.gif" alt="">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  name:"loading",
  props:{
    title:{
      type: String,
      default:"loading..."
    }
  }
}
</script>

<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
  .loading{
    width: 100%;
    text-align: center;
    margin-top: 40%;
    img{
      width: 30px;
      height: 30px;
    }
    .desc{
      line-height: 10px;
      font-size: @font-size-small;
      color: @color-text-l;
    }
  }
</style>



