import { Form, Input, Button, Cascader, Popover, Icon } from "antd"
import { Component } from "react"
import { allQueryArray } from "utils"
import validate from "../../../utils/validate"
import PropTypes from "prop-types"
import { connect } from "dva"
import CommonTable from "../../../components/CommonTable/index"
import services from "../../../services"
import styles from "./shop.less"
import { message } from "antd/lib/index"
import tableConfig from "./tableConfig"
const FormItem = Form.Item
const { TextArea } = Input

let init = true

const Tkbox = Form.create({
  mapPropsToFields(props) {
    //编辑操作,表单默认
    const { type, editItem, projectList, maintaintype } = props
    if (type === "edit") {
      let obj = {}
      editItem.categoryId = allQueryArray(
        projectList,
        editItem.categoryId,
        "categoryId"
      )
      editItem.maintainTypeId = allQueryArray(
        maintaintype,
        editItem.maintainTypeId,
        "maintainTypeId"
      )
      Object.keys(editItem).map(v => {
        return (obj[v] = Form.createFormField({
          value: editItem[v],
        }))
      })
      return obj
    }
  },
})(
  class extends Component {
    state = {
      count: 100,
      loading: false,
    }
    priceTemChange(e) {
      const value = e.target.value
      const { setFieldsValue } = this.props.form
      if (value * 1) {
        let num = (value * 1) / this.state.count
        setFieldsValue({ manHour: num.toFixed(2) })
      }
    }
    manHourChange(e) {
      const value = e.target.value
      const { setFieldsValue } = this.props.form
      let num = value * 1 * this.state.count
      setFieldsValue({ priceTem: num.toFixed(2) })
    }
    handleSubmit() {
      this.setState({loading: true})
      const { validateFields, resetFields } = this.props.form
      const { hideModal, dispatch, type, editItem } = this.props
      validateFields(async (err, values) => {
        if (err) {
          this.setState({loading: false})
          return
        }
        Object.keys(values).map(key => {
          if (!values[key]) {
            values[key] = ""
          }
          return true
        })
        values.salesCommissions = { money: 0, percent: 0, type: 1 }
        values.roadWorkCommissions = { money: 0, percent: 0, type: 1 }
        values.categoryId = values.categoryId[values.categoryId.length - 1]
        values.maintainTypeId = values.maintainTypeId[values.maintainTypeId.length - 1]
        values.salesCommissions = { money: 0, percent: 0, type: 1 }
        values.roadWorkCommissions = { money: 0, percent: 0, type: 1 }
        if (type === "add") {
          services.insert({ data: values, keys: { name: "brand/project" } }).then(res => {
            this.setState({loading: false})
            if (res.success) {
              hideModal()
              resetFields()
              message.success("添加成功！")
              dispatch({
                type: "table/getData",
                payload: "brand/project",
              })
            } else {
              message.error(res.content)
            }
          })
        } else {
          values.projectId = editItem.projectId
          services.update({ data: values, keys: { name: "brand/project" } }).then(res => {
            this.setState({loading: false})
            if (res.success) {
              hideModal()
              resetFields()
              message.success("修改成功！")
              dispatch({
                type: "table/getData",
                payload: "brand/project",
              })
            } else {
              message.error(res.content)
            }
          })
        }
      })
    }
    che(v, item) {
      let num = item[item.length - 1].price
      const { setFieldsValue, getFieldValue } = this.props.form
      this.setState({ count: num })
      if (getFieldValue("priceTem")) {
        setFieldsValue({ manHour: (getFieldValue("priceTem") * 1) / (num * 1) })
      } else {
        setFieldsValue({ manHour: "" })
      }
    }
    render() {
      const {
        getFieldDecorator,
        // getFieldError,
        getFieldValue,
      } = this.props.form
      const {
        hideModal,
        type,
        projectList,
        maintaintype,
        editItem,
      } = this.props
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
      }
      const reviseCategory = type === 'edit' ? getFieldValue('categoryId') !== editItem.categoryId : false
      return (
        <div className="from-wrap-margin">
          <p className={styles.title}>
            {type === "edit" ? "编辑项目" : "新增项目"}
          </p>
          <div className={styles.centerDiv}>
            <Form>
              <FormItem {...formItemLayout} label="项目名称">
                {getFieldDecorator(
                  "projectName",
                  validate("项目名称", {
                    required: true,
                    max: 30,
                    type: "string",
                    sole: true,
                    key: 'name',
                    model: "Project",
                    id: editItem.projectId,
                  })
                )(
                  <Input
                    className="inputwidth"
                    size="large"
                    placeholder="输入项目名称"
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="分类" help={reviseCategory ? <span style={{color: '#ff6f28 '}}>注意：分类修改后，项目不再享有原分类折扣</span> : ''}>
                {getFieldDecorator(
                  "categoryId",
                  validate("分类", { required: true, type: "select" })
                )(
                  <Cascader
                    size="large"
                    placeholder="请选择分类"
                    options={projectList}
                    expandTrigger="hover"
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="业务类型">
                <div className={styles.espInput350}  style={{position:'relative'}}>
                  {getFieldDecorator(
                    "maintainTypeId",
                    validate("业务类型", { required: true })
                  )(
                    <Cascader
                      size="large"
                      placeholder="请选择业务类型"
                      options={maintaintype}
                      expandTrigger="hover"
                    />
                  )}
                  <span style={{position:'absolute',right:'-30px'}}>
                    <Popover
                      trigger="click"
                      content="总部内所有业务的板块分类。"
                      placement="bottom"
                    >
                      <Icon
                        style={{ color: "#4AACF7", marginLeft: "10px",fontSize: '16px' }}
                        type="question-circle"
                      />
                    </Popover>
                  </span>
                </div>
              </FormItem>
              <FormItem {...formItemLayout} label="成本">
                {getFieldDecorator("costTem",
                  validate("成本", { min: 0, type: "price1" }))(
                  <Input
                    className="inputwidth"
                    size="large"
                    placeholder="成本"
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="备注">
                {getFieldDecorator("remark", validate("备注", { max: 200 }))(
                  <TextArea
                    className="inputwidth"
                    placeholder="备注"
                    style={{
                      width: "350px",
                      height: "80px",
                    }}
                  />
                )}
              </FormItem>
              <div className={styles.btnDiv}>
                <Button
                  type="primary"
                  size="large"
                  loading={this.state.loading}
                  onClick={this.handleSubmit.bind(this)}
                >
                  提交
                </Button>
                <Button onClick={hideModal} size="large">
                  取消
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )
    }
  }
)

class project extends Component {
  state = {
    visible: false,
    type: "",
    category: "",
  }
  componentDidMount() {
    this.props.dispatch({ type: "project/getType" })
    this.props.dispatch({ type: "project/getMaintain" })
  }
  componentWillUnmount(){
    this.onReset()
    init = true
  }
  showModal = () => {
    this.setState({
      visible: true,
    })
  }
  hideModal = () => {
    this.setState({
      visible: false,
    })
  }
  // 操作
  onTableChange = (e, v) => {
    const { dispatch } = this.props
    if (e === 217) {
      dispatch({ type: "project/edit", payload: {} })
      this.showModal()
      this.setState({
        type: "add",
      })
    }
    if (e === 11) {
      dispatch({ type: "project/edit", payload: v })
      this.showModal()
      this.setState({
        type: "edit",
      })
    }
  }
  onReset = () => {
    if(!init){
      tableConfig.screen.rules[1].value = undefined
      delete tableConfig.screen.query.categoryId
    }
  }
  render() {
    const {
      dispatch,
      editItem,
      projectList,
      maintaintype,
    } = this.props
    tableConfig.screen.rules[1].list = [...projectList]
    const {query} = this.props.history.location
    if(init && query && query.categoryId){
      init = false
      const categoryId = []
      const list = tableConfig.screen.rules[1].list
      for(let i = 0; i < list.length; i++){
        if(list[i].categoryId === Number(query.categoryId)){
          categoryId.push(Number(query.categoryId))
          break
        }else {
          const children = list[i].children || []
          for(let j = 0; j < children.length; j++){
            if(children[j].categoryId === Number(query.categoryId)){
              categoryId.push(list[i].categoryId, children[j].categoryId)
            }
          }
        }
      }
      tableConfig.screen.rules[1].value = categoryId
      tableConfig.screen.query = {...tableConfig.screen.query, categoryId:Number(query.categoryId)}
    }
      return (
        <div>
          <div style={{ display: this.state.visible ? 'none' : '' }}>
            <CommonTable
              tableConfig={tableConfig}
              name="brand/project"
              refresh
              onTableChange={this.onTableChange}
              onReSet={this.onReset}
            />
          </div>
            {this.state.visible&&<Tkbox
              visible={this.state.visible}
              hideModal={this.hideModal.bind(this)}
              showModal={this.showModal}
              dispatch={dispatch}
              editItem={editItem}
              projectList={projectList}
              type={this.state.type}
              maintaintype={maintaintype}
            />}
        </div>
      )
  }
}

project.propTypes = {
  dispatch: PropTypes.func,
}

function mapStateToProps(state) {
  const { editItem, projectList, maintaintype } = state.project
  return { editItem, projectList, maintaintype }
}

export default connect(mapStateToProps)(project)
