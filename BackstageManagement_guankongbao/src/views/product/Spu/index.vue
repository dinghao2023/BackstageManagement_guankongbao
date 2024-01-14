<template>
  <div>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene == 0"></CategorySelect>
    </el-card>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <!-- 底部这里将来是有三部分进行切换 -->
      <div v-show="scene == 0">
        <el-button type="primary" size="default" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加spu</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width"></el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- row为records数组中的每个对象 -->
              <el-button type="success" size="mini" icon="el-icon-plus" title="添加sku" @click="addSku(row)"></el-button>
              <el-button type="waring" size="mini" icon="el-icon-edit" title="修改spu" @click="updateSpu(row)"></el-button>
              <el-button type="info" size="mini" icon="el-icon-info" @click="handler(row)" title="查看当前spu全部sku列表"></el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <el-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center" 
          :current-page="page" 
          :page-sizes="[3, 5, 10]" 
          :page-size="limit" 
          layout="prev, pager, next, jumper,->, sizes,total" 
          @current-change="getSpuList" 
          @size-change="handleSizeChange" 
          :total="total">
        </el-pagination>
      </div>
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"></SpuForm>
      <SkuForm v-show="scene == 2" @changeScenes="changeScenes" ref="sku"></SkuForm>
    </el-card>
    <!-- 对话框，点击操作中的第三个按钮查看当前spu全部sku列表进行显示 -->
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
        <el-table-column prop="price" label="价格" width="width"></el-table-column>
        <el-table-column prop="weight" label="重量" width="width"></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      show: true,
      page: 1, //当前页
      limit: 3, //每页显示条目个数
      records: [], //是一个数组，里面包含多条spu数据。为当前page中的limit条数据。
      total: 0,
      scene: 0, //0展示SPU列表数据   1 添加SPU|修改SPU   2 添加SKU
      dialogTableVisible: false,//控制对话框的显示与隐藏，默认false不显示
      spu: {},
      skuList: [], //存储spu的所有sku列表数据
      loading: true,
    };
  },
  components: {
    SpuForm,
    SkuForm,
  },
  methods: {
    //给三级联动CategorySelect绑定自定义事件，自定义事件触发时接收其传递过来的数据对象
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      }else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      }else {
        this.category3Id = categoryId;
        this.getSpuList();//发请求获取spu数据列表
      }
    },
    //获取SPU列表数据的方法 点击分页器的某一页或接收到三级分类id时触发
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);//携带三个参数:page 第几页  limit 每一页需要展示多少条数据  三级分类id
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //pageSize即每页数据条数改变时触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //点击场景0最上方的添加SPU按钮
    addSpu() {
      this.scene = 1; //切换为场景为1，显示SpuForm组件
      this.$refs.spu.addSpuData(this.category3Id); //通知子组件SpuForm发请求---两个
    },
    //点击右侧第二个按钮，修改spu
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuData(row);//调用子组件SpuForm身上的initSpuData方法，并将row作为参数传递过去
    },
    //自定义事件回调（SpuForm）
    changeScene({ scene, flag }) {
      this.scene = scene;//切换场景
      //再次获取SPU列表的数据进行展示，flag用于区分添加spu还是修改spu
      if(flag == "修改") {
        this.getSpuList(this.page);
      }else {
        this.getSpuList();
      }
    },
    //点击右侧最后一个按钮，删除spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1); //当前page中数据条数如果大于1，删除之后停留在当前页；如果为1，删除之后当前page就没有数据了，所以回到上一page。
      }
    },
    //点击右侧第一个按钮，添加sku
    addSku(row) {
      this.scene = 2; //切换场景为2
      this.$refs.sku.getData(this.category1Id, this.category2Id, row); //调用子组件SkuForm的getDate方法，主要发送3个请求。发送3个请求总共需要4个参数，其中row身上有spuId和category3Id两个参数。
    },
    //点击右侧第三个按钮，查看当前spu全部sku列表
    async handler(spu) {
      this.dialogTableVisible = true;//显示对话框
      this.spu = spu;//保存spu信息
      let result = await this.$API.spu.reqSkuList(spu.id);//获取sku列表的数据进行展示
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;//获取到返回的数据之后，loading效果消失
      }
    },
    //关闭对话框之前触发
    close(done) {
      this.loading = true;//loading属性再次变为真
      this.skuList = [];//清除sku列表的数据
      done();//关闭对话框
    },
    //skuform通知父组件修改场景
    changeScenes(scene) {
      this.scene = scene;
    },
  },
};
</script>

<style scoped>
</style>
