<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px" @click="showDialog">添加</el-button>
    <!-- 
         表格组件 
         data:表格组件将来需要展示的数据------数组类型
         border：是给表格添加边框
         column属性
         label：显示标题
         width：对应列的宽度
         align：标题的对齐方式
         prop:对应列内容的字段名
         type:如果设置了索引那么就从一开始
         border：边框
         注意1：elementUI当中的table组件，展示的数据是以一列一列进行展示数据
       -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column header-align="center" align="center" label="序号" width="80%" type="index"></el-table-column>
      <el-table-column header-align="center" align="center" prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="prop" label="操作">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" size="mini" icon="el-icon-edit" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器 
      当前第几页、数据总条数、每一页展示条数、连续页码数
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      current-page:代表的是当前第几页
      total：代表分页器一共需要展示数据条数
      page-size：代表的是每一页需要展示多少条数据
      page-sizes：代表可以设置每一页展示多少条数据
      layout：可以实现分页器布局
      pager-count:页码按钮的数量  如果 9 则连续页码是7
    -->
    <el-pagination 
      style="margin-top: 20px; text-align: center" 
      :current-page="page" 
      :total="total" 
      :page-size="limit"
      :pager-count="7" 
      :page-sizes="[3, 5, 10]" 
      layout="prev, pager, next, jumper,->,sizes,total"
      @current-change="getPageList" 
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 
      Dialog 对话框
        visible:是否显示 Dialog，支持 .sync 修饰符
      Upload 上传
        action 设置图片上传的地址
        on-success 文件上传成功时的回调 function(event, file, fileList)
        before-upload 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload 
            class="avatar-uploader" 
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess" 
            :before-upload="beforeAvatarUpload">
              <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    //自定义校验规则函数
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称为2-10位"));
      }else {
        callback();//放行
      }
    };
    return {
      page: 1,
      limit: 3,// 每页展示数据条数
      total: 0,// 数据总条数
      list: [],// 列表展示的数据
      dialogFormVisible: false,// 控制对话框显示与隐藏
      // imageUrl: "",
      tmForm: {// 该对象表示表单收集的品牌信息
        tmName: "",
        logoUrl: "",
      },
      //表单验证的规则，此处需要验证tmName与logoUrl
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },//trigger为触发方式，blur即失去焦点时触发，一般还有change时触发
          { validator: validateTmName, trigger: "change" },//自定义校验规则
        ],
        logoUrl: [{ required: true, message: "请选择品牌的图片" }],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    async getPageList(pager = 1) {
      this.page = pager;// 没有传入参数时，默认是1，点击分页器后，将参数page设置为当前点击的页码
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);// {records: [{id: 1, tmName: '小米', logoUrl: 'http://39.98.123.211/group1/M00/03/D9/rBHu8mHmKC6AQ-j2AAAb72A3E.jpg'},{...},{...}], total: 15, size: 3, current: 1, searchCount: true, pages: 5}
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 每一页展示数据的条数发生改变时触发
    handleSizeChange(limit) {
      this.limit = limit;// 将每一页展示数据的条数重新赋值
      this.getPageList();
    },
    //点击修改品牌的按钮 row为当前品牌的信息
    updateTradeMark(row) {
      this.dialogFormVisible = true;//对话框显示
      this.tmForm = { ...row };//将当前品牌信息浅拷贝给tmForm，从而在对话框中展示。若直接赋值则是引用，修改tmForm就修改了row，所以此处浅拷贝保证修改tmForm的顶层属性不影响row。
    },
    showDialog() {
      this.dialogFormVisible = true; //对话框显示
      this.tmForm = { tmName: "", logoUrl: "" }; //清除数据，防止每次显示对话框时仍保留上次的图片数据
    },
    // 文件上传成功时的回调 function(event, file, fileList)
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data;// res为上传成功后返回给前端的数据，里面的属性为图片上传后在服务器中的地址。
    },
    // 上传文件之前的回调，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //对话框添加或修改品牌之后点击确定
    addOrUpdateTradeMark() {
      //当全部验证字段通过，再去书写业务逻辑 success是一个布尔值，表示是否验证通过。
      this.$refs.ruleForm.validate(async (success) => {
        //如果全部字段符合条件
        if (success) {
          this.dialogFormVisible = false;// 对话框退出
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            this.getPageList(this.tmForm.id ? this.page : 1);//再次获取品牌列表，若是修改品牌则停留在那一页
          }
        }else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //点击删除品牌
    deleteTradeMark() {
      this.$confirm(`你确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {//点击确定按钮时触发
        let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
        if (result.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1);//再次获取品牌列表数据。当前列表的数据条数若大于1则删除后留在当前页，等于1删除后回到上一页
        }
      }).catch(() => {//点击取消按钮时触发
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>




