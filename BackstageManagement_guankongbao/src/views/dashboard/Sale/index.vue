<!-- 首页中间部分 -->
<template>
  <el-card class="box-card" style="margin: 10px 0px">
    <!-- 头部区域 -->
    <div slot="header" class="clearfix">
      <!--  @tab-click="handleClick" -->
      <!-- 头部左侧 -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!--  
          日历：
            value-format：设置绑定值的格式
        -->
        <el-date-picker 
          v-model="date" 
          class="date" 
          type="daterange" 
          range-separator="-" 
          start-placeholder="开始日期" 
          end-placeholder="结束日期" 
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
    </div>
    <!-- 内容区域 -->
    <div>
      <!-- 所有el-col之间的空隙大小为10px -->
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- 容器，存放echarts -->
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6" class="right">
          <h3>门店{{ title }}排名</h3>
          <ul>
            <li>
              <span class="rindex">0</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex">1</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>4</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>5</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>6</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>7</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "",
  data() {
    return {
      activeName: "sale",
      mycharts: null,//将mycharts挂载到组件实例对象身上，避免其作为局部变量。使得title发生变化时，mycharts实例可以重新设置title。
      date: [],//日历数据，是一个数组
    };
  },
  mounted() {
    //初始化echarts实例
    this.mycharts = echarts.init(this.$refs.charts);
    //配置数据
    this.mycharts.setOption({
      title: {
        text: this.title,//由于mounted只执行一次，所以需要watch监听
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
          color: "yellowgreen",
        },
      ],
    });

    //顶部是mounted：为什么第一次没有数据，没有数据因此不显示
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  watch: {
    title() {
      //图表option可以再次修改，如果有新的数值，新的数值，没有新的数值，还是用以前的
      this.mycharts.setOption({
        title: {
          text: this.title,
        },
        xAxis: {
          data: this.title == "销售额" ? this.listState.orderFullYearAxis : this.listState.userFullYearAxis,
        },
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.title == "销售额" ? this.listState.orderFullYear : this.listState.userFullYear,
            color: "yellowgreen",
          },
        ],
      });
    },
    //监听listState，当listState有数据时立马将图表数据设置为此。
    listState() {
      this.mycharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.listState.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.listState.orderFullYear,
            color: "yellowgreen",
          },
        ],
      });
    },
  },
  methods: {
    //点击今日
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");//获取今日日期并进行格式化
      this.date = [day, day];//开始结束日期均设置今日
    },
    //点击本周
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");//获取本周的周一并进行格式化
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //点击本月
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");//获取本月第一天
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //点击本年
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.date {
  width: 250px;
  margin: 0px 20px;
}
.right span {
  margin: 0px 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>
