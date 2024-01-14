<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <!-- row为attrList中的每个对象 -->
            <template slot-scope="{ row, $index }">
              <el-tag type="success" v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id" style="margin: 0px 20px">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 关于添加或修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0px" border :data="attrInfo.attrValueList">
          <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
          <el-table-column width="width" prop="prop" label="属性值名称">
            <!-- 这里结构需要用到span与input进行来回的切换 此处的row为attrInfo.attrValueList这个属性值数组中的每个对象，$index为0,1,2... -->
            <template slot-scope="{ row, $index }">
              <el-input v-if="row.flag" @blur="toLook(row)" @keyup.enter.native="toLook(row)" :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini"></el-input>
              <span v-else @click="toEdit(row,$index)" style="display: block">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column width="width" prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 在element-ui2.13版本中用@onConfirm绑定确认的回调 -->
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled='attrInfo.attrValueList.length<1'>保存 </el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";//按需引入lodash当中的深拷贝
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],//平台属性列表
      isShowTable: true,
      //收集新增或修改的属性
      attrInfo: {
        attrName: "",
        attrValueList: [],//属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        categoryId: 0, //三级分类的id
        categoryLevel: 3,
      },
    };
  },
  methods: {
    //自定义事件的回调，接收子组件CategorySelect传递过来的数据
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";//当接收到一级id时，需要清空二三级id
        this.category3Id = "";
      }else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      }else {
        this.category3Id = categoryId;
        this.getAttrList();//发请求获取平台的属性数据
      }
    },
    //当用户确定三级分类的数据时候，向服务器发请求获取平台属性进行展示
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(category1Id,category2Id,category3Id);
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //三级分类选好之后点击最上方的添加属性按钮
    addAttr() {
      this.isShowTable = false;
      //清除数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,//收集三级分类的id
        categoryLevel: 3,
      };
    },
    //输入属性名之后点击添加属性值按钮
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,//添加属性值时，每一个属性值对象的attrId均为整个attrInfo的id，即整个大属性的id
        valueName: "",
        flag: true,//为true表示切换到input框，为编辑模式，反之切换到span为查看模式
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();//点击添加之后，最后添加的input框自动聚焦
      });
    },
    // 失去焦点和按下回车时，展示span，为查看模式
    toLook(row) {
      if (row.valueName.trim() == "") {
        this.$message("请输入一个正确的属性值");
        return;
      }
      //新增的属性值不能与已有的属性值重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        if (row != item) {
          return row.valueName == item.valueName;
        }
        if (isRepat) return;//重复了，直接返回，否则不返回，执行下一行
        row.flag = false;//input消失，展示span
      });
    },
    //点击span，显示input，为编辑模式
    toEdit(row, index) {
      row.flag = true;
      //获取input节点，实现自动聚焦，但是input的渲染绘制在页面上需要时间，所以不可能一点击span立马获取到input
      //$nextTick,当节点渲染完毕了，会执行一次
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //点击列表右侧图标修改原有属性
    updateAttr(row) {
      this.isShowTable = false;
      this.attrInfo = cloneDeep(row);//需要深拷贝，确保attrInfo的修改不影响原本服务器中的row，否则直接引用或浅拷贝都会修改服务器中的row数据
      //在修改某个属性的时候，将该属性中的每个属性值对象添加上flag标记
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    //点击气泡确认框的确定按钮
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);//删除数组中对应index的元素
    },
    //添加或修改属性之后点击最后的保存按钮
    async addOrUpdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
        if (item.valueName != "") {
          delete item.flag; //删除掉flag属性
          return true;
        }
      });
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.isShowTable = true;
        this.$message({ type: "success", message: "保存成功" });
        this.getAttrList(); //再次获取平台属性进行展示
      }catch (error) {}
    },
  },
};
</script>

<style scoped>
</style>
