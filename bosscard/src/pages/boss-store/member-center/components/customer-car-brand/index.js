/**
 * Created by kikazheng on 2018/11/20
 */
import React,{Component} from 'react'
import {Modal,Popover,Select} from 'antd'
import debounce from 'lodash.debounce'
import styles from './style.less'
import services from 'services'

const { Option } = Select

class Content extends Component{
  render(){
    const {list} = this.props
    return(
      <div className={styles.popBrandList}>
        {
          list.map(item => (
            <a key={item.carBrandId} href={`#car-${item.carBrandId}`}>
              <div className={styles.popCarImg}>
                <img src={item.icon.requestAddress} alt=' '/>
              </div>
              <span>{item.autoName}</span>
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
    searchList:[],
    loading: false,
    keyword: undefined,
    selectLetter:'',
    selectBrand:[{name:'',value:''}],
    carBrandId:'',
    seriesId:'',
    autoName:'',
    seriesName:'',
    icon:'',
    letterList:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
  }
  componentDidMount(){
    this.getData()
  }

  handleSelected = (carBrandId,seriesId,autoName,seriesName,icon) => {
    const selectBrand = [{name:`${autoName}${seriesName}`,value:`${carBrandId}-${seriesId}`}]
    this.setState({
      selectBrand,
      carBrandId,
      seriesId,
      autoName,
      seriesName,
      icon,
    })
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
  handleOk = () => {
    const {selectBrand, carBrandId, seriesId, autoName, seriesName,icon} = this.state
    this.props.onOk(selectBrand, carBrandId, seriesId, autoName, seriesName,icon)
    this.reset()
  }
  handleCancel = () => {
    this.props.onCancel()
    this.reset()
  }
  reset = () => {
    this.setState({
      selectLetter:'',
      selectBrand:[{name:'',value:''}],
    },() => {
      this.getData()
    })
  }
  onMouserOver = (letter) => {
    const {cacheData} = this.state
    this.setState({
      overBrandList:cacheData.filter(item => item.letter === letter)[0] ? cacheData.filter(item => item.letter === letter)[0].list : [],
    })
  }
  handleChange = (e) => {
    const { searchList,data } = this.state
    // this.setState({ keyword: searchList[e].brand_name + ' - ' + searchList[e].series_name})

    const carBrandId = searchList[e].brand_id
    const selectData = data.filter(item => item.carBrandId === carBrandId)[0]
    const autoName = selectData.autoName
    const icon = selectData.icon
    console.log(searchList[e].series_name, 88888888, selectData)
    const seriesData = selectData.treeList.filter(item => item.seriesName === searchList[e].series_name)[0]
    const seriesName = seriesData.seriesName
    const seriesId = seriesData.seriesId
    const selectBrand = [{name:`${autoName}${seriesName}`,value:`${carBrandId}-${seriesId}`}]
    this.setState({
      selectBrand,
      carBrandId,
      seriesId,
      autoName,
      seriesName,
      icon,
      keyword: searchList[e].brand_name + ' - ' + searchList[e].series_name,
    })

  }
  search = (value) => {
    this.handleSearch(value)
  }
  handleSearch = debounce((e) => {
    this.setState({
      loading: true,
    })
    services.LIST({keys: {name: 'common/carSeries'}, data: {keyword: e}}).then(res => {
      if(res.code === '0'){
        this.setState({
          searchList: res.list,
          loading: false,
        })
      }
    })
  }, 500)
  render(){
    const {selectLetter,selectBrand,letterList,overBrandList,data,searchList, keyword, loading} = this.state
    const {visable} = this.props
    return(
      <Modal
        title="选择车型"
        width={713}
        keyboard={false}
        maskClosable={false}
        bodyStyle={{padding:'32px 29px'}}
        visible={visable}
        destroyOnClose
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Select
          className={styles.search}
          showSearch
          size='large'
          value={keyword}
          loading={loading}
          placeholder="按车型关键词搜索"
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={this.search}
          onChange={this.handleChange}
        >
          {
            searchList.map((item, index) => (
              <Option key={index}>
                <a href={`#car-${item.brand_id}`}>{item.brand_name} <span style={{color: '#333'}}>－ {item.series_name}</span></a>
              </Option>
            ))
          }
        </Select>
        <div className={styles["search-bar"]}>
          <div className={styles.tip}>快捷查找</div>
          <div className={styles.letterList} id='letterList' style={{position:'relative'}}>
            {
              letterList.map((item,index) => (
                <Popover
                  key={index}
                  trigger="hover"
                  arrowPointAtCenter={true}
                  getPopupContainer={()=>document.querySelector('#letterList')}
                  content={<Content letter={item} list={overBrandList} />}
                  placement='bottom'
                >
                  <span className={item === selectLetter ? styles.active : ''} onMouseOver={() =>{this.onMouserOver(item)}} >{item}</span>
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
                        className={`${item.carBrandId}-${item2.seriesId}` === selectBrand[0].value ?styles.brandActive:''}
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
      </Modal>
    )
  }
}

Brand.defaultProps = {
  visable:false,
  // letter:'A',
  // sbrand:[{name:'',value:''}],
}

export default Brand
