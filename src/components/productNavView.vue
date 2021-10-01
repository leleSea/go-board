<template>
  <div class=" engine-word-page bg">
      <div class="productNavView page-box">
            <router-view></router-view>
            <!-- <engineWebFoot></engineWebFoot> -->
      </div>
    
  </div>
</template>


<script type="text/javascript">
import engineWebFoot from './engineWebFoot.vue'

export default {
  data() {
    return {
    }
  },
  methods:{
     
  },
  watch:{
      
  },
  created(){
  },
  components: {
    'engineWebFoot':engineWebFoot
  }
}
</script>

<style lang="less" >
.bg{
    background: rgb(39,39,39);
}
.productNavView{
    width: 85%;
    margin: 0 auto;
    margin-top: 1rem;
}
</style>
