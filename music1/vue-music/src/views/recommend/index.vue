<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll">
      <div>
        <div class="carousel swiper-container">
          <ul class="swiper-wrapper">
            <li v-for="imgImg in slide" :key="imgImg.key" class="swiper-slide">
              <a :href="imgImg.linkUrl"><img :src="imgImg.picUrl" class="img"/></a>
            </li>
          </ul>
          <div class="swiper-pagination slideshowStyle"></div>
        </div>
        <div class="recommendList">
          <h3 class="title">热门歌单推荐</h3>
          <div class="recommendPlaylist" v-for="list in songList" :key="list.key" @click="detail(list.id)">
            <img :src="list.picUrl" alt="">
            <div class="content">
              <h5>{{list.songListAuthor}}</h5>
              <p>{{list.songListDesc}}</p>
            </div>
          </div>
        </div>
      </div> 
      <div class="loading-container" v-show="isloading">
        <loading :title="loadingTitle"></loading>
      </div>
    </scroll> 
    <router-view/>
  </div>
</template>

<script>
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';
import {getRecommend} from '@/api';
import Scroll from '@/components/scroll';
import Loading from '@/components/loading';
import {myMixin} from '@/assets/js/mixin';

export default {
  mixins:[myMixin],
  name: 'recommend',
  data () {
    return {
      slide:[],
      songList:[],
      isloading:true,
      loadingTitle:"正在努力加载中..."
    }
  },
  //页面加载完成时获取数据
  created(){
    this.getSlide()
  },
  methods:{ 
    watchPlayList(playList){
      if(playList.length > 0){
        this.$refs.recommend.style.bottom = "60px"
        this.$refs.scroll.refresh()
      }else{
        this.$refs.recommend.style.bottom = "0"
        this.$refs.scroll.refresh()
      }
    },
    getSlide:function(){
      getRecommend().then(res => {
        this.slide = res.data.slider;
        this.songList = res.data.songList;
        this.isloading=false;
        var mySwiper = new Swiper('.carousel', {
          autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false, 
          },
          observer: true,//修改swiper自己或子元素时，自动初始化swiper
          observeParents: true,//修改swiper的父元素时，自动初始化swiper
          // 如果需要分页器
          pagination: {
            el: '.slideshowStyle'
          },
        })
      })
    },
    detail(id){
      this.$router.push({path:`/recommend/${id}`})
    }
  },
  components:{
    Scroll,
    Loading
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
  .recommend{
    position: fixed;
    width: 100%;
    top:88px;
    bottom:0;
    .recommend-content{
      height: 100%;
      overflow: hidden;
      .loading-container{
        position: absolute;
        width: 100%;
        top:50%;
        transform: translateY(-50%);
        height: 101%;
        background: @color-background;
      }
    }
  }
  .carousel img{
    width:100%;
  }
  .swiper-pagination-bullet{
    width:32px;
    height:32px;
    border-radius:0;
    background-color:@color-text-d;
  }
  .swiper-pagination-bullet-active {
    background-color:@color-text-l;
  }
  .recommendList{
    .title{
      line-height:44px;
      font-size:@font-size-medium-x;
      text-align:center;
      color:@color-theme;
    }
    .recommendPlaylist{
      display:flex;
      padding: 10px;
      img{
        width: 60px;
        height: 60px;
        margin:0 15px;
      }
      .content{
        display: flex;
        flex-direction:column;
        overflow: hidden;
        padding-right: 5px;
        h5{
          line-height: 30px;
          font-size: @font-size-medium;
          color: @color-text;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        p{
          line-height: 30px;
          font-size: @font-size-small;
          color:@color-text-l;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
    }
  }


</style>
