import { AnotherTFRequest } from '../../utils'

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

// 查询标签详情
export const getEnterpriseUserLabelDetailApi = (data) => AnotherTFRequest('/dtsEnterpriseUserLabel/xxx', data)

// 删除用户标签
export const deleteByIdEnterpriseUserLabelApi = (data) => AnotherTFRequest('/dtsEnterpriseUserLabel/deleteById', data, 'POST')

// 点赞标签
export const updateByLabelEnterpriseUserLikeApi = (data) => AnotherTFRequest('/dtsEnterpriseUserLike/getByLabel', data, 'POST')

// 取消点赞标签
export const updateByIdCanEnterpriseUserLikeApi = (data) => AnotherTFRequest('/dtsEnterpriseUserLike/likeByIdCan', data, 'POST')

/**
 * @description 商城相关接口
 */

// 获取支付宝小程序手机号绑定
export const updateAliPhoneAppApi = (data) => AnotherTFRequest('/app/updateAliPhone', data, 'POST')

// 获取短信验证码
export const getCodeBusinessApi = (data) => AnotherTFRequest('/app/getCode', data, 'POST')

// 获取短信验证码
export const getVerifyCodeApi = (data) => AnotherTFRequest('/app/getCode', data)

// 手机号验证码登录、注册
export const updatePhoneLoginRegisterApi = (data) => AnotherTFRequest('/app/login', data, 'POST')

// 支付宝登录
export const updateAlipayLoginApi = (data) => AnotherTFRequest('/app/alipayLogin', data, 'POST')

// 微信登录
export const updateWXLoginApi = (data) => AnotherTFRequest('/app/wxLogin', data, 'POST')

// APP微信登录
export const updateWXAppLoginApi = (data) => AnotherTFRequest('/app/wxAppLogin', data, 'POST')

// 获取微信手机号绑定
export const getSessionKeyAppApi = (data) => AnotherTFRequest('/app/getSessionKey', data, 'POST')

// 获取微信手机号绑定
export const updateSetWxPhoneAppApi = (data) => AnotherTFRequest('/app/setWxPhone', data, 'POST')

// 获取微信手机号绑定
export const updateWxPhoneAppApi = (data) => AnotherTFRequest('/app/updateWxPhone', data, 'POST')

// 判断用户是否是商家
export const getIsShopByUserApi = (data) => AnotherTFRequest('/shop/getShopByUser', data)

// 个人系信息查询
export const getUserInfoApi = (data) => AnotherTFRequest('/user/getUser', data)

// 个人系信息修改
export const updateUserInfoApi = (data) => AnotherTFRequest('/user/update', data, 'POST')
