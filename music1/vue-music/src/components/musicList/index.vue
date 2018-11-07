<template>
  <div class="music-list">
    <!-- 返回上一层 -->
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <!-- 歌曲信息 -->
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" ref="bgImage" :style="bgImg">
      <div class="play-wrapper">
        <div class="play" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <!-- 互动辅助层 -->
    <div class="bg-layer" ref="layer"></div>
    <!-- 歌曲列表 -->
    <scroll ref="scroll" class="list" @scroll="scroll" :listenScroll=true :probeType=3>
      <div class="song-list-wrapper">
        <div class="song-list" ref="songList"> 
          <ul>
            <li class="item" v-for="(song,index) in songList" :key="song.key" @click="addPlayerList(song,index)">
              <div class="rank">
                <span class="text">{{index + 1}}</span>
              </div>
              <div class="content">
                <h2 class="name">{{song.songname}}</h2>
                <p class="desc"><span v-for="singer in song.singer" :key="singer.key">{{singer.name}} </span>▪ <span>{{song.albumname}}</span></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <!-- loading加载 -->
    <div class="loading-container" v-show="isloading">
      <loading :title="loadingTitle"></loading>
    </div>
  </div>
</template>

<script>
import Scroll from '@/components/scroll';
import Loading from '@/components/loading';
import {mapActions} from 'vuex';
import {myMixin} from '@/assets/js/mixin';

export default {
  mixins:[myMixin],
  props:{
    title:{
      type:String,
      default:""
    },
    bgUrl:{
      type:String,
      default:""
    },
    songList:{
      type:Array,
      default:[]
    }
  },
  data(){
    return {
      scrollY,
      isloading:true,
      loadingTitle:"正在努力加载中..."
    }
  },
  updated(){
    this.isloading = false
  },
  methods:{
    watchPlayList(playList){
      if(playList.length > 0){
        this.$refs.scroll.$el.style.bottom = "0"
        this.$refs.scroll.refresh()
      }else{
        this.$refs.scroll.$el.style.bottom = "60px"
        this.$refs.scroll.refresh()
      }
    },
    //回退到上一页
    back(){
      this.$router.back()
    },
    //better-scroll事件
    scroll(pos){
      this.scrollY = pos.y
    },
    addPlayerList(song,index){
      this.addPlayer({
        list:this.songList,
        index:index
      })
    },
    ...mapActions([
      'addPlayer'
    ])
  },
  
  mounted(){
    //获取背景图片的高度，并将滚动区域的top设置为背景图层的高度
    this.beHeight = this.$refs.bgImage.clientHeight
    this.$refs.scroll.$el.style.top = `${this.beHeight}px`
    this.ty = - this.beHeight + 44
  },
  created(){
    
  },
  computed:{
    bgImg(){
      return `background-image:url(${this.bgUrl})`
    }
  },
  components:{
    Scroll,
    Loading
  },
  watch:{
    scrollY(v){
      let translateY = Math.max(this.ty,v)
      let zIndex = 0
      let scale = 1
      const p = Math.abs(v/this.beHeight);
      if(v>0){
        scale = 1 + p 
        zIndex = 10
      }
      this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`
      if(v<this.ty){
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = "44px"
        this.$refs.playBtn.style.display = "none"
      }else{
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = "block"
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style.transform = `scale(${scale})`
    }
  }
}
</script>

<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');

  .music-list{
    width: 100%;
    height: 100%;
    background: @color-background;
    position: fixed;
    top:0;
    z-index: 30;
    .back{
      position: absolute;
      top:15px;
      left: 20px;
      font-size: @font-size-large;
      color:@color-theme;
      z-index: 50;
    }
    .title{
      position: absolute;
      top:15px;
      width: 100%;
      text-align: center;
      font-size: @font-size-large;
      color:@color-text;
      z-index: 20;
    }
    .bg-image{
      width: 100%;
      height: 0;
      position: relative;
      padding-top: 70%;
      transform: top;
      background-size: cover;
      .play-wrapper{
        position: absolute;
        bottom:20px;
        z-index:50;
        width: 100%;
        .play{
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border:1px solid @color-theme;
          color:@color-theme;
          border-radius: 20px;
          .icon-play{
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
            font-size: @font-size-small;
          }
          .text{
            display: inline-block;
            vertical-align: middle;
            font-size: @font-size-small;
          }
        }
        .filter{
          position: absolute;
          top:0;
          left:0;
          width: 100%;
          height: 100%;
          background: @color-background-d;
        }
      }
    }
    .bg-layer{
      position: relative;
      height: 100%;
      background: @color-background;
    }
    .list{
      width: 100%;
      background: @color-background;
      transition: all 0.5s;
      position: fixed;
      top:0;
      bottom: 0;
      .song-list-wrapper{
        .song-list{
          ul{
            li{
              display: flex;
              padding: 10px 0;
              align-items: center;
              .rank{
                flex-shrink: 0;
                font-size: @font-size-large-x;
                color:@color-theme;
                width: 60px;
                text-align: center;              
              }
              .content{
                line-height: 25px;
                overflow: hidden;
                padding-right: 20px;
                .name{
                  font-size: @font-size-medium-x;
                  color: @color-text ;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                }
                .desc{
                  font-size: @font-size-medium;
                  color: @color-text-l;
                  overflow: hidden;
                  &:last-child{
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                  }
                }
              }
            }
          }
        }
      }
    }
    .loading-container{
      position: absolute;
      width: 100%;
      top:50%;
      transform: translateY(-50%);
      height: 101%;
      z-index: 500;
      background: @color-background;
    }
  }
</style>

