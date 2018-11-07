<template>
  <div class="rank" ref="rank">
    <scroll class="rank-content" ref="scroll">
      <div>
        <div class="rankList" v-for="list in topList" :key="list.id" @click="details(list.id)">
          <img :src="list.picUrl" alt="">
          <ol class="songList">
            <li v-for="(song,index) in list.songList" :key="index"><p><span>{{song.songname}}</span>-<span>{{song.singername}}</span></p></li>
          </ol>
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
import Scroll from '@/components/scroll';
import Loading from '@/components/loading';
import {getRankList} from '@/api';
import {myMixin} from '@/assets/js/mixin';

export default {
  mixins:[myMixin],
  name: 'rank',
  data () {
    return {
      topList:{},
      isloading:true,
      loadingTitle:"正在努力加载中..."
    }
  },
  //页面加载时获取数据
  created(){
    this.getSlide()
  },
  methods:{
    watchPlayList(playList){
      if(playList.length > 0){
        this.$refs.rank.style.bottom = "60px"
        this.$refs.scroll.refresh()
      }else{
        this.$refs.rank.style.bottom = "0"
        this.$refs.scroll.refresh()
      }
    },
    getSlide:function(){
      getRankList().then(res => {
        this.topList = res.data.topList;
        this.isloading=false;
      })
    },
    details(id){
      this.$router.push({path:`/rank/${id}`})
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

  .rank{
    padding-top: 10px;
    position: fixed;
    width: 100%;
    top:88px;
    bottom:0;
  }
  .rank-content{
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
  .rankList{
    display:flex;
    padding:10px 20px;
    img{
      width: 100px;
      height: 100px;
    }
    .songList{
      width: 100%;
      list-style-type:none;
      counter-reset:sectioncounter;//对子部分进行编码
      background: @color-text-d;
      color: @color-text-l;
      display: flex;
      padding: 0 20px;
      flex-direction:column;
      overflow: hidden;  /*超出部分不显示*/
      li{
        display: flex;
        flex:1;
        font-size:@font-size-medium;
        align-items:center;
        p{
          overflow: hidden;  /*超出部分不显示*/
          text-overflow:ellipsis;  /*超过部分用点点表示*/
          white-space: nowrap;  /*不换行*/
        }
        span{
          padding: 0 5px;
        }
      }
      li:before {
       content:counter(sectioncounter) " "; 
       counter-increment:sectioncounter;
      }
    }
  }
</style>

