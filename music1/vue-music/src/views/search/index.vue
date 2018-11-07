<template>
  <div class="search">
    <div class="searchBox">
      <input id="search" ref="input" v-model="searchVal" type="text" placeholder="搜索歌曲、歌手" @focus="detail">
      <label for="search" class="music-icon icon-search"></label>
      <span ref="cancel" @click="cancel">取消</span>
    </div>
    <div class="hotSearch">
      <h5>热门搜索</h5>
      <span v-for="(item,index) in hotSearch" v-if="index<10" :key="index" @click="hotSearchL(item.k)">{{item.k}}</span>
    </div>
    <scroll class="searchList" ref="scroll">
      <div>
        <div v-for="list in searchList" :key="list.key" class="message">
          <span class="music-icon icon-music"></span>
          <div class="content">
            <h2 class="name">{{list.songname}}</h2>
            <p class="desc"><span v-for="singer in list.singer" :key="singer.key">{{singer.name}} </span>▪ <span>{{list.albumname}}</span></p>
          </div>
        </div>
      </div>
    </scroll>
    <div class="loading-container" v-show="isloading">
      <loading :title="loadingTitle"></loading>
    </div>
  </div>
</template>

<script>
import {getHotKey} from '@/api';
import {search} from '@/api';
import Scroll from '@/components/scroll';
import Loading from '@/components/loading';
export default {
  name: 'search',
  data () {
    return {
      hotSearch:[],
      searchVal:"",
      searchList:[],
      isloading:true,
      loadingTitle:"正在努力加载中..."
    }
  },
  //页面加载时获取数据
  created(){
    this.getSlide()
  },
  components:{
    Scroll,
    Loading
  },
  methods:{
    getSlide:function(){
      getHotKey().then(res => {
        this.hotSearch = res.data.hotkey;
        this.isloading=false;
      })
    },
    detail(){
      this.$refs.input.style.width = "calc(100% - 80px)"
      this.$refs.cancel.style.display = "inline-block"
      this.$refs.scroll.$el.style.display = "inline-block"

    },
    cancel(){
      this.$refs.input.style.width = "calc(100% - 40px)"
      this.$refs.cancel.style.display = "none"
      this.$refs.scroll.$el.style.display = "none"
      this.searchVal = ""
      this.searchList = []
    },
    hotSearchL(val){
      this.searchVal = val
      this.detail()
    },
    newList(list){
      let newLis = []
      for(let i=0;i<list.length;i++){
        let item = {
          id:list[i].album.id,
          albumname:list[i].album.name,
          songname:list[i].name,
          singer:list[i].singer
        }
        newLis.push(item)
      }
      return newLis
    }
  },
  watch:{
    searchVal(v){
      search(v,1,100).then(res => {
        this.searchList = this.newList(res.data.song.list)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
  .searchBox{
    padding:20px;
    position: relative;
    input{
      width: calc(100% - 40px);
      height: 40px;
      padding-left: 40px;
      border-radius: 5px;
      background: @color-text-d;
      color: @color-text-l;
      font-size: @font-size-medium-x;
      &::placeholder{
        color: @color-text-l;
      }
      &:focus{
        outline:none
      }
    }
    .icon-search{
      font-size:@font-size-large-x;
      color:@color-background-d;
      position: absolute;
      left:30px;
      top:50%;
      margin-top: -11px;
      z-index: 5;
    }
    span{
      color: @color-text-l;
      position: absolute;
      right: 15px;
      top:50%;
      font-size:@font-size-medium-x;
      margin-top: -8px;
      display: none;
    }
  }
  .hotSearch{
    padding:0 20px;
    h5{
      font-size:@font-size-medium-x;
      color:@color-text-ll;
      padding-top:10px;
      padding-bottom:20px;
    }
    span{
      display: inline-block;
      padding:0 6px;
      border-radius:5px;
      background: @color-text-d;
      color: @color-text-l;
      font-size: @font-size-medium;
      line-height:25px;
      margin-right: 20px;
      margin-top: 10px;
    }
  }
  .searchList{
    position: fixed;
    width: 100%;
    top:168px;
    bottom:0;
    z-index: 20;
    background: @color-background;
    overflow: hidden;
    display: none;
    .message{
      display: flex;
      align-items: center;
      padding: 10px 0;
      .icon-music{
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
</style>
