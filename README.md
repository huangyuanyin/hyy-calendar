# vue-calendar
基于vue封装一个日历组件

# 1.环境搭建：
（1）npm install @vue/cli @vue/cli-service-global -g 快速开始零配置原型开发（省去自己搭建webpack环境）

（2）npm init -y 项目初始化

（3）npm install stylus stylus-loader -D

# 2.运行方式：
vue serve

# 3.基本思路（对日历组件的封装，首先，我们需要清楚日历组件都需要哪些功能。）：
（1）获取当前时间到显示框里，并对时间进行处理：

先写一个input，给input赋值（当前的时间），然后在utils.js中写一个工具封装方法，这个方法用来获取当前的年月日，然后在计算属性调用这个方法并返回一个时间格式来处理时间。

（2）当获取输入框焦点时，出现日历面板，失去输入框焦点时，日历面板消失。

（3）确定每个月的一号对应的是周几，需要上个月补充几天，需要下个月补充几天。

比如5月的1号是周三，那么我们就用42-3（注：如果周日在第一个就是42-周几，如果周一是在第一个就是42-周几-1）。日历的内容渲染，一个面板上应该是42个元素，包括上个月的部分数据，下个月的部分数据和当月的全部数据。这样子确定了当月一号的所在位置后，就能知道上个月和下个月需要补充的天数。

但是这样很丑，而且不能区分出哪一天是上个月哪一天是下个月，所以我们需要给上下月去加一下样式来区分当前月和上下月的区分

（4）给上下月去加一下样式来对当前月和上下月进行区分

1.判断是否是当前月的方法，传入每一天 用传入的每一天去和当前年月做比较然后返回

2.判断是否是当前天的方法 同理

3.然后给类名加一些自己喜欢的样式就可以愉快的区分出当前月和上下月以及今天

（5）判断是不是今天，是今天就显示红色

思路：获取当前用户传入的值this.value与new Date中的年月是否相等。

isToday(date){
    let {year,month,day} = utils.getYearMonthDay(this.value);

    let {year:y,month:m,day:d} = utils.getYearMonthDay(date);

    return year === y & month === m & day === d;
}
（6）点击日期，输入框里面的日期也随之更改

思路：给每个span标签都添加一个事件方法：

@click="chooseDate(visibeDays()[(i-1)*7+(j-1)])
chooseDate(date){
	this.$emit('input',date);
	this.blur();
},
判断点击的样式是否被选中，如果被选中，给一个标识样式

isSelect(date){
    //获取当前的年月日
    let {year,month,day} = utils.getYearMonthDay(this.value);
    let {year:y,month:m,day:d} = utils.getYearMonthDay(date);
    return year === y & month === m & day === d;
}
····遇到问题：点击日期，如果点击的不是本月的日期，样式也要随之发生改变

chooseDate(date){
   	this.time = utils.getYearMonthDay(date);
	this.$emit('input',date);
	this.blur();
}     
（7）切换月份与年份，并且当切换上个月或者下个月的时候，日历面板需要重新渲染。

1.先去utils里面创建一个新的方法用来获取当前几月几日

2.上一个月 获取当年月 用setMonth()去设置月份，然后更新月份

（8）日历的头部渲染，即日历的周一到周日渲染出来

4.项目难点：
（1）. 每个月的日期数是不定的，拢共需要几个格子？

直接给他一个6*7的列表，全部展示上个月，当前月以及下个月，并将不是本月的日期用灰色展示。

（2）翻年翻月时，如果不停点击月或者年，最终月就会变成一个负的或者超过12月。

原写法：

preMonth(){
	this.time.month --;
}
解决方案：

preMonth(){
	let d = utils.getDate(this.time.year,this.time.month,1);
	d.setMonth(d.getMonth()-1);
	this.time = utils.getYearMonthDay(d);
}
（3）

image-20210304110856124

如何处理样式（当月份或天数小于十时，前面自动补0）？？？

在封装获取时间方法的时候，对时间进行一个处理（三元运算表达式）：

const getYearMonthDay = (date) => {

		 `const year = date.getFullYear();`

	     `const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) :    date.getMonth() + 1;`

	     `const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();`

	     `return { year, month, day }`
}

（4）

获取输入框焦点时，虽然能出现日历面板，但是点击日历面板里面的内容时，输入框就失去焦点了，使面板消失了。无法点击到日历面板里面的内容。

····解决办法：

用事件委托的方式。给父级div写一个自定义指令，自己在指令上加事件。bind()：当指令绑定到dom元素上，bind方法就会被触发。

（5）选择日期后，日历面板消失，但是再次打开时，日历面板之后选中的日期并没有显示。 （6）拿到当前的日期，将其渲染到头部组件中，但是点击日历面板中的日期，头部年月并没有变化

因为拿到的日期在data中，只有在其加载的时候才会渲染一次。所以在选中日期的时候，不仅要把年和月赋值出去，还要更新一下。
