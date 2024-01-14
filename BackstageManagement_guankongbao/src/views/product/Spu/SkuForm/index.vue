<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元素)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <!-- 平台属性当中有多个下拉框，所以是行内的el-form -->
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr, index) in attrInfoList" :key="attr.id">
            <!-- 需要收集attr.id和attrValue.id两个数据，暂时收集到attr.attrIdAndValueId中 -->
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName" v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id" :value="`${attr.id}:${attrValue.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :value="`${saleAttr.id}:${saleAttrValue.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <!-- 第一列type设置为section表示多选框 -->
          <el-table-column type="selection" prop="prop" width="80"></el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuImageList: [],//存储图片的信息
      spuSaleAttrList: [],//存储销售属性
      attrInfoList: [],//存储平台属性
      //收集sku数据，将来提交给服务器
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        skuDefaultImg: "",//默认图片
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu: {},
      //收集选中的图片的数据，暂时的存放位置。注意原本图片的数据存放在spuImageList中，但缺少isDefault字段，添加该字段后暂时存放在imageList中。后续整理参数再存储在skuInfo中提交给服务器，
      imageList: [],//收集用户勾选中的图片数据
    };
  },
  methods: {
    //获取SkuForm数据
    async getData(category1Id, category2Id, spu) {
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;//收集spu信息
      let result = await this.$API.spu.reqSpuImageLIst(spu.id);//获取图片数据
      if (result.code == 200) {
        let list = result.data;
        list.forEach((item) => {
          item.isDefault = 0;
          this.spuImageList = list;
        });
      }
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);//获取销售属性的数据
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      let result2 = await this.$API.spu.reqAttrInfoList(category1Id,category2Id,spu.category3Id);//获取平台属性的数据
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    //table表格复选框发生变化时触发
    handleSelectionChange(params) {
      this.imageList = params; //获取到用户选中图片的数据，但当前收集的数据缺少isDefault字段
    },
    //点击设置默认按钮
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1; //点击的那个图片的数据变为1
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //点击取消按钮
    cancel() {
      this.$emit("changeScenes", 0); //自定义事件，让父组件切换场景0
      Object.assign(this.$data, this.$options.data()); //点击取消之后将已经输入的数据清除。将当前组件实例（即 this 对象）的_data或$data重置为初始的数据对象。
    },
    //点击最后的保存
    async save() {
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      //整理平台属性。平台属性数据都是保存在attrInfoList中，整理后放在skuInfo.skuAttrValueList中之后提交给服务器
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if(item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      //整理销售属性。销售属性数据都是保存在spuSaleAttrList中，整理后放在skuInfo.skuSaleAttrValueList中之后提交给服务器
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      //整理图片的数据。用户勾选的图片数据存放在imageList中，整理后放在skuInfo.skuImageList中提交给服务器
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      let result = await this.$API.spu.reqAddSku(skuInfo);//发送请求，添加sku
      if (result.code == 200) {
        this.$message({ type: "success", message: "添加SKU成功" });
        this.$emit("changeScenes", 0);//触发自定义事件通知父组件切换场景为0
      }
    },
  },
};
</script>

<style scoped>
</style>
