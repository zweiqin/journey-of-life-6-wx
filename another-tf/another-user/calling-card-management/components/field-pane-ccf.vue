<template>
	<view class="field-pane-container">
		<view class="title">{{ title }}</view>
		<view v-for="item in fields" :key="item.label">
			<view
				v-if="(item.field === 'id') || (item.field === 'label') || (item.field === 'enterpriseUserId') || (item.field === 'buyerId')"
			>
			</view>
			<view v-else-if="item.field === 'birthday'">
				<view class="item">
					<template>
						<view
							class="input-wrapper" :style="{
								'flex-direction': item.type === 'textarea' ? 'column' : '',
								'align-items': item.type === 'textarea' ? 'flex-start' : ''
							}"
						>
							<view class="sub-title">{{ item.label }}</view>

							<view v-if="item.type === 'time' && item.field === 'birthday'" class="input">
								<input
									:value="form[item.field]" :disabled="true" type="text"
									:placeholder="item.placeholder"
									@click="$refs.dateTimeTradeB[0].show()"
								/>
								<tui-datetime
									ref="dateTimeTradeB" :type="2" radius
									@confirm="handleInput(item.field, $event)"
								></tui-datetime>
							</view>

						</view>
					</template>
				</view>
			</view>
			<view v-else-if="item.field === 'styleId'">
				<view class="item">
					<view
						class="input-wrapper" :style="{
							'flex-direction': item.type === 'textarea' ? 'column' : '',
							'align-items': item.type === 'textarea' ? 'flex-start' : ''
						}"
					>
						<view class="sub-title">{{ item.label }}</view>
						<view
							v-if="item.type === 'select' && item.field === 'styleId'" style="flex: 1" :style="{
								color: form.styleId ? '' : '#999'
							}" @click="isShowStyleListSelect = true"
						>
							{{ styleName || (form.styleId ? `已选样式：${form.styleId}` : "请选择样式") }}
						</view>
					</view>
				</view>
			</view>
			<view
				v-else-if="(item.field === 'enterpriseName') || (item.field === 'enterpriseDuties') || (item.field === 'enterpriseDepartment')"
			>
				<view v-if="form.isEnterprise === 'true'">
					<view class="item">
						<template>
							<view
								class="input-wrapper" :style="{
									'flex-direction': item.type === 'textarea' ? 'column' : '',
									'align-items': item.type === 'textarea' ? 'flex-start' : ''
								}"
							>
								<view class="sub-title">{{ item.label }}</view>
								<input
									v-if="item.type === 'input'" :value="form[item.field]" class="input" :disabled="false"
									:type="item.field === 'phone' ? 'number' : 'text'" :placeholder="item.placeholder"
									@input="handleInput(item.field, $event)"
								/>
							</view>
						</template>
					</view>
				</view>
				<view v-else></view>
			</view>
			<view v-else class="item">
				<template>
					<view
						class="input-wrapper" :style="{
							'flex-direction': item.type === 'textarea' ? 'column' : '',
							'align-items': item.type === 'textarea' ? 'flex-start' : ''
						}"
					>
						<view class="sub-title">{{ item.label }}</view>
						<input
							v-if="item.type === 'input'" :value="form[item.field]" class="input" :disabled="false"
							:type="item.field === 'phone' ? 'number' : 'text'" :placeholder="item.placeholder"
							@input="handleInput(item.field, $event)"
						/>

						<textarea
							v-if="item.type === 'textarea'" :value="form[item.field]" class="textarea"
							:placeholder="item.placeholder" @input="handleInput(item.field, $event)"
						></textarea>

						<tui-radio-group
							v-if="(item.type === 'radio') && (item.field === 'sex')" v-model="form[item.field]"
							@change="handleInput(item.field, $event)"
						>
							<view style="display: flex;">
								<tui-label v-for="(part, index) in [{ name: '男', value: '1' }, { name: '女', value: '2' }]" :key="index">
									<tui-list-cell padding="16rpx">
										<view>
											<tui-radio :checked="false" :value="part.value" color="#07c160" border-color="#999">
											</tui-radio>
											<text>{{ part.name }}</text>
										</view>
									</tui-list-cell>
								</tui-label>
							</view>
						</tui-radio-group>
						<tui-radio-group
							v-else-if="item.type === 'radio'" v-model="form[item.field]" style="display: flex;"
							@change="(e) => { }"
						>
							<view style="display: flex;">
								<tui-label v-for="(part, index) in [{ name: '是', value: 'true' }, { name: '否', value: 'false' }]" :key="index">
									<tui-list-cell padding="16rpx">
										<view>
											<tui-radio :checked="false" :value="part.value" color="#07c160" border-color="#999">
											</tui-radio>
											<text>{{ part.name }}</text>
										</view>
									</tui-list-cell>
								</tui-label>
							</view>
						</tui-radio-group>

					</view>
				</template>
			</view>
		</view>
		<!-- 样式 -->
		<tui-select
			:list="styleList" reverse :show="isShowStyleListSelect" @confirm="handleSelectStyleList"
			@close="isShowStyleListSelect = false"
		></tui-select>

	</view>
</template>

<script>

export default {
	name: 'FieldPaneCCF',
	props: {
		fields: {
			type: Array,
			required: true
		},
		value: {
			type: Object,
			required: true
		},
		title: String
	},

	data() {
		return {
			form: {},
			styleList: [],
			isShowStyleListSelect: false,
			styleName: ''
		}
	},

	watch: {
		fields: {
			handler(value) {
				if (value) {
					const form = {}
					for (const item of value) {
						form[item.field] = this.value[item.field]
						if (item.type === 'select' && item.field === 'styleId') this.getStyleList()
					}
					this.form = form
				}
			},
			immediate: true,
			deep: true
		},

		form: {
			handler(value) {
				this.$emit('input', value)
			},
			immediate: true,
			deep: true
		}
	},

	methods: {
		getStyleList() {
			// getxxxApi({})
			// 	.then((res) => {
			this.styleList = [{ styleId: 1, value: 1, text: '样式一' }, { styleId: 2, value: 2, text: '样式二' }, { styleId: 3, value: 3, text: '样式三' }]
			// })
			// .catch(() => {
			// 	this.$showToast('样式列表获取失败')
			// })
		},
		handleSelectStyleList(e) {
			this.isShowStyleListSelect = false
			this.styleName = e.options.text
			this.form.styleId = e.options.styleId
		},

		handleInput(field, e) {
			console.log(field, e)
			if (field === 'birthday') {
				this.form[field] = e.result
			} else {
				this.form[field] = e.detail.value
			}
		}
	}
}
</script>

<style lang="less" scoped>
.field-pane-container {
	margin-top: 30rpx;

	.title {
		font-size: 28rpx;
		color: #fa5151;
		font-weight: bold;
	}

	.item {
		padding: 20rpx 0;
		border-bottom: 1rpx solid #d8d8d8;
		margin-top: 20rpx;

		.input-wrapper {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 24rpx;
			color: #3d3d3d;

			.sub-title {
				margin-right: 20rpx;
			}

			/deep/ .uni-input-placeholder,
			/deep/ .uni-textarea-placeholder {
				font-size: 24rpx;
				color: #999;
			}

			.input {
				flex: 1;
				font-size: 24rpx;
			}

			.textarea {
				margin-top: 20rpx;
				width: 100%;
				height: 100px;
				font-size: 24rpx;
			}
		}
	}
}
</style>
