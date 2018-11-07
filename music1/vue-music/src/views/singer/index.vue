<template>
  <div class="singer" ref="singer">
    <singer-list :list="list" :isloading="isloading" :loadingTitle="loadingTitle"></singer-list>
  </div>
</template>

<script>
import {getSingerList} from '@/api';
import SingerList from '@/components/singerList';
import {myMixin} from '@/assets/js/mixin';

export default {
  mixins:[myMixin],
  name: 'singer',
  data () {
    return {
      list:[],
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
        this.$refs.singer.style.bottom = "60px"
      }else{
        this.$refs.singer.style.bottom = "0"
      }
    },
    getSlide:function(){
      getSingerList().then(res => {
        this.list = this.newSinger(res.data.list)
        this.isloading = false
      })
    },
    newSinger(list){
      //新建一个对象
      let newList = {
        hot:{
          title:"热门",
          items:[]
        }
      }
      list.forEach((item,index) => {
        //取前十条数据作为热门数据
        if(index < 10){
          newList.hot.items.push({
            id:item.Fsinger_mid,
            name:item.Fsinger_name,
            img:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        }
        //通过姓名首字母定义数据X
        if(!newList[item.Findex]){
          newList[item.Findex] = {
            title:item.Findex,
            items:[]
          }
        }
        newList[item.Findex].items.push({
          id:item.Fsinger_mid,
          name:item.Fsinger_name,
          img:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
        })
      });
      //把对象转成有序数组
      let hot = [];
      let other = [];
      for(var k in newList){
        if(newList[k].title == "热门"){
          hot.push(newList[k])
        }else if(newList[k].title.match(/[a-zA-Z]/)){
          other.push(newList[k])
        }
      }
      other.sort((a,b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(other)
    }
  },
  components:{
    SingerList
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .singer{
    position: fixed;
    bottom: 0;
    top: 88px;
    width: 100%;
  }
</style>
