import { Component } from 'react'
import { Form } from 'antd'
const Add = Form.create({
  mapPropsToFields(props) { //编辑操作,表单默认
    console.log(props)
  },
})(
  class extends Component {
    render () {      
      return (
        <div>123
        </div>
      )
    }
  }
)
export default Add
