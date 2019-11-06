import {Component} from 'react'
import { connect } from 'dva'

import { Tooltip, Input  } from "antd"
import style from './table.less'

const Search = Input.Search


class SearchBtn extends Component {

  state = {
    isShow: false,
    searchStr: '',
  }

  showInput = () => {
    const input = this.refs.myInput
    input.focus()
    this.setState({
      isShow: true,
    })
  }

  hideInput = () => {
    this.setState({
      isShow: false,
    })
  }

  searchData = (value) => {
    const { search, dispatch, New } = this.props
    let temp = search.split(',')
    let str = ''
    temp.forEach(e => {
      str += `${e}[~]|`
    })
    str = str.slice(0,-1)
    dispatch({
      type: 'table/setPageData',
      payload: {where: { [str]: value}},
    })
    dispatch({
      type: 'table/getData',
      payload: {new: New},
    }).then(() => {
      dispatch({
        type: 'table/setPageData',
        payload: {where: {}},
      })
    })
  }

  passHandel = () => {
    if(this.state.isShow) {
      this.searchData(this.state.searchStr)
    }else { 
      this.showInput()
    }
  }

  blurHandel = (value) => {
    this.setState({
      searchStr: value,
    })

    if(!value) {
      this.setState({
        isShow: false,
      })
    }
  }

  render() {
    return (
      <div className={style['search-btn']}>
       <Search
          className={ 'animated ' + style['searchInput'] + (this.state.isShow ? ' fadeInRight' : ' fadeOut')}
          placeholder="请输入搜索的内容"
          size='large'
          onSearch={value => this.searchData(value)}
          onBlur={(e) => this.blurHandel(e.target.value)}
          ref="myInput"
        />
        <Tooltip key={77} title={'搜索'}>
        <i
          key={77}
          className={`iconfont icon-chazhao ${style['spec']}` + (this.state.isShow ? ` ${style['bg']}` : '')}
          onClick={this.passHandel}
        />
        </Tooltip>
      </div>
    )
  }
}

export default  connect()(SearchBtn)