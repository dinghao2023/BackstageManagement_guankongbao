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
        show: false,//隐藏x轴
        type: "category",
      },
      yAxis: {
        show: false,//隐藏y轴
      },
      series: [
        {
          type: "line",
          data: [10, 7, 33, 12, 48, 9, 29, 10, 180],
          //拐点的样式
          itemStyle: {
            opacity: 0,//透明度为0，即消除拐点
          },
          //线条的样式
          lineStyle: {
            color: "purple",
          },
          //填充颜色
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          smooth:true,//折线平滑
        },
      ],
      //布局
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
