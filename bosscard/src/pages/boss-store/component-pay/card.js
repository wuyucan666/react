import { Component } from 'react'
import { Form, Input, Icon  } from 'antd'
import styles from './styles.less'

const FormItem = Form.Item

const Card = Form.create({
  mapPropsToFields(props) {
    const { type, editItem } = props
    if(type === 'edit'){
      let obj = {}
      Object.keys(editItem).map(v => {
        return obj[v] = Form.createFormField({
          value: editItem[v] ? editItem[v] : '',
        })
      })
      return obj
    }
  },
})(
  class extends Component {
    publish () {
      const { validateFields } = this.props.form
      validateFields((err, values) => {
        if (err) {
          return
        }
        for (let i in values) {
          if (!values[i]) {
            values[i] = ''
          }
        }
      })
    }
    render () {
      const { getFieldDecorator } = this.props.form
      const { item } = this.props
      return (
        <div className={styles.cardpay}>
          <div className={styles.bflex}><Icon type="alipay-circle" theme="outlined" /></div>
          <div>
            <div className={styles.paytxt}>
              <p>{item.paymentName}支付</p>
              <FormItem style={{'margin':'0'}}>
                {getFieldDecorator('paymentName')(
                  <Input className={styles.inputw96} placeholder="输入金额" />
                )}
              </FormItem>
            </div>
          </div>
        </div>
      )
    }
  }
)
export default Card
