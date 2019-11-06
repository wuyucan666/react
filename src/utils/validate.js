import services from "../services"

/**
 * 验证配置
 * @param rule
 * @param value
 * @param callback
 *
 * name: 验证框的label名字
 *{
 * required: true, // 是否必填
 * max: 10,  // 最大长度值
 * min: 10,  // 最小长度值
 * len: 10, // 最大数值
 * lenMin: 10, // 最小数值
 * type: 'number' // string, number, phone, card, sole, tel, pwd, date, email, price, integer, select(非输入框) // 验证的类型。（必传）
 *
 * }
 * 使用方法
 * 引用文件，直接方法调用传下标过来
 * import validate from '../../utils/validate'
 * {getFieldDecorator('user_name',
 * validate('用户名',{required: true,max: 10, min: 5, type: 'string'})
 * )(<Input onPressEnter={handleOk} placeholder="用户名" />)}
 *
 * editItem 为编辑状态下原有值
 */
const REGTXT = new RegExp(
  "[；： ￥（）【】‘”“．。，、？１２３４５６７８９０＝＋～？！＠＃＄％＾＆＊）]"
)
const PHONE = /^[1]([3-9])[0-9]{9}$/
const INIEGER = /^[0-9]\d*$/
const PRICE = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
const TEL = /^0\d{2,3}-?\d{7,8}$/
const CARD = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
const CODE = /^[A-Za-z0-9]+$/
const PLATE = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/




export default function validate(name = "", rs = {}) {
  let _type = (type, v) => {
    let fun = {
      max: {
        validator: (rule, value, callback) => {
          if (value) {
            if (value.length > v) {
              callback("请输入小于" + v + "个字符")
            }
          }
          callback()
        },
      },
      min: {
        validator: (rule, value, callback) => {
          if (value) {
            if (value.length < v) {
              callback("请输入大于" + v + "个字符")
            }
          }
          callback()
        },
      },
      required: {
        required: v,
        message: rs.type === "select" ? "请选择" + name : "请输入" + name,
      },
      len: {
        validator: (rule, value, callback) => {
          if (value && value !== "") {
            if (value * 1 > v) {
              callback("最大值为" + v)
            }
          }
          callback()
        },
      },
      lenMin: {
        validator: (rule, value, callback) => {
          if (value && value !== "") {
            if (value * 1 < v) {
              callback("最小值为" + v)
            }
          }
          callback()
        },
      },
      sole: {
        validator: async (rule, value, callback) => {
          if (!rs.sole) {
            callback()
            return false
          }
          if (!value || (value && String(value).trim().length === 0)) {
            callback()
            return false
          }
          const field =
            rule.field.indexOf(".") > -1
              ? rule.field.slice(rule.field.indexOf(".") + 1)
              : rule.field
          let data = {}
          data.model = rs.model
          data.key = rs.key || field
          data.value = rs.value || value
          if (rs.value) {
            const isFunc = typeof rs.value === 'function'
            if (isFunc) {
              data.value = rs.value(value)
            } else {
              data.value = rs.value
            }
          } else {
            data.value = value
          }
          if (rs._var !== false) {
            data._var =
              rs._var || parseInt(localStorage.getItem("loginType") - 1, 0)
          }
          if (value && value !== "") {
            if (rs.id) {
              // 编辑修改校验
              await services
                .validateEdit({ keys: { id: rs.id }, data })
                .then((res) => {
                  if (res.code !== 0) {
                    callback("此" + name + "已使用!")
                  }
                })
            } else {
              // 新增校验
              await services.validate({ data }).then((res) => {
                if (res.code !== 0) {
                  callback("此" + name + "已使用!")
                }
              })
            }
          }
          callback()
        },
      },
      string: {
        validator: (rule, value, callback) => {
          // if (value && value !== "") {
          //   if (REGTXT.test(value)) {
          //     callback("请不要使用“-”“_”“/”以外的符号")
          //   }
          // }
          callback()
        },
      },
      number: {
        validator: (rule, value, callback) => {
          if (value && value !== "") {
            if (isNaN(value)) {
              callback("请输入数字")
            }
            if (!INIEGER.test(value)) {
              callback("请输入正整数字！")
            }
          }
          callback()
        },
      },
      phone: {
        validator: (rule, value, callback) => {
          if (value && value !== "") {
            if (!PHONE.test(value)) {
              callback("请输入正确的手机号！")
            }
          }
          callback()
        },
      },
      tel: {
        validator: (rule, value, callback) => {
          if (value && value !== "") {
            if (!TEL.test(value)) {
              callback("请输入正确的座机号码！")
            }
          }
          callback()
        },
      },
      card: {
        validator: (rule, value, callback) => {
          if (value && value !== "") {
            if (!CARD.test(value)) {
              callback("请输入正确的身份证号！")
            }
          }
          callback()
        },
      },
      code: {
        validator: (rule, value, callback) => {
          if (value && value !== "") {
            if (!CODE.test(value)) {
              callback("只能输入数字和字母！")
            }
          }
          callback()
        },
      },
      pwd: {
        validator: (rule, value, callback) => {
          if (value && value !== "") {
            if (16 < value.length || value.length < 6) {
              callback("请输入6到16位长度的密码！")
            }
          }
          callback()
        },
      },
      loginpwd: {
        validator: (rule, value, callback) => {
          if (value && value !== "") {
            if (REGTXT.test(value)) {
              return callback("密码6-18个字符，可以是字母、数字或者特殊符号")
            }
            if (18 < value.length || value.length < 6) {
              return callback("密码6-18个字符，可以是字母、数字或者特殊符号")
            }
            if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(value)) {
              return callback("密码6-18个字符，可以是字母、数字或者特殊符号")
            }
          }
          callback()
        },
      },
      agpwd: {
        validator: (rule, value, callback) => {
          if (rs && rs.agpwd) {
            if (rs.agpwd !== value) {
              callback("密码不一致！")
            }
          } else {
            callback("请先填写新密码！")
          }
          callback()
        },
      },
      date: false,
      email: {
        type: "email",
        message: "请输入正确的邮箱",
      },
      price: {
        validator: (rule, value, callback) => {
          if (value && value !== "") {
            if (value * 1 <= 0) {
              callback("请输入大于0的金额！")
            } else if (!PRICE.test(value)) {
              callback("请输入正确格式的金额！")
            }
          }
          callback()
        },
      },
      price1: {
        validator: (rule, value, callback) => {
          if (value && value !== "") {
            if (!/^-?\d+(.\d{1,2})?$/.test(value)) {
              callback("只能输入两位小数的数字！")
            }
          }
          callback()
        },
      },
      money: {
        validator: (rule, value, callback) => {
          if (value && value !== "") {
            if (!/^[0-9]+\.{0,1}[0-9]{0,1}$/.test(value)) {
              callback("只能输入一位小数的正数！")
            }
          }
          callback()
        },
      },
      integer: {
        validator: (rule, value, callback) => {
          if (value && value !== "") {
            if (!INIEGER.test(value)) {
              callback("请输入正整数字！")
            }
          }
          callback()
        },
      },
      plate: {
        validator: (rule, value, callback) => {
          if (value && value !== "") {
            if (!PLATE.test(rs.value().slice(0,2)+(value.toUpperCase()))) {
              callback("请输入正确的车牌号！")
            }
          }
          callback()
        },
      },
      select: false,
    }
    return fun[type === "type" ? rs.type : type]
  }
  let rules = []
  Object.keys(rs).forEach((item) => {
    let obj = _type(item, rs[item])
    if (obj) {
      rules.push(obj)
    }
  })
  let res = { rules: rules, validateFirst: false }
  if (rs.sole) {
    // 如果验证唯一
    res.validateTrigger = "onChange"
  }
  return res
}
