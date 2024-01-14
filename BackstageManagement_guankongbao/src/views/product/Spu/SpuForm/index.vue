<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <!-- value为收集的数据，要收集的是tm.id，存放在spu.tmId中 -->
          <el-option :label="tm.tmName" :value="tm.id" v-for="(tm,index) in tradeMarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片：（具体查看element-UI）
          action图片上传的地址  
          list-type: 文件列表的类型 
          on-preview:点击文件列表中的文件时的钩子，即预览时触发
          on-remove:文件列表移除文件时的钩子
          file-list：上传的文件列表，是一个数组。数组里面的元素务必要有name、url属性
        -->
        <el-upload action="/dev-api/admin/product/fileUpload" :file-list="spuImageList" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handlerSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}个未选择`" v-model="attrIdAndAttrName">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect, index) in unSelectSaleAttr" :key="unselect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示spu自己的销售属性 -->
        <el-table style="width: 100%" :data="spu.spuSaleAttrList" border>
          <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width"></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)" closable>{{tag.saleAttrValueName}}</el-tag>
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)"></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {//当添加spu时双向绑定的数据也存储在此，以供之后发送给服务器。
        category3Id: 0,
        description: "",
        spuName: "",
        tmId: "", //品牌的id
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [//spu自己的销售属性
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储SPU图片的数据
      saleAttrList: [], //服务器返回的所有销售属性的数据，一共有3个
      attrIdAndAttrName: "", //收集未选择的销售属性的id与name
    };
  },
  methods: {
    //初始化SpuForm数据
    async initSpuData(spu) {//参数spu由父组件Spu传递过来
      let spuResult = await this.$API.spu.reqSpu(spu.id);//获取SPU信息
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();//获取品牌的信息
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);//获取spu图片的信息
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        listArr.forEach((item) => {//由于element-UI照片墙显示图片需要数组中的对象含有name与url属性，所以将服务器返回的数据处理后再存储。
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();//获取平台全部的销售属性
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //照片墙删除某个图片时触发
    handleRemove(file, fileList) {//file:代表的是删除的那张图片 fileList:删除某张图片以后，剩余图片组成的数组
      this.spuImageList = fileList;
    },
    //点击照片墙图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;//将图片地址赋值给dialogImageUrl
      this.dialogVisible = true; //对话框显示
    },
    //在照片墙上传图片成功时的回调
    handlerSuccess(response, file, fileList) {//response为服务器返回的信息，里面包含该上传的图片在服务器中的路径
      this.spuImageList = fileList;
    },
    //点击添加销售属性按钮
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      let newSaleAttr = {baseSaleAttrId, saleAttrName, spuSaleAttrValueList: []};
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attrIdAndAttrName = "";
    },
    //在销售属性的表格中点击添加按钮，添加销售属性的属性值。row为spu.spuSaleAttrList中的每个对象，即每一个销售属性。
    addSaleAttrValue(row) {
      this.$set(row, "inputVisible", true);//挂载在销售属性身上的响应式数据inputVisible，用于控制button与input切换
      this.$set(row, "inputValue", "");//响应式属性inputValue，用于收集input框输入的内容，即销售属性的属性值，先收集到row身上的inputValue属性中，后续再放入row.spuSaleAttrValueList中。
    },
    //input框添加销售属性的属性值好了之后失去焦点触发
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      if (inputValue.trim() == "") return this.$message("属性值不能为空");
      let result = row.spuSaleAttrValueList.some((item) => item.saleAttrValueName == inputValue);
      if (result) return;//若为true，说明重复，直接返回。
      row.spuSaleAttrValueList.push(newSaleAttrValue);//将整理好的对象push进row.spuSaleAttrValueList中，专门存放row属性的属性值
      row.inputVisible = false;//关闭input，显示button
    },
    //添加或修改spu之后，最终点击保存按钮
    async addOrUpdateSpu() {
      //照片墙的信息是保存在this.spuImageList中，现在需要存放到spu对象里面一起发送给服务器，并且每个图片需要有imageName与imageUrl字段
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.imgUrl,//有item.response这个属性则用item.response.data
        };
      });
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功" });
        //触发父组件给SpuForm组件绑定的自定义事件
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",//spu中如果有id，那么就是修改spu，没有id就是添加spu
        }); 
      }
      Object.assign(this.$data, this.$options.data());//清理当前收集的数据，使得下次再添加spu时表单中不含任何数据
    },
    //该方法是当父组件Spu点击场景0最上方的添加spu按钮时，子组件SpuForm执行此方法。
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id;
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList(); //spu组件需要发送2个请求。1.获取品牌的信息
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      let saleResult = await this.$API.spu.reqBaseSaleAttrList(); //spu组件需要发送2个请求。2.获取平台全部的销售属性
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //最终的取消按钮
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "" });//回到场景0
      //this._data或this.$data可以获取组件中当前响应式数据，this.$options可以获取配置对象，而配置对象的data函数执行返回的数据为最初代码中配置的空数据
      Object.assign(this.$data, this.$options.data());//第二个参数对象将第一个参数对象覆盖，即清除数据。
    },
  },
  computed: {
    unSelectSaleAttr() {//计算出还未选择的销售属性
      //整个平台的销售属性一共三个：尺寸、颜色、版本 ----saleAttrList
      //当前SPU拥有的属于自己的销售属性spu.spuSaleAttrList  ----颜色
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {//当每个item都和item1不相等时，则every方法返回true，那么filter方法保留该item元素，最终所有的item元素形成新数组
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
