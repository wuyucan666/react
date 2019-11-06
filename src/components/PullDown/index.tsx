import { Component } from 'react'
import { Select } from 'antd'
const style = require('./style.less')

const Option = Select.Option

export interface PageProps {
  /**显示的数据 */
  data: Array<Data>,
  /**回调 表单自动传入*/
  onChange: Function,
  /**默认参数 相当于表单 initialValue*/
  value: any,
  /**单位长度 */
  tdWidth: string,
  /**自定义props */
  customProp: Object,
}

type Data = {
  id: any,
  name: string,
}

class PullDown extends Component<PageProps> {

  change = (e) => {
    this.triggerChange(e)
  }

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue)
    }
  }

  render () {
    const { data, tdWidth, value, customProp = {} } = this.props
    return (
      <div className={style.pulldown}>
        <Select
          placeholder="请选择"
          size='large'
          value={value}
          onChange={this.change}
          {...customProp}
        >
          {
            data.map(v => {
              return (
                <Option key={v.id} value={v.id} className='ainier-option' style={{width: tdWidth}}>
                  {v.name}
                </Option>
              )
            })
          }
        </Select>
      </div>
    )
  }
}

export default PullDown
