import request from '@/utils/request';

export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });//获取品牌列表
//添加或修改品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    if (tradeMark.id) {
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark });//修改品牌 携带三个参数：id、品牌名称、品牌logo
    } else {
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark });//添加品牌 携带两个参数：品牌名称、品牌logo，不需要传递id，id是由服务器生成
    }
}
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' });//删除品牌