<template>
	<view>
		<view class="weui-desktop-panel_inner">
			<h3 class="panel__title-center">团蜂名片小程序隐私保护指引</h3>
			<view class="group-infos">
				<text>本指引是团蜂名片小程序开发者 "广东团蜂科技有限公司"（以下简称“开发者”）为处理你的个人信息而制定。</text>
			</view>
			<view class="group-infos">
				<view class="group-infos__hd">
					<text class="group-infos__title">开发者处理的信息</text>
					<text class="group-infos__hd-privacyText">根据法律规定，开发者仅处理实现小程序功能所必要的信息。</text>
				</view>
				<text>
					开发者 收集你选中的照片或视频信息，用于业务介绍。
				</text>
				<text>
					开发者 收集你选中的文件，用于信息展示。
				</text>
			</view>
			<view class="group-infos">
				<view class="group-infos__hd">
					<text class="group-infos__title">你的权益</text>
				</view>
				<text class="group-infos_order">
					关于收集你选中的照片或视频信息、收集你选中的照片或视频信息、收集你选中的文件、收集你选中的文件，你可以通过以下路径：小程序主页右上角“...” — “设置” —
					“小程序已获取的信息” — 点击特定信息 — 点击“通知开发者删除”，开发者承诺收到通知后将删除信息。
				</text>
				<text class="group-infos_order">关于你的个人信息，你可以通过以下方式与开发者联系，行使查阅、复制、更正、删除等法定权利。</text>
			</view>
			<view class="group-infos">
				<view class="group-infos__hd">
					<text class="group-infos__title">开发者对信息的存储</text>
				</view>
				<text>开发者承诺，除法律法规另有规定外，开发者对你的信息的保存期限应当为实现处理目的所必要的最短时间。</text>
			</view>
			<view class="group-infos">
				<view class="group-infos__hd">
					<text class="group-infos__title">信息的使用规则</text>
				</view>
				<text class="group-infos_order">开发者将会在本指引所明示的用途内使用收集的信息</text>
				<text>如开发者使用你的信息超出本指引目的或合理范围，开发者必须在变更使用目的或范围前，再次以电话方式告知并征得你的明示同意。</text>
			</view>
			<view class="group-infos">
				<view class="group-infos__hd">
					<text class="group-infos__title">信息对外提供</text>
				</view>
				<text class="group-infos_order">
					开发者承诺，不会主动共享或转让你的信息至任何第三方，如存在确需共享或转让时，开发者应当直接征得或确认第三方征得你的单独同意。
				</text>
				<text class="group-infos_order">
					开发者承诺，不会对外公开披露你的信息，如必须公开披露时，开发者应当向你告知公开披露的目的、披露信息的类型及可能涉及的信息，并征得你的单独同意。
				</text>
			</view>
			<view class="group-infos">
				<text class="group-infos_order">
					你认为开发者未遵守上述约定，或有其他的投诉建议、或未成年人个人信息保护相关问题，可通过以下方式与开发者联系；或者向微信进行投诉。
				</text>
			</view>

		</view>
	</view>
</template>

<script>
export default {
	name: '',
	data() {
		return {

		}
	},
	onLoad() {

	},
	methods: {

	}
}
</script>

<style scoped>
	page {
		background: #fff;
	}

	.panel__title-center {
		font-size: 18px;
		text-align: center;
		height: 60px;
		line-height: 60px;
	}

	.group-infos_order {
		height: 24px;
		line-height: 24px;
		text-indent: 24px;
	}

	.signature {
		text-align: right;
	}

	.group-infos__title {
		display: block;
		height: 60px;
		line-height: 60px;
	}
</style>
