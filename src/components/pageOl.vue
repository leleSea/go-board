<template>
    <div class="page-ol">
      <el-dialog
        :title="content.title"
        :visible="dialogVisible"
        :before-close="handleClose"
        width="25.5rem"
        >
        <span>
          <div class="ol-item" v-for="(v, i) in content.content" :key="i">
              <p><strong>{{v.title}}</strong></p>
              <ul>
                  <li v-for="(s, k) in v.content" :key="k">{{s}}</li>
              </ul>
          </div>
        </span>
        
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'pageOl',
  data () {
    return {
      content: {
        content: []
      },
      dialogVisible: false
    }
  },
  methods:{
    handleClose(done) {
      this.dialogVisible = false
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      },
      open(){
        this.dialogVisible = true
      }
  },
  created(){
    let path = `${this.GLOBAL.assetsUrl}/txt/engineHelp.json`
    this.GLOBAL.getStaticData(path)
    .then(res => {
        this.content = res
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.page-ol{
    li{
        margin-left: 2rem;
    }
    .el-dialog__body{
      text-align: left;
      padding: 1.5rem 1rem;
      font-size: 0.7rem;
    }
    .ol-item:last-child{
      margin: 0px;
    }
    .ol-item{
      margin-bottom: 1rem;
    }
}

</style>
