'use strict';
/**
 * 微信相关业务
 */
const wxConfigMp = {
	appId: 'wxe920d4492b51c1ef',
	secret: '1b01ea7c449392739c693ed8f460beda'
}

const crypto = require('crypto')

/**
 * 微信小程序授权登录获取session_key
 * @param {Object} options
 * @param {String} options.code 小程序code
 *
 * @param {String} options.encryptedData 可选，存在encryptedData和iv时返回用户信息（包含unionid）
 * @param {String} options.iv 可选
 */
const mpWxGetSessionKey = async options => {
	const {
		code,
		encryptedData,
		iv
	} = options;
	const {
		appId,
		secret
	} = wxConfigMp;

	let url = 'https://api.weixin.qq.com/sns/jscode2session';
	url += '?appid=' + appId;
	url += '&secret=' + secret;
	url += '&js_code=' + code + '&grant_type=authorization_code';
	const res = await uniCloud.httpclient.request(url, {
		method: 'GET',
		dataType: 'json'
	})

	const data = res.res.data;
	if (data.errcode) {
		return {
			status: 0,
			msg: 'appid错误',
			data,
			appId
		}
	}
	if (!data.session_key) {
		return {
			status: 0,
			msg: '获取微信授权失败',
			data
		}
	}
	if (!encryptedData || !iv) {
		return {
			status: 1,
			openid: data.openid,
			session_key: data.session_key
		}
	}
	const userInfo = WXBizDataCrypt({
		sessionKey: data.session_key,
		encryptedData,
		iv
	})
	return {
		status: 1,
		session_key: data.session_key,
		userInfo
	}
}

/**
 * 微信小程序授权登录获取session_key
 * @param {Object} options
 * @param {String} options.code 小程序code
 *
 * @param {String} options.encryptedData 可选，存在encryptedData和iv时返回用户信息（包含unionid）
 * @param {String} options.iv 可选
 */
const mpWxGetPhoneNo = async options => {
	const {
		sessionKey,
		encryptedData,
		iv
	} = options;
	const userInfo = WXBizDataCrypt({
		sessionKey: sessionKey,
		encryptedData: encryptedData,
		iv: iv
	})
	return {
		userInfo
	}
}

/**
 * 解密encryptedData 获取unionid
 * @param {Object} options
 * @param {String} options.sessionKey
 * @param {String} options.encryptedData
 * @param {String} options.iv
 */
const WXBizDataCrypt = options => {
	const appId = wxConfigMp.appId;
	let {
		sessionKey,
		encryptedData,
		iv
	} = options;
	console.log("sessionKey", sessionKey)
	console.log("encryptedData", encryptedData)
	console.log("iv", iv)
	sessionKey = new Buffer(sessionKey, 'base64')
	encryptedData = new Buffer(encryptedData, 'base64')
	iv = new Buffer(iv, 'base64')

	let decoded;
	try {
		// 解密
		let decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
		// 设置自动 padding 为 true，删除填充补位
		decipher.setAutoPadding(true)
		decoded = decipher.update(encryptedData, 'binary', 'utf8')
		decoded += decipher.final('utf8')
		decoded = JSON.parse(decoded)
	} catch (err) {
		throw new Error('Illegal Buffer')
	}
	if (decoded.watermark.appid !== appId) {
		throw new Error('Illegal Buffer')
	}
	return decoded
}
const getWxConfigPart = async options => {
	const {
		data
	} = options;
	const {
		appId,
		secret
	} = wxConfigMp;

	const res0 = await uniCloud.httpclient.request(
		"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" +
		appSecret, {
			method: 'GET',
			data: {},
			contentType: 'json', // 指定以application/json发送data内的数据
			dataType: 'json' // 指定返回值为json格式，自动进行parse
		})
	var access_token = res0.data.access_token;
	const res = await uniCloud.httpclient.request(
		"https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access_token + "&type=jsapi", {
			method: 'GET',
			data: {},
			contentType: 'json', // 指定以application/json发送data内的数据
			dataType: 'json' // 指定返回值为json格式，自动进行parse
		})
	var jsapiticket = res.data.ticket;
	var timestamp = new Date().getTime();
	var url = data.url;
	/****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	var maxLen = $chars.length;
	var noncestr = '';
	for (var i = 0; i < 32; i++) {
		noncestr += $chars.charAt(Math.floor(Math.random() * maxLen));
	}
	var str = "jsapi_ticket=" + jsapiticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" +
		url;
	var signature = sha1(str);
	
	console.log("签名=========", {
		appId: appId,
		timestamp: timestamp,
		noncestr: noncestr,
		signature: signature,
		jsapiticket: jsapiticket
	});
	return {
		code: 200,
		data: {
			appId: appId,
			timestamp: timestamp,
			noncestr: noncestr,
			signature: signature,
			jsapiticket: jsapiticket
		}
	}
}
module.exports = {
	mpWxGetSessionKey,
	mpWxGetPhoneNo,
	getWxConfigPart
}
