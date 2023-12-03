import { AnotherTFRequest } from '../../utils'

/**
 * @description 商城相关接口
 */

// 登录拿 新团蜂的 token
export const getAnotherTFTokenApi = (data) => AnotherTFRequest('/app/tmpLoginOrRegByPhone', data)

// 判断用户是否是商家
export const getIsShopByUserApi = (data) => AnotherTFRequest('/shop/getShopByUser', data)

// 查询名片信息
export const getIdEnterpriseUserApi = (data) => AnotherTFRequest('/dtsEnterpriseUser/getId', data)

// 保存名片信息
export const addEnterpriseUserSaveApi = (data) => AnotherTFRequest('/dtsEnterpriseUser/save', data, 'POST')

// 修改名片信息
export const updateByIdEnterpriseUserApi = (data) => AnotherTFRequest('/dtsEnterpriseUser/updateById', data, 'POST')

// 查询用户标签
export const getUserIdEnterpriseUserLabelApi = (data) => AnotherTFRequest('/dtsEnterpriseUserLabel/getUserId', data)

// 新增用户标签
export const addEnterpriseUserLabelSaveApi = (data) => AnotherTFRequest('/dtsEnterpriseUserLabel/save', data, 'POST')

// 修改用户标签
export const updateByIdEnterpriseUserLabelApi = (data) => AnotherTFRequest('/dtsEnterpriseUserLabel/updateById', data, 'POST')

// 删除用户标签
export const deleteByIdEnterpriseUserLabelApi = (data) => AnotherTFRequest('/dtsEnterpriseUserLabel/deleteById', data, 'POST')

// 点赞标签
export const updateByLabelEnterpriseUserLikeApi = (data) => AnotherTFRequest('/dtsEnterpriseUserLike/getByLabel', data, 'POST')

// 取消点赞标签
export const updateByIdCanEnterpriseUserLikeApi = (data) => AnotherTFRequest('/dtsEnterpriseUserLike/likeByIdCan', data, 'POST')
