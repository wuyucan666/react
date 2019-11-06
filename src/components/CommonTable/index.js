import MainTable from "./table"
import { connect } from "dva"
import moment from "moment"
import utilsTableConfig from "../../utils/table"
import Screen from "./screen"
import style from "./table.less"
import "animate.css"
import { Modal } from "antd"

const CommonTable = ({
  name,
  onTableChange,
  dispatch,
  New,
  mock,
  search,
  tableConfig,
  table,
  onDataChangeBefore,
  onReSet = () => { },
}) => {
  /**
   * 表格配置
   */
  const config = {
    ...(utilsTableConfig[name] || {}),
    ...tableConfig,
  }
  if (!Object.keys(config).length) {
    throw new Error("没有当前表格配置")
  }
  /**
   * 表格事件触发
   * @param {Number} type 事件类型
   * @param {Object} item 数据
   */
  const tableChange = (type, item) => {
    const id = config["id"]
    if (!id) throw new Error("utils/table.js相关配置缺少ID")

    const selectItems = table.data.filter(_ => table.selectedRowKeys.find(key => _.key === key))

    let ids = { [id]: selectItems.map(_ => _[id]) }

    switch (type) {
      // 删除
      case 1:
        let payloadId = { [id]: item[id] }

        //以下是后面添加删除全局提示操作
        let pathArr = [
          "/boss-brand/administor",
          "/boss-brand/supervisor",
          "/boss-store/staff",
        ]
        let nameObj = {
          "/boss-brand/administor": "管理员",
          "/boss-brand/supervisor": "督导",
          "/boss-store/staff": "员工",
        }
        let tipContent = `删除后该${
          nameObj[window.location.pathname]
          }账号将无法登录系统`
        return (() => {
          Modal.confirm({
            title: "您确定要删除吗?",
            content: `${
              pathArr.indexOf(window.location.pathname) >= 0 ? tipContent : ""
              }`,
            okText: "确认",
            cancelText: "取消",
            icon: (
              <div
                style={{
                  width: "37px",
                  height: "37px",
                  background: "#FF303D",
                  borderRadius: "50%",
                  textAlign: "center",
                  lineHeight: "37px",
                  marginLeft: "177px",
                  marginBottom: "10px",
                }}
              >
                <i
                  className="iconfont icon-shanchu"
                  style={{ color: "#fff" }}
                />
              </div>
            ),
            closable: true,
            centered: true,
            maskClosable: true,
            maskStyle: {
              background: "rgba(0,0,0,0.65)",
            },
            className: "madalDiv",
            onOk() {
              //点击确认时候的操作（dispath是之前的代码部分）
              dispatch({
                type: "table/del",
                payload: {
                  ...payloadId,
                  idVal: item[id],
                  new: New,
                  mock,
                  cb: () =>
                    dispatch({
                      type: "table/revoke",
                      payload: {
                        ...payloadId,
                        new: New,
                        idVal: item[id],
                        mock,
                      },
                    }),
                },
              })
            },
            onCancel() {
              // console.log('Cancel')
            },
          })
        })()
      // 批量删除
      case 213:

        //以下是后面添加删除全局提示操作
        let pathArray = ["/boss-store/staff"]
        let nameObjs = {
          "/boss-store/staff": "员工",
        }
        let tipContents = `删除后该${
          nameObjs[window.location.pathname]
          }账号将无法登录系统`
        return (() => {
          Modal.confirm({
            title: "您确定要删除所选项吗?",
            content: `${
              pathArray.indexOf(window.location.pathname) >= 0
                ? tipContents
                : ""
              }`,
            okText: "确认",
            cancelText: "取消",
            icon: (
              <div
                style={{
                  width: "37px",
                  height: "37px",
                  background: "#FF303D",
                  borderRadius: "50%",
                  textAlign: "center",
                  lineHeight: "37px",
                  marginLeft: "177px",
                  marginBottom: "10px",
                }}
              >
                <i
                  className="iconfont icon-shanchu"
                  style={{ color: "#fff" }}
                />
              </div>
            ),
            closable: true,
            centered: true,
            maskClosable: true,
            maskStyle: {
              background: "rgba(0,0,0,0.65)",
            },
            className: "madalDiv",
            onOk() {
              //点击确认时候的操作（dispath是之前的代码部分）
              dispatch({
                type: "table/del",
                payload: {
                  ...ids,
                  mock,
                  cb: () => dispatch({ type: "table/revoke", payload: ids }),
                },
              })
            },
            onCancel() {
              // console.log('Cancel')
            },
          })
        })()

      default:
        return onTableChange(type, item || selectItems, ids)

    }
  }

  const tableProps = {
    name,
    New,
    search,
    config,
    onDataChangeBefore: (data, total) => {
      if (onDataChangeBefore) {
        return onDataChangeBefore(data, total)
      } else {
        return data
      }
    },
    onTableChange() {
      tableChange(...arguments)
    },
  }

  /**
   * 过滤筛选数据
   * @param {Object} values 查询字段
   * @param {Array} rules 查询规则列表
   *
   * @param {Array} newQuery 用户自定义查询规则
   */
  const handleSearch = (values, rules, newQuery) => {
    let query = {},
      data = { ...values },
      value = undefined
    try {
      for (let key in data) {
        if (data[key] !== undefined) {
          let rule = {}
          // type : text 下的情况
          if (key === "text") {
            rule = { ...rules.find((_) => _.type === "text") }
            rule.prop = rule.prop
              .split(",")
              .map((_) => _ + "[~]")
              .join("|")
            value = data[key] === "" ? undefined : data[key]
          } else {
            rule = { ...rules.find((_) => _.prop === key) }
            /**
             * 其他type的情况
             */
            switch (rule.type) {
              case "text-cell":
                rule.prop = rule.prop + "[~]"
                value = data[key] === "" ? undefined : data[key]
                break
              case "date":
                rule.prop = rule.prop + "[<>]"
                let date = data[key].format("YYYY-MM-DD")
                let startTime = moment(date + " 00:00:00")
                let endTime = moment(date + " 23:59:59")
                value = [startTime.unix(), endTime.unix()]
                break
              case "month":
                rule.prop = rule.prop + "[<>]"
                if (data[key]) {
                  startTime = moment(data[key]).startOf("month")
                  endTime = moment(data[key]).endOf("month")
                  value = [startTime.unix(), endTime.unix()]
                } else {
                  value = undefined
                }
                break
              case "date<>":
                rule.prop = rule.prop + "[<>]"
                if (data[key].length) {
                  startTime = moment(
                    data[key][0].format("YYYY-MM-DD") + " 00:00:00"
                  )
                  endTime = moment(
                    data[key][1].format("YYYY-MM-DD") + " 23:59:59"
                  )
                  value = [startTime.unix(), endTime.unix()]
                } else {
                  value = undefined
                }
                break
              case "list":
                value = JSON.stringify(data[key]) !== 'undefined' && data[key] !== -999 ? data[key] : undefined
                break
              case "tree":
                value = data[key][data[key].length - 1]
                value = value > -1 ? value : undefined
                break
              case "check":
                rule.prop = rule.regProp
                value = data[key] ? rule.value : undefined
                break
              default:
                break
            }
          }
          query[rule.prop] = value
        }
      }
    } catch (e) {
      console.error("查询条件或者规则出错")
      console.error(e)
    }

    /**控件值优先级提高 */
    /**让控件值替换掉传递进来的默认值 */
    searchTable({ ...config.screen.query, ...query, ...newQuery })
  }

  /**
   * 查询表格数据
   * @param {Object} query 查询字段
   */
  const searchTable = (query) => {
    dispatch({
      type: "table/search",
      payload: { query, new: New, mock, wrapperQuery: config.screen ? config.screen.wrapperQuery : {} },
    })
  }

  /**
   * 重置函数
   */
  const handleReSet = async () => {
    const query = await onReSet()
    return query || {}
  }

  const moreBtn = config.moreBtn
    ? config.moreBtn.filter((_) => _.type > 200)
    : []

  return (
    <div className={style["common-table"]}>
      {(config.screen || !!moreBtn.length) && (
        <Screen
          tableChange={tableChange}
          onSearch={handleSearch}
          onReSet={handleReSet}
          colSpan={table.colSpan}
          name={name}
          config={{
            moreBtn,
            ...(config.screen || {}),
          }}
        />
      )}
      <MainTable {...tableProps} />
    </div>
  )
}

export default connect(({ table }) => ({ table }))(CommonTable)
