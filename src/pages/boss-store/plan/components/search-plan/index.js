import { Component } from "react"
import { DatePicker } from 'antd'
import PropTypes from "prop-types"
import moment from 'moment'
import style from "./index.less"

const { MonthPicker } = DatePicker

class SearchMember extends Component {
  state = {
    value: moment(),
  }
  componentDidMount() {
    const date = new Date()
    date.setMonth(date.getMonth())
    date.setDate(1)
    this.setState({
      value: moment(date),
    })
  }
  onChange = (e, time) => {
    const { gettime } = this.props
    gettime(time)
    this.setState({
      value: e,
    })
  }
  render() {
    const { value } = this.state
    return (
      <div className={style.searchMember}>
        <div className="flex center" style={{ marginBottom: 32 }}>
          <h3 className="item" >计划时间</h3>
        </div>
        <div className="search flex">
          <MonthPicker
            size='large'
            allowClear={false}
            style={{ width: '100%' }}
            value={value}
            onChange={this.onChange}
          />
        </div>
      </div>
    )
  }
}

SearchMember.propTypes = {
  onChange: PropTypes.func,
}

export default SearchMember
