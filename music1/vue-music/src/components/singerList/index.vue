<template>
  <scroll class="singer-list" ref="listView" @scroll="scroll" :listenScroll=true :probeType=3>
    <div>
      <div v-for="singer in list" :key="singer.key" ref="classify">
        <h4>{{singer.title}}</h4>
        <div class="singerList" v-for="item in singer.items" :key="item.key" @click="detail(item.id)">
          <img :src="item.img" alt="">
          <p>{{item.name}}</p>
        </div>
      </div> 
    </div>
    <!--右侧快速定位列表-->
      <div class="list-shortcut" @touchstart="touchstart" @touchmove="touchMove">
        <ul>
          <li class="item" v-for="(c,index) in touchList" :data-index="index" :key='c.key' :class="{current:currentIndex==index}">{{c}}</li>
        </ul>
      </div> 
    <div class="loading-container" v-show="isloading">
      <loading :title="loadingTitle"></loading>
    </div>
    <router-view/>
  </scroll>
</template>

<script>
import Scroll from '@/components/scroll';
import Loading from '@/components/loading';
import {myMixin} from '@/assets/js/mixin';

export default {
  mixins:[myMixin],
  props:{
    list:{
      type: Array,
      default:[]
    },
    isloading:{
      type:Boolean,
      default:true
    },
    loadingTitle:{
      type:String,
      default:""
    }
  },
  data(){
    return {
      //建立一个对象，储存第一次手指触摸的位置及index
      touch:{},
      currentIndex:0,
      listHeight:[],
      scrollY:0
    }
  },
  components:{
    Scroll,
    Loading
  },
  computed:{
    touchList(){
      let arr = []
      for(let i=0;i<this.list.length;i++){
        arr.push(this.list[i].title.substring(0,1))
      }
      return arr
    }
  },
  updated(){
    this.getClassifyHeight();  
  },
  methods:{
    watchPlayList(playList){
      if(playList.length > 0){
        // this.$refs.listView.$el.style.bottom = "60px"
        this.$refs.listView.refresh()
      }else{
        this.$refs.listView.$el.style.bottom = "0"
        this.$refs.listView.refresh()
      }
    },
    touchstart(ev){
      //获取手指点击的那个li的下标
      let cIndex = ev.target.attributes['data-index'].value
      //手指触摸时记录当前的index还有位置
      this.touch.index = cIndex
      this.touch.y1 = ev.touches[0].pageY
      this.scrollTo(cIndex)
    },
    touchMove(ev){
      //手指在滑动的时候也要记录滑动的位置
      this.touch.y2 = ev.touches[0].pageY
      //计算滑动的距离经过了几个li，向下取整
      let aIndex = (this.touch.y2 - this.touch.y1)/18 | 0
      let cIndex = aIndex + parseInt(this.touch.index)
      this.scrollTo(cIndex)
    },
    scrollTo(index){
      this.scrollY = -this.listHeight[index]
      //左边的scroll也跳转至点击的cIndex
      this.$refs.listView.scrollToElement(this.$refs.classify[index],0)
    },
    scroll(pos){
      this.scrollY = pos.y
    },
    //获取所有分类单独的高度
    getClassifyHeight(){
      const list = this.$refs.classify;
      let height = 0;
      this.listHeight.push(height)
      for(let i=0;i<list.length;i++){
        height += list[i].clientHeight;
        this.listHeight.push(height)
      }
    },
    detail(id){
      this.$router.push({path:`/singer/${id}`})
    }
  },
  watch:{
    scrollY(v){
      //顶端
      if(v>0){
        this.currentIndex = 0
        return
      }
      //中间
      for(let i=0;i<this.listHeight.length;i++){
        let h1 = this.listHeight[i]
        let h2 = this.listHeight[i+1]
        //v是负数
        if(-v>=h1 && -v<h2){
          this.currentIndex = i
          return
        }
      }
      //底端
      this.currentIndex = this.listHeight.length
    }
  }
}
</script>

<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
  .singer-list{
    height: 100%;
    overflow: hidden;
    margin-top: 5px;
    h4{
      width: 100%;
      background: @color-text-d;
      font-size: @font-size-medium;
      line-height: 30px;
      padding: 0 25px;
      margin-bottom: 10px;
      color:@color-text-l;
    }
    .singerList{
      padding: 10px 30px;
      display:flex;
      color:@color-text-l;
      img{
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      p{
        margin-left: 20px;
        display:flex;
        align-items:center;
        font-size: @font-size-medium-x;
      }
    }
    .letter{
      width: auto;
      position: fixed;
      top:90px;
      right:0;
      padding: 18px 3px;
      border-radius: 20px;
      font-size: @font-size-small;
      background: @color-background-d;
      li{
        padding-top:7px;
        text-align:center;
      }
    }
    .list-shortcut{
      position: absolute;
      z-index: 20;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: @color-background-d;
      font-family: Helvetica;
      .item{
        padding: 3px;
        line-height: 1;
        color: @color-text-l;
        font-size: @font-size-small;
        &.current{
          color: @color-theme;
        }
      }
    }
  }
</style>

