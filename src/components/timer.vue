<template>
    <div :active.sync="active" v-show="active" :type="type">
        <span v-if="type != 'countTime'"> {{time}} </span>
        <span v-if="type == 'countTime'"> {{clock}} </span>
    </div>
    
</template>

<script>
// import { setInterval, clearInterval } from 'timers';
// import { Promise } from 'q';
export default {
    name: 'timer',
    props: {
        count: Number,
        type: String,
        status: Number,
        active: Boolean,
        formate: Boolean,
    },
    data(){
        return {
            time: '',
            spend: 1000,
            interval: null,
            clock: '00:00:00'
        }
    },
    methods: {
        init(){
            this.time = this.type == 'add' ? 0 : this.count
        },
        start(){
            this.interval = setInterval(() => {
                let s = this[this.type]()
                if(s != 0){
                    this.stop()
                    this.$emit('countEnd')
                }
            }, this.spend)
        },
        stop(){
            clearInterval(this.interval)
            // this.active = false
        },
        add(){
            if(this.time >= this.count) return 1
            this.time = Number(this.time) + 1
            // if(this.formate) this.time = this.formateTime(this.time)
            return 0
        },
        countTime(){
            this.time = Number(this.time) + 1
            this.clock = this.formateTime(this.time)
            this.$emit('updateTime', this.clock)
            return 0
        },
        minus(){
            if(this.time <= 0) return 1
            this.time = Number(this.time) - 1
            return 0
        },
        formateTime(s){
            let h, m
            m = parseInt(s / 60)
            s = s % 60
            h = parseInt(m / 60)
            m = m % 60
            if(s < 10) s = '0' + s
            if(m < 10) m = '0' + m
            if(h < 10) h = '0' + h
            return h + ':' + m + ':' + s
        }
    },
    watch: {
        active(val){
            if(val) this.start()
            else this.stop()
        }
    },
    created(){
        this.init();
    },
    updated(){
        // if(this.active) this.start()
        // else this.stop()
    }
}
</script>

<style>

</style>


