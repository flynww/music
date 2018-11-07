<template>
  <transition name="slide">
    <music-list :title="title" :bgUrl="bgUrl" :songList="songList"></music-list>
  </transition>
  <!-- <div class="recommendDetail">
    
  </div> -->
</template>

<script>
import MusicList from '@/components/musicList';
import {getRankInfo} from '@/api';

export default {
  data(){
    return {
      title:"",
      bgUrl:"",
      songList:[],
      id:""
    }
  },
  created(){
    this.getRankInfoList()
  },
  methods:{
    getRankInfoList(){
      this.id = this.$route.params.id;
      getRankInfo(this.id).then(res => {
        this.title = res.topinfo.ListName;
        this.bgUrl = res.topinfo.pic_album;
        this.songList = this.editSongs(res.songlist)
      })
    },
    editSongs(list){
      let nSongsList = [];
      for(let i=0;i<list.length;i++){
        let item = {
          //歌曲的id
          id:list[i].data.songid,
          //歌曲的mid
          songmid:list[i].data.songmid,
          //歌曲名
          songname:list[i].data.songname,
          //专辑名
          albumname:list[i].data.albumname,
          //歌曲时长
          interval:list[i].data.interval,
          //专辑封面
          img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[i].data.albummid}.jpg?max_age=2592000`,
          //歌曲链接
          url:`http://dl.stream.qqmusic.qq.com/C400${list[i].data.songmid}/${list[i].data.songid}.m4a?guid=983915916&fromtag=66`,
          //歌手
          singer:list[i].data.singer
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

