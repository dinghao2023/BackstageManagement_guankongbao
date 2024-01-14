<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "",
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        show: false,
        //最小值与最大值的设置
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        type: "category",//在y轴均分
      },
      series: [
        {
          type: "bar",
          data: [78],
          color: "cyan",
          barWidth: 10,//柱状图的宽度
          color: "yellowgreen",
          showBackground: true,
          backgroundStyle: {
            color: "#eee",
          },
          //文本标签
          label: {
            show: true,
            //改变文本内容
            formatter: "|",
            //文本标签位置调试
            position: "right",
          },
        },
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
