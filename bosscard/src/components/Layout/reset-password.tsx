import React, { Component } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';
import request from 'utils/request';
const styles = require('./reset-password.less');

export default connect(({ app }) => app)(
	Form.create()(
		class ResetPasswordModal extends Component<any> {
			state = {
				type: '',
				loading: false
			};

			handleFocus = type => () => this.setState({ type });

			handleCancel = () => {
				this.props.dispatch({ type: 'app/showSetPassword', payload: false });
			};

			submit = () => {
				this.props.form.validateFieldsAndScroll(error => {
					if (!error) {
						this.setState({ loading: true });
						request({ url: 'reset/password', method: 'post', data: this.props.form.getFieldsValue() })
							.then(res => {
								this.setState({ loading: false });
								if (res.code === '0') {
									this.handleCancel();
									message.success('修改成功');
									this.props.dispatch({ type: 'app/logout' });
								}
							})
							.catch(() => this.setState({ laoding: false }));
					}
				});
			};

			render() {
				const { getFieldDecorator, getFieldValue } = this.props.form;
				return (
					<Modal
						title="修改密码"
						width={634}
						visible={this.props.showResetPasswordModal}
						okButtonProps={{ loading: this.state.loading }}
						onOk={this.submit}
						onCancel={this.handleCancel}
					>
						<Form>
							<Form.Item className={styles.formItem}>
								<div className={this.state.type === 'password' ? 'flex center active' : 'flex center'}>
									<div className={styles.label}>旧密码:</div>
									<div className="item">
										{getFieldDecorator('currentPassword', {
											validateTrigger: 'onBlur',
											rules: [
												{
													required: true,
													message: '请输入旧密码'
												},
												{
													pattern: /^[0-9a-zA-Z]{6,}$/,
													message: '密码格式不对，请输入至少6位字母或数字'
												}
											]
										})(
											<Input
												size="large"
												readOnly={this.state.type !== 'password'}
												placeholder="请输入旧密码"
												onFocus={this.handleFocus('password')}
												onBlur={this.handleFocus('')}
												type="password"
											/>
										)}
									</div>
								</div>
							</Form.Item>
							<Form.Item className={styles.formItem}>
								<div className={this.state.type === 'password' ? 'flex center active' : 'flex center'}>
									<div className={styles.label}>新密码:</div>
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
												size="large"
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
							<Form.Item className={styles.formItem}>
								<div
									className={this.state.type === 'newPassword' ? 'flex center active' : 'flex center'}
								>
									<div className={styles.label}>确认新密码:</div>
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
												size="large"
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
					</Modal>
				);
			}
		}
	)
);
