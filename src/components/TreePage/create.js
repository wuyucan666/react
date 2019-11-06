import { Modal, Form, Input } from "antd"
import { connect } from "dva"
import validate from "utils/validate"
import treeConfig from "utils/tree"

const getValidateData = (config) => {
  let _var = config._var
  const inheritance = config.inheritance
  if (_var) {
    if (inheritance) {
      // 继承关系
      const coiling = Number(localStorage.getItem("coiling")) === 1
      if (typeof _var === "string") {
        _var = coiling ? "1|2" : 2
      } else {
        _var = {
          ..._var,
          _: coiling ? "1|2" : 2,
        }
      }
    } else {
      if (typeof _var === "string") {
        _var = parseInt(localStorage.getItem("loginType") - 1, 0)
      } else {
        _var = {
          ..._var,
          _: parseInt(localStorage.getItem("loginType") - 1, 0),
        }
      }
    }
  }
  return _var
}

export default connect((state) => ({ state }))(
  Form.create()(
    ({
      level,
      dispatch,
      formTem,
      form,
      pid,
      itemId,
      title,
      remark,
      categorySort,
      type,
      isRegional,
      state,
      isProject,
      isProduct,
    }) => {
      const config = treeConfig[type]

      if (!config) return <div />

      const { showCreate, btnLoading } = state[config.type]

      const { getFieldDecorator } = form

      const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
      }

      let moreItem = ""

      if (!isRegional) {
        moreItem = (
          <div>
            {pid !== 0 && (isProject || isProduct) && (
              <Form.Item label="排序" {...formItemLayout}>
                {getFieldDecorator("categorySort", {
                  initialValue: categorySort || "",
                })(
                  <Input
                    type="number"
                    size="large"
                    disabled={
                      formTem === 1 && config.type === "storeProjectCategory"
                    }
                  />
                )}
              </Form.Item>
            )}
            <Form.Item label="备注" {...formItemLayout}>
              {getFieldDecorator("remark", {
                ...validate(config.createTitle, { required: false, max: 200 }),
                initialValue: remark ? remark : "",
              })(
                <Input.TextArea
                  type="text"
                  disabled={
                    formTem === 1 && config.type === "storeProjectCategory"
                  }
                />
              )}
            </Form.Item>
          </div>
        )
      }

      return (
        <Modal
          title={title ? config.editTitle : config.addTitle}
          visible={showCreate}
          onOk={() => {
            form.validateFields((err) => {
              if(!err){
                const type = title ? "update" : "add"
                let data = {
                  formData: {
                    ...form.getFieldsValue(),
                    level,
                  },
                  form,
                }
                // 项目或者产品类型情况下需要排序字段
                if (isProduct || isProject) {
                  data.formData.categorySort =
                    form.getFieldsValue(["categorySort"]).categorySort || 0
                  type === "update"
                    ? (data.id = itemId)
                    : (data.formData.pId = pid)
                } else {
                  data.id = itemId
                  data.formData.pId = pid
                }

                // model effects edit 修改
                dispatch({
                  type: config.type + "/" + type,
                  payload: data,
                })
              }
            })
          }}
          onCancel={() =>
            dispatch({ type: config.type + "/setShowCreate", payload: false })
          }
          okText="发布"
          cancelText="取消"
          width={580}
          confirmLoading={btnLoading}
        >
          {showCreate ? (
            <Form>
              <Form.Item label={config.createTitle} {...formItemLayout}>
                {getFieldDecorator(config.apiName, {
                  ...validate(config.createTitle, {
                    required: true,
                    max: 10,
                    type: "string",
                    sole: true,
                    id: title ? itemId : undefined,
                    model: config.model,
                    _var: getValidateData(config),
                  }),
                  initialValue: title ? title : "",
                })(
                  <Input
                    autoFocus
                    type="text"
                    size="large"
                    disabled={
                      formTem === 1 && config.type === "storeProjectCategory"
                    }
                  />
                )}
              </Form.Item>
              {moreItem}
            </Form>
          ) : (
              ""
            )}
        </Modal>
      )
    }
  )
)
