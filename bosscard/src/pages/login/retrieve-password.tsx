import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, message } from 'antd';
import request from 'utils/request';
const styles = require('./index.less');

interface Props {
	type?: number;
	dispatch: (any) => any;
}

export default connect(({ login }) => login)(
	Form.create({})(
		class RetrievePassword extends Component<Props | any> {
			state = {
				type: '',
				time: 0,
				codeLoading: false,
				submitLoading: false
			};
			handleFocus = type => () => this.setState({ type });
			handleBack = () => this.props.dispatch({ type: 'login/setState', payload: { type: 1 } });
			handleGetCode = () => {
				this.props.form.validateFields(['phone']).then(res => this.getCode(res.phone));
			};
			getCode = phone => {
				this.setState({
					codeLoading: true
				});
				request({ url: 'forgot/password/code', data: { phone }, skip: true })
					.then(res => {
						if (res.code === '0') {
							this.setState({ time: 60, codeLoading: false });
							const timer = setInterval(() => {
								this.setState({ time: this.state.time - 1 }, () => {
									if (this.state.time === 0) {
										clearInterval(timer);
									}
								});
							}, 1000);
						} else if (res.code === 422) {
							this.props.form.setFields({
								user: {
									errors: [new Error(res.content)]
								}
							});
						}
					})
					.catch(() => this.setState({ codeLoading: false }));
			};
			submit = () => {
				this.props.form.validateFieldsAndScroll(error => {
					if (!error) {
						this.setState({ submitLoading: true });
						request({
							url: 'forgot/password',
							method: 'post',
							data: this.props.form.getFieldsValue(),
							skip: true
						})
							.then(res => {
								this.setState({ submitLoading: false });
								if (res.code === '0') {
									message.success('修改成功');
									this.props.dispatch({ type: 'login/setState', payload: { type: 1 } });
								} else if (res.code === 422) {
									this.props.form.setFields({
										code: {
											errors: [new Error(res.content)]
										}
									});
								}
							})
							.catch(() => this.setState({ submitLoading: false }));
					}
				});
			};

			handleValidatePhone = async (rules, value, callback) => {
				if (/^1[3456789][0-9]{9}$/.test(value)) {
					const res = await request({
						url: 'validate/phone',
						data: {
							phone: value
						},
						skip: true
					});
					if (res.code !== '0') {
						callback(res.message);
					} else {
						callback();
					}
					callback();
				} else {
					callback('请输入正确的手机号');
				}
			};

			render() {
				const { getFieldDecorator, getFieldValue } = this.props.form;
				return (
					<div className={styles.retrieve}>
						<div className="flex head">
							<div className="back-icon" onClick={this.handleBack}>
								<i className="iconfont icon-xiangzuo" />
								返回登陆
							</div>
							<div className="title">找回密码</div>
						</div>
						<Form>
							<Form.Item>
								<div className={this.state.type === 'phone' ? 'flex center active' : 'flex center'}>
									<div className="label">手机号:</div>
									<div className="item">
										{getFieldDecorator('phone', {
											validateTrigger: 'onBlur',
											rules: [
												{
													validator: this.handleValidatePhone
												}
											]
										})(
											<Input
												readOnly={this.state.type !== 'phone'}
												placeholder="请输入手机号"
												onFocus={this.handleFocus('phone')}
												onBlur={this.handleFocus('')}
												maxLength={11}
											/>
										)}
									</div>
								</div>
							</Form.Item>
							<Form.Item>
								<div className={this.state.type === 'code' ? 'flex center active' : 'flex center'}>
									<div className="label">验证码:</div>
									<div className="item">
										{getFieldDecorator('code', {
											validateTrigger: 'onBlur',
											rules: [
												{
													required: true,
													message: '请输入正确的验证码'
												},
												{
													pattern: /^[0-9]{6}$/,
													message: '请输入正确的验证码'
												}
											]
										})(
											<Input
												readOnly={this.state.type !== 'code'}
												placeholder="请输入验证码"
												onFocus={this.handleFocus('code')}
												onBlur={this.handleFocus('')}
											/>
										)}
									</div>
									<Button
										disabled={this.state.time !== 0}
										loading={this.state.codeLoading}
										onClick={this.handleGetCode}
										className={this.state.time === 0 ? styles.getCode : styles.getCodeDisabled}
										type="primary"
									>
										{this.state.time === 0 ? '获取验证码' : `${this.state.time}秒后可重新发送`}
									</Button>
								</div>
							</Form.Item>
							<Form.Item>
								<div className={this.state.type === 'password' ? 'flex center active' : 'flex center'}>
									<div className="label">新密码:</div>
									<div className="item">
										{getFieldDecorator('password', {
											validateTrigger: 'onBlur',
											rules: [
												{
													required: true,
													message: '请输入新密码'
												},
												{
													pattern: /^[0-9a-zA-Z]{6,}$/,
													message: '密码格式不对，请输入至少6位字母或数字'
												}
											]
										})(
											<Input
												readOnly={this.state.type !== 'password'}
												placeholder="至少6位数字母或数字"
												onFocus={this.handleFocus('password')}
												onBlur={this.handleFocus('')}
												type="password"
											/>
										)}
									</div>
								</div>
							</Form.Item>
							<Form.Item>
								<div
									className={this.state.type === 'newPassword' ? 'flex center active' : 'flex center'}
								>
									<div className="label">确认新密码:</div>
									<div className="item">
										{getFieldDecorator('passwordConfirmation', {
											validateTrigger: 'onBlur',
											rules: [
												{
													required: true,
													message: '请确认新密码'
												},
												{
													validator: (rules, value, callback) => {
														if (value && value !== getFieldValue('password')) {
															callback(true);
														} else {
															callback();
														}
													},
													message: '两次输入的新密码不一致'
												}
											]
										})(
											<Input
												readOnly={this.state.type !== 'newPassword'}
												placeholder="再次输入新密码"
												onFocus={this.handleFocus('newPassword')}
												onBlur={this.handleFocus('')}
												type="password"
											/>
										)}
									</div>
								</div>
							</Form.Item>
						</Form>
						<Button
							className={styles.btn}
							type="primary"
							style={{ marginTop: -10 }}
							onClick={this.submit}
							loading={this.state.submitLoading}
						>
							确定
						</Button>
					</div>
				);
			}
		}
	)
);
