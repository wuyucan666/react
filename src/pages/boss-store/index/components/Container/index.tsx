import * as React from 'react'
import {Button, Popover, Select} from 'antd'
import router from 'umi/router'

const style = require('./style.less')

const { Option } = Select

interface listItem {
  name: string,
  value: any,
}

interface searchItem {
  type: string,
  prop: string,
  list: Array<listItem>,
  defaultValue: any
}

interface defaultProps  {
  /**标题**/
  title: string,
  /**标题解释信息**/
  tip?: string | object,
  /**跳转链接**/
  link?: string,
  /**跳转链接文字**/
  linkText?: string,
  /**内容区域样式**/
  bodyStyle?: object,
  /**搜索配置**/
  searchConfig?: Array<searchItem>,
  /**搜索函数**/
  onSearchChange?: (query: object) => void,
  /**最外层class**/
  wrapperClass?: string,
}



class Container extends React.Component<defaultProps>{

  state = {
    data: {},
    query: {}
  }

  componentDidMount(){
    const {searchConfig = []} = this.props
    const query = {}
    searchConfig.forEach(item => {
      query[item.prop] = item.defaultValue
    })
    this.setState({query})
  }

  routerGo = () => {
    const {link} = this.props
    router.push(link)
  }

  searchChange = (value, prop) => {
    const {query} = this.state
    query[prop] = value
    this.setState({query}, () => {
      this.props.onSearchChange(query)
    })
  }

  render(){
    const {title, tip, link, linkText, bodyStyle, searchConfig = [], wrapperClass} = this.props
    const {query} = this.state
    return(
      <div className={`${style.box} ${wrapperClass}`} >
        <div className={style.box_head}>
          <div className={style.title}>
            {title}
            {tip && <Popover content={tip}><i className='iconfont icon-wenhao' /></Popover>}
          </div>
          <div>
            {
              searchConfig.map((item, index) => {
                if(item.type === 'list'){
                  return (
                    <Select size='large' style={{width: 220,}} value={query[item.prop]} key={index} onChange={value => this.searchChange(value, item.prop)}>
                      {
                        item.list.map((option, optionIndex) => (
                          <Option value={option.value} key={optionIndex}>{option.name}</Option>
                        ))
                      }
                    </Select>
                  )
                }
              })
            }
            {link && linkText && <Button size='large' className={style.link} onClick={this.routerGo}>{linkText} <i className='iconfont icon-quchakan'/> </Button>}
          </div>
        </div>
        <div className={style.box_content} style={{...bodyStyle}}>
          {/*{*/}
            {/*// @ts-ignore*/}
            {/*React.Children.map(this.props.children, (child) => React.cloneElement(child, {baseInfo: "def"}))*/}
          {/*}*/}
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Container
