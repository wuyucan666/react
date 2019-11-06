/**
 * Created by kikazheng on 2019/6/20
 */
import React,{Component} from 'react'
import {Modal,Popover, Empty} from 'antd'
import styles from './style.less'
import services from 'services'


class Content extends Component{
  render(){
    const {list, onClick} = this.props
    return(
      <div className={styles.popBrandList}>
        {
          !list.length && <Empty style={{margin: 'auto'}}/>
        }
        {
          list.map(item => (
            <a key={item.carBrandId} href={`#car-${item.carBrandId}`} onClick={onClick}>
              <div className={styles.popCarImg}>
                <img src={item.icon.requestAddress} alt=' '/>
              </div>
              <span title={item.autoName}>{item.autoName}</span>
            </a>
          ))
        }
      </div>
    )
  }
}

class Brand extends Component{
  state = {
    data:[],
    cacheData:[],
    overBrandList:[],
    letterList:[{"name":"A","visible":false},{"name":"B","visible":false},{"name":"C","visible":false},{"name":"D","visible":false},{"name":"E","visible":false},{"name":"F","visible":false},{"name":"G","visible":false},{"name":"H","visible":false},{"name":"I","visible":false},{"name":"J","visible":false},{"name":"K","visible":false},{"name":"L","visible":false},{"name":"M","visible":false},{"name":"N","visible":false},{"name":"O","visible":false},{"name":"P","visible":false},{"name":"Q","visible":false},{"name":"R","visible":false},{"name":"S","visible":false},{"name":"T","visible":false},{"name":"U","visible":false},{"name":"V","visible":false},{"name":"W","visible":false},{"name":"X","visible":false},{"name":"Y","visible":false},{"name":"Z","visible":false}],
  }
  componentDidMount(){
    this.getData()
  }

  handleSelected = (carBrandId,seriesId,autoName,seriesName,icon) => {
    const data = {
      seriesId: seriesId,
      carBrandId: carBrandId,
      carBrandName: autoName,
      seriesName: seriesName,
      carIcon: icon.id,
      carIconUrl: icon.requestAddress,
    }
    this.props.onOk(data)
  }

  getData = () => {
    services.getCarBrand().then(res => {
      if(res.success){
        const {list} = res
        const cacheData = []
        let data = []
        for(let i in list){
          const obj = {}
          obj.letter = i
          obj.list = list[i]
          cacheData.push(obj)
          data = data.concat(list[i])
        }
        this.setState({
          data,
          cacheData,
        })
      }
    })
  }

  onMouserOver = (letter, index) => {
    const {cacheData, letterList} = this.state
    letterList[index].visible = true
    this.setState({
      letterList,
      overBrandList:cacheData.filter(item => item.letter === letter)[0] ? cacheData.filter(item => item.letter === letter)[0].list : [],
    })
  }

  unKnownBrand = () => {
    services.LIST({ keys: { name: 'common/carSeries' }, data: {q: {where: {carBrandId: 3310, carSeriesId: 1592}} } }).then(res => {
      if(res.code === '0'){
        const car = res.list[0]
        const data = {
          seriesId: car.series_id,
          carBrandId: car.brand_id,
          carBrandName: '未知品牌',
          seriesName: '未知车型',
          carIcon: car.brand_icon[0].id,
          carIconUrl: car.brand_icon[0].requestAddress,
        }
        this.props.onOk(data)
      }
    })
  }

  handleVisibleChange = (visible, index) => {
    const {letterList} = this.state
    letterList[index].visible = visible
    this.setState({ letterList })
  }

  carClick = () => {
    const {letterList} = this.state
    letterList.forEach(item => {
      item.visible = false
    })
    this.setState({ letterList })
  }
  render(){
    const {letterList,overBrandList,data} = this.state
    const {visable, onCancel} = this.props
    return(
      <Modal
        closable={false}
        footer={null}
        width={570}
        keyboard={false}
        maskClosable={false}
        visible={visable}
        destroyOnClose
        onOk={this.handleOk}
      >
        <div style={{padding: '32px 0'}}>
          <div className={styles.back}  onClick={onCancel} ><i className='iconfont icon-xiangzuo'/>返回新建</div>
          <div className={styles.searchBar}>
            <div className={styles.tip}>
              <span>按品牌首字母选择</span>
              <span onClick={this.unKnownBrand}>未知品牌</span>
            </div>
            <div className={styles.letterList} id='letterList' style={{position:'relative'}}>
              {
                letterList.map((item,index) => (
                  <Popover
                    key={index}
                    visible={item.visible}
                    trigger="hover"
                    getPopupContainer={()=>document.querySelector('#letterList')}
                    content={<Content letter={item.name} list={overBrandList} onClick={this.carClick} />}
                    placement='bottom'
                    onVisibleChange={(visible) => this.handleVisibleChange(visible,index)}
                  >
                    <span onMouseOver={() =>{this.onMouserOver(item.name, index)}} >{item.name}</span>
                  </Popover>
                ))
              }
            </div>
          </div>
          <div className={styles.brandList}>
            {
              data.map(item => (
                <div className={styles.brandListItem} id={`car-${item.carBrandId}`} key={item.carBrandId}>
                  <div>
                    <span className={styles.carImg}>
                      <img src={item.icon.requestAddress} alt=' '/>
                    </span>
                    <span>{item.autoName}</span>
                  </div>
                  <div>
                    {
                      item.treeList&&item.treeList.map(item2 => (
                        <span
                          key={item2.seriesId}
                          title={item2.seriesName}
                          onClick={()=>this.handleSelected(item.carBrandId,item2.seriesId,item.autoName,item2.seriesName,item.icon)}
                        >
                        {item2.seriesName}
                        </span>
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </Modal>
    )
  }
}


export default Brand
