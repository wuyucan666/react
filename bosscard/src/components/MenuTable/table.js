import React, { Component } from "react"
import styles from "./styles.less"
import { connect } from "dva"
import { Checkbox, Pagination,Tooltip  } from "antd"
import { message } from "antd";

// import services from 'services'

class Table extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAll: false,
      tree: [],
      dataList: [],
      dataNum: null,
      storeList: [],
      loading:false,
    }
    this.storeList=[]
  }
  //发起请求
  serverApi=(api, t)=> {
    const { dispatch } = this.props
    this.setState({
      loading:true,
    },()=>{
      dispatch({
        type: api,
        payload: { ...t },
      }).then(()=>{
        this.setState({
          loading:false,
        })
      })
    })
  }
  //改变分页
  changePage=(val)=> {
    this.props.changePage(val)
    this.setState({
      isAll: false,
    })
  }
  onSelect=(keys)=> {
    if (keys.length === 0) return
    this.searchSelect({ q: { where: { cid: keys } } })
  }
  //进行分类筛选
  searchSelect=(t)=> {
    const { api } = this.props
    this.serverApi(api.getData, t)
  }

  componentDidMount() {
    var { dataList } = this.props
    dataList = dataList.map((item) => ({
      ...item,
      checked: false,
    }))
    this.setState({
      dataList,
    })
  }
  //根据props传参更新状态
  UNSAFE_componentWillReceiveProps(nextsprops) {
    var { dataList } = nextsprops
    var List = [],
      state = []
    nextsprops.selectList
    .forEach((item) => {
      List.push(item)
    })
    List
    .forEach((item) => {
      state.push(item.id)
    })
    dataList = dataList
    .map((item) => {
      if( state.indexOf(item.id) >= 0){
        return {
          ...item,
          checked: true,
        }
      }else {
        return {
          ...item,
          checked: false,
        }
      }
    })
    this.setState(
      {
        dataList,
        // isAll:state.length === this.state.dataList.length ? true :false ,
        // storeList: List,
      },
      () => {
        this.storeList=List
      }
    )
  }
  onChange=(e)=> {
    const { api } = this.props
    this.setState(
      {
        isAll: !this.state.isAll,
      },
      () => {
        var all = [],
          state = []
        api.getData !== "storeAdjustment/getProductData"
          ? (all = this.state.dataList
            .filter((v) => {
              return v.number === 0 ? false : true
            }))
          : (all = this.state.dataList)
        if (this.state.isAll === true) {
          state = this.storeList
          .map((item) => {
            return item.id
          })
          all
          .forEach((item) => {
            state.indexOf(item.id) >= 0 ? null : this.storeList.push(item)
          })
        }
        if (this.state.isAll === false) {
          state = this.state.dataList
          .map((item) => {
            return item.id
          })
          this.storeList= this.storeList
          .filter((item) =>
              state.indexOf(item.id) >= 0 ? false : true
          )
        }
        this.props.addproduct(this.storeList)
      }
    )
    if (e.target.prefixCls === "ant-checkbox")
      this.handerAllCheck(e.target.checked)
  }

  handerAllCheck=(state)=> {
    const { api } = this.props
    this.setState({
      dataList: this.state.dataList
      .map((item) => {
        if (api.getData !== "storeAdjustment/getProductData") {
          item.number === 0 ? null : (item.checked = state)
          return item
        } else {
          item.checked = state
          return item
        }
      }),
    })
  }

  handerCheck=(i, item)=> {
    const { api } = this.props
    if (api.getData !== "storeAdjustment/getProductData") {
      if (item.number === 0) {
        message.error('库存为零不可添加')
        return false
      }
    }
    this.setState(
      {
        dataList: this.state.dataList
        .map((item, idx) => {
          if (idx === i) item.checked = !item.checked
          return item
        }),
      },
      () => {
        var isAll,
          checkedList = []
        checkedList = this.storeList
        .map((item) => {
          return item.id
        })
        this.state.dataList
        .forEach((item) => {
          item.checked === false ? (isAll = false) : null
          item.checked === true ? checkedList.push(item) : null
        })

        checkedList
        .indexOf(item.id) < 0
          ? this.storeList.push(item)
          : this.storeList= this.storeList
          .filter((v) =>
                v.id === item.id ? false : true
              ),

        isAll === false
          ? this.setState({
              isAll,
            })
          : this.setState({
              isAll: true,
            })

        this.props.addproduct(this.storeList)
      }
    )
  }

  renderList=(list)=> {
    return list
    .map((item, idx) => {
      return (
        <li
          key={idx}
          onClick={this.handerCheck.bind(this, idx, item)}
          className={item.checked ? styles.zl_isChecked : null}
        >
           <Tooltip title={ item.name } >
          <span>
            <Checkbox checked={item.checked} />{" "}
            <i className={styles.zl_overflow}> {item.name} </i>{" "}
          </span>
          </Tooltip>
          <Tooltip    title={ item.spec } >
          <span style={{wordWrap:'break-word',wordBreak:'break-all'}}>{item.spec}</span>
          </Tooltip>
          <Tooltip  title={ item.code }   >
          <span style={{wordWrap:'break-word',wordBreak:'break-all'}}>{item.code}</span>
          </Tooltip>
          {this.props.api.getData === "storeAdjustment/getProductData" || (
            <span>{item.warehouseName}</span>
          )}
          <span>{item.number}</span>
        </li>
      )
    })
  }
  render() {

    return (
      <div className={styles.zl_table}>
        <p>
          <span>
            <Checkbox checked={this.state.isAll} onChange={this.onChange} />
            名称
          </span>
          <span>规格</span>
          <span>编码</span>
          {this.props.api.getData === "storeAdjustment/getProductData" || (
            <span> 仓库 </span>
          )}
          <span>目前库存</span>
        </p>
        <div className={styles.zl_tableContent}>
          <ul className={styles.zl_tablelist}>
            {this.renderList(this.state.dataList)}
          </ul>
          <div>

            {" "}
            <Pagination
              style={{ float: "right" }}
              current={this.props.currentPage}
              defaultCurrent={1}
              onChange={this.changePage}
              total={this.props.maxNumL}
            />
          </div>
        </div>

      </div>
    )
  }
}

export default connect()(Table)
