import React, { Component } from "react"
import styles from "./styles.less"
import CommonTable from "../../../components/CommonTable/index"
import tableConfig from "./tableConfig"
import { Button, Modal, Table, Input, Checkbox, message, Select,Form } from "antd"
import { connect } from "dva"
import services from "services"
import { __PROJECT_TYPE__ } from "utils/globalConfig"
import SelectProject from "components/SelectProject"

const Option = Select.Option

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selectProjects: [],
      selectProjectVisible: false,
      staffs: [], // 员工列表
      batchSetting: {
        // 批量设置
        show: false,
        title: "批量设置",
        time: 0,
        staffId: 0,
        isDisabled: false,
      },
    }
    services
      .list({ keys: { name: "store/staff" }, data: { curPage: -1 } })
      .then((res) => {
        if (res.code === "0") {
          let arr = res.list
          arr.unshift({staffId:0,staffName:'服务顾问'})
          this.setState({
            staffs:arr,
          })
        }
      })
  }

  /**
   * 表格按钮点击事件
   * @param {Number} type 点击的事件类型
   * @param {Object} item 点击的对象
   **/
  handerTableChange(type, item) {
    console.log("handerTableChange -> type: ", type,item)
    switch (type) {
      case 11:
        this.setState({
          selectProjects: [item],
          batchSetting: {
            ...this.state.batchSetting,
            show: true,
            title: "修改回访设置",
            staffId: item.staffId,
            isDisabled: item.isDisabled,
            time: item.time,
          },
        },()=>setTimeout(()=>{this.props.form.setFieldsValue({'visitTime':item.time,'staff':item.staffId})},0))
        break
        case 13:
        this.forbidden(item,true)
        break
        case 16:
        this.forbidden(item,false)
        break
      default:
    }
  }

  /**
   * 选择项目
   * @param {Array} items 选择的项目列表
   */
  selectProject(items) {
    services
      .LIST({
        keys: { name: "setting/remind/construction/create" },
        data: { ids: items.map((_) => _.projectId) },
      })
      .then((res) => {
        if(res.code==='0'){
          if (res.data.filters.length) {
            /**如果选择的项目已经设置，提醒用户 */
            const msg = res.data.filters.reduce(
              (total, _) =>
                items.find((item) => item.projectId === Number(_)).projectName +
                (total ? "," : "") +
                total,
              ""
            )
            message.warning(`项目：${msg}已经设置过回访`)
          } else {
            this.props.form.resetFields()
            this.props.form.setFieldsValue({
              'staff': 0,
              })
            this.setState({
              selectProjects: items,
              batchSetting: { ...this.state.batchSetting, show: true },
            })
          }
        }
      })
  }

  /**添加回访提醒 */
  inserts() {
    return services
      .INSERT({
        keys: { name: "setting/remind/construction" },
        data: {
          remind: this.state.selectProjects.map((_) => ({
            type: 6,
            values: {
              time: this.state.batchSetting.time,
              staffId: this.state.batchSetting.staffId?this.state.batchSetting.staffId:0,
              projectId: _.projectId,
            },
            isDisabled: this.state.batchSetting.isDisabled,
          })),
        },
      })
      .then((res) => {
        if (res.code === "0") {
          this.setState({
            batchSetting: {
              ...this.state.batchSetting,
              show: false,
              time: 0,
              staffId: 0,
            },
          })
          this.props.dispatch({
            type: "table/getData",
            payload: { new: true },
          })
          this.props.form.resetFields()
          message.success("添加成功")
        }
      })
  }

  /**
   * 设置回访时间
   * @param {Object} e dom事件对象
   */
  batchSetTime(e) {
    let time = e.target.value

    time = time.replace(/^0/, "")

    time = Number(time.replace(/[^\d]/g, ""))
    this.setState({
      batchSetting: {
        ...this.state.batchSetting,
        time,
      },
    })
  }

  /**
   * 设置提醒人
   * @param {Number} staffId 员工id
   */
  batchSetStaffId(staffId) {
    console.log(staffId)
    this.setState({
      batchSetting: {
        ...this.state.batchSetting,
        staffId,
      },
    })
  }

  /**批量设置窗口确定事件 */
  handlerModalOk() {
    const batchSetting = this.state.batchSetting
    this.props.form.validateFields(['visitTime','staff'],(error)=>{
        /**判断数据表单类型 */
        if(error){
          return
        }
        if (batchSetting.title === "批量设置") {
          this.batchSettingPost()

        } else if (batchSetting.title === "回访设置") {
          this.inserts()
        } else if (batchSetting.title === "修改回访设置") {
          this.put()
        }
    })
    /**判断是否数据有效 */
  }

  /**
   * 批量设置
   */
  batchSetting() {
    // console.log("this.state.batchSetting.staffId", this.state.batchSetting.staffId)
    if (this.props.table.selectedRowKeys.length > 0) {
      this.setState({
        selectProjects: this.props.table.data.filter((_) =>
          this.props.table.selectedRowKeys.find((key) => key === _.id)
        ),
        batchSetting: {
          ...this.state.batchSetting,
          show: true,
          title: "批量设置",
        },
      })
    } else {
      message.warning("请先选择项目")
    }
  }

  /**批量修改，提交数据 */
  batchSettingPost() {
    services
      .PUT({
        keys: { link: "setting/remind/construction/0" },
        data: {
          remind: this.state.selectProjects.map((_) => ({
            id: _.id,
            type: 6,
            values: {
              time: this.state.batchSetting.time,
              staffId: this.state.batchSetting.staffId,
              projectId: _.projectId,
            },
            isDisabled: this.state.batchSetting.isDisabled,
          })),
        },
      })
      .then((res) => {
        if (res.code === "0") {
          message.success("设置成功")
          this.setState({
            batchSetting: {
              ...this.state.batchSetting,
              show: false,
              time: 0,
              staffId: 0,
              isDisabled: false,
            },
          })
          this.props.form.resetFields()
          this.props.dispatch({
            type: "table/getData",
            payload: { new: true },
          })
        }
      })
  }

  /**批量删除 */
  handlerBatchDelete() {
    let that = this
      Modal.confirm({
        title: '您确定要删除所选项吗?',
        content: '',
        okText: '确认',
        cancelText: '取消',
        icon:<div style={{width:'37px',height:'37px',background:'#FF303D',borderRadius:'50%',textAlign:'center',lineHeight:'37px',marginLeft:'177px',marginBottom:'10px'}}><i className='iconfont icon-shanchu' style={{color:'#fff'}}/></div>,
        closable: true,
        centered: true,
        maskClosable: true,
        maskStyle:{
          background:'rgba(0,0,0,0.65)',
        },
        className:'madalDiv',
        onOk () {
          if (that.props.table.selectedRowKeys.length) {
            that.batchDeletePost()
          } else {
            message.warning("请先选择项目")
          }
        },
      })
  }

  /**提交批量删除的数据 */
  batchDeletePost() {
    services
      .DELETE({
        keys: { name: "setting/remind/construction", id: 0 },
        data: { type: 6, ids: this.props.table.selectedRowKeys },
      })
      .then((res) => {
        if (res.code === "0") {
          message.success("删除成功")
          this.props.dispatch({
            type: "table/getData",
            payload: { new: true },
          })
        }
      })
  }
  /**
   *
   * @param {禁用和启用切换} isDisabled
   */
  forbidden(item,bul){
    services
      .PUT({
        keys: { link: "setting/remind/construction/0" },
        data: {
          remind: [
            {id: item.id,
              type: 6,
              values: {
                time: Number(item.time),
                staffId: item.staffId,
                projectId:item.projectId,
              },
              isDisabled:bul},
          ],
      }}).then((res)=>{
        if (res.code === "0") {
          message.success("设置成功")
          this.props.dispatch({
            type: "table/getData",
            payload: { new: true },
          })
        }
      })
  }
  /**设置是否开启 */
  batchSetIsDisabled(isDisabled) {
    this.setState({
      batchSetting: {
        ...this.state.batchSetting,
        isDisabled,
      },
    })
  }

  /**单个修改put */
  put() {
    services
      .PUT({
        keys: { link: "setting/remind/construction/0" },
        data: {
          remind: [
            {
              id: this.state.selectProjects[0].id,
              type: 6,
              values: {
                time: this.state.batchSetting.time,
                staffId: this.state.batchSetting.staffId,
                projectId: this.state.selectProjects[0].projectId,
              },
              isDisabled: this.state.batchSetting.isDisabled,
            },
          ],
        },
      })
      .then((res) => {
        if (res.code === "0") {
          message.success("修改成功")
          this.setState({
            batchSetting: {
              ...this.state.batchSetting,
              show: false,
              time: "",
              staffId: 0,
              isDisabled: false,
            },
          })
          this.props.dispatch({
            type: "table/getData",
            payload: { new: true },
          })
        }
      })
  }
 /**
  * 取消
  */
 cancel(){
  this.setState({
    batchSetting: { ...this.state.batchSetting, show: false },
  })
  this.props.form.resetFields()
  this.props.form.setFieldsValue({'visitTime':'','staff':''})
 }
 /**
  * 重置添加项目
  */

 hideProjectModel(){
   this.setState({ selectProjectVisible: false })
   console.log('quxiao',this.$selectProject)
   this.$selectProject.resetSelected()
 }
 /**
  * f5刷新时关闭弹窗
  */
 componentWillUnmount(){
   this.setState({
    batchSetting:{
      show:false,
    },
   })
 }
  render() {
    const { getFieldDecorator } = this.props.form
    const { batchSetting } = this.state
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    }
    tableConfig.screen.moreContent = (
      <div className="flex">
        <Button
          style={{ width: "120px", margin: "0 24px 0 20px", height: "40px" }}
          type="primary"
          shape="circle"
          icon="plus"
          onClick={() =>
            this.setState({
              selectProjectVisible: true,
              batchSetting: {
                ...this.state.batchSetting,
                title: "回访设置",
              },
            })
          }
        >
          添加项目
        </Button>
        <Button
          style={{ width: "120px", margin: "0 24px 0 0", height: "40px" }}
          type="primary"
          shape="circle"
          icon="appstore"
          onClick={this.batchSetting.bind(this)}
        >
          批量设置
        </Button>
        <Button
          style={{ width: "120px", height: "40px" }}
          type="primary"
          shape="circle"
          icon="delete"
          onClick={this.handlerBatchDelete.bind(this)}
        >
          删除
        </Button>
      </div>
    )
    const columns = [
      {
        width: "50%",
        title: "回访提醒时间",
        dataIndex:"time",
        render: (text) => {
          return (
            <Form.Item
            {...formItemLayout}
            label=' '
            colon={false}
            >
            {getFieldDecorator('visitTime', {
            rules: [{ required: true, message: '请输入回访天数',pattern: new RegExp(/^[1-9]\d*$/, "g")}],getValueFromEvent: (event) => {
              return event.target.value.replace(/\D/g,'')
          },
            initialValue:null,
          })(<Input
              size="large"
              style={{ width: 100 }}
              addonAfter="天"
              onChange={this.batchSetTime.bind(this)}
            />
          )}</Form.Item>
          )
        },
      },
      {
        width: "50%",
        title: "提醒人",
        dataIndex: "staffId",
        render: (staffId) => {
          return (
            <Form.Item
            {...formItemLayout}
            label=' '
            colon={false}
            >
            {getFieldDecorator('staff',{
              rules: [{ required: true,type:'number', message: '请选择提醒人' }],
              initialValue:staffId?staffId:0,
            })(
              <Select
              showSearch
              size="large"
              style={{ width: 200 }}
              placeholder="选择回访人"
              onChange={this.batchSetStaffId.bind(this)}
            >
              {this.state.staffs.map((_) => (
                <Option key={_.staffId} value={_.staffId}>
                  {_.staffName}
                </Option>
              ))}
            </Select>
            )}
            </Form.Item>
          )
        },
      },
    ]
    return (
      <div>
        <CommonTable
          style={{ width: "450px" }}
          name="setting/remind/construction"
          tableConfig={tableConfig}
          onTableChange={this.handerTableChange.bind(this)}
          New
        />
        <Modal
          width={795}
          onCancel={this.cancel.bind(this)
          }
          onOk={this.handlerModalOk.bind(this)}
          visible={this.state.batchSetting.show}
          title={this.state.batchSetting.title}
        >
          <div className={styles.modal}>
            <Table
              pagination={false}
              columns={columns}
              dataSource={[{ ...batchSetting }]}
              rowkey={(record, index) => { return index }}
            />
          </div>
          <div style={{ marginTop: 50 }}>
            <span style={{ marginRight: 26 }}>开启状态</span>
            <Checkbox
              checked={!batchSetting.isDisabled}
              style={{ marginRight: 90 }}
              onChange={this.batchSetIsDisabled.bind(this, false)}
            >
              启用
            </Checkbox>
            <Checkbox
              checked={batchSetting.isDisabled}
              onChange={this.batchSetIsDisabled.bind(this, true)}
            >
              停用
            </Checkbox>
          </div>
        </Modal>
        <SelectProject
          visible={this.state.selectProjectVisible}
          type={__PROJECT_TYPE__}
          selected={this.props.table.data}
          onOk={this.selectProject.bind(this)}
          onCancel={this.hideProjectModel.bind(this)}
          onRef={(selectProject) => this.$selectProject = selectProject}
        />
      </div>
    )
  }
}
const WrappedRegistrationForm = Form.create({ name: 'register' })(Index)
export default connect(({ table }) => ({ table }))(WrappedRegistrationForm)
