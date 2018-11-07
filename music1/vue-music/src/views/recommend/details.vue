<template>
  <transition name="slide">
    <music-list :title="title" :bgUrl="bgUrl" :songList="songList"></music-list>
  </transition>
  <!-- <div class="recommendDetail">
    
  </div> -->
</template>

<script>
import MusicList from '@/components/musicList';
import {getCdInfo} from '@/api';

export default {
  data(){
    return {
      title:"",
      bgUrl:"",
      songList:[],
    }
  },
  created(){
    this.getCdInfoList()
  },
  methods:{
    getCdInfoList(){
      getCdInfo().then(res => {
        this.title = res.data.cdlist[0].dissname;
        this.bgUrl = res.data.cdlist[0].logo;
        this.songList = this.editSongs(res.data.cdlist[0].songlist);
      })
    },
    editSongs(list){
      let nSongsList = [];
      for(let i=0;i<list.length;i++){
        let item = {
          //歌曲的id
          id:list[i].songid,
          //歌曲的mid
          songmid:list[i].songmid,
          //歌曲名
          songname:list[i].songname,
          //专辑名
          albumname:list[i].albumname,
          //歌曲时长
          interval:list[i].interval,
          //专辑封面
          img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[i].albummid}.jpg?max_age=2592000`,
          //歌曲链接
          url:`http://dl.stream.qqmusic.qq.com/C400${list[i].songmid}/${list[i].songid}.m4a?guid=983915916&fromtag=66`,
          //歌手
          singer:list[i].singer
        }
        nSongsList.push(item)
      }
      return nSongsList
    }
  },
  components:{
    MusicList
  }
}
</script>

<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');

  .slide-enter-active,.slide-leaver-active{
    transition: all 0.3s;
  }
  .slide-enter,.slide-leave-to{
    transform: translate3d(100%,0,0);
  }
</style>

