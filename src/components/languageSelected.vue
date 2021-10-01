<template>
  <div class="langSelected ">
      <!-- <div v-for="(item, index) in lang" :key="index" class="langS" @click="langChange(item.name)">
          <img :src="`${GLOBAL.assetsUrl}/img/`+item.src" alt="item.name" >
      </div> -->
      <el-select class="lang input-select-area-bcg" id="t" v-model="label" :placeholder="$t('语言')" @change="langChange(label)"
      :popper-append-to-body="false"
          :popper-class="`play-ready-game-set-s handicap ${theme} input-select-area-bcg`"
      >
          <el-option 
          v-for="item in lang"
          :key="item.label"
          :label="item.name"
          :value="item.label"
          >
          <span>{{ $t(item.name) }}</span>
          </el-option>
      </el-select>
  </div>
</template>

<script type="text/javascript">
export default {
    props: {
        language: String,
        theme: String
    },
    data() {
        return {
            lang:[],
            label:null,
            languageLang: null
        }
    },
    methods:{
        langChange(label){

            // for(i in this.lang){
            //     if(this.lang[i].label === this.$i18n.locale){
            //         this.label = this.lang[i].name
            //         break
            //     }
            // }
            // this.label = label
            this.GLOBAL.languageSet(label)
        },
        langLabelauto(){
            for(i in this.lang){
                if(this.lang[i].label === this.$i18n.locale){
                    this.label = this.lang[i].label
                    return
                }
            }
        },
        init(){
            this.lang = this.GLOBAL.deepCopy(this.GLOBAL.langSelectItems)
            this.langLabelauto()
        }
    },
    created(){
        this.init()
    },
    computed:{
        
    },
    watch:{
        languageLang: {
            handler(){
                this.langLabelauto()
            },
            immediate: true,
            deep: true
        },
        language: {
            handler(){
                this.langLabelauto()
            },
            immediate: true,
            deep: true
        }
    },
    components: {

    }
}
</script>

<style lang="less" >
.langSelected{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
    .langS{
        margin-right: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover{
            cursor: pointer;
        }
        >img{
            width: 1.5rem;
            height: 0.99rem;
        }
    }
    .el-select{
        .el-input{
            >input{
            border: none;
            // border-color: #272727;
            background: inherit;
            //   color: white;
                color: inherit;
                width: 7rem;
                padding-left: 25px;
            }
            .el-input__suffix{
                color: inherit;
            }
            .el-select__caret{
                color: inherit;
            }
        }
        .el-input.is-focus{
            >input{
            border: none;
            // border-color: #272727;
            // background: #272727;
            }
        }
    } 
}
.el-scrollbar{
    // background: #272727;
}
</style>
