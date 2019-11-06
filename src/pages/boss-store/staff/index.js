import {
  Form,
  Input,
  Button,
  Radio,
  DatePicker,
  Select,
  Upload,
  Popover,
  Icon,
  Checkbox,
  Modal,
} from "antd"
import CommonTable from "../../../components/CommonTable/index"
import * as React from "react"
import styles from "./staff.less"
import { connect } from "dva"
import { Row, Col } from "antd"
import validate from "../../../utils/validate"
import services from "../../../services"
import moment from "moment"
import uploadImg from "../../../utils/uploadImg"
import Tabbar from "components/Tabbar"
import tableConfig from './tableConfig'
import Tkbox from './Tkbox.js'
import Passw from './passw.js'

const CheckboxGroup = Checkbox.Group

const FormItem = Form.Item

const RadioGroup = Radio.Group

const { TextArea } = Input

const Option = Select.Option

const staff = Form.create({
  mapPropsToFields(props) {
    //编辑操作,表单默认
    const { type, editItem, Listwork } = props
    if (type === "edit") {
      let obj = {}
      Object.keys(editItem).map((v) => {
        // if (v === "icardBack" || v === "icardFace") {
        //   return (obj[v] = Form.createFormField({
        //     value: [],
        //   }))
        // }
        if (v === "business") {
          let newArray = []
          if (editItem[v]) {
            editItem[v].split(",").forEach((v) => {
              newArray.push(Number(v))
            })
          }
          console.log('obj', obj[v])
          return (obj[v] = Form.createFormField({
            value: newArray,
          }))
        }
        if (v === "basicSalary") {
          return (obj[v] = Form.createFormField({
            value: parseInt(editItem[v], 10),
          }))
        }
        if(v === 'roleId'){
          return (obj[v] = Form.createFormField({
            value: Listwork.findIndex(item => item.id === editItem.roleId) > -1 ? editItem.roleId : undefined,
          }))
        }
        if (v === "entryTime" || v === "quitTime") {
          return (obj[v] = Form.createFormField({
            value: editItem[v] ? moment(editItem[v] * 1000) : undefined,
          }))
        } else {
          return (obj[v] = Form.createFormField({
            value: editItem[v],
          }))
        }
      })
      console.log(obj, 'klsldjflksfsd')
      return obj
    }
  },
})(
  class extends React.Component {
    state = {
      phoneTip: false,
      showData: true,
      shouqi: false,
      addData: false,
      fileListZheng: [],
      fileListFan: [],
      grouplist: [],
      previewImage: "",
      previewVisible: false,
      showPhone: true,
      passwvisible: false,
      item: {},
      plainOptions: [
        { value: 1, label: "接车" },
        // { value: 2, label: "收银" },
        { value: 3, label: "销售" },
        { value: 4, label: "施工" },
        { value: 5, label: "领料" },
        { value: 6, label: "仓管" },
      ],
      visible: false,
    }
    componentDidMount() {
      this.props.dispatch({
        type: "staff/getworklists",
        payload: {},
      })
      services.list({ keys: { name: 'store/staffgroup' } }).then((res) => {
        let grouplist = [...res.list]
        this.setState({grouplist})
      })
    }
    handlePreview = (file) => {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      })
    }
    handleCancel = () => this.setState({ previewVisible: false })
    //正面
    handleChangeZheng = ({ fileList, file }) => {
      const imgType = ['image/jpeg', 'image/jpg', 'image/png']
      if (imgType.indexOf(file.type) === -1) {
        return false
      }
      this.setState({
        fileListZheng: fileList,
      })
    }
    getImgNameZheng = (imgName) => {
      const { fileListZheng } = this.state
      const last = fileListZheng[fileListZheng.length - 1]
      last.imgName = imgName
      this.setState({
        fileListZheng,
      })
    }
    //反面
    handleChangeFan = ({ fileList, file }) => {
      const imgType = ['image/jpeg', 'image/jpg', 'image/png']
      if (imgType.indexOf(file.type) === -1) {
        return false
      }
      this.setState({
        fileListFan: fileList,
      })
    }
    getImgNameFan = (imgName) => {
      const { fileListFan } = this.state
      const last = fileListFan[fileListFan.length - 1]
      last.imgName = imgName
      this.setState({
        fileListFan,
      })
    }
    // 图片value转换
    normFile = (e) => {
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    }
    // 新建班组
    addgroup=()=> {
      this.setState({
        visible: true,
      })
    }
    // 新建班组成功
    hideModal = (e) => {
      this.setState({
        visible: false,
      })
      if(e) {
        // 刷新班组
        services.list({ keys: { name: 'store/staffgroup' } }).then((res) => {
          let grouplist = [...res.list]
          this.setState({grouplist})
        })
      }
    }
    // 重置密码
    passwhideModal=(e)=> {
      const {dispatch} = this.props
      this.setState({
        passwvisible: false,
      })
      if(e) {
        // 刷新
        dispatch({
          type: "table/getData",
          payload: "store/staff",
        })
      }
    }
    render() {
      const { dispatch, editItem } = this.props
      const {
        getFieldDecorator,
        resetFields,
        validateFieldsAndScroll,
        getFieldError,
        getFieldValue,
      } = this.props.form
      //工种列表
      tableConfig.screen.rules[1].list = this.props.Listwork.map(item => ({ name: item.name, value: item.id }))
      tableConfig.screen.rules[2].list = this.state.grouplist.map(item => ({ name: item.groupName, value: item.groupId }))

      const celbtn = () => {
        this.setState({ phoneTip: false })
        resetFields()
        this.setState({
          addData: false,
        })
      }
      const handleOk = () => {
        validateFieldsAndScroll((errors, values) => {
          if (errors) {
            this.setState({ phoneTip: true })
            return
          }
          if (values.icardFace === undefined) {
            values.icardFace = []
          }
          if (values.icardBack === undefined) {
            values.icardBack = []
          }
          this.setState({ phoneTip: false })
          const formData = {
            ...values,
            icardFace: values.icardFace[0]
              ? values.icardFace[0].imgName
                ? values.icardFace[0].imgName
                : values.icardFace[0].url
              : "",
            icardBack: values.icardBack[0]
              ? values.icardBack[0].imgName
                ? values.icardBack[0].imgName
                : values.icardBack[0].url
              : "",
            phoneTem: Number(values.phoneTem),
          }
          if (this.state.type === "add") {
            services
              .insert({ data: formData, keys: { name: "store/staff" } })
              .then((res) => {
                if (res.success) {
                  resetFields()
                  this.setState({
                    addData: false,
                  })
                  dispatch({
                    type: "table/getData",
                    payload: "store/staff",
                  })
                }
              })
          }
          if (this.state.type === "edit") {
            formData.staffId = editItem.staffId
            services
              .update({ data: formData, keys: { name: "store/staff" } })
              .then((res) => {
                if (res.success) {
                  resetFields()
                  this.setState({
                    addData: false,
                  })
                  dispatch({
                    type: "table/getData",
                    payload: "store/staff",
                  })
                }
              })
          }
        })
      }
      const showDataClick = () => {
        if (this.state.showData === true) {
          this.setState({ showData: false })
        } else {
          this.setState({ showData: true })
        }
      }
      //跳去工种设置页面
      // const goworktype = () => {
      //   router.push({
      //     pathname: '/boss-store/work-type',
      //   })
      // }
      //跳去班组设置
      // const goclass = () => {
      //   router.push({
      //     pathname: '/boss-store/team-group',
      //   })
      // }
      const onTableChange = (e, v) => {
        const { dispatch } = this.props
        if (e === 217) {
          dispatch({
            type: "staff/edit",
            payload: { editItem: {}, type: "edit" },
          })
          const { resetFields } = this.props.form
          resetFields()
          this.setState({
            addData: true,
            type: "add",
          })
        }

        if (e === 11) {
          services.detail({ data: { staffId: v.staffId }, keys: { 'name': 'store/staff' } }).then(res => {
            const editItem = {
              ...res.list,
              icardBack: res.list.icardBack.map(item => ({ uid: item.id, imgName: item.id, url: item.requestAddress })),
              icardFace: res.list.icardFace.map(item => ({ uid: item.id, imgName: item.id, url: item.requestAddress })),
            }
            if(Number(editItem.groupId)===0 && editItem.groupName === null) {editItem.groupId=''}
            // console.log(editItem,'00000000000000000000000')
            dispatch({
              type: "staff/edit",
              payload: { editItem, type: "edit" },
            })
            this.setState({
              addData: true,
              type: "edit",
            })
          })
        }
        if (e === 132) {
          // 重置密码
          this.setState({
            item: v,
          }, () => {
            this.setState({
              passwvisible: true,
            })
          })
        }
      }
      const userChange = (e) => {
        this.setState({
          isOpen: e.target.value,
        })
      }

      const workChange = (e) => {
        this.setState({
          isJob: e.target.value,
        })
      }
      const enterClick = (type, time) => {
        this.setState({
          entryTime: time,
        })
      }
      const disabledStartDate = (startValue) => {
        const endValue = moment()
        if (!startValue) {
          return false
        }
        return startValue.valueOf() > endValue.valueOf()
      }
      const leaveClick = (type, time) => {
        this.setState({
          quitTime: time,
        })
      }
      const uploadButtonZheng = (
        <div>
          <Icon type="plus" />
        </div>
      )
      const uploadButtonFan = (
        <div>
          <Icon type="plus" />
        </div>
      )
      const errshow = getFieldError("phoneTem")
      return (
        <div>
          <div
           className='headstylemargin'
            style={
              this.state.addData ? { display: "none" } : { display: "block" }
            }
          >
            <CommonTable
              name="store/staff"
              refresh
              search="staffNo,staffName, groupName"
              tableConfig={tableConfig}
              onTableChange={onTableChange}
            >
            </CommonTable>
          </div>
          <div
            className="from-wrap-margin"
            style={
              this.state.addData ? { display: "block" } : { display: "none" }
            }
          >
            {/* <div className={styles.brandhead}>
              {this.state.type === "add" ? "新建员工" : "编辑员工"}
            </div> */}
            <div className={styles.centerDiv}>
              <p className={styles.brandhead}>
                <span></span>基本信息
              </p>
              <Form>
                <Row gutter={196}>
                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="姓名">
                      {getFieldDecorator("staffName", {
                        ...validate("姓名", {
                          required: true,
                          min: 1,
                          max: 10,
                          type: "string",
                        }),
                      })(
                        <Input
                          placeholder="输入员工姓名"
                          size="large"
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem
                      label="手机号(默认为系统登录账号)"
                    >
                      {getFieldDecorator("phoneTem", {
                        ...validate("手机号", {
                          required: true,
                          type: "phone",
                          max: 11,
                          sole: true,
                          _var: false,
                          model: 'Staff|Admin|Supervisor',
                          id: editItem.staffId,
                        }),
                      })(
                        <Input
                          placeholder="输入员工的手机号"
                          size="large"
                        />
                      )}
                    </FormItem>
                  </Col>

                  {this.state.type === "edit" ? '' : <Col span={8} className={styles['form-style']}>
                    <FormItem
                      label="登录密码"
                    >
                      {getFieldDecorator("password", {
                        ...validate("登录密码", {
                          required: true,
                          type: 'loginpwd',
                        }),
                      })(
                        <Input
                          placeholder="输入登录密码"
                          size="large"
                        />
                      )}
                    </FormItem>
                  </Col>}

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="关联角色">
                      {getFieldDecorator("roleId", {
                        rules: [
                          {
                            required: true,
                            message: "请选择关联角色",
                          },
                        ],
                      })(
                        <Select
                          size="large"
                          placeholder="请选择"
                        >
                          {this.props.Listwork.map((v, index) => {
                            return (
                              <Option key={index} value={v.id}>
                                {v.name}
                              </Option>
                            )
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    {getFieldValue("isJob") === 1 ? (
                      <FormItem label="入职时间">
                        {getFieldDecorator("entryTime", {
                          initialValue: editItem.entryTime ? moment(editItem.entryTime * 1000) : moment(new Date()),
                          rules: [
                            {
                              type: "object",
                              required: true,
                              message: "请选择入职时间",
                            },
                          ],
                        })(
                          <DatePicker
                            onChange={enterClick}
                            disabledDate={disabledStartDate}
                            style={{width: '100%'}}
                            size="large"
                            placeholder="选择员工入职时间"
                          />
                        )}
                      </FormItem>
                    ) : (
                        <FormItem label="离职时间">
                          {getFieldDecorator("quitTime", {
                            initialValue: editItem.quitTime ? moment(editItem.quitTime * 1000) : undefined,
                            rules: [
                              {
                                type: "object",
                                required: true,
                                message: "请选择离职时间",
                              },
                            ],
                          })(
                            <DatePicker
                              onChange={leaveClick}
                              size="large"
                              placeholder="选择员工离职时间"
                            />
                          )}
                        </FormItem>
                      )}
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="底薪">
                      {getFieldDecorator("basicSalary", {
                        ...validate("底薪", {
                          required: true,
                          type: "number",
                          min: 1,
                          max: 10,
                        }),
                        initialValue: this.state.basicSalary,
                      })(
                        <Input
                          placeholder="输入底薪"
                          addonAfter={"元"}
                          size="large"
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="性别">
                      {getFieldDecorator("sex", { initialValue: 1 })(
                        <RadioGroup>
                          <Radio value={1}>男</Radio>
                          <Radio value={2}>女</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="是否允许登录系统">
                      {getFieldDecorator("isOpen", { initialValue: 1 })(
                        <RadioGroup onChange={userChange}>
                          <Radio value={1}>是</Radio>
                          <Radio value={2}>否</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="是否在职">
                      {getFieldDecorator("isJob", { initialValue: 1 })(
                        <RadioGroup onChange={workChange}>
                          <Radio value={1}>是</Radio>
                          <Radio value={2}>否</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="工号">
                      {getFieldDecorator(
                        "staffNo",
                        validate("工号", {
                          required: false,
                          min: 1,
                          max: 10,
                          sole: true,
                          model: 'Staff',
                          id: editItem.staffId,
                        })
                      )(
                        <Input
                          placeholder="输入工号"
                          size="large"
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <div className={styles['form-style-add']}>
                      <div>
                        <FormItem label="班组">
                          {getFieldDecorator("groupId")(
                            <Select
                              size="large"
                              placeholder="请选择"
                            >
                              {this.state.grouplist.map((v) => {
                                return (
                                  <Option key={v.groupId} value={v.groupId}>
                                    {v.groupName}
                                  </Option>
                                )
                              })}
                            </Select>
                          )}
                        </FormItem>
                      </div>
                      <div className={styles['form-style-add-btn']} onClick={this.addgroup}><Icon type="plus" /></div>
                    </div>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="维修业务" className={styles.espdivs} style={{position:'relative'}}>
                      <span style={{position:'absolute', left:'65px', top: '-88px'}}>
                            <Popover
                              trigger="click"
                              content="员工的工作内容范围，勾选后会在对应功能【选择员工】处出现该员工。"
                              placement="bottom"
                            >
                              <Icon
                                style={{ color: "#4AACF7", marginLeft: "10px",fontSize: '16px' }}
                                type="question-circle"
                              />
                            </Popover>
                      </span>
                      {getFieldDecorator("business")(
                        <CheckboxGroup options={this.state.plainOptions} />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="备注">
                      {getFieldDecorator("remark", {
                        ...validate("备注", { required: false, min: 0, max: 200 }),
                      })(<TextArea placeholder="备注" style={{height: '80px'}} />)}
                    </FormItem>
                  </Col>

                  </Row>
                  <p className={styles.brandhead} style={{marginTop: '40px'}}>
                    <span></span>其他资料
                  </p>
                  <Row gutter={196}>
                  {this.state.showData ? '' : <Col span={8} className={styles['form-style']}>
                    <FormItem label="微信">
                      {getFieldDecorator("wechat", {
                        ...validate("微信", {
                          required: false,
                          max: 30,
                          type: "string",
                        }),
                      })(
                        <Input
                          size="large"
                          placeholder="输入员工微信"
                        />
                      )}
                    </FormItem>
                  </Col>}

                  {this.state.showData ? '' : <Col span={8} className={styles['form-style']}>
                    <FormItem label="qq">
                      {getFieldDecorator("qq", {
                        ...validate("qq", {
                          required: false,
                          max: 30,
                          type: "string",
                          sole: true,
                          model: 'Staff',
                          id: editItem.staffId,
                        }),
                      })(
                        <Input
                          placeholder="输入员工qq"
                          size="large"
                        />
                      )}
                    </FormItem>
                  </Col>}

                  {this.state.showData ? '' : <Col span={8} className={styles['form-style']}>
                    <FormItem label="邮箱">
                      {getFieldDecorator("email", {
                        ...validate("邮箱", {
                          required: false,
                          max: 30,
                          type: "email",
                          sole: true,
                          key: 'emailTem',
                          model: 'Staff',
                          id: editItem.staffId,
                        }),
                      })(
                        <Input
                          placeholder="输入员工邮箱"
                          size="large"
                        />
                      )}
                    </FormItem>
                  </Col>}

                  {this.state.showData ? '' : <Col span={8} className={styles['form-style']}>
                    <FormItem label="身份证号">
                      {getFieldDecorator("identity", {
                        ...validate("身份证号", {
                          required: false,
                          max: 18,
                          type: "string",
                          sole: true,
                          key: 'identityCard',
                          model: 'Staff',
                          id: editItem.staffId,
                        }),
                      })(
                        <Input
                          size="large"
                          placeholder="输入员工身份证号"
                        />
                      )}
                    </FormItem>
                  </Col>}

                  {this.state.showData ? '' : <Col span={8} className={styles['form-style']}>
                    <FormItem
                      label="身份证照片正面"
                      className={styles.escPicDiv}
                    >
                      {getFieldDecorator("icardFace", {
                        valuePropName: "fileList",
                        getValueFromEvent: this.normFile,
                      })(
                        <Upload
                          className={styles.idCarDiv}
                          listType="picture-card"
                          onPreview={this.handlePreview}
                          onChange={this.handleChangeZheng}
                          beforeUpload={(file) =>
                            uploadImg(
                              file,
                              "staff",
                              this.getImgNameZheng
                            )
                          }
                        >
                          {getFieldValue("icardFace")
                            ? getFieldValue("icardFace").length === 1
                              ? null
                              : uploadButtonZheng
                            : uploadButtonZheng}
                        </Upload>
                      )}
                    </FormItem>
                  </Col>}

                  {this.state.showData ? '' : <Col span={8} className={styles['form-style']}>
                    <FormItem
                      label="身份证照片反面"
                      className={styles.escPicDiv}
                    >
                      {getFieldDecorator("icardBack", {
                        valuePropName: "fileList",
                        getValueFromEvent: this.normFile,
                      })(
                        <Upload
                          className={styles.idCarDiv}
                          listType="picture-card"
                          onPreview={this.handlePreview}
                          onChange={this.handleChangeFan}
                          beforeUpload={(file) =>
                            uploadImg(
                              file,
                              "staff",
                              this.getImgNameFan
                            )
                          }
                        >
                          {getFieldValue("icardBack")
                            ? getFieldValue("icardBack").length === 1
                              ? null
                              : uploadButtonFan
                            : uploadButtonFan}
                        </Upload>
                      )}
                    </FormItem>
                  </Col>}
                </Row>
                {this.state.showData ? '' : <Modal
                  visible={this.state.previewVisible}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={this.state.previewImage}
                  />
                </Modal>}
              </Form>
              <p onClick={showDataClick} className={styles.showOther}>
                {this.state.showData ? "展开" : "收起"}其余五个项目
                {this.state.showData ? (
                  <i
                    style={{ fontSize: "10px", marginLeft: "4px" }}
                    className="iconfont icon-zhankai"
                  />
                ) : (
                    <i
                      style={{ fontSize: "10px", marginLeft: "4px" }}
                      className="iconfont icon-shouqi"
                    />
                  )}
              </p>
            </div>
          </div>
          {
            this.state.addData ?
            <Tabbar>
              <div className={styles.btnDiv}>
                <Button size='large' onClick={celbtn}>取消</Button>
                <Button type='primary' size='large' onClick={handleOk}>提交</Button>
              </div>
            </Tabbar>
            : null
          }
          <Tkbox
            visible={this.state.visible}
            hideModal={this.hideModal.bind(this)}
            dispatch={dispatch}
          ></Tkbox>
          <Passw
          visible={this.state.passwvisible}
          hideModal={this.passwhideModal.bind(this)}
          dispatch={dispatch}
          name={this.state.item && this.state.item.staffName}
          id={this.state.item && this.state.item.staffId}
          ></Passw>
        </div>
      )
    }
  }
)

function mapStateToProps(state) {
  const { Listwork, editItem, type } = state.staff
  return { Listwork, editItem, type }
}
export default connect(mapStateToProps)(staff)
