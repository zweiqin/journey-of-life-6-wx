'use strict';
const {
	mpWxGetSessionKey,
	mpWxGetPhoneNo
} = require('wx-auth')
const moment = require('moment');
const db = uniCloud.database();
const dbCmd = db.command
const $ = dbCmd.aggregate
const cardCollection = db.collection('card')
const visitorCollection = db.collection('visitor')
const userCollection = db.collection('user');
let uniID = require('uni-id')
const createConfig = require('uni-config-center')
const uniIdConfig = createConfig({
	pluginId: 'uni-id'
}).config()
exports.main = async (event, context) => {
	uniID = uniID.createInstance({
		context
	})
	console.log('event : ' + JSON.stringify(event))
	const {
		operation,
		data
	} = event;
	try {
		console.log('operation : ' + operation)
		switch (operation) {
			case "getInfo": {
				return true;
			}
			case "loginByWx": {
				return await loginByWx(data);
			}
			case "getWxConfigPart": {
				return await getWxConfigPart(data);
			}
			case "getPhoneByWeixin": {
				return await getPhoneByWeixin(data);
			}
			case "bindPhone": {
				return await bindPhone(data);
			}
			case "getCard": {
				return await getCard(data);
			}
			case "getMyCard": {
				return await getMyCard(data);
			}
			case "saveCard": {
				return await saveCard(data);
			}
			case "getVisitorList": {
				return await getVisitorList(data);
			}
			case "getMyVisitorList": {
				return await getMyVisitorList(data);
			}
			default: {
				throw new Error("未找到接口")
			}
		}
	} catch (e) {
		var msg = e.toString().replace("Error: ", "")
		console.log("出错了", msg)
		return {
			code: 50101,
			msg: msg
		};
	}

};
/**
 * 绑定手机
 */
async function bindPhone() {
	var user = await userCollection.where({
		_id: data.user_id
	}).get();
	if (user.data.length == 0)
		throw new Error("用户不存在")
	await userCollection.doc(data.user_id).update({
		phone: data.phone
	});
}
/**
 * 获取名片
 */
async function getCard(data) {
	var user = await userCollection.where({
		_id: data.uid
	}).get();
	if (user.data.length == 0)
		throw new Error("用户不存在")
	var card = await cardCollection.where({
			_id: data.id
		})
		.get();
	if (card.data.length == 0) {
		return {
			code: 200,
			data: {
				name: "",
				phone: "",
				job: "",
				company: "",
				head_img: "",
				address: "",
				phone: "",
				wechat: "",
				qq: "",
				email: "",
				intro: "",
				_id: ""
			}
		}
	}
	
	var visitors = await visitorCollection.where({
		uid: user.data[0]._id,
		card_id: data.id
	}).get();
	if (visitors.data.length == 0) {
		var visitor = {
			card_id: data.id,
			uid: user.data[0]._id,
			name: user.data[0].nickName,
			head_img: user.data[0].avatar,
			phone: user.data[0].phone
		};
		var res = await visitorCollection.add(visitor);
	}

	return {
		code: 200,
		data: card.data[0]
	};
}
/**
 * 获取名片
 */
async function getMyCard(data) {
	var user = await userCollection.where({
		_id: data.uid
	}).get();
	if (user.data.length == 0) {
		throw new Error("用户不存在")
	}
	var card = await cardCollection.where({
			uid: data.uid
		})
		.get();
	if (card.data.length == 0) {
		return {
			code: 200,
			data: {
				name: "",
				phone: "",
				job: "",
				company: "",
				head_img: "",
				address: "",
				phone: "",
				wechat: "",
				qq: "",
				email: "",
				intro: "",
				_id: ""
			}
		}
	}
	return {
		code: 200,
		data: card.data[0]
	};
}
/**
 * 提交名片
 */
async function saveCard(data) {
	const now = Date.now()
	if (data.length == 0) {
		throw new Error("请勿提交空内容");
	}
	var id = "";
	var user = await userCollection.where({
		_id: data.uid
	}).get();
	if (user.data.length == 0)
		throw new Error("用户不存在")
	var card = await cardCollection.where({
			uid: user.data[0]._id
		})
		.get();
	if (data.name == "") {
		throw new Error("请填写姓名");
	}
	if (data.phone == "") {
		throw new Error("请填写手机号");
	}
	if (card.data.length == 0) {
		data.uid = user.data[0]._id;
		data.create_time = now;
		var res = await cardCollection.add(data);
		console.log("cardCollection.add",res)
		id = res.id;
	} else {
		await cardCollection.doc(card.data[0]._id).update({
			name: data.name,
			phone: data.phone,
			job: data.job,
			company: data.company,
			head_img: data.head_img,
			address: data.address,
			phone: data.phone,
			wechat: data.wechat,
			qq: data.qq,
			email: data.email,
			intro: data.intro,
			create_time: now
		});
		id = card.data[0]._id;
	}
	return {
		code: 200,
		data: {
			id: id
		}
	};
}
/**
 * 获取浏览列表
 */
async function getVisitorList(data, token, deviceId) {
	const now = Date.now()
	var total = await visitorCollection.where({
		card_id: dbCmd.eq(data.card_id)
	}).count();
	var res = await visitorCollection.where({
			card_id: dbCmd.eq(data.card_id)
		})
		.orderBy('create_time', 'desc')
		.skip(data.skip)
		.limit(data.limit)
		.get();
	return {
		code: 200,
		data: {
			total: total.total,
			items: res.data
		}
	};
}
/**
 * 获取浏览列表
 */
async function getMyVisitorList(data, token, deviceId) {
	const now = Date.now()
	var total = await visitorCollection.where({
		card_id: dbCmd.eq(data.uid)
	}).count();
	var res = await visitorCollection.where({
			card_id: dbCmd.eq(data.uid)
		})
		.orderBy('create_time', 'desc')
		.skip(data.skip)
		.limit(data.limit)
		.get();
	return {
		code: 200,
		data: {
			total: total.total,
			items: res.data
		}
	};
}
// 通过微信登录
async function loginByWx(data) {
	// 获取openid
	const wxUser = await mpWxGetSessionKey(data)
	console.log("wxUser", wxUser)
	if (wxUser.status == 0) {
		throw new Error(wxUser.msg)
	}
	// 通过openid查库里的数据
	const result = await userCollection.where({
		openId: wxUser.userInfo.openId
	}).get()
	let id = null;
	console.log("result", result.data[0])
	const now = moment().format('YYYY-MM-DD HH:mm:ss');
	// 如果已经有了，则更新库里的信息
	if (result.data.length > 0) {
		let user = result.data[0]
		const r = await userCollection.doc(user._id).update({
			nickName: wxUser.userInfo.nickName,
			gender: wxUser.userInfo.gender,
			avatar: wxUser.userInfo.avatar,
			city: wxUser.userInfo.city,
			language: wxUser.userInfo.language,
			updateTime: now
		})
		return {
			code: 200,
			data: {
				id: user._id,
				nickName: wxUser.userInfo.nickName,
				gender: wxUser.userInfo.gender,
				avatar: wxUser.userInfo.avatar,
				city: wxUser.userInfo.city,
				language: wxUser.userInfo.language,
				sessionKey: wxUser.session_key
			}
		};
	} else {
		// 若没有，则插入该用户数据
		const r = await userCollection.add({
			nickName: wxUser.userInfo.nickName,
			gender: wxUser.userInfo.gender,
			avatar: wxUser.userInfo.avatar,
			openId: wxUser.userInfo.openId,
			avatar: wxUser.userInfo.avatar,
			city: wxUser.userInfo.city,
			language: wxUser.userInfo.language,
			createTime: now,
			updateTime: now
		})
		return {
			code: 200,
			data: {
				id: r.id,
				nickName: wxUser.userInfo.nickName,
				openId: wxUser.userInfo.openId,
				gender: wxUser.userInfo.gender,
				avatar: wxUser.userInfo.avatar,
				city: wxUser.userInfo.city,
				language: wxUser.userInfo.language,
				sessionKey: wxUser.session_key
			}
		}
	}
}
//获取微信授权手机号码
async function getPhoneByWeixin(data) {
	var res = await mpWxGetPhoneNo(data);
	return {
		code: 200,
		data: res
	}
}
async function getWxConfigPart(data) {
	var res = await getWxConfigPart(data);
	return {
		code: 200,
		data: res
	}
}
