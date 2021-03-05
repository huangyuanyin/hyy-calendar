<template>
    <div v-click-outside >
        <input type="text" :value="formaDate"  >
        <di v-if="isVisible" class="pannel">
            <div class="pannel-nav">
                <span @click="preYear">&lt;</span>
                <span @click="preMonth">&lt;&lt;</span>
                <span>{{time.year}}年</span>
                <span>{{time.month}}月</span>
                <span @click="nextMonth">&gt;&gt;</span>
                <span @click="nextYear">&gt;</span>
            </div>
            <div class="pannel-content">
                <div class="days">
                     <span 
                            v-for="j in 7" :key="`_`+j"
                            class="cell"
                    >
                        {{weekDays[j-1]}}
                        </span>
                    <div v-for="i in 6" :key="i">  
                        <span 
                            v-for="j in 7" :key="j"
                            class="cell cell-days"
                            @click="chooseDate(visibeDays()[(i-1)*7+(j-1)])"
                            :class="[
                                {notCurrentMonth:!isCurrentMonth(visibeDays()[(i-1)*7+(j-1)])},
                                {today:isToday(visibeDays()[(i-1)*7+(j-1)])},
                                {select:isSelect(visibeDays()[(i-1)*7+(j-1)])}
                            ]"
                        >
                            {{visibeDays()[(i-1)*7+(j-1)].getDate()}}
                        </span>
                    </div>
                </div>
            </div>
            <div class="pannel-footer">
                <img src="./img/1.jpg" width="100%" height="200px">
            </div>
        </div>
    </div>
</template>

<script>
import * as utils from './utils.js'
export default {
    directives:{
        clickOutside:{    //指令的生命周期  用自定义指令，为了操作dom
            bind(el,bindings,vnode){
                let hander = (e) =>{
                    if(el.contains(e.target)){
                    //判断一下是否当前面板已经显示出来了
                        if (!vnode.context.isVisible) {
                        vnode.context.focus();
                        console.log('包含')
                        }
                    }else{
                        if (vnode.context.isVisible) {
                        vnode.context.blur();
                        console.log('不包含')
                        }
                     }
                }
                el.hander = hander;
                //把事件 绑定到document上，看一下点击的是否是当前这个元素的内部
                document.addEventListener('click',hander)
            },
            unbind(el){
                document.removeEventListener('click',el.hander)
            }
        }
    },
    data(){
        let {year,month} = utils.getYearMonthDay(this.value);  //拿到当前传过来的年和月
        return{
            isVisible:false,
            weekDays:['日','一','二','三','四','五','六'],
            time:{year,month}
        }
    },
    props:{
        value:{
            type:Date,
            defalut:() => new Date()  //返回的默认值必须是一个函数类型
        }
    },
    methods:{
        focus(){
            this.isVisible = true;
        },
        blur(){
            this.isVisible = false;
        }, 
        visibeDays(){
            //获取当前的年月日
            // let {year,month} = utils.getYearMonthDay(this.value);
            let {year,month} = utils.getYearMonthDay(utils.getDate(this.time.year,this.time.month,1));
            //获取当前月份的第一天
            let currentFirstDay = utils.getDate(year,month,1);  
            //获取第一天是周几
            let week = currentFirstDay.getDay();
            //用当月的第一天减去 周几前面的几天，这样就能得到上个月开始的天数
            let startDay = currentFirstDay - week * 60 * 60 * 24 * 1000
            console.log(week);
            //利用数组并循环遍历获取到所有的日期
            let arr = [];
            for (let i = 0; i < 42 ; i++) {
                arr.push(new Date(startDay + i *60 * 60 * 24 *1000));
            }
            return arr;
        },
        //判断是否是当前月的方法，传入每一天 用传入的每一天去和当前年月做比较然后返回
        isCurrentMonth(date){
            let {year,month} = utils.getYearMonthDay(utils.getDate(this.time.year,this.time.month,1));
            let {year:y,month:m} = utils.getYearMonthDay(date);
            return year === y && month === m;
        },
        //判断是否是当前天的方法 同理
        isToday(date){
            let {year,month,day} = utils.getYearMonthDay(this.value);
            let {year:y,month:m,day:d} = utils.getYearMonthDay(date);
            return year === y & month === m & day === d;
        },
        chooseDate(date){
            this.time = utils.getYearMonthDay(date); //因为拿到的日期在data中，只有在其加载的时候才会渲染一次。所以在选中日期的时候，不仅要把年和月赋值出去，还要更新一下。
            //将获得的日期返回到input
            //子组件可以使用 $emit 触发父组件的自定义事件。
            this.$emit('input',date);
            this.blur();
        },
        isSelect(date){
            //获取当前的年月日
            let {year,month,day} = utils.getYearMonthDay(this.value);
            let {year:y,month:m,day:d} = utils.getYearMonthDay(date);
            return year === y & month === m & day === d;
        },
        //上一个月 获取当年月 用setMonth()去设置月份，然后更新月份
        preMonth(){
            //获取当前的年月日
            let d = utils.getDate(this.time.year,this.time.month,1);
            //更改月份
            d.setMonth(d.getMonth()-1);
            //拿到更改的月份然后赋值给time
            this.time = utils.getYearMonthDay(d);
        },
        nextMonth(){
            let d = utils.getDate(this.time.year,this.time.month,1);
            d.setMonth(d.getMonth()+1);
            this.time = utils.getYearMonthDay(d);
        },
        preYear(){
            let d =  utils.getDate(this.time.year,this.time.month,1);
            d.setYear(d.getFullYear()-1);
            this.time = utils.getYearMonthDay(d);
        },
        nextYear(){
            let d = utils.getDate(this.time.year,this.time.month,1);
            d.setYear(d.getFullYear()+1);
            this.time = utils.getYearMonthDay(d);
        }
    },
    mounted(){
        console.log(this.visibeDays()) 
    },
    computed:{
        formaDate(){
            let {year,month,day} = utils.getYearMonthDay(this.value);
            return `${year}-${month}-${day}`
        }
    },

}
</script>

<style>
    .pannel{
        position: absolute;
        background: #fff;
        width: 60*7px;
        box-shadow: 2px 2px 2px pink,-2px -2px 2px pink;
        
    }
    .pannel-nav{
        height: 60px;
        display: flex;
        justify-content: space-around;
    }
    .pannel-nav span{
        display: inline-flex;
        cursor: pointer;
        user-select: none;

        margin-left: 0px;
        justify-content: center;
        align-items: center;
        
    }
    .pannel-nav span:hover{
        border: 0.5px solid blue;
        border-radius: 20%;
        
    }
    .pannel-content .cell{
        width: 64px;
        height: 64px;
        display: inline-flex;
        /* align-content: center; */
        justify-content: center;
           align-items: center;
        font-weight: bold;
            border: 1px solid white;
            border-radius: 10px;

    }
    .pannel-content .cell-days:hover,.select{
        border: 1px solid pink;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
    }
    .pannel-footer .img{
        height: 60px;
    }
    .notCurrentMonth{
        color: gray;
    }
    .today{
        background: red;
        color: #fff;
        border-radius: 10px;
    }

</style>