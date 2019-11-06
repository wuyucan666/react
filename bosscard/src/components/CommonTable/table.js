import React from "react"
import PropTypes from "prop-types"
import { connect } from "dva"
import { Table, Tooltip } from "antd"
import RowBtns from "./rowBtns"
import style from "./table.less"

// 数据
const data = {
  showBtn: -1,
}

// 是否已经设置过table组件的state
let toSetState = false

/**
 * 全局组件
 */
class CommonTable extends React.PureComponent {
  state = {
    data: [],
  }
  /**
   * 设置每一列的宽度
   * 动态获取表头配置
   * @param {[type]} props [description]
   */
  constructor(props) {
    super(props)
    toSetState = false
    if (props.config.headers && props.config.headers.length) {
      this.state = this.getTableState(props)
    } else {
      this.state = {
        hasCheck: false,
        columns: [],
      }
    }

    /**
     * 是否发起数据请求
     * 当配置了查询条件时，表格不主动发起数据请求，需要screen组件发起请求
     **/
    if (!(props.config.screen && props.config.screen.rules)) {
      this.props.dispatch({
        type: "table/getTableConfig",
        payload: this.props.name,
      })

      this.props.dispatch({
        type: "table/setPageData",
        payload: {
          page: 1,
          limit: 10,
          total: 0,
          where: (props.config.screen ? props.config.screen.query : {}) || {},
        },
      })

      this.props.dispatch({
        type: "table/getData",
        payload: {
          name: this.props.name,
          new: this.props.New,
          mock: this.props.mock,
          wrapperQuery: this.props.config.screen
            ? this.props.config.screen.wrapperQuery || {}
            : {},
        },
      })
    }
  }

  /**
   * 更新props时
   * @param {Object} prop nextProps
   */
  UNSAFE_componentWillReceiveProps(prop) {
    // 当配置变更时
    if (
      JSON.stringify(prop.config.headers) !==
      JSON.stringify(this.props.config.headers)
    ) {
      const state = this.getTableState(prop)
      this.setState(state)
    }
    if (
      JSON.stringify(prop.table.data) !== JSON.stringify(this.props.table.data)
    ) {
      console.log(prop.table)
      this.setState({
        data: prop.onDataChangeBefore(prop.table.data, prop.table.total),
      })
    }
    if (prop.config.hasTotal && !prop.config.selectTotal) {
      this.getSelectTotalData(prop.table.data, this.props.table.selectedRowKeys)
    }
  }

  /**
   * 获取新的tableState
   * @param {Object} prop 组件props
   */
  getTableState(prop) {
    if (toSetState) {
      return false
    } else {
      toSetState = true
    }
    const { name } = prop || this.props

    const { headers, hasCheck = false } = prop ? prop.config : this.props.config

    /**
     * 渲染content内容
     * @param  {[type]} text   [description]
     * @param  {[type]} column [description]
     * @param res
     * @return {[type]}        [description]
     */
    function getContent(text, column, res) {
      // 总计数据不需要处理
      if (res.isTotalData) return <b>{text}</b>
      if (column.render) {
        return column.render(res, text)
      } else {
        if (text || text === 0) {
          return text.length > 11 ? (
            <Tooltip title={text}>{text.slice(0, 10)}...</Tooltip>
          ) : (
              text
            )
        }
      }
    }

    /**
     * 计算表格组件的props
     * 包括 模块名称，是否具有全选，默认选择的项，columns
     * @type {[type]}
     */
    const tableProps = {
      ...data,
      name,
      hasCheck,
      selectedRowKeys: [],
      columns: headers.map((v, i) => {
        // 针对排序条件的列，进行处理
        const sorter = v.sortFilterType === "sort"
        return {
          ...v,
          title: (
            <div className={style.flex}>
              <div className={style.item}>{v.name}</div>
            </div>
          ),
          key: new Date().getTime() + i,
          dataIndex: v.prop,
          width: v.width,
          sorter,
          render(text, res) {
            return getContent(text, v, res)
          },
        }
      }),
    }
    return tableProps
  }

  editHeaders() { }

  componentWillUnmount() {
    this.props.dispatch({
      type: "table/setData",
      payload: [],
    })
  }

  /**
   * 翻页时更新数据
   * @param  {Number} current 选择第几页
   * @param {Object} columb 当前发生变化的列
   * @param {String} order 当前排序类型 状态: "ascend" 升序 "descend" 降序
   */
  handleTableChange({ current }, other, { column, order }) {
    // 收集排序条件
    let orders = {}
    if (order) {
      orders[column.prop] = order === "ascend" ? 1 : 2
    }

    // 翻页时
    this.setState({
      selectedRowKeys: [],
    })
    /**当前表格排序条件清空时，是否有默认排序条件进行排序 */
    if (JSON.stringify(orders) === "{}") {
      const screen = this.props.config.screen
      if (screen && screen.order) {
        for (let key in screen.order) {
          orders[key] = screen.order[key] === "ascend" ? 2 : 1
        }
      }
    }
    this.props.dispatch({
      type: "table/setPageData",
      payload: {
        page: current || 1,
        order: orders,
      },
    })
    this.props.dispatch({
      type: "table/getData",
      payload: {
        new: this.props.New,
        mock: this.props.mock,
        wrapperQuery:
          (this.props.config.screen && this.props.config.screen.wrapperQuery) ||
          {},
      },
    })
  }

  /**
   * 计算选中项的合计数据 or 获取后端返回的合计数据
   * @param {Object} data 数据
   * @param {Array} selectedRowKeys 选择的项
   */
  getSelectTotalData(data, selectedRowKeys) {
    const { selectTotal } = this.props.config
    let totalData = { key: new Date().getTime() + 'total' }
    // 首次计算合计数据
    if (this.props.config.hasTotal && this.props.table.total) {
      totalData = {
        ...this.props.table.total,
        isTotalData: true,
        key: new Date().getTime() + "_total",
      }
      this.setState({
        data: [...data, totalData],
      })
    } else if (selectTotal) {
      selectTotal.forEach(key => {
        if (!totalData[key]) {
          totalData[key] = 0
        }
        data.forEach(_ => {
          const checked = selectedRowKeys.find(key => key === _.key)
          if (checked && _[key]) {
            totalData[key] += parseFloat(_[key]) * 10
          }
        })
        totalData[key] = totalData[key] / 10
      })

      this.setState({
        data: [
          ...data,
          {
            ...totalData,
            isTotalData: true,
            key: new Date().getTime() + "_select_total",
          },
        ],
      })
    }
  }

  getRowBtn(isScroll) {
    const btns = this.props.config.moreBtn.filter(_ => _.type < 200)
    if (!btns.length) {
      return false
    }
    let width = btns.length * 50 + 10 + "px"
    /**没有横向滚动的表格 操作列的宽度为剩余百分比 */
    if (!isScroll) {
      /**当前所有列的百分比和 */
      const totalWidth = this.props.config.headers.reduce(
        (total, item) => total + parseInt(item.width),
        0
      )
      width = 100 - totalWidth - 5 + "%"
    }
    return {
      title: "操作",
      width,
      fixed: isScroll ? "right" : "",
      align: "left",
      key: "operation",
      render: (text, res) => (
        <RowBtns
          moreBtn={btns}
          itemClick={this.props.onTableChange}
          item={res}
        />
      ),
    }
  }

  render() {
    const { ...tableProps } = this.props

    // 选择的字段进行合计
    const selectTotal = tableProps.config.selectTotal

    // 分页数据
    const pageData = this.props.table.pageData[this.props.name]

    let rowSelection = null

    // 横向滚动设置
    let scroll = tableProps.config.isScroll
      ? {
        x:
          tableProps.config.headers.reduce(
            (total, _) => (parseInt(_.width) || 0) + total,
            0
          ) + 70,
      }
      : undefined

    /**得到表格父级元素的标签 */
    const tableWraper = document.querySelector(".contentData")

    /**计算columns属性 */
    let columns = this.state.columns || []

    /**当当前表格的总宽度小于屏幕宽度时，不需要横向滚动 */
    if (tableWraper) {
      if (scroll) {
        scroll = scroll.x < tableWraper.clientWidth - 64 ? undefined : scroll
        if (!scroll) {
          columns = columns.map(_ => ({ ..._, fixed: false }))
        }
      }
    }

    // 首列的宽度
    let firstcloumnWidth = scroll ? 70 : "5%"

    /**首列 */
    const firstCol = {
      title: "序号",
      dataIndex: "key",
      width: firstcloumnWidth,
      key: "-1",
      align: "left",
      fixed: scroll ? "left" : undefined,
      render: (text, record, index) => {
        if (tableProps.config.hasTotal || selectTotal) {
          if (index === this.props.table.data.length) {
            return <b>{selectTotal ? "已选合计:" : "合计:"}</b>
          }
        }
        // console.log("pageData", pageData)
        return (pageData.page - 1) * 10 + index + 1
      },
    }

    /**是否需要首列 序号 */
    columns = tableProps.config.hideFirstCol
      ? [...columns]
      : [firstCol, ...columns]

    /**计算右边的操作列 */
    const rowBtns = this.getRowBtn(scroll)
    /**载入正确的操作列 */
    columns = rowBtns ? [...columns, rowBtns] : columns

    // 得到合计数据
    let totalData = this.props.config.hasTotal || selectTotal

    /**
     * 判断当前配置项是否需要checkout
     * @param  {[type]} this.state.hasCheck [description]
     * @return {[type]}                     [description]
     */
    if (this.state.hasCheck || selectTotal) {
      // const loginType = localStorage.getItem("loginType")
      rowSelection = {
        columnWidth: scroll ? 50 : "5%",
        hideDefaultSelections: true,
        selectedRowKeys: this.props.table.selectedRowKeys,
        getCheckboxProps(record) {
          if (tableProps.config.hasTotal || selectTotal) {
            if (record.isTotalData) {
              return {
                disabled: true,
              }
            }
          }
          return {}
        },
        onChange: arr => {
          this.props.dispatch({
            type: "table/setSelectedRowKeys",
            payload: arr,
          })

          if (selectTotal) {
            this.getSelectTotalData(this.props.table.data, arr)
          }
        },
      }
    }

    /**计算出当前页有多少条数据，特殊页面不分页的情况需要考虑 */
    const pageSize = totalData
      ? pageData.limit + 1
      : pageData.curSize < pageData.limit
        ? pageData.limit
        : pageData.curSize
    // 页码
    const pagination = this.props.config.hidePagenation
      ? false
      : {
        pageSize,
        current: pageData.page,
        total: totalData ? pageData.total + 1 : pageData.total,
        showTotal: () => (
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              color: "#999",
            }}
          >
            本页显示
              <span style={{ color: "#333" }}>
              {pageData.curSize ? pageData.curSize : pageData.limit}
            </span>
            条记录，共<span style={{ color: "#333" }}>{pageData.total}</span>
            条记录
            </div>
        ),
        showQuickJumper: true,
      }

    return (
      <Table
        ref="DataTable"
        rowKey="key"
        columns={columns}
        dataSource={this.state.data}
        loading={this.props.table.loading}
        onChange={this.handleTableChange.bind(this)}
        pagination={pagination}
        scroll={scroll}
        {...tableProps}
        rowSelection={rowSelection}
      />
    )
  }
}

/**
 * 组件props字段类型定义
 * @type {Object}
 */
CommonTable.propTypes = {
  name: PropTypes.string,
}

/**
 * 连接model
 * @param  {[type]} ({table} [description]
 * @return {[type]}            [description]
 */

export default connect(({ table }) => ({ table }))(CommonTable)
