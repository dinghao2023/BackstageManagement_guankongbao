import request from '@/utils/request';

export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' }); //Sku组件中的列表数据
export const reqSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' });//上架
export const reqCancel = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' });//下架
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' });//查看SKU详情

