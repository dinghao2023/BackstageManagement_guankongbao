## Build Setup

```bash
# 进入项目目录
cd houtaiguanli

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

## 文件介绍

```bash
build
     ----index.js
mock
    ----mock数据的文件夹

node_modules
     ------项目依赖的模块

public
     ------ico图标,静态页面，publick文件夹里面经常放置一些静态资源，而且在项目打包的时候webpack不会编译这个文件夹，原封不动的打包到dist文件夹里面

src
    ------api文件夹:涉及请求相关的
    ------assets文件夹：里面放置一些静态资源（一般共享的），放在aseets文件夹里面静态资源，在webpack打包的时候，会进行编译
    ------components文件夹：一般放置非路由组件获取全局组件
    ------icons这个文件夹的里面放置了一些svg矢量图
    ------layout文件夹：他里面放置一些组件与混入
    ------router文件夹：与路由相关的
    -----store文件夹：一定是与vuex先关的
    -----style文件夹：与样式先关的
    ------utils文件夹：request.js是axios二次封装文件****
    ------views文件夹：里面放置的是路由组件

App.vue:根组件
main.js：入口文件
.env.development
.env.producation
```

## 后台路由

![image-20220609120120695](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091350089.png)



后台管理系统接口文档地址：http://39.98.123.211:8510/swagger-ui.html#/

```mermaid
graph LR
路由--> A(后台管理)
A-->B(商品管理Product<br>/product)
B-->C(品牌管理Trademark<br>/product/trademark)
C-->G["获取品牌管理的数据 reqTradeMarkList<br>请求地址：/admin/product/baseTrademark/${page}/${limit}"]
C-->H["新增品牌 reqAddOrUpdateTradeMark<br>请求地址：/admin/product/baseTrademark/save"]
C-->I["修改品牌 reqAddOrUpdateTradeMark<br>请求地址：/admin/product/baseTrademark/update"]
C-->J["删除品牌 reqDeleteTradeMark<br>请求地址：/admin/product/baseTrademark/remove/${id}"]
B-->D(平台属性管理Attr<br>/product/attr)
D-->获取一级分类数据["获取一级分类数据 reqCategory1List<br>请求地址：/admin/product/getCategory1"]
D-->获取二级分类数据["获取二级分类数据 reqCategory2List<br>请求地址：/admin/product/getCategory2/${category1Id}"]
D-->获取三级分类数据["获取三级分类数据 reqCategory3List<br>请求地址：/admin/product/getCategory3/${category2Id}"]
D-->获取平台属性["获取平台属性 reqAttrList<br>请求地址：/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}"]
D-->添加属性与属性值["添加属性与属性值 reqAddOrUpdateAttr<br>请求地址：/admin/product/saveAttrInfo"]
B-->E(Spu管理Spu<br>/product/spu)
E-->获取spu数据列表["获取spu数据列表 reqSpuList<br>请求地址：/admin/product/${page}/${limit}"]
E-->获取spu信息["获取spu信息 reqSpu<br>请求地址：/admin/product/getSpuById/${spuId}"]
E-->获取品牌信息["获取品牌信息 reqTradeMarkList<br>请求地址：/admin/product/baseTrademark/getTrademarkList"]
E-->获取spu图片["获取spu图片 reqSpuImageList<br>请求地址：/admin/product/spuImageList/${spuId}"]
E-->获取平台全部销售属性["获取平台全部销售属性 reqBaseSaleAttrList<br>请求地址：/admin/product/baseSaleAttrList"]
E-->添加spu["添加spu reqAddOrUpdateSpu<br>请求地址：/admin/product/saveSpuInfo"]
E-->修改spu["修改spu reqAddOrUpdateSpu<br>请求地址：/admin/product/updateSpuInfo"]
E-->删除spu["删除spu reqDeleteSpu<br>请求地址：/admin/product/deleteSpu/${spuId}"]
E-->获取图片数据["获取图片的数据 reqSpuImageLIst<br>请求地址：/admin/product/spuImageList/${spuId}"]
E-->获取销售属性数据["获取销售属性的数据 reqSpuSaleAttrList<br>请求地址：/admin/product/spuSaleAttrList/${spuId}"]
E-->获取平台属性的数据["获取平台属性的数据 reqAttrInfoList<br>请求地址：/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}"]
E-->添加sku["添加sku reqAddSku<br>请求地址：/admin/product/saveSkuInfo"]
E-->获取sku列表数据["获取sku列表数据 reqSkuList<br>请求地址：/admin/product/findBySpuId/${spuId}"]


B-->F(Sku管理Sku<br>/product/sku)
F-->获取sku列表["获取sku列表 reqSkuList<br>请求地址：/admin/product/list/${page}/${limit}"]
F-->上架["上架 reqSale<br>请求地址：/admin/product/onSale/${skuId}"]
F-->下架["下架 reqCancel<br>请求地址：/admin/product/cancelSale/${skuId}"]
F-->查看sku详情["查看sku详情 reqSkuById<br>请求地址：/admin/product/getSkuById/${skuId}"]
```


