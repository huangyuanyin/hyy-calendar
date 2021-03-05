<template>
    <div >
        <!-- <DatePicker :value="now" @input="val => value = val">    hello </DatePicker> -->
        <DatePicker v-model="now"></DatePicker>
        <span>点击输入框来显示日期面板</span>
    </div>
</template>

<script>
import DatePicker from './date-picker'
export default {
    components:{
        DatePicker
    },
    data(){
        return {
            now:new Date()
        }
    }
}
</script>

<style lang="css"   >

</style>