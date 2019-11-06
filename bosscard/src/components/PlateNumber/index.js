import {Component} from 'react'
import PropTypes from 'prop-types'
import {Checkbox} from 'antd'
import services from 'services'
import style from './index.less'

const CheckboxGroup = Checkbox.Group
/**
 * 选择项目
 * 门店使用
 * 调用的所有接口为门店角色下的接口
 */
class plateNumber extends Component {
  constructor (props) {
    super(props)
    this.state = {
      plateList: [],
    }
  }
  componentDidMount () {
    console.log('000')
    this.getData()
  }
  /**
   * 初始化数据
   * @return {[type]} [description]
   */
  async getData () {
    const {list} = await services.list({keys: {name: 'store/projectcategory'}})
    if (list && list.length) {
      let obj = list.map(i => {
        return Object.assign(i, {value: i.categoryId, label: i.categoryName})
      })
      this.setState({plateList: obj})
      console.log(this.state, 555555555555)
    }
  }

  render () {
    return (
      <div className={style.card}>
        <CheckboxGroup onChange={this.props.onChanges} className={style.checkboxGroup} options={this.state.plateList} />
      </div>
    )
  }
}

plateNumber.propTypes = {
  onChanges: PropTypes.func,
}

export default plateNumber
