import { Component } from "react"
import PropTypes from "prop-types"
import {
  Modal,
  Icon,
  Spin,
  Input,
  Button,
  Form,
  InputNumber,
  message,
  Cascader,
  Radio,
} from "antd"
import services from "services"
import List from "./list"
import style from "../style.less"

const Search = Input.Search
const { TextArea } = Input
const FormItem = Form.Item
const RadioGroup = Radio.Group

class AddtionProject extends Component {
  constructor(props) {
    super(props)

    this.state = {
      list: [], // 项目列表
      selected: props.selected, // 选择的列表
      loading: true, // 加载状态
      visible: false, // 显示状态
      tkshow: false, //添加项目弹窗
      idType: props.type === 1 ? "productId" : "projectId",
      nameType: props.type === 1 ? "productName" : "projectName",
      searchStr: null,
      searchCloseShow: false,
      where: {
        q: { where: { statusTem: 1 } },
      },
    }
  }

  /**
   * props更新时判断是否请求数据
   */
  static getDerivedStateFromProps(props) {
    return {
      visible: props.visible,
    }
  }

  resetSelected = selected => {
    this.setState({ selected: selected || [] })
  }

  /**
   * 删除选择项
   */
  delSelectItem = item => {
    const index = this.state.selected.findIndex(
      _ => _[this.state.idType] === item[this.state.idType]
    )
    if (index >= 0) {
      this.setState(({ selected }) => {
        let newSelected = [...selected]
        newSelected.splice(index, 1)
        return {
          selected: newSelected,
        }
      })
    }
  }

  componentDidMount() {
    this.getProjectList(this.state.where)
    const { onRef } = this.props
    if (onRef) {
      onRef(this)
    }
  }

  /**
   * 获取项目列表
   * @param  {[type]} categoryId [description]
   * @return {[type]}            [description]
   */
  async getProjectList(where) {
    this.setState({ loading: true })
    services
      .LIST({ keys: { name: "store/project/addition" }, data: where })
      .then(res => {
        if (res.success) {
          this.setState({ list: res.list, loading: false })
        }
      })
  }

  onSearch(value) {
    this.setState({ searchStr: value })
    this.getProjectList(this.state.where)
  }

  refresh() {
    this.setState({ searchStr: null })
    this.setState({ searchCloseShow: false })
  }

  cancel = () => {
    const form = this.props.form
    this.setState({ tkshow: false })
    form.resetFields()
  }

  onOk = () => {
    const form = this.props.form
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      values.maintainTypeId =
        values.maintainTypeId[values.maintainTypeId.length - 1]
      services
        .INSERT({ keys: { name: "store/project/addition" }, data: values })
        .then(res => {
          if (res.success) {
            this.getProjectList(this.state.where)
            this.setState({ tkshow: false })
            message.success("添加成功!")
          }
        })
      form.resetFields()
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { maintaintype } = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    return (
      <Modal
        width={900}
        visible={this.state.visible}
        title={"选择附加项目"}
        onCancel={() => this.props.onCancel()}
        onOk={() => {
          this.props.onCancel()
          this.props.onOk(this.state.selected)
        }}
      >
        {/* 添加附加项目弹框 */}
        <Modal
          visible={this.state.tkshow}
          title={"添加附加项目"}
          onCancel={this.cancel}
          onOk={this.onOk}
          style={{ marginTop: "100px" }}
        >
          <Form className="from-wrap-margin additional-wrap">
            <FormItem {...formItemLayout} label="项目名称">
              {getFieldDecorator("projectName", {
                rules: [{ required: true, message: "请输入项目名称!" }],
              })(<Input size="large" placeholder="请输入项目名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="成本">
              {getFieldDecorator("cost", {
                rules: [{ required: true, message: "请输入成本!" }],
              })(
                <InputNumber
                  size="large"
                  min={1}
                  placeholder="输入金额"
                  style={{ width: "100%" }}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="售价">
              {getFieldDecorator("priceTem", {
                rules: [{ required: true, message: "请输入售价!" }],
              })(
                <InputNumber
                  size="large"
                  min={1}
                  placeholder="输入金额"
                  style={{ width: "100%" }}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="维修类型">
              {getFieldDecorator("maintainTypeId", {
                rules: [{ required: false, message: "请选择维修类型!" }],
              })(
                <Cascader
                  size="large"
                  placeholder="请选择维修类型"
                  options={maintaintype}
                  expandTrigger="hover"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="状态">
              {getFieldDecorator("status", {
                rules: [{ required: false, message: "请选择状态!" }],
                initialValue: 1,
              })(
                <RadioGroup>
                  <Radio value={1}>启用</Radio>
                  <Radio value={0}>停用</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
              className="from-wrap-remark"
            >
              {getFieldDecorator("remark", {
                rules: [{ required: false, message: "" }],
              })(
                <TextArea
                  style={{ width: "358px", height: "80px" }}
                  placeholder="备注"
                />
              )}
            </FormItem>
          </Form>
        </Modal>
        <div className="flex">
          <div className="item" />
          <Search
            size="large"
            value={this.state.searchStr}
            onChange={e => this.setState({ searchStr: e.target.value })}
            style={{ width: 260, marginBottom: 24 }}
            placeholder="名称"
            enterButton
            onSearch={this.onSearch.bind(this)}
          />
          <Button
            style={{ marginLeft: "24px" }}
            type="primary"
            size="large"
            onClick={() => this.setState({ tkshow: true })}
          >
            <i
              style={{ marginRight: "8px" }}
              className="iconfont icon-tianjia"
            />
            添加项目
          </Button>
        </div>
        <Spin spinning={this.state.loading}>
          <List
            type={this.props.type}
            onChange={selected => this.setState({ selected })}
            selected={this.state.selected}
            list={this.state.list}
            nameType={this.state.nameType}
            idType={this.state.idType}
          />
        </Spin>
        {/*选择的列表*/}
        <div className={style.select + " flex"}>
          <div className="title">已选择</div>
          <div className="item">
            {this.state.selected.map(_ => (
              <div className="select-item" key={_[this.state.idType]}>
                {_[this.state.nameType]}
                <Icon
                  type="close"
                  theme="outlined"
                  onClick={() => this.delSelectItem(_)}
                />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    )
  }
}

AddtionProject.propTypes = {
  visible: PropTypes.bool, // 是否显示modal
  onCancel: PropTypes.func, // 取消事件
  onOk: PropTypes.func, // 确定事件
  selected: PropTypes.arrayOf(PropTypes.object), // 选择的值
  type: PropTypes.number, //1产品 2项目 默认项目
  onRef: PropTypes.func, // 获取当前组件ref
}

export default Form.create()(AddtionProject)
