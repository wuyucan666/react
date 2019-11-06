import { Component } from 'react'
import style from './style.less'


export default class cardList extends Component {

  constructor (props) {
    super(props)
    this.state = {
    
    }
  }

  componentDidMount () {
    console.log('11111111111', this.contentNode)
    if (this.contentNode) {
      this.contentNode.addEventListener('scroll', this.onScrollHandle.bind(this))
    }
  }

  onScrollHandle = (event) => {
    const { loadMore } = this.props
    const clientHeight = event.target.clientHeight
    const scrollHeight = event.target.scrollHeight
    const scrollTop = event.target.scrollTop
    const isBottom = (clientHeight + scrollTop === scrollHeight)
    if(isBottom) {
      loadMore()
    }
    console.log('is bottom:' + isBottom)
  }

  choose = (item) => {
    // if(this.props.zeroDisable && item.stock*1 === 0) {
    //   return false
    // }
    let { selected, onChange } = this.props
    const index = selected.findIndex(_ => _.soleId === item.soleId)
    if(index === -1) {
      selected.unshift({...item, soleId: item.soleId})
      onChange(selected)
    }
  }

  cancel = (e,item) => {
    e.stopPropagation() //阻止冒泡
    const { selected, onChange } = this.props
    let index = selected.findIndex(_ => _.soleId === item.soleId)
    selected.splice(index,1)
    onChange(selected)
  }

  render() {
    const { list, selected, type } = this.props
    list.map(_ => {
      _.checked = false
      if(selected.findIndex(j => j.soleId === _.soleId) !== -1) {
        _.checked = true
      }
      return _
    })
    return(
      <div 
      ref={ node => this.contentNode = node } 
      className={this.props.type === 1 ? style.allList : style.allList2}>
        {
          list.length > 0 
          ?
          list.map((_,i) => {
            return (
              <div key={i} 
              // (this.props.zeroDisable && _.stock*1 === 0 ? style.disabled : '') 
              className={style.goods + ' ' + (_.checked ? style.checked : '')} 
              onClick={this.choose.bind(this,_)}>
              {/* {
                _.checked &&
                <span className="animated fadeIn" style={{marginRight: 8}} onClick={(e) => this.cancel(e, _)}>[取消]</span>
              } */}
              <span style={{flex: 1}}>{_.name}</span>
              {/* {
                (_.stock*1 === 0 && this.props.zeroDisable) &&
                <Button type="primary" onClick={() => this.props.setCurProduct(_.id)}>快捷入库</Button>
              } */}
              <span style={{width: 86, display: 'inline-block', textAlign: 'right'}}>{_.commodityCode}</span>
              {
                type === 1 ?
                <span>￥ {_.price}</span>
                :
                <span style={{width: 65, display: 'inline-block', textAlign: 'right'}}>{_.stock}</span>
              }
            </div>
            )
          })
          :
          <div className="flex center animated fadeIn" style={{flexDirection: 'column'}}>
            <img 
            style={{marginTop: 120, width: 62, marginBottom: 12}}
            src="
            data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhla
            WdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zy
            I+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZS
            IgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN
            4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplc
            m8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3Lj
            Q3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnY
            tOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNT
            UgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLj
            MyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4w
            MDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K" 
            alt=""/>
            <span style={{fontSize: 12, color: '#999'}}>暂无数据</span>
          </div>
        }
      </div>
    )
  }
}