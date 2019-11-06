import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Form, Input } from 'antd'
import styles from './index.less'
import logo from './image/logo.png'
import RetrievePassword from './retrieve-password'

const FormItem = Form.Item

class Login extends React.Component {
  state = {
    type: '',
  };
  handleClick = type => {
    this.setState({ type })
  };
  componentWillMount() {
    this.props.dispatch({ type: 'app/setSystemMessage', payload: [] })
  }
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      this.props.dispatch({
        type: 'login/login',
        payload: values,
        callback: ({ type, text }) => {
          const setFields = this.props.form.setFields
          if (type === '10404') {
            setFields({
              pwd: { errors: [new Error(text)] },
            })
          } else if (type === '10102') {
            setFields({
              phoneTem: { errors: [new Error(text)] },
            })
          }
        },
      })
    })
  };
  hanldeChangeType = () => this.props.dispatch({ type: 'login/setState', payload: { type: 2 } });
  render() {
    const { getFieldDecorator } = this.props.form
    const { loading } = this.props
    const { type } = this.state
    return (
      <div className={styles.loginPage}>
        <div className={styles.contentBox}>
          {this.props.type === 1 && (
            <div className={styles.loginContent}>
              <div className={styles.logo}>
                <img src={logo} alt="logo" />
              </div>
              <div className={styles.welcome}>欢迎回来，请登录</div>
              <Form layout="vertical" hideRequiredMark className={styles.form}>
                <FormItem label="" className={type === 'account' ? styles.active : ''}>
                  {getFieldDecorator('phoneTem', {
                    rules: [
                      {
                        required: true,
                        message: '请输入账号',
                        // len: 11,
                      },
                    ],
                  })(
                    <Input
                      onPressEnter={this.handleSubmit}
                      placeholder="账号"
                      maxLength={11}
                      type="phone"
                      addonBefore={<span className="iconfont icon-denglu" />}
                      onFocus={() => this.handleClick('account')}
                      onBlur={() => this.handleClick('')}
                    />
                  )}
                </FormItem>
                {/* {getFieldError('phoneTem') && <p className={styles.error}>请输入账号</p>} */}
                <FormItem label="" className={type === 'pwd' ? styles.active : ''}>
                  {getFieldDecorator('pwd', {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                      },
                    ],
                  })(
                    <Input
                      type="password"
                      onPressEnter={this.handleSubmit}
                      placeholder="密码"
                      addonBefore={<span className="iconfont icon-mima2" />}
                      onFocus={() => this.handleClick('pwd')}
                      onBlur={() => this.handleClick('')}
                    />
                  )}
                </FormItem>
                {/* {getFieldError('pwd') && <p className={styles.error}>请输入密码</p>} */}
                <Button
                  className={styles.btn}
                  type="primary"
                  onClick={this.handleSubmit}
                  loading={loading.effects.login}
                >
                  登录
								</Button>
                <div className={styles.retrieveTip}>
                  <span onClick={this.hanldeChangeType}>忘记密码？</span>
                </div>
              </Form>
            </div>
          )}
          {this.props.type === 2 && <RetrievePassword />}
        </div>
        {/* <div className={styles.tip}>技术支持：赞播智店信息科技有限公司 &nbsp;&nbsp;&nbsp;&nbsp; 备案号 粤ICP备18146222号</div> */}
      </div>
    )
  }
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ loading, login }) => ({ ...login, loading }))(Form.create()(Login))
