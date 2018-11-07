<template>
  <div class="player" v-show="playList.length > 0">
    <!-- 播放页面全屏 -->
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <!-- 背景模糊 -->
        <div class="background">
          <img :src="currentSong.img" alt="">
        </div>
        <!-- 顶部 -->
        <div class='top'>
          <div class="back" @click="toggleFullScreen">
            <i class="icon-back"></i>
          </div>
          <h4 class="title">{{currentSong.songname}}</h4>
          <p class="subtitle"><span v-for="singer in currentSong.singer" :key="singer.key">{{singer.name}} </span>▪ <span>{{currentSong.albumname}}</span></p>
        </div>
        <!-- 中间cd部分 -->
        <div class="middle swiper-container">
          <div class="swiper-wrapper">
            <div class="middle-l swiper-slide" ref="middleL">
              <div class="cd-wrapper" ref="cdWrapper">
                <div class="cd" :class="cdState">
                  <img class="image" :src="currentSong.img" alt="">
                </div>
              </div>
              <!-- 一条歌词滚动 -->
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{currentLyc}}</div>
              </div>
            </div>
            <!-- 歌词滚动 -->
            <scroll class="middle-r swiper-slide" ref="lyriclist" :listenScroll=true :probeType=3>
              <div class="lyric-wrapper">
                <div>
                  <p class="text" ref="lyricLine" v-for="(item,index) in lyric.lines" :key="item.key" :class="{current:currentLine == index}">{{item.txt}}</p>
                </div>
              </div>
            </scroll>
          </div>
        </div>
        <!-- 底部播放按键 -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
          </div>
          <div class="porgress-wrapper">
            <span class="time time-l">{{playTime}}</span>
            <!-- 播放进度条 -->
            <div class="porgress-bar-wrapper">
              <progressBar :percent="percent" @percentChenge="ChengePorgressTime"></progressBar>
            </div>
            <span class="time time-r">{{songTime}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="getMode" @click="modeChange"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <i :class="btnState" @click="togglePlay"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>  
    
    <!-- 播放页面小屏 -->
    <transition name="mini">
      <div class="mini-player" v-if="!fullScreen" @click="toggleFullScreen">
        <div class="icon">
          <img :src="currentSong.img" width="40" height="40" alt="" :class="cdState">
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.songname}}</h2>
          <p class="desc"><span v-for="singer in currentSong.singer" :key="singer.key">{{singer.name}} </span>▪ <span>{{currentSong.albumname}}</span></p>
        </div>
        <div class="control">
          <i :class="btnMiniState" @click.stop="togglePlay"></i>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop="openList"></i>
        </div>
      </div>
    </transition>
    <!-- 引入h5播放器 -->
    <audio :src="currentSong.url" ref="audio" @canplay="changePlayState" @error="changePlayState" @timeupdate="updateTime" @ended="ended"></audio>
    <play-list v-if="isOpenList" @changeShow="closeList"></play-list>
  </div>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from "vuex"
import ProgressBar from '@/components/progressBar'
import {getLyric} from '@/api'
import Scroll from '@/components/scroll'
import Loading from '@/components/loading'
import PlayList from '@/components/playList'
import {Base64} from 'js-base64'
import Lyric from 'lyric-parser'
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';

export default {
  name:"Player",
  data(){
    return{
      //播放器播放的链接加载状态
      playState:false,
      //当前播放时间
      currentTime:0,
      //歌词
      lyric:{},
      //播放第几条歌词
      currentLyc:"",
      //当前播放的是第几行
      currentLine:0,
      //是否打开播放列表
      isOpenList:false
    }
  },
  mounted(){
    this.$nextTick(() => {
      var banner = new Swiper('.middle', {
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        // 如果需要分页器
        pagination: {
          el: '.dot-wrapper',
          bulletClass:"dot",
          bulletActiveClass:"active"
        }
      })
    })
  },
  computed:{
    //根据播放状态来判断cd是否旋转
    cdState(){
      return this.playing ? 'play' : 'pause'
    },
    //根据播放状态来判断播放按钮显示
    btnState(){
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    //根据播放状态来判断小屏播放按钮显示
    btnMiniState(){
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    //计算歌曲总时长
    songTime(){
      let m = this.currentSong.interval / 60 | 0
      let s = this.currentSong.interval % 60 | 0
      if(s<10){
        s = "0" + s
      }
      return `${m}:${s}`
    },
    //计算播放时间
    playTime(){
      let m = this.currentTime / 60 | 0
      let s = this.currentTime % 60 | 0
      if(s<10){
        s = "0" + s
      }
      return `${m}:${s}`
    },
    //计算播放时长和总时长的百分比
    percent(){
      return this.currentTime/this.currentSong.interval
    },
    //判断播放模式
    getMode(){
      switch(this.mode){
        case 0 :
          return "icon-sequence"
          break;
        case 1 :
          return "icon-random"
          break;
        case 2 :
          return "icon-loop"
          break;
      }
    },
    ...mapGetters([
      'playing',
      'fullScreen',
      'currentIndex',
      'currentSong',
      'playList',
      'mode',
      'newPlayList'
    ])
  },
  methods:{
    //更改全屏状态
    toggleFullScreen(){
      this.changeFullScreen(!this.fullScreen)
    },
    //更改播放状态
    togglePlay(){
      this.changePlaying(!this.playing)
      //歌词
      this.lyric.togglePlay()
    },
    //上一曲
    prev(){
      //当播放准备状态为false时
      if(!this.playState){
        return
      }
      let index = this.currentIndex- 1
      if(index == -1){
        index = this.playList.length - 1
      }
      this.changeCurrentIndex(index)
      this.playState = false
      if(!this.playing){
        this.togglePlay()
      }
    },
    //下一曲
    next(){
      //当播放准备状态为false时
      if(!this.playState){
        return
      }
      let index = this.currentIndex + 1
      if(index == this.playList.length){
        index = 0
      }
      this.changeCurrentIndex(index)
      this.playState = false
      if(!this.playing){
        this.togglePlay()
      }
    },
    //更改播放器是否加载完成
    changePlayState(){
      this.playState = true
    },
    //当播放器是否加载完成获取当前播放时间
    updateTime(ev){
      this.currentTime = ev.target.currentTime
    },
    //根据子组件传回来的百分比计算当前需要播放的歌曲时间
    ChengePorgressTime(v){
      let t = this.currentSong.interval * v;
      this.$refs.audio.currentTime = t
      //播放轴拖到哪歌词显示
      this.lyric.seek(t * 1000)
      if(!this.playing){
        this.lyric.stop()
      }
    },
    //获取歌词
    getLyc(){
      getLyric(this.currentSong.id).then((res) => {
        this.lyric = new Lyric(Base64.decode(res.lyric),this.hanlder)
        if(this.playing){
          this.lyric.play()
        }
      }).catch(() => {
        this.lyric = {}
        this.currentLine = 0
        this.currentLyc = ''
      })
    },
    hanlder({lineNum,txt}){
      this.currentLyc = txt
      this.currentLine = lineNum
      if(lineNum > 5){
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyriclist.scrollToElement(lineEl,300)
      }else{
        this.$refs.lyriclist.scrollTo(0,0,300)
      }
    },
    //改变播放模式
    modeChange(){
      let mode = (this.mode + 1) % 3
      this.changeMode(mode)
      //根据mode改变PlayLis的值
      this.newPlayList()
    },
    //播放完成后
    ended(){
      this.mode == 0 ? this.next() : this.mode == 1 ? this.next() : this.loop()
    },
    //单曲循环
    loop(){
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.lyric.seek(0)
    },
    //打开播放列表
    openList(){
      this.isOpenList = true
    },
    closeList(val){
      this.isOpenList = val
    },
    ...mapMutations([
      'changePlaying',
      'changeFullScreen',
      'changeCurrentIndex',
      'changeMode'
    ]),
    ...mapActions(['newPlayList'])
  },  
  watch:{
    //监听currentSong的状态，控制播放的歌曲
    currentSong(newSong,oldSong){
      
      //当歌曲没有变化时不执行（用于模式切换）
      if(newSong.id === oldSong.id){
        return
      }
      //切换歌曲是，清空lyric-parser对象
      // if(this.lyric){
      //   this.lyric.stop()
      // }
      console.log(this.lyric)
      this.$nextTick(() => {
        this.getLyc()
        this.$refs.audio.play()
      })
      
      console.log(newSong)
      console.log(oldSong)
    },
    //监听playing的状态，控制播放器的播放
    playing(val){
      this.$nextTick(() => {
        val ? this.$refs.audio.play() : this.$refs.audio.pause()
      })
    }
  },
  components:{
    ProgressBar,
    Loading,
    Scroll,
    PlayList
  }
}
</script>

<style lang="less">
  @import url('~@/assets/less/variable.less');
  .player{
    .normal-player{
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: @color-background; 
      .background{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
        img{
          width: 100%;
          height: 100%;
        }
      }  
      .top{
        position: relative;
        margin-bottom: 25px;
        .back{
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          .icon-back{
            display: block;
            padding: 6px;
            font-size: @font-size-large;
            color:@color-theme;
            transform: rotate(-90deg);
          }
        }
        .title{
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          font-size: @font-size-large;
          color:@color-text;
        }
        .subtitle{
          line-height: 20px;
          text-align: center;
          font-size: @font-size-medium;
          color:@color-text;
        }
      }
      .middle{
        position: fixed;
        width: 100%;
        top:80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l{
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top:80%;
          .cd-wrapper{
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            .cd{
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid @color-text-d;
              border-radius: 50%;
              &.play{
                animation:rotate 20s linear infinite;
              }
              &.pause{
                animation-play-state:paused;
              }
              .image{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          } 
          .playing-lyric-wrapper{
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric{
              height: 20px;
              line-height: 20px;
              font-size: @font-size-medium;
              color: @color-text-l;
            }
          }
        }
        .middle-r{
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper{
            width: 80%;
            margin:0 auto;
            overflow: hidden;
            text-align: center;
            .text{
              line-height:32px;
              font-size: @font-size-medium;
              color: @color-text-l;
              &.current{
                color: @color-text;
              }
            }
          }
        }
      }
      .bottom{
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper{
          text-align: center;
          font-size: 0;
          .dot{
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: @color-text-l;
            &.active{
              width: 20px;
              border-radius: 5px;
              background: @color-text-ll;
            }
          }
        }
        .porgress-wrapper{
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0 auto;
          padding: 10px 0;
          .time{
            color: @color-text;
            font-size: @font-size-small;
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;
            &.time-l{
              text-align: left;
            }
            &.time-r{
              text-align: right;
            }
          }
          .porgress-bar-wrapper{
            flex: 1;
          }
        }
        .operators{
          display: flex;
          align-items: center;
          .icon{
            flex: 1;
            color: @color-theme;
            &.disable{
              color: @color-theme-d;
            }
            i{
              font-size: 30px;
            }
          }
          .i-left{
            text-align: right;
          }
          .i-center{
            padding: 0 20px;
            text-align: center;
            i{
              font-size: 40px;
            }
          }
          .i-right{
            text-align: left;
          }
          .icon-favorite{
            color: @color-sub-theme;
          }
        }
      }
      &.normal-enter-active,&.normal-leave-active{
        transition: all 0.4s;
        .top,.bottom{
          transition: all 0.4s cubic-bezier(0.86,0.18,0.82,1.32);
        }
      }
      &.normal-enter,&.normal-leave-to{
        opacity: 0;
        .top{
          transform: translate3d(0,-100px,0);
        }
        .bottom{
          transform: translate3d(0,100px,0);
        }
      }
    }
    .mini-player{
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: @color-highlight-background;
      &.mini-enter-active,&mini--leave-active{
        transition: all 0.4s;
      }
      &.mini-enter,&.mini-leave-to{
        opacity: 0;
      }
      .icon{
        flex:0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;
        img{
          border-radius: 50%;
          &.play{
            animation:rotate 20s linear infinite;
          }
          &.pause{
            animation-play-state:paused;
          }
        }
      }
      .text{
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name{
          margin-bottom: 2px;
          font-size: @font-size-medium;
          color:@color-text;
        }
        .desc{
          font-size: @font-size-small;
          color: @color-text-d;
        }
      }
      .control{
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-play-mini,.icon-pause-mini,.icon-playlist{
          font-size: 30px;
          color: @color-theme-d;
        }
        .icon-mini{
          font-size: 32px;
          position: absolute;
          left: 0;
          top: 0;
        }
      }

    }
  }
  @keyframes rotate{
    0%{
      transform: rotate(0);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>

