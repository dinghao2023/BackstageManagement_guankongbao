import request from '@/utils/request';

export const reqCategory1List = () => request({ url: '/admin/product/getCategory1', method: 'get' });//获取一级分类数据
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' });//获取二级分类数据
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' });//获取三级分类数据
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });//获取平台属性
export const reqAddOrUpdateAttr = (data) => request({ url: '/admin/product/saveAttrInfo', method: 'post', data });//添加或修改属性后保存
/*
以下为添加属性与属性值所发送请求携带的data参数
{
  "attrName": "",      属性名
  "attrValueList": [   属性名中属性值，因为属性值可以是多个，因此需要的是数组
    {
      "attrId": 0,          属性的id
      "valueName": "string"  属性值
    }
  ],
  "categoryId": 0,    category3Id
  "categoryLevel":3,
}
*/


