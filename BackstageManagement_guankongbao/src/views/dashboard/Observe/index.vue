<!-- 首页底部部分，包含两个子组件 -->
<template>
  <div>
    <!-- 两个子组件均分，子组件间隔10px -->
    <el-row :gutter="10">
      <el-col :span="12">
          <Search></Search>
      </el-col>
      <el-col :span="12">
          <Category></Category>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Search from "./Search";
import Category from "./Category";
export default {
  name: "",
  components: {
    Search,
    Category,
  },
};
</script>

<style scoped>
</style>
