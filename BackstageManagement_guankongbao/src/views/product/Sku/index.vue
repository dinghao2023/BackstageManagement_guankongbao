<template>
  <div>
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width" align="center"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width" align="center"></el-table-column>
      <el-table-column label="默认图片" width="110" align="center">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80" align="center"></el-table-column>
      <el-table-column prop="price" label="价格" width="80" align="center"></el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <!-- isSale为0表示处于下架状态 -->
          <el-button type="success" icon="el-icon-sort-up" size="mini" v-if="row.isSale == 0" @click="sale(row)"></el-button>
          <el-button type="success" icon="el-icon-sort-down" size="mini" v-else @click="cancel(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" @click="edit" size="mini" title="编辑sku信息"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" title="查看sku信息" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除sku信息"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination 
      @size-change="handleSizeChange" 
      @current-change="getSkuList" 
      style="text-align: center" 
      :current-page="page" 
      :page-sizes="[3, 5, 10]" 
      :page-size="limit" 
      layout="prev, pager, next, jumper,->,sizes,total" 
      :total="total">
    </el-pagination>
    <!-- 抽屉效果，点击查看sku信息按钮触发 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag type="success" v-for="(attr,index) in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right:10px">{{attr.attrId}}-{{attr.valueId}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="300px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1, //当前页
      limit: 10, //每页的条目个数
      records: [], //存储Sku列表的数据
      total: 0, //总条目数
      skuInfo: {}, //存储某个SKU详情
      show: false,//抽屉效果的显示与隐藏
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    //获取sku列表
    async getSkuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //pageSize改变时触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    //上架
    async sale(sku) {
      let result = await this.$API.sku.reqSale(sku.id);
      if (result.code == 200) {
        sku.isSale = 1;
        this.$message({ type: "success", message: "上架成功" });
      }
    },
    //下架
    async cancel(sku) {
      let result = await this.$API.sku.reqCancel(sku.id);
      if (result.code == 200) {
        sku.isSale = 0;
        this.$message({ type: "success", message: "下架成功" });
      }
    },
    edit() {
      this.$message("正在开发中");
    },
    //查看某个SKU详情
    async getSkuInfo(sku) {
      let result = await this.$API.sku.reqSkuById(sku.id);
      this.show = true;//展示抽屉
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
};
</script>


<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-carousel__button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}

/* >>>.el-carousel__button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
} */
</style>
