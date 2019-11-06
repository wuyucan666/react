/**
 * 按钮集合
 * name 按钮名称
 * icon 按钮图标
 * type 按钮类型 type <= 10 为组件内部使用 事件在组件内部实现 type > 10 为组件外部使用派发事件 onTableChange(type)
 * type 按钮类型 上面的type 范围指的是十位数。 百位数区别头部和每一行的按钮。type > 200 为头部按钮， type <= 200 为行内按钮
 * 比如 type = 201 为头部的按钮，且事件绑定在组件内部 type 211 为头部的按钮，且事件传递给父组件
 * 比如 type = 101 为每行内按钮，且事件绑定到组件内部 type 11  为行内的按钮，且事件传递给父组件
 * power 权限
 * disabled 按钮是否可以点击
 * show 控制按钮显示隐藏
 * btnName 按钮的文案 默认name
 * tooltip 按钮hover时显示的文案
 * btnColor 操作按钮文字的颜色 默认为主题蓝色
 * @type {Object}
 */

import moment from "moment"
import { Popover, Icon } from "antd"
import Status from "components/CommonTable/status"
import PopoverTip from "components/PopoverTip"
import hasPermission from "../utils/hasPermission"

const BTN = {
  name: "删除",
  icon: "icon-shanchu",
  type: 1,
  power: "Delete",
  btnColor: '#FE6060FF',
}

const DEL_BTN = {
  ...BTN,
}
const NDEL_BTN = {
  ...BTN,
  show: (item) => item.name !== "休息",
}

const EDIT_BTN = {
  name: "修改",
  power: "Edit",
  icon: "icon-bianji",
  type: 11,
}

const NEDIT_BTN = {
  ...EDIT_BTN,
  show: (item) => item.name !== "休息",
}

const FORB_BTN = {
  name: "禁用",
  power: "Forbidden",
  icon: "icon-tingyong",
  type: 13,
  btnColor: '#FE6060',
}

const START_BTN = {
  name: "启用",
  power: "Start",
  icon: "icon-qiyong",
  type: 17,
}

const PERMESSION_BTN = {
  name: "分配权限",
  power: "permission",
  icon: "icon-quanxian",
  type: 12,
}

const DETAIL_BTN = {
  name: "详情",
  power: "permission",
  icon: "icon-xiangqing",
  type: 14,
}
const CANCELLATIONS_BTN = {
  name: "撤单",
  power: "Edit",
  icon: "icon-chedan",
  type: 18,
  btnColor: '#FE6060',
}
const DETAIL_BTN_XQ = {
  name: "详情",
  power: "permission",
  icon: "icon-chanpinfenlei",
  type: 14,
}
const CANCELLATION_BTN = {
  name: "作废",
  power: "permission",
  icon: "icon-zuofei",
  type: 15,
}
const LOGOUT_BTN = {
  name: "注销",
  power: "permission",
  icon: "icon-chanpinfenlei",
  type: 19,
  btnColor: '#FE6060',
}

const HEADER_ADD_BTN = {
  ...BTN,
  name: "新增",
  icon: "icon-xinzeng",
  type: 217,
}

const BATCH_BTN = {
  ...BTN,
  name: "批量设置",
  icon: "icon-piliang",
  type: 218,
}

const BULK_BTN = {
  ...BTN,
  name: "批量导入",
  icon: "icon-daoru",
  type: 219,
}

const PASSW_BTN = {
  name: "重置密码",
  power: "Edit",
  icon: "icon-bianji",
  type: 132,
  btnColor: '#FE6060FF',
}

const CLEAN_BTN = {
  name: "清除",
  power: "Clean",
  icon: "icon-qingkong",
  type: 20,
}
// 批量删除
// const HEADER_DEL_BTN = {
//   ...BTN,
//   type: 213,
// }

const HEADER_PRINT_BTN = {
  ...BTN,
  name: "打印",
  icon: "icon-dayin",
  type: 214,
  btnColor: '4AACF7FF',
}

// const HEADER_DOWNLOAD_BTN = {
//   ...BTN,
//   name: "下载",
//   icon: "icon-xiazai",
//   type: 215,
// }

// const LOGOUT_BTN = {
//   name: "注销",
//   power: "permission",
//   icon: "icon-xiazai",
//   type: 216,
// }
const SMS_TOP_UP_BTN = {
  ...BTN,
  name: '短信充值',
  type: 21,
  btnColor: '#4AACF7',
}

const ASSIGN_IMPLEMENT_BTN = {
  ...BTN,
  name: '指定实施',
  type: 22,
  btnColor: '#FF6F28',
}

const IMPLEMENT_FOLLOW_BTN = {
  ...BTN,
  name: '实施跟进',
  type: 23,
  btnColor: '#35C43D',
}
/**
 * 需要用到组件的模块都需要在此声明
 * @type {string[]}
 */

export default {
  "admin/per": {
    hasCheck: false,
    moreBtn: [DEL_BTN, DEL_BTN, DEL_BTN, DEL_BTN],
    headers: [
      {
        name: "显示名字",
        prop: "dname",
        width: 10,
        sortFilterType: "sort",
      },
      {
        name: "备注",
        prop: "remark",
        width: 20,
        sortFilterType: "sort",
      },
      {
        name: "状态",
        prop: "gytype",
        width: 10,
        contentType: "switch",
        sortFilterType: "sort",
      },
      {
        name: "名字",
        prop: "uname",
        width: 10,
        sortFilterType: "sort",
      },
    ],
  },
  "admin/brand": {
    hasCheck: false,
    id: "brandId",
    moreBtn: [DEL_BTN, EDIT_BTN, { ...HEADER_ADD_BTN, btnName: '新建品牌商' }],
    headers: [
      {
        name: "品牌名称",
        prop: "brandName",
        width: "20",
      },
      {
        name: "手机号码",
        prop: "phoneTem",
        width: "10",
        // sortFilterType: "sort",
      },
      {
        name: "公司名称",
        prop: "companyTem",
        width: "20",
        // sortFilterType: "sort",
      },
      {
        name: "地址",
        prop: "addressTem",
        width: "20",
        // sortFilterType: "sort",
      },
      {
        name: "门店数",
        prop: "storeNum",
        width: "10",
        sortFilterType: "sort",
      },
    ],
  },
  "brand/store": {
    hasCheck: false,
    id: "adminId",
    moreBtn: [
      EDIT_BTN,
      {
        ...PASSW_BTN,
        show() {
          return hasPermission('54efbfb3')
        },
      },
      { ...HEADER_ADD_BTN, btnName: '新建门店' },
    ],
    headers: [
      {
        name: "编号",
        prop: "storeNo",
        width: '5%',
        // sortFilterType: "sort",
      },
      {
        name: "门店名称",
        prop: "storeName",
        width: '15%',
      },
      {
        name: "区域",
        prop: "blockName",
        width: '8%',
      },
      {
        name: "门店类型",
        prop: "storeTitle",
        width: '8%',
      },
      {
        name: "经营者",
        prop: "operator",
        width: '8%',
      },
      {
        name: "联系电话",
        prop: "phoneTem",
        width: '10%',
        // sortFilterType: "sort",
      },
      {
        name: "状态",
        prop: "work",
        width: '8%',
        sortFilterType: "sort",
        render: (c) => {
          return c.work === 1 ? "启用" : "停用"
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: '15%',
        // sortFilterType: "sort",
      },
      {
        name: "创建时间",
        prop: "created",
        width: '9%',
        sortFilterType: "sort",
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
    ],
  },
  "brand/project": {
    hasCheck: false,
    id: "projectId",
    moreBtn: [
      {
        ...EDIT_BTN,
        disabled(c) {
          return c.isSystem === 1
        },
      },
      { ...HEADER_ADD_BTN, btnName: '新建项目' },
      {
        ...DEL_BTN,
        disabled(c) {
          if (c.isSystem === 1) {
            return true
          } else {
            return false
          }
        },
      },
    ],
    headers: [
      {
        name: "项目名称",
        prop: "projectName",
        width: '22%',
      },
      {
        name: "项目分类",
        prop: "categoryName",
        width: '21%',
      },
      {
        name: "业务类型",
        prop: "maintainTypeName",
        width: '21%',
        render: (v) => {
          if (v.isSystem === 1) {
            return "其他"
          } else if (v.maintainTypeName == null) {
            return "其他"
          } else {
            return v.maintainTypeName
          }
        },
      },
      {
        name: "创建时间",
        prop: "created",
        width: '21%',
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
    ],
  },
  "store/project": {
    hasCheck: true,
    id: "projectId",
    moreBtn: [
      {
        ...EDIT_BTN,
        show() {
          return hasPermission(51)
        },
      },
      {
        ...BATCH_BTN,
        tooltip: '请选择需要批量设置的项目',
        show() {
          return hasPermission(51)
        },
      },
      {
        ...HEADER_ADD_BTN,
        btnName: '新建项目',
        show() {
          return hasPermission(51)
        },
      },
      {
        ...DEL_BTN,
        disabled(c) {
          if (c.isSystem === 1) {
            return true
          } else {
            return c.formTem === 1
          }
        },
        show() {
          return hasPermission(51)
        },
      },
    ],
    headers: [
      {
        name: "项目名称",
        prop: "projectName",
        width: "13%",
        render: (c) => {
          if (c.isSystem === 1) {
            return (
              <div>
                {c.projectName}
                <Popover
                  trigger="hover"
                  content="用于需要计算工时的不常用临时项目。"
                >
                  <Icon
                    style={{ color: "#4AACF7", marginLeft: "10px" }}
                    type="question-circle"
                  />
                </Popover>
              </div>
            )
          } else {
            return c.projectName
          }
        },
      },
      {
        name: "来源",
        prop: "formTem",
        width: "6%",
        render: (c) => {
          return c.formTem === 1 ? "品牌商" : "门店"
        },
      },
      {
        name: "销售提成",
        prop: "salesPercent",
        width: "12%",
        render(v) {
          if (v.salesType * 1 === 1) {
            return "实收比例 " + v.salesPercent + "%"
          } else if (v.salesType * 1 === 2) {
            return "原价比例 " + v.salesPercent + "%"
          } else if (v.salesType * 1 === 4) {
            return "固定金额 " + v.salesMoney + "元"
          } else if (v.salesType * 1 === 5) {
            return "利润比例 " + v.salesPercent + "%"
          } else if (v.salesType * 1 === 6) {
            return "毛利提成 " + v.salesPercent + "%"
          } else {
            return "不提成"
          }
        },
      },
      {
        name: "项目状态",
        prop: "statusTem",
        width: "6%",
        render: (c) => {
          return c.statusTem === 1 ? (
            <Status status={true}>启用</Status>
          ) : (
              <Status status={false}>停用</Status>
            )
        },
      },
      {
        name: "项目分类",
        prop: "categoryName",
        width: "6%",
        render: (v) => {
          if (v.categoryName == null) {
            return "其他"
          } else {
            return v.categoryName
          }
        },
      },
      {
        name: "业务类型",
        prop: "maintainTypeName",
        width: "6%",
        render: (v) => {
          if (v.isSystem === 1) {
            return "其他"
          } else if (v.maintainTypeName == null) {
            return "其他"
          } else {
            return v.maintainTypeName
          }
        },
      },
      {
        name: "施工提成",
        prop: "roadWorkPercent",
        render(v) {
          return v.roadWorkType * 1 === 1
            ? "实收比例 " + v.roadWorkPercent + "%"
            : v.roadWorkType * 1 === 2
              ? "原价比例 " + v.roadWorkPercent + "%"
              : v.roadWorkType * 1 === 4
                ? "固定金额" + v.roadWorkMoney + "元"
                : v.roadWorkType * 1 === 5
                  ? "利润比例" + v.roadWorkPercent + "%"
                  : v.roadWorkType * 1 === 6
                  ? "毛利提成" + v.roadWorkPercent + "%"
                  : v.roadWorkType * 1 === 3
                    ? "不提成"
                    : ""
        },
        width: "12%",
      },
      {
        name: "成本",
        prop: "costTem",
        width: "7%",
        sortFilterType: "sort",
      },
      {
        name: "销售价格",
        prop: "priceTem",
        width: "7%",
        sortFilterType: "sort",
      },
      {
        name: "创建时间",
        prop: "created",
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
        width:'7%',
      },
    ],
  },
  //门店-员工列表
  "store/staff": {
    hasCheck: false,
    id: "staffId",
    moreBtn: [
      EDIT_BTN,
      DEL_BTN,
      {
        ...PASSW_BTN,
        show() {
          return hasPermission('78ecbad7')
        },
      },
      { ...HEADER_ADD_BTN, btnName: '新建员工' }],
    headers: [
      {
        name: "工号",
        prop: "staffNo",
        width: "6%",
      },
      {
        name: "姓名",
        prop: "staffName",
        width: "9%",
      },
      {
        //以前的工种
        name: "角色",
        prop: "roleName",
        width: "8%",
      },
      {
        name: "班组",
        prop: "groupName",
        width: "12%",
      },
      {
        name: "入职时间",
        prop: "entryTime",
        width: "10%",
        sortFilterType: "sort",
        render: (c) => {
          return c.entryTime === 0
            ? "-"
            : moment(c.entryTime * 1000).format("YYYY-MM-DD")
        },
      },
      {
        name: "手机号",
        prop: "phoneTem",
        width: "11%",
      },
      {
        name: "在职状态",
        prop: "",
        width: "8%",
        sortFilterType: "sort",
        render: (c) => {
          if (Number(c.isJob) === 1) {
            return <Status status={true}>在职</Status>
          } else {
            return <Status status={false}>离职</Status>
          }
        },
      },
      {
        name: "最后一次登录时间",
        prop: "lastLogin",
        width: "14%",
        sortFilterType: "sort",
        render: (c) => {
          return c.lastLogin === 0
            ? "-"
            : moment(c.lastLogin * 1000).format("YYYY-MM-DD")
        },
      },
    ],
  },
  "brand/shift": {
    hasCheck: false,
    id: "id",
    moreBtn: [{ ...HEADER_ADD_BTN, btnName: '新建班次' }, { ...NEDIT_BTN, name: "详情" }, NDEL_BTN],
    headers: [
      {
        name: "排班名称",
        prop: "name",
        width: "12%",
      },
      {
        name: "开始时间",
        prop: "startTime",
        width: "12%",
      },
      {
        name: "结束时间",
        prop: "endTime",
        width: "12%",
      },
      {
        name: "时长（小时）",
        prop: "lengthTime",
        width: "12%",
      },
      {
        name: "出勤数",
        prop: "attendanceNumber",
        width: "12%",
      },
      {
        name: "计薪数",
        prop: "salaryPlanNumber",
        width: "12%",
      },
      {
        name: "备注",
        prop: "remarks",
        width: "13%",
      },
    ],
  },
  "brand/unit": {
    hasCheck: false,
    id: "unitId",
    moreBtn: [{ ...EDIT_BTN, show: (item) => item.formTem !== 0 }, { ...DEL_BTN, show: (item) => item.formTem !== 0 }, { ...HEADER_ADD_BTN, btnName: '新建单位' }],
    headers: [
      {
        name: "单位名称",
        prop: "unitName",
        width: '28%',
      },
      {
        name: "单位来源",
        prop: "formTem",
        width: '28%',
        contentType: "switch",
        render: (item) => {
          if (item.formTem === 0) {
            return "系统内置"
          } else if (item.formTem === 1) {
            return "品牌商"
          } else {
            return "门店"
          }
        },
      },
      {
        name: "创建时间",
        prop: "created",
        width: '29%',
        sortFilterType: "sort",
        render: (record) => {
          return record.formTem !== 0 ? moment(record.created * 1000).format("YYYY-MM-DD") : '-'
        },
      },
    ],
  },
  "brand/stafflevel": {
    hasCheck: true,
    id: "staffLevelId",
    moreBtn: [EDIT_BTN, DEL_BTN, { ...HEADER_ADD_BTN, btnName: '新建工种' }],
    headers: [
      {
        name: "工种名称",
        prop: "staffLevelName",
        width: 20,
        sortFilterType: "sort",
      },
      {
        name: "角色名称",
        prop: "roleName",
        width: 18,
        sortFilterType: "sort",
      },
      {
        name: "来源",
        prop: "formTem",
        width: 18,
        sortFilterType: "sort",
        render: (c) => {
          if (Number(c.formTem) === 1) {
            return "品牌商"
          } else {
            return "门店"
          }
        },
      },
      {
        name: "创建时间",
        prop: "created",
        width: 26,
        sortFilterType: "sort",
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
    ],
  },
  "store/stafflevel": {
    // hasCheck: true,
    id: "staffLevelId",
    moreBtn: [
      {
        ...EDIT_BTN,
        disabled(c) {
          return c.formTem === 1
        },
      },
      {
        ...DEL_BTN,
        disabled(c) {
          return c.formTem === 1
        },
      },
      { ...HEADER_ADD_BTN, btnName: '新建工种' },
    ],
    headers: [
      {
        name: "工种名称",
        prop: "staffLevelName",
        width: 20,
      },
      {
        name: "角色名称",
        prop: "roleName",
        width: 18,
      },
      {
        name: "来源",
        prop: "formTem",
        width: 18,
        render: (c) => {
          if (Number(c.formTem) === 1) {
            return "品牌商"
          } else {
            return "门店"
          }
        },
      },
      {
        name: "创建时间",
        prop: "created",
        width: 26,
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
    ],
  },
  "store/staffgroup": {
    hasCheck: false,
    id: "groupId",
    moreBtn: [EDIT_BTN, DEL_BTN, { ...HEADER_ADD_BTN, btnName: '新建班组' }],
    headers: [
      {
        name: "班组名称",
        prop: "groupName",
        width: 31,
      },
      {
        name: "创建时间",
        prop: "created",
        width: 52,
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
    ],
  },
  "store/manhour": {
    hasCheck: true,
    id: "manHourId",
    moreBtn: [EDIT_BTN, DEL_BTN, { ...HEADER_ADD_BTN, btnName: '新建工时' }],
    headers: [
      {
        name: "名称",
        prop: "manHourName",
        width: 26,
        sortFilterType: "sort",
      },
      {
        name: "分钟",
        prop: "min",
        width: 18,
        sortFilterType: "sort",
      },
      {
        name: "金额",
        prop: "amount",
        width: 18,
      },
      {
        name: "默认",
        prop: "statusTem",
        width: 34,
        sortFilterType: "sort",
        render: (c) => {
          return c.statusTem === 1 ? "是" : "否"
        },
      },
    ],
  },
  "store/warehouse": {
    hasCheck: false,
    id: "warehouseId",
    moreBtn: [EDIT_BTN, DEL_BTN, { ...HEADER_ADD_BTN, btnName: '新建仓库' }],
    headers: [
      {
        name: "仓库名称",
        prop: "warehouseName",
        width: "27%",
        sortFilterType: "sort",
      },
      {
        name: "默认仓库",
        prop: "isDefaultWarehouse",
        width: "12%",
        sortFilterType: "sort",
        render: (c) => {
          if (Number(c.isDefaultWarehouse) === 1) {
            return <Status status={true}>是</Status>
          } else {
            return <Status status={false}>否</Status>
          }
        },
      },
      {
        name: "创建时间",
        prop: "created",
        width: "14%",
        sortFilterType: "sort",
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: "20%",
        contentType: "switch",
      },
    ],
  },
  "store/unit": {
    hasCheck: true,
    id: "unitId",
    moreBtn: [EDIT_BTN, DEL_BTN, { ...HEADER_ADD_BTN, btnName: '新建单位' }],
    headers: [
      {
        name: "单位名称",
        prop: "unitName",
        width: 28,
      },
      {
        name: "单位来源",
        prop: "formTem",
        width: 28,
        contentType: "switch",
      },
      {
        name: "创建时间",
        prop: "created",
        width: 30,
        sortFilterType: "sort",
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
    ],
  },
  "store/supplier": {
    hasCheck: false,
    id: "supplierId",
    moreBtn: [EDIT_BTN, DEL_BTN, { ...HEADER_ADD_BTN, btnName: '新建供应商' }],
    headers: [
      {
        name: "供应商名称",
        prop: "supplierName",
        width: '15%',
      },
      {
        name: "来源",
        prop: "formTem",
        width: '5%',
        render: (c) => {
          return c.formTem === 1 ? "品牌商" : "门店"
        },
      },
      {
        name: "手机号",
        prop: "businessPhone",
        width: '10%',
        contentType: "switch",
      },
      {
        name: "联系电话",
        prop: "businessTelephone",
        width: '10%',
        render: (c) => {
          return c.businessTelephone && c.businessTelephone !== "0"
            ? c.businessTelephone
            : ""
        },
      },
      {
        name: "传真",
        prop: "faxTem",
        width: '10%',
      },
      {
        name: "地址",
        prop: "addressTem",
        width: '20%',
      },
      {
        name: "备注",
        prop: "remark",
        width: '9%',
      },
      {
        name: "创建时间",
        prop: "created",
        width: '8%',
        sortFilterType: "sort",
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
    ],
  },
  "brand/storetype": {
    hasCheck: false,
    id: "storeTypeId",
    moreBtn: [EDIT_BTN, DEL_BTN, { ...HEADER_ADD_BTN, btnName: '新建分类' }],
    headers: [
      {
        name: "分类名称",
        prop: "storeTitle",
        width: "40%",
      },
      {
        name: "备注",
        prop: "remark",
        width: "45%",
      },
    ],
  },
  "brand/product": {
    hasCheck: false,
    id: "productId",
    moreBtn: [EDIT_BTN, DEL_BTN, { ...HEADER_ADD_BTN, btnName: '新建产品' }],
    headers: [
      {
        name: "产品名称",
        prop: "productName",
        width: '13%',
        render: (text) => {
          return <div style={{ width: '154px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.productName}
          </div>
        },
      },
      {
        name: "商品编码",
        prop: "commodityCode",
        width: '8%',
        render: (text) => {
          return <div style={{ width: '112px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.commodityCode}
          </div>
        },
      },
      {
        name: "型号",
        prop: "modelTem",
        width: '9%',
      },
      {
        name: "规格",
        prop: "specificationTem",
        width: '9%',
      },
      {
        name: "所属分类",
        prop: "categoryName",
        width: '9%',
      },
      {
        name: "业务类型",
        prop: "maintainTypeName",
        width: '8%',
      },
      {
        name: "条形码",
        prop: "barCodeNumber",
        width: '8%',
      },
      {
        name: "单位",
        prop: "unitName",
        width: '6%',
      },
      {
        name: "配件属性",
        prop: "accessoryProperties",
        width: '9%',
        render(v) {
          let rel = ""
          if (v.accessoryProperties === 1) {
            rel = "原厂"
          } else if (v.accessoryProperties === 2) {
            rel = "同质"
          } else if (v.accessoryProperties === 3) {
            rel = "修复"
          } else if (v.accessoryProperties === 4) {
            rel = "其他"
          }
          return rel
        },
      },
      {
        name: "状态",
        prop: "statusTem",
        width: '6%',
        render(v) {
          return v.statusTem === 1 ? (
            <Status status={true}>启用</Status>
          ) : (
              <Status status={false}>停用</Status>
            )
        },
      },
    ],
  },
  "store/product": {
    hasCheck: true,
    isScroll: true,
    id: "productId",
    moreBtn: [
      {
        ...EDIT_BTN,
        show() {
          return hasPermission(53)
        },
      },
      {
        ...DEL_BTN,
        disabled(c) {
          return c.formTem === 1
        },
        show() {
          return hasPermission(53)
        },
      },
      {
        ...BATCH_BTN,
        tooltip: '请选择需要批量设置的产品',
        show() {
          return hasPermission(53)
        },
      },
      {
        ...HEADER_ADD_BTN,
        btnName: '新增产品',
        show() {
          return hasPermission(53)
        },
      },
    ],
    headers: [
      {
        name: "产品名称",
        prop: "productName",
        width: "154px",
        render(v) {
          return <div style={{ width: '154px', wordWrap: 'break-word', wordBreak: 'break-all' }}>{v.productName}</div>
        },
      },
      {
        name: "商品编码",
        prop: "commodityCode",
        width: "112px",
        render(v) {
          return <div style={{ width: '112px', wordWrap: 'break-word', wordBreak: 'break-all' }}>{v.commodityCode}</div>
        },
      },
      {
        name: "产品简称",
        prop: "intro",
        width: "7%",
      },
      {
        name: "来源",
        prop: "formTem",
        width: "5%",
        render(v) {
          return v.formTem === 1 ? "品牌商" : "门店"
        },
      },
      {
        name: "销售提成",
        prop: "salesPercent",
        render(v) {
          if (v.salesType * 1 === 1) {
            return "实收比例 " + v.salesPercent + "%"
          } else if (v.salesType * 1 === 2) {
            return "原价比例 " + v.salesPercent + "%"
          } else if (v.salesType * 1 === 4) {
            return "固定金额 " + v.salesMoney + "元"
          } else if (v.salesType * 1 === 5) {
            return "利润比例" + v.salesPercent + " % "
          } else if (v.salesType * 1 === 6) {
            return "毛利提成" + v.salesPercent + " % "
          } else {
            return "不提成"
          }
        },
        width: "8%",
      },
      {
        name: "施工提成",
        prop: "roadWorkPercent",
        width: "8%",
        render(v) {
          return v.roadWorkType * 1 === 1
            ? "实收比例 " + v.roadWorkPercent + "%"
            : v.roadWorkType * 1 === 2
              ? "原价比例 " + v.roadWorkPercent + "%"
              : v.roadWorkType * 1 === 4
                ? "固定金额" + v.roadWorkMoney + "元"
                : v.roadWorkType * 1 === 5
                  ? "利润比例" + v.roadWorkPercent + "%"
                  : v.roadWorkType * 1 === 6
                  ? "毛利提成" + v.roadWorkPercent + "%"
                  : v.roadWorkType * 1 === 3
                    ? "不提成"
                    : ""
        },
      },
      {
        name: "所属分类",
        prop: "categoryName",
        width: "7%",
      },
      {
        name: "业务类型",
        prop: "maintainTypeName",
        width: "7%",
      },
      {
        name: "销售价格",
        prop: "sellingPriceTem",
        width: "7%",
      },
      {
        name: "产品类型",
        prop: "type",
        width: "7%",
        render(v) {
          return v.type === 0 ? "外采产品" : "自有产品"
        },
      },
      {
        name: "配件属性",
        prop: "accessoryProperties",
        // width: "7%",
        render(v) {
          let rel = ""
          if (v.accessoryProperties === 1) {
            rel = "原厂"
          } else if (v.accessoryProperties === 2) {
            rel = "同质"
          } else if (v.accessoryProperties === 3) {
            rel = "修复"
          } else if (v.accessoryProperties === 4) {
            rel = "其他"
          }
          return rel
        },
      },
      {
        name: "状态",
        prop: "statusTem",
        width: "4%",
        render(v) {
          return v.statusTem === 1 ? (
            <Status status={true}>启用</Status>
          ) : (
              <Status status={false}>停用</Status>
            )
        },
      },
    ],
  },
  //赵林 库存调整——————————————————————————————————————————————————————————————
  "erp/stock/inventory/adjustment": {
    hasCheck: false,
    id: "id",
    moreBtn: [{ ...EDIT_BTN, name: "详情" }],
    headers: [
      {
        name: "单号",
        prop: "storageNo",
        width: "18%",
        render:(v) => { return v.storageNo },
        // sortFilterType: "sort",
      },
      {
        name: "类型",
        prop: "type",
        width: "7%",
        // sortFilterType: "sort",
        render: (c) => {
          return c.type === 1 ? <span>入库</span> : <span>出库</span>
        },
      },
      {
        name: "种类",
        prop: "typeName",
        width: "9%",
      },
      {
        name: "商品数",
        prop: "goodsNum",
        width: "8%",
        // sortFilterType: "sort",
      },
      {
        name: "金额",
        prop: "totalMoney",
        width: "9%",
        // sortFilterType: "sort",
      },
      {
        name: "员工",
        prop: "staffName",
        width: "9%",
        // sortFilterType: "sort",
      },
      {
        name: "时间",
        prop: "created",
        width: "10%",
        // sortFilterType: "sort",
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
      {
        name: "备注",
        prop: "remark",
        // sortFilterType: "sort",
        width: "20%",
      },
    ],
  },

  //——————————————————————————————————————————————————————————————————————————————————
  "store/clients": {
    hasCheck: false,
    id: "clientId",
    moreBtn: [
      BULK_BTN,
      DETAIL_BTN_XQ,
      {
        ...LOGOUT_BTN,
        show() {
          return hasPermission('550a5e38')
        },
      },
      { ...HEADER_ADD_BTN, btnName: '新建顾客' },
    ],
    headers: [
      {
        name: "姓名",
        prop: "clientName",
        width: "12%",
        fixed: "left",
        render: (v) => {
          // console.log(v)
          return (
            <span>
              <em className='pigeon_client_tag pigeon_client_tag_one'
                style={{
                  display: v.stage === 0 ? 'none' : 'inline-block',
                  background: v.stage === 1 ? '#13C2C2' : (v.stage === 2 ? '#24C02F' : (v.stage === 3 ? '#1890FF' : (v.stage === 4 ? '#F2AE09' : ''))),
                }} >
                {v.stage === 1 ? '吸客' : (v.stage === 2 ? '养客' : (v.stage === 3 ? '黏客' : (v.stage === 4 ? '升客' : '')))}
              </em>
              <em className='pigeon_client_tag pigeon_client_tag_two'
                style={{ display: v.stageMark === 0 ? 'none' : 'inline-block' }} >待升卡</em>
              <br style={{ display: (v.stage === 0 && v.stageMark === 0) ? 'none' : '' }} />
              {v.clientName}
            </span>
          )
        },
      },
      {
        name: "手机号",
        prop: "phoneTem",
        width: "11%",
      },
      {
        name: "客户来源",
        prop: "channelName",
        width: "9%",
      },
      {
        name: "累计消费",
        prop: "cumulative",
        width: "12%",
        sortFilterType: "sort",
      },
      {
        name: "客户类型",
        prop: "clientType",
        width: "9%",
        render: (c) => {
          return c.clientType === 1 ? "个人" : "单位"
        },
      },
      {
        name: "车牌",
        prop: "licenseNo",
        width: "9%",
        render: (c) => {
          const licenseNo = Array.isArray(c.licenseNo) ? c.licenseNo : []
          return (
            <div>
              {licenseNo.map((item, index) => (
                <div key={index}>{item.license_no}</div>
              ))}
            </div>
          )
        },
      },
      {
        name: "账户类型",
        prop: "individual",
        width: "9%",
        render: (v) => {
          return (v.individual === 1 ? '会员' : '散客')
        },
      },
      {
        name: "创建时间",
        prop: "created",
        width: "13%",
        sortFilterType: "sort",
        render: (c) => {
          return c.created ? moment(c.created * 1000).format("YYYY-MM-DD HH:mm:ss"):''
        },
      },
    ],
  },
  "store/clientcar": {
    id: "clientCarId",
    moreBtn: [{ ...HEADER_ADD_BTN, btnName: '新建车辆' }, EDIT_BTN],
    headers: [
      {
        name: "车牌",
        prop: "licenseNo",
        width: "12%",
      },
      {
        name: "车型",
        prop: "carBrandName",
        width: "12%",
        render: (c) => {
          return c.carBrandName + c.seriesName
        },
      },
      {
        name: "车主类型",
        prop: "clientName",
        width: "12%",
        render: (v) => {
          return (v.isIndividual === 1 ? '会员' : '散客')
        },
      },
      {
        name: "车主姓名",
        prop: "clientName",
        width: "12%",
      },
      {
        name: "车主手机号",
        prop: "phoneTem",
        width: "12%",
        render: (c) => {
          return c.phoneTem ? c.phoneTem : ""
        },
      },
      // {
      //   name: "发动机号",
      //   prop: "engineNo",
      //   width: 7,
      // },
      // {
      //   name: "车架号",
      //   prop: "frameNumber",
      //   width: 12,
      // },
      {
        name: "上次到店时间",
        prop: "lastTime",
        width: "12%",
        sortFilterType: "sort",
        render: (c) => {
          return c.lastTime
            ? moment(c.lastTime * 1000).format("YYYY-MM-DD")
            : ""
        },
      },
      // {
      //   name: "保险时间",
      //   prop: "trafficSafeStopTime",
      //   width: 8,
      //   sortFilterType: "sort",
      //   render: (c) => {
      //     return c.trafficSafeStopTime ? moment(c.trafficSafeStopTime * 1000).format("YYYY-MM-DD") : ''
      //   },
      // },
      // {
      //   name: "年审时间",
      //   prop: "carSafeStopTime",
      //   width: 8,
      //   sortFilterType: "sort",
      //   render: (c) => {
      //     return c.carSafeStopTime ? moment(c.carSafeStopTime * 1000).format("YYYY-MM-DD") : ''
      //   },
      // },
      {
        name: "创建时间",
        prop: "created",
        width: "12%",
        sortFilterType: "sort",
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
    ],
  },
  "admin/role": {
    hasCheck: false,
    id: "roleId",
    moreBtn: [EDIT_BTN, DEL_BTN, PERMESSION_BTN, { ...HEADER_ADD_BTN, btnName: '新建角色' }],
    headers: [
      {
        name: "角色名称",
        prop: "roleName",
        width: "40%",
      },
      {
        name: "备注",
        prop: "remark",
        contentType: "sort",
      },
    ],
  },
  "brand/role": {
    hasCheck: false,
    id: "roleId",
    moreBtn: [EDIT_BTN, DEL_BTN, PERMESSION_BTN, { ...HEADER_ADD_BTN, btnName: '新建角色' }],
    headers: [
      {
        name: "角色名称",
        prop: "roleName",
        width: "20%",
      },
      {
        name: "角色类型",
        prop: "roleType",
        width: "20%",
        render: (c) => {
          return c.roleType === 1 ? "品牌商" : "门店"
        },
      },
      {
        name: "备注",
        prop: "remark",
      },
    ],
  },
  "store/role": {
    hasCheck: false,
    id: "roleId",
    moreBtn: [
      {
        ...EDIT_BTN,
        disabled(c) {
          return c.typeTem !== 3
        },
      },
      {
        ...DEL_BTN,
        disabled(c) {
          return c.typeTem === 2
        },
      },
      {
        ...PERMESSION_BTN,
        disabled(c) {
          return c.typeTem !== 3
        },
      },
      { ...HEADER_ADD_BTN, btnName: '新建角色' },
    ],
    headers: [
      {
        name: "角色名称",
        prop: "roleName",
        width: "20%",
      },
      {
        name: "角色来源",
        prop: "typeTem",
        render: (c) => {
          return c.typeTem === 2
            ? "品牌商"
            : c.typeTem === 3
              ? "门店"
              : "管理员"
        },
        width: "20%",
      },
      {
        name: "备注",
        prop: "remark",
        contentType: "sort",
      },
    ],
  },
  admin: {
    hasCheck: false,
    id: "adminId",
    moreBtn: [EDIT_BTN, DEL_BTN, { ...HEADER_ADD_BTN, btnName: '新建管理员' }],
    headers: [
      {
        name: "管理员名称",
        prop: "userName",
        width: "20%",
        // sortFilterType: "sort",
      },
      {
        name: "角色",
        prop: "roleName",
        width: "20%",
        // sortFilterType: "sort",
      },
      {
        name: "手机号码",
        prop: "phoneTem",
        width: "20%",
        // sortFilterType: "sort",
      },
      {
        name: "备注",
        prop: "remark",
        width: "20%",
        // sortFilterType: "sort",
      },
    ],
  },
  "brand/supervisor": {
    hasCheck: false,
    id: "supervisorId",
    moreBtn: [EDIT_BTN, DEL_BTN, { ...HEADER_ADD_BTN, btnName: '新建督导' }],
    headers: [
      {
        name: "姓名",
        prop: "supervisorName",
        width: '17%',
        // sortFilterType: "sort",
      },
      {
        name: "手机号码",
        prop: "phoneTem",
        width: '17%',
        // sortFilterType: "sort",
      },
      {
        name: "权限角色",
        prop: "roleName",
        width: '17%',
        // sortFilterType: "sort",
      },
      {
        name: "是否在职",
        prop: "statusTem",
        width: '17%',
        // sortFilterType: "sort",
        render: (c) => {
          return c.statusTem === 1 ? (
            <Status status={true}>在职</Status>
          ) : (
              <Status status={false}>离职</Status>
            )
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: '10%',
        // sortFilterType: "sort",
      },
    ],
  },
  "brand/brandadmin": {
    hasCheck: false,
    id: "supervisorId",
    moreBtn: [EDIT_BTN, DEL_BTN, { ...HEADER_ADD_BTN, btnName: '新建管理员' }],
    headers: [
      {
        name: "姓名",
        prop: "supervisorName",
        width: '17%',
      },
      {
        name: "手机号码",
        prop: "phoneTem",
        width: '17%',
      },
      {
        name: "权限角色",
        prop: "roleName",
        width: '17%',
      },
      {
        name: "是否在职",
        prop: "statusTem",
        width: '17%',
        render: (c) => {
          return c.statusTem === 1 ? (
            <Status status={true}>在职</Status>
          ) : (
              <Status status={false}>离职</Status>
            )
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: '10%',
      },
    ],
  },
  "store/species": {
    hasCheck: false,
    id: "speciesId",
    moreBtn: [
      {
        ...EDIT_BTN, // 修改按钮
        show() {
          return hasPermission(46)
        },
      },
      {
        ...HEADER_ADD_BTN, // 新增按钮
        btnName: '新建充值卡',
        show() {
          return hasPermission(46)
        },
      },
      {
        ...FORB_BTN, // 禁用按钮
        show(c) {
          return hasPermission(46) && c.state !== 0
        },
      },
      {
        ...START_BTN, // 启用按钮
        show(c) {
          return hasPermission(46) && c.state !== 1
        },
      },
      {
        name: '复制',
        icon: 'icon-qia',
        power: 'permission',
        type: 22,
      },
    ],
    headers: [
      {
        name: "卡名称",
        prop: "cardName",
        width: "15%",
        render: (item) => {
          return (
            <PopoverTip query={{ 'speciesId': item.speciesId }} type={1} name='store/species/details'>
              {item.cardName}
            </PopoverTip>
          )
        },
      },
      {
        name: "开卡充值",
        prop: "rechargeMoney",
        width: "8%",
      },
      {
        name: "开卡赠送",
        prop: "giveMoney",
        width: "8%",
      },
      {
        name: "有效期",
        prop: "deadline",
        width: "8%",
        sortFilterType: "sort",
        render: (c) => {
          let result = ""
          if (c.neverValid === 1) {
            result = "无限期"
          } else {
            result =
              c.deadlineNum +
              (c.deadlineUnit === 1 ? "年" : c.deadlineUnit === 2 ? "月" : "日")
          }
          return result
        },
      },
      {
        name: "销售提成",
        prop: "salesPercent",
        width: "8%",
        render: (v) => {
          if (v.salesType * 1 === 1) {
            return "实收比例 " + v.salesPercent + "%"
          } else if (v.salesType * 1 === 2) {
            return "原价比例 " + v.salesPercent + "%"
          } else if (v.salesType * 1 === 4) {
            return "固定金额 " + v.salesMoney + "元"
          } else {
            return "不提成"
          }
        },
      },
      {
        name: "已售数量",
        prop: "soldNum",
        width: "8%",
        sortFilterType: "sort",
      },
      {
        name: "状态",
        prop: "state",
        width: "6%",
        render: (c) => {
          return (
            <div className={c.state === 1 ? "radio-green" : "radio-red"}>
              {c.state === 1 ? "启用" : "停用"}
            </div>
          )
        },
      },
      {
        name: "创建时间",
        prop: "created",
        width: "10%",
        sortFilterType: "sort",
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: "13%",
      },
    ],
  },
  "brand/payment": {
    hasCheck: false,
    id: "paymentId",
    moreBtn: [
      {
        ...EDIT_BTN,
        disabled(c) {
          return c.formTem !== 1
        },
      },
      {
        ...DEL_BTN,
        disabled(c) {
          return c.formTem !== 1
        },
      },
      { ...HEADER_ADD_BTN, btnName: '新建支付' },
    ],
    headers: [
      {
        name: "支付名称",
        prop: "paymentName",
        width: "17%",
      },
      {
        name: "是否开启",
        prop: "statusTem",
        width: "17%",
        render: (c) => {
          return c.statusTem === 1 ? (
            <Status status={true}>是</Status>
          ) : (
              <Status status={false}>否</Status>
            )
        },
      },
      {
        name: "是否收现",
        prop: "typeTem",
        width: "17%",
        render: (c) => {
          return c.typeTem === 1 ? (
            <Status status={true}>是</Status>
          ) : (
              <Status status={false}>否</Status>
            )
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: "17%",
      },
      {
        name: "创建时间",
        prop: "created",
        width: "17%",
        render: (c) => {
          return c.typeTem === 1 ? '-' : moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
    ],
  },
  "store/payment": {
    hasCheck: false,
    id: "paymentId",
    moreBtn: [
      {
        ...EDIT_BTN,
        disabled(c) {
          return c.formTem !== 2
        },
      },
      {
        ...DEL_BTN,
        disabled(c) {
          return c.formTem !== 2
        },
      },
      { ...HEADER_ADD_BTN, btnName: '新建支付' },
    ],
    headers: [
      {
        name: "支付名称",
        prop: "paymentName",
        width: 14,
      },
      {
        name: "是否开启",
        prop: "statusTem",
        width: 13,
        render: (c) => {
          return c.statusTem === 1 ? (
            <Status status={true}>是</Status>
          ) : (
              <Status status={false}>否</Status>
            )
        },
      },
      {
        name: "是否收现",
        prop: "typeTem",
        width: 13,
        render: (c) => {
          return c.typeTem === 1 ? (
            <Status status={true}>是</Status>
          ) : (
              <Status status={false}>否</Status>
            )
        },
      },
      {
        name: "来源",
        prop: "formTem",
        width: 13,
        render: (c) => {
          return c.formTem === 1 ? "品牌商" : c.formTem === 2 ? "门店" : "公共"
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: 14,
      },
      {
        name: "创建时间",
        prop: "created",
        width: 14,
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
    ],
  },
  "brand/channel": {
    hasCheck: false,
    id: "channelId",
    moreBtn: [
      {
        ...EDIT_BTN,
        disabled(c) {
          return c.formTem !== 1
        },
      },
      {
        ...DEL_BTN,
        disabled(c) {
          return c.formTem !== 1
        },
      },
      { ...HEADER_ADD_BTN, btnName: '新建入店渠道' },
    ],
    headers: [
      {
        name: "入店渠道",
        prop: "channelName",
        width: '17%',
        // sortFilterType: "sort",
      },
      {
        name: "来源",
        prop: "formTem",
        width: '17%',
        render: (c) => {
          return c.formTem === 1 ? "品牌商" : "公共"
        },
      },
      {
        name: "是否开启",
        prop: "statusTem",
        width: '17%',
        render: (c) => {
          return c.statusTem === 1 ? "是" : "否"
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: '34%',
        // sortFilterType: "sort",
      },
    ],
  },
  "store/records": {
    hasCheck: false,
    id: "recordsId",
    moreBtn: [
      {
        ...HEADER_ADD_BTN,
        btnName: '新建计次卡',
        show() {
          return hasPermission(48)
        },
      },
      {
        ...HEADER_ADD_BTN, // 新增按钮
        btnName: '新建随选卡',
        tooltip: '设定卡的总次数，会员可以选择卡内任意服务消费，总次数用完为止。',
        type: 317,
        show() {
          return hasPermission(46)
        },
      },
      {
        ...EDIT_BTN,
        show() {
          return hasPermission(48)
        },
      },
      {
        ...FORB_BTN,
        show(e) {
          return hasPermission(48) && e.statusTem === 1
        },
      },
      {
        ...START_BTN,
        show(e) {
          return hasPermission(48) && e.statusTem !== 1
        },
      },
    ],
    headers: [
      {
        name: "套餐名称",
        prop: "cardName",
        width: "17%",
        render: (item) => {
          return (
            <PopoverTip query={{ 'recordsId': item.recordsId }} type={2} name='store/records/details'>
              {item.cardName}
            </PopoverTip>
          )
        },
      },
      {
        name: "套餐售价",
        prop: "amount",
        width: "9%",
      },
      {
        name: "套餐次数",
        prop: "packageCount",
        width: "9%",
        render: (c) => {
          return c.packageCount === -1 || parseInt(c.packageCount) === -1
            ? "无限"
            : c.packageCount * 1
        },
      },
      {
        name: "有效期",
        prop: "deadlineTime",
        width: "9%",
        sortFilterType: "sort",
        render: (c) => {
          let result = ""
          if (c.neverValid === 1) {
            result = "无限期"
          } else {
            result =
              c.deadlineNum +
              (c.deadlineUnit === 1 ? "年" : c.deadlineUnit === 2 ? "月" : "日")
          }
          return result
        },
      },
      {
        name: "销售提成",
        prop: "salesPercent",
        width: "9%",
        render: (v) => {
          if (v.salesType * 1 === 1) {
            return "实收比例 " + v.salesPercent + "%"
          } else if (v.salesType * 1 === 2) {
            return "原价比例 " + v.salesPercent + "%"
          } else if (v.salesType * 1 === 4) {
            return "固定金额 " + v.salesMoney + "元"
          } else {
            return "不提成"
          }
        },
      },
      {
        name: "状态",
        prop: "statusTem",
        width: "6%",
        render: (c) => {
          return (
            <div className={c.statusTem === 1 ? "radio-green" : "radio-red"}>
              {c.statusTem === 1 ? "启用" : "停用"}
            </div>
          )
        },
      },
      {
        name: "创建时间",
        prop: "created",
        width: "11%",
        sortFilterType: "sort",
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: "12%",
      },
    ],
  },
  // 出库单
  "erp/stock/inventory/storage/output": {
    id: "id",
    moreBtn: [{ ...HEADER_ADD_BTN, btnName: '新建出库单' }, DETAIL_BTN],
    headers: [
      {
        name: "单号",
        prop: "storageNo",
        width: '15%',
        render:(v) => v.storageNo,
      },
      {
        name: "商品数",
        prop: "goodsNum",
        width: '10%',
        sortFilterType: "sort",
      },
      {
        name: "金额",
        prop: "totalMoney",
        width: '11%',
        sortFilterType: "sort",
      },
      {
        name: "出库员",
        prop: "staffName",
        width: '11%',
      },
      {
        name: "时间",
        prop: "created",
        width: '21%',
        sortFilterType: "sort",
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD HH:mm:ss")
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: '21%',
      },
    ],
  },
  "erp/stock/purchase": {
    id: "id",
    hasCheck: false,
    moreBtn: [
      { ...HEADER_ADD_BTN, btnName: '新建采购单' },
      {
        ...EDIT_BTN,
        disabled(c) {
          return c.status !== 3
        },
      },
      // HEADER_PRINT_BTN,
      DETAIL_BTN,
      {
        ...CANCELLATION_BTN,
        disabled(c) {
          return c.status === 4 || c.status === 1 || c.status === 2
        },
      },
    ],
    headers: [
      {
        name: "单号",
        prop: "no",
        width: "16%",
        render:(v) => v.no,
      },
      {
        name: "商品数",
        prop: "number",
        width: "5%",
        sortFilterType: "sort",
      },
      {
        name: "供应商",
        prop: "supplier_name",
        width: "10%",
      },
      {
        name: "原价",
        prop: "total",
        width: "6%",
        sortFilterType: "sort",
      },
      {
        name: "优惠",
        prop: "discount",
        width: "6%",
        sortFilterType: "sort",
      },
      {
        name: "付款",
        prop: "payment",
        width: "6%",
        sortFilterType: "sort",
      },
      {
        name: "挂账",
        prop: "surplus",
        width: "6%",
        sortFilterType: "sort",
      },
      {
        name: "采购员",
        prop: "operator",
        width: "6%",
      },
      {
        name: "时间",
        prop: "created",
        width: "11%",
        sortFilterType: "sort",
        render: (e) => {
          return moment(e.created * 1000).format("YYYY-MM-DD HH:mm:ss")
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: "8%",
      },
      {
        name: "状态",
        prop: "status",
        width: "6%",
        render: (e) => {
          const status = e.status
          if (status === 0) {
            return "采购中"
          } else if (status === 1) {
            return "部分入库"
          } else if (status === 2) {
            return "全部入库"
          } else if (status === 3) {
            return "挂单"
          } else if (status === 4) {
            return "已作废"
          }
        },
      },
    ],
  },
  "erp/statistics/inventory": {
    id: "id",
    hasCheck: false,
    moreBtn: [
      // {
      //   ...CHECK_CIRCLE,
      //   disabled(item) {
      //     return item.status !== 1
      //   },
      //   show(item) {
      //     return item.id?true:false
      //   }
      // },
      // {
      //   ...FORB_BTN,
      //   disabled(item) {
      //     return item.status !== 0
      //   },
      //   show(item) {
      //     return item.id?true:false
      //   }
      // },
      {
        name: "成本调整",
        power: "permission",
        icon: "icon-xiangqing",
        type: 21,
        show(item) {
          return item.id && hasPermission(84) ? true : false
        },
      },
    ],
    headers: [
      {
        name: "商品名称",
        prop: "productName",
        width: "12%",
        render: (text) => {
          return <div style={{ width: '100%', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.productName}
          </div>
        },
      },
      {
        name: "编码",
        prop: "commodityCode",
        width: "12%",
        render: (text) => {
          return <div style={{ width: '100%', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.commodityCode}
          </div>
        },
      },
      {
        name: "规格",
        prop: "specification",
        width: "7%",
      },
      {
        name: "分类",
        prop: "categoryName",
        width: "8%",
      },
      {
        name: "平均成本",
        prop: "sellingPrice",
        width: "8%",
        sortFilterType: "sort",
      },
      {
        name: "库存量",
        prop: "inventoryGoodsNum",
        width: "7%",
        sortFilterType: "sort",
      },
      {
        name: "库存总额",
        prop: "totalPrice",
        width: "8%",
        sortFilterType: "sort",
      },
      {
        name: "寄存数",
        prop: "inventoryLockerNum",
        width: "7%",
        sortFilterType: "sort",
      },
      {
        name: "仓库",
        prop: "warehouseName",
        width: "7%",
      },
      {
        name: "状态",
        prop: "status",
        width: "7%",
        render: (e) => {
          const status = e.status
          if (status === 0) {
            return "正常"
          } else if (status === 1) {
            return <span style={{ color: "#FF6F28" }}>已停用</span>
          }
        },
      },
    ],
  },
  "erp/stock/inventory/storage": {
    id: "id",
    hasCheck: false,
    moreBtn: [],
    headers: [
      {
        name: "类型",
        prop: "typeName",
        width: '5%',
      },
      {
        name: "单号",
        prop: "storageNo",
        width: '15%',
        render: (v) => v.storageNo,
      },
      {
        name: "商品名称",
        prop: "productName",
        width: '10%',
        render: (text) => {
          return <div style={{ margin: '0px', width: '100%', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.productName}
          </div>
        },
      },
      {
        name: "编码",
        prop: "commodityCode",
        width: '9%',
        render: (text) => {
          return <div style={{ margin: '0px', width: '100%', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.commodityCode}
          </div>
        },
      },
      {
        name: "规格",
        prop: "specification",
        width: '7%',
        render: (text) => {
          return <div style={{ margin: '0px', width: '100%', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.specification}
          </div>
        },
      },
      {
        name: "仓库",
        prop: "warehouseName",
        width: '8%',
      },
      {
        name: "供应商",
        prop: "supplierName",
        width: '8%',
      },
      {
        name: "单价",
        prop: "goodsPrice",
        width: '5%',
      },
      {
        name: "数量",
        prop: "num",
        width: '4%',
      },
      {
        name: "金额",
        prop: "totalPrice",
        width: '5%',
      },
      {
        name: "操作员",
        prop: "staffName",
        width: '5%',
      },
      {
        name: "时间",
        prop: "created",
        width: '10%',
        sortFilterType: "sort",
        render: (e) => {
          return moment(e.created * 1000).format("YYYY-MM-DD HH:mm:ss")
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: '5%',
      },
    ],
  },
  "store/stocktaking": {
    id: "stocktakingId",
    hasCheck: false,
    moreBtn: [
      {
        ...EDIT_BTN,
        disabled(c) {
          return c.status !== 2
        },
      },
      DETAIL_BTN_XQ,
      {
        ...DEL_BTN,
        disabled(c) {
          return c.status === 1
        },
      },
      { ...HEADER_ADD_BTN, btnName: '新建盘点' },
    ],
    headers: [
      {
        name: "盘点时间",
        prop: "created",
        width: 19,
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD HH:mm")
        },
      },
      {
        name: "盘盈数量",
        prop: "profitNum",
        width: 10,
        render: (c) => {
          return parseFloat(c.profitNum) ? "+" + c.profitNum : c.profitNum
        },
      },
      {
        name: "盘盈金额",
        prop: "profitMoney",
        width: 10,
        render: (c) => {
          return parseFloat(c.profitMoney) ? "+" + c.profitMoney : c.profitMoney
        },
      },
      {
        name: "盘亏数量",
        prop: "lossNum",
        width: 10,
        render: (c) => {
          return parseFloat(c.lossNum) ? "-" + c.lossNum : c.lossNum
        },
      },
      {
        name: "盘亏金额",
        prop: "lossMoney",
        width: 10,
        render: (c) => {
          return parseFloat(c.lossMoney) ? "-" + c.lossMoney : c.lossMoney
        },
      },
      {
        name: "盘点人",
        prop: "staffName",
        width: 10,
      },
      {
        name: "状态",
        prop: "status",
        width: 10,
        render: (e) => {
          const status = e.status
          if (status === 0) {
            return <div style={{ color: "#41B035" }}>待审阅</div>
          } else if (status === 1) {
            return "已审阅"
          } else if (status === 2) {
            return <div style={{ color: "#FF6F28" }}>不通过</div>
          }
        },
      },
    ],
  },
  "store/stocktakingInfo": {
    id: "stocktakingId",
    hasCheck: false,
    moreBtn: [],
    headers: [
      {
        name: "商品名称",
        prop: "name",
        width: "154px",
        render: (text) => {
          return <div style={{ width: '154px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.name}
          </div>
        },
      },
      {
        name: "编码",
        prop: "code",
        width: "112px",
        render: (text) => {
          return <div style={{ width: '112px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.code}
          </div>
        },
      },
      {
        name: "规格",
        prop: "spec",
        width: "9%",
      },
      {
        name: "账面数量",
        prop: "goodsNum",
        width: "6%",
      },
      {
        name: "盘盈数量",
        prop: "num",
        width: "6%",
        render: (e) => {
          return parseFloat(e.num) ? "+" + e.num : 0
        },
      },
      {
        name: "盘盈金额",
        prop: "profitMoney",
        width: "6%",
        render: (e) => {
          let d = (e.goodsPrice && e.goodsPrice * 1) ? e.goodsPrice * 1 : 0
          return (e.num && e.num * 1) ? '+' + (e.num * 1 * d) : '**'
        },
      },
      {
        name: "盘亏数量",
        prop: "changeNum",
        width: "6%",
        render: (e) => {
          return parseFloat(e.changeNum) ? "-" + e.changeNum : 0
        },
      },
      {
        name: "盘亏金额",
        prop: "lossMoney",
        width: "6%",
        render: (e) => {
          let d = (e.goodsPrice && e.goodsPrice * 1) ? e.goodsPrice * 1 : 0
          return (e.changeNum && e.changeNum * 1) ? '-' + (e.changeNum * 1 * d) : '**'
        },
      },
      {
        name: "商品分类",
        prop: "categoryName",
        width: "6%",
      },
      {
        name: "盘点人",
        prop: "staffName",
        width: "6%",
      },
      {
        name: "仓库",
        prop: "warehouseName",
        width: "6%",
      },
      {
        name: "时间",
        prop: "created",
        render: (e) => {
          return moment(e.created * 1000).format("YYYY-MM-DD HH:mm:ss")
        },
      },
    ],
  },
  "erp/rejectinfo": {
    id: "rejectId",
    hasCheck: false,
    moreBtn: [],
    headers: [
      {
        name: "采购单号",
        prop: "purchase",
        width: '8%',
      },
      {
        name: "商品名称",
        prop: "productName",
        width: '147px',
        render: (text) => {
          return <div style={{ margin: '0px', width: '147px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.productName}
          </div>
        },
      },
      {
        name: "编码",
        prop: "commodityCode",
        width: '111px',
        render: (text) => {
          return <div style={{ margin: '0px', width: '111px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.commodityCode}
          </div>
        },
      },
      {
        name: "规格",
        prop: "specification",
        width: '7%',
      },
      {
        name: "供应商",
        prop: "supplierName",
        width: '10%',
      },
      {
        name: "数量",
        prop: "num",
        width: '4%',
      },
      {
        name: "采购成本",
        prop: "price",
        width: '6%',
      },
      {
        name: "退货金额",
        prop: "totalPrice",
        width: '7%',
      },
      {
        name: "操作人",
        prop: "staffName",
        width: '7%',
      },
      {
        name: "时间",
        prop: "created",
        width: '11%',
        sortFilterType: "sort",
        render: (e) => {
          return moment(e.created * 1000).format("YYYY-MM-DD HH:mm:ss")
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: '13%',
      },
    ],
  },
  "erp/reject": {
    id: "id",
    hasCheck: false,
    moreBtn: [DETAIL_BTN],
    headers: [
      {
        name: "采购单号",
        prop: "purchaseNo",
        width: 10,
      },
      {
        name: "供应商",
        prop: "supplierName",
        width: 11,
      },
      {
        name: "退货数",
        prop: "goodsNum",
        width: 7,
      },
      {
        name: "退货后应收",
        prop: "recievedMoney",
        width: 7,
      },
      {
        name: "退货后待付",
        prop: "waitMoney",
        width: 7,
      },
      {
        name: "操作人",
        prop: "staffName",
        width: 8,
      },
      {
        name: "时间",
        prop: "created",
        width: 14,
        sortFilterType: "sort",
        render: (e) => {
          return moment(e.created * 1000).format("YYYY-MM-DD HH:mm:ss")
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: 19,
      },
    ],
  },
  "erp/statistics/selling/storage": {
    id: "storageid",
    moreBtn: [
      {
        name: "查看订单",
        power: "permission",
        icon: "icon-chanpinfenlei",
        type: 22,
      },
    ],
    headers: [
      {
        name: "车牌",
        prop: "cardName",
        width: "8%",
      },
      {
        name: "客户",
        prop: "clientName",
        width: "9%",
      },
      {
        name: "商品名称",
        prop: "productName",
        width: '154px',
        render: (text) => {
          return <div style={{ width: '154px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.productName}
          </div>
        },
      },
      {
        name: "编码",
        prop: "commodityCode",
        width: '112px',
        render: (text) => {
          return <div style={{ width: '112px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.commodityCode}
          </div>
        },
      },
      {
        name: "规格",
        prop: "specification",
        width: "6%",
      },
      {
        name: "仓库",
        prop: "warehouseName",
        width: "6%",
      },
      {
        name: "单价",
        prop: "unitPrice",
        width: "5%",
      },
      {
        name: "数量",
        prop: "num",
        width: "5%",
      },
      {
        name: "优惠",
        prop: "discount",
        width: "5%",
      },
      {
        name: "金额",
        prop: "totalPrice",
        width: "5%",
      },
      {
        name: "平均成本",
        prop: "averagePrice",
        width: "6%",
      },
      {
        name: "毛利",
        prop: "profit",
        width: "5%",
      },
      {
        name: "时间",
        prop: "created",
        width: "10%",
        render: (e) => {
          return moment(e.created * 1000).format("YYYY-MM-DD HH:mm:ss")
        },
      },
    ],
  },
  "erp/statistics/inventory/warning": {
    id: "storageid",
    moreBtn: [DETAIL_BTN],
    headers: [
      {
        name: "商品名称",
        prop: "productName",
        width: '20%',
        render: (text) => {
          return <div style={{ width: '154px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.productName}
          </div>
        },
      },
      {
        name: "编码",
        prop: "commodityCode",
        width: '12%',
        render: (text) => {
          return <div style={{ width: '112px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.commodityCode}
          </div>
        },
      },
      {
        name: "规格",
        prop: "specification",
        width: '13%',
      },
      {
        name: "商品分类",
        prop: "categoryName",
        width: '12%',
      },
      {
        name: "当前库存",
        prop: "goodsNum",
        width: '10%',
        sortFilterType: "sort",
      },
      {
        name: "最低库存",
        prop: "lowestNum",
        width: '10%',
        sortFilterType: "sort",
      },
      {
        name: "预警库存",
        prop: "discount",
        width: '10%',
        render: (e) => {
          if (Number(e.goodsNum) - Number(e.lowestNum) >= 0) {
            return <div style={{ color: "#FF6F28" }}>--</div>
          } else {
            if (Number(e.goodsNum) - Number(e.lowestNum) < 0) {
              return (
                <div style={{ color: "red" }}>
                  {Number(e.goodsNum) - Number(e.lowestNum)}
                </div>
              )
            }
          }
        },
      },
    ],
  },
  "erp/statistics/receive/detail": {
    id: "receivedetail",
    moreBtn: [],
    headers: [
      {
        name: "商品名称",
        prop: "productName",
        width: '154px',
        render: (text) => {
          return <div style={{ width: '154px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.productName}
          </div>
        },
      },
      {
        name: "编码",
        prop: "commodityCode",
        width: '112px',
        render: (text) => {
          return <div style={{ width: '112px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.commodityCode}
          </div>
        },
      },
      {
        name: "规格",
        prop: "specification",
        width: '6%',
      },
      {
        name: "时间",
        prop: "created",
        width: '10%',
        render: (e) => {
          return moment(e.created * 1000).format("YYYY-MM-DD HH:mm")
        },
      },
      {
        name: "类型",
        prop: "typeName",
        width: '6%',
        // render: e => {
        //   const status = e.type
        //   if (status === 1) {
        //     return "入库"
        //   } else if (status === 2) {
        //     return "出库"
        //   }
        // },
      },
      {
        name: "仓库",
        prop: "warehouseName",
        width: '8%',
      },
      {
        name: "入库数量",
        prop: "num",
        width: '6%',
        render: (e) => {
          const status = e.type
          if (status === 1) {
            return e.num
          } else if (status === 2) {
            return "--"
          }
        },
      },
      {
        name: "单位成本",
        prop: "goodsPrice",
        width: '6%',
        render: (e) => {
          const status = e.type
          if (status === 1) {
            return e.goodsPrice
          } else if (status === 2) {
            return "--"
          }
        },
      },
      {
        name: "入库金额",
        prop: "totalPrice",
        width: '6%',
        render: (e) => {
          const status = e.type
          if (status === 1) {
            return e.totalPrice
          } else if (status === 2) {
            return "--"
          }
        },
      },
      {
        name: "出库数量",
        prop: "num",
        width: '6%',
        render: (e) => {
          const status = e.type
          if (status === 1) {
            return "--"
          } else if (status === 2) {
            return e.num
          }
        },
      },
      {
        name: "单位成本",
        prop: "goodsPrice",
        width: '6%',
        render: (e) => {
          const status = e.type
          if (status === 1) {
            return "--"
          } else if (status === 2) {
            return e.goodsPrice
          }
        },
      },
      {
        name: "出库金额",
        prop: "totalPrice",
        width: '6%',
        render: (e) => {
          const status = e.type
          if (status === 1) {
            return "--"
          } else if (status === 2) {
            return e.totalPrice
          }
        },
      },
      {
        name: "结余数量",
        prop: "inventoryNum",
        width: '6%',
      },
      {
        name: "结余金额",
        prop: "inventoryPrice",
        width: '6%',
      },
    ],
  },
  "erp/inventoryLocker": {
    id: "inventoryLockerid",
    moreBtn: [DETAIL_BTN],
    headers: [
      {
        name: "会员",
        prop: "clientName",
        width: '15%',
      },
      {
        name: "商品名称",
        prop: "productName",
        width: '262px',
        render: (text) => {
          return <div style={{ width: '262px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.productName}
          </div>
        },
      },
      {
        name: "编码",
        prop: "commodityCode",
        width: '262px',
        render: (text) => {
          return <div style={{ width: '262px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.commodityCode}
          </div>
        },
      },
      {
        name: "规格",
        prop: "specification",
        width: '18%',
      },
      {
        name: "数量",
        prop: "lockerNum",
        width: '18%',
      },
    ],
  },
  "erp/statistics/receive/collect": {
    id: "inventoryLockerid",
    moreBtn: [],
    headers: [
      {
        name: "商品名称",
        prop: "productName",
        width: '12%',
        render: (text) => {
          return <div style={{ width: '100%', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.productName}
          </div>
        },
      },
      {
        name: "编码",
        prop: "commodityCode",
        width: '10%',
        render: (text) => {
          return <div style={{ width: '100%', wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text.commodityCode}
          </div>
        },
      },
      {
        name: "规格",
        prop: "specification",
        width: '5%',
      },
      {
        name: "期初单价",
        prop: "fristAveragePrice",
        width: '7%',
      },
      {
        name: "期初数量",
        prop: "fristGoodsNum",
        width: '6%',
      },
      {
        name: "期初金额",
        prop: "fristTotalPrice",
        width: '6%',
      },
      {
        name: "本期入库数量",
        prop: "byIntoGoodsNum",
        width: '8%',
      },
      {
        name: "本期入库金额",
        prop: "byIntoTotalPrice",
        width: '8%',
      },
      {
        name: "本期出库数量",
        prop: "byOutGoodsNum",
        width: '8%',
      },
      {
        name: "本期出库金额",
        prop: "byOutTotalPrice",
        width: '8%',
      },
      {
        name: "期末单价",
        prop: "endAveragePrice",
        width: '6%',
      },
      {
        name: "期末数量",
        prop: "endGoodsNum",
        width: '6%',
      },
      {
        name: "期末金额",
        prop: "endTotalPrice",
        width: '6%',
      },
    ],
  },
  "orderCard": {
    id: "cardId",
    moreBtn: [DETAIL_BTN, CANCELLATIONS_BTN, { ...HEADER_PRINT_BTN, type: 24 }],
    headers: [
      {
        name: "办卡时间",
        prop: "created",
        width: "9%",
        sortFilterType: "sort",
        render: (e) => {
          return e.created
            ? moment(e.created * 1000).format("YYYY-MM-DD HH:mm")
            : ""
        },
      },
      {
        name: "客户姓名",
        prop: "clientName",
        width: "6%",
      },
      {
        name: "卡名称",
        prop: "cardName",
        width: "8%",
      },
      {
        name: "卡类型",
        prop: "cardType",
        width: "7%",
        render: (e) => {
          if (e.cardType === 1) {
            return "充值卡"
          } else if (e.cardType === 2 || e.cardType === 4 || e.cardType === 5) {
            return "计次卡"
          } else {
            return "赠送卡"
          }
        },
      },
      {
        name: "卡订单金额(元)",
        prop: "totalAmount",
        width: "10%",
      },
      {
        name: "提成人员",
        prop: "commission",
        render: (e) => {
          let str = ""
          for (let i in e.commission) {
            str += e.commission[i].staffName + ": " + e.commission[i].percentage + "%；"
          }
          return str
        },
        width: "10%",
      },
      {
        name: "结算方式",
        prop: "payment",
        render: (e) => {
          let str = ""
          for (let i in e.payment) {
            str += e.payment[i].name + ": " + e.payment[i].money + "；"
          }
          return str
        },
        width: "7%",
      },
      {
        name: "结算人",
        prop: "operatorName",
        width: "6%",
      },
      {
        name: "卡余额(元)",
        prop: "rechargeMoney",
        width: "8%",
      },
      {
        name: "截止时间",
        prop: "deadlineTime",
        width: "7%",
        sortFilterType: "sort",
        render: (e) => {
          if (e.deadlineTime === -1 || e.deadlineTime === "-1") {
            return "无限期"
          } else {
            return e.deadlineTime
              ? moment(e.deadlineTime * 1000).format("YYYY-MM-DD")
              : ""
          }
        },
      },
      // {
      //   name: "备注",
      //   prop: "remark",
      //   width: "6%",
      // },
    ],
  },
  "store/project/addition": {
    hasCheck: false,
    id: "projectId",
    moreBtn: [
      EDIT_BTN,
      { ...HEADER_ADD_BTN, btnName: '新建附加项目' },
      {
        ...DEL_BTN,
        disabled(c) {
          return c.formTem === 1
        },
      },
    ],
    headers: [
      {
        name: "项目名称",
        prop: "projectName",
        width: 11,
      },
      {
        name: "来源",
        prop: "formTem",
        width: 7,
        render: (c) => {
          return c.formTem === 1 ? "品牌商" : "门店"
        },
      },
      {
        name: "项目状态",
        prop: "status",
        width: 9,
        render: (c) => {
          return c.status === 1 ? (
            <Status status={true}>启用</Status>
          ) : (
              <Status status={false}>停用</Status>
            )
        },
      },
      {
        name: "维修类型",
        prop: "maintainTypeName",
        width: 10,
      },
      {
        name: "成本",
        prop: "cost",
        width: 10,
        sortFilterType: "sort",
      },
      {
        name: "销售价格",
        prop: "priceTem",
        width: 10,
        sortFilterType: "sort",
      },
      {
        name: "创建时间",
        prop: "created",
        width: 13,
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: 17,
      },
    ],
  },
  "brand/project/addition": {
    hasCheck: false,
    id: "projectId",
    moreBtn: [
      EDIT_BTN,
      { ...HEADER_ADD_BTN, btnName: '新建附加项目' },
      {
        ...DEL_BTN,
        disabled(c) {
          return c.formTem === 1
        },
      },
    ],
    headers: [
      {
        name: "项目名称",
        prop: "projectName",
        width: 11,
      },
      {
        name: "项目状态",
        prop: "status",
        width: 9,
        render: (c) => {
          return c.status === 1 ? (
            <Status status={true}>启用</Status>
          ) : (
              <Status status={false}>停用</Status>
            )
        },
      },
      {
        name: "维修类型",
        prop: "maintainTypeName",
        width: 10,
      },
      {
        name: "成本",
        prop: "cost",
        width: 10,
        sortFilterType: "sort",
      },
      {
        name: "销售价格",
        prop: "priceTem",
        width: 10,
        sortFilterType: "sort",
      },
      {
        name: "创建时间",
        prop: "created",
        width: 13,
        render: (c) => {
          return moment(c.created * 1000).format("YYYY-MM-DD")
        },
      },
      {
        name: "备注",
        prop: "remark",
        width: 17,
      },
    ],
  },
  "admin/manage/role": {
    hasCheck: false,
    id: "id",
    moreBtn: [EDIT_BTN, { ...HEADER_ADD_BTN, btnName: '新建角色' }, DEL_BTN],
    headers: [
      {
        name: "角色名称",
        prop: "name",
        width: "40%",
      },
      {
        name: "备注",
        prop: "remark",
      },
    ],
  },
  "brand/manage/role": {
    hasCheck: false,
    id: "id",
    moreBtn: [EDIT_BTN, { ...HEADER_ADD_BTN, btnName: '新建角色' }, DEL_BTN],
    headers: [
      {
        name: "角色名称",
        prop: "name",
        width: "28%",
      },
      {
        name: "角色类型",
        prop: "role_type",
        width: "28%",
      },
      {
        name: "备注",
        prop: "remark",
        width:'29%',
      },
    ],
  },
  "store/manage/role": {
    hasCheck: false,
    id: "id",
    moreBtn: [
      {
        ...EDIT_BTN,
        disabled(c) {
          return !c.store_id
        },
      },
      { ...HEADER_ADD_BTN, btnName: '新建角色' },
      {
        ...DEL_BTN,
        disabled(c) {
          return !c.store_id
        },
      },
    ],
    headers: [
      {
        name: "角色名称",
        prop: "name",
        width: "25%",
      },
      {
        name: "角色来源",
        prop: "store_id",
        width: "25%",
        render(c) {
          return c.store_id ? "门店创建" : "总部创建"
        },
      },
      {
        name: "备注",
        prop: "remark",
        width:'35%',
      },
    ],
  },
  "returnVisit/visit": {
    hasCheck: false,
    id: "id",
    // moreBtn:[DETAIL_BTN,CHECK_CIRCLE],
  }, //回访
  "wide-detail/order/wide/list": {},
  "wide-performance/sales/deduct/list": {},
  "wide-performance/builder/deduct/list": {},
  "wide-performance/species/deduct/list": {},
  "wide-performance/records/deduct/list": {},
  "wide-detail/reward/deduct/list": {},
  "brand/wide/inventory/receive/collect": {}, //品牌商收发汇总
  "store/superPrivilege/list": {}, //超级权限日志列表
  "wide-client/species/consume": {}, // 充值卡消耗
  "wide-client/records/consume": {}, // 计次卡消耗
  "wide-detail/arrears": {}, // 挂账还款
  "maintain/order": {}, // 订单列表
  "store/vice/order": {},
  "wide-business/category/collect": {}, //服务分类
  "wide-detail/goods/wide/list": {},
  "store/wages": {}, //门店薪资列表
  "brand/wages": {}, //品牌商薪资列表
  "messageNoify/messageNotify": {},//系统通知列表
  "setting/remind/construction": {}, // 施工回访设置
  "service/classify/statistics": {}, // 服务分类统计
  "store/smsGroupMessage": {}, //短信群发
  "refill/particulars": {}, //充值卡续卡明细
  "brand/wide/center/store/category": {}, //连锁汇总-服务分类
  "brand/wide/center/collect/goods": {}, //连锁汇总-项目产品表现
  "brand/wide/center/collect/report": {}, //连锁汇总-财务报表
  "brand/wide/center/store/output": {}, //品牌商门店数据-员工产值
  "brand/wide/center/store/output/type": {}, //品牌商门店数据-维修类型产值
  "brand/wide/center/store/goods": {}, //品牌商门店数据-项目产品表现
  "store/inventory/cost-detail": {}, //库存统计-成本调整
  "brand/wide/center/collect/category": {}, // 品牌商-连锁汇总
  "wide-transaction/persent/report": {}, // 门店-数据统计-赠送明细
  "wide-ranking/details": {}, // 门店-数据中心-排行数据
  'wide-business/staff/employeeAnalysis/list': {}, // 门店-数据中心-员工分析
  "wide-business/maintain/type/list": {}, // 门店-数据中心-业务类型
  "wide-staff/details": {}, // 门店-数据中心-提成明细
  "maintain/inspectionReport": {}, // 门店-订单中心-车检报告列表
  "store/commission/reward": {
    moreBtn: [
      EDIT_BTN,
      {
        ...CLEAN_BTN,
        disabled(c) {
          return c.type === 0
        },
      },
    ],
  }, //业绩奖励规则

  //——————————————————————————————————————————————————————————————————————————————————
  "wide-ranking/details?driver=cardRevenue": {
    hasCheck: false,
    id: "id",
    moreBtn: [],
    headers: [
      {
        name: "卡名称",
        prop: "name",
        width: "26%",
      },
      {
        name: "营业额",
        prop: "receipts",
        width: "18%",
        sortFilterType: "sort",
      },
      {
        name: "营业额占比",
        prop: "proportion",
        width: "18%",
        sortFilterType: "sort",
        render: (v) => {
          // console.log('vvvv',v)
          return v.proportion + '%'
        },
      },
      {
        name: "工单数",
        prop: "quantity",
        width: "18%",
        sortFilterType: "sort",
      },
      {
        name: "提成",
        prop: "commission",
        width: "15%",
        sortFilterType: "sort",
      },
    ],
  },
  "message/opinion/feedback": {
    hasCheck: false,
    id: "id",
    moreBtn: [
      DETAIL_BTN,
      {
        name: "处理",
        type: 78,
        show(c) {
          return c.status === 0
        },
      },
      {
        name: "备注",
        type: 89,
      },
      BTN,
    ],
    headers: [
      {
        name: "品牌名称",
        prop: "brandName",
        width: "6%",
      },
      {
        name: "门店名称",
        prop: "storeName",
        width: "12%",
      },
      {
        name: "问题类型",
        prop: "type",
        width: "7%",
        render(c) {
          return c.type === 1 ? "遇到问题" : "功能建议"
        },
      },
      {
        name: "反馈时间",
        prop: "created",
        width: "12%",
        render: (c) => {
          return c.created ? moment(c.created * 1000).format("YYYY-MM-DD HH:mm:ss") : ''
        },
      },
      {
        name: "反馈人姓名",
        prop: "staffName",
        width: "7%",
      },
      {
        name: "手机号",
        prop: "phone",
        width: "8%",
      },
      {
        name: "处理状态",
        prop: "status",
        width: "6%",
        render(c) {
          return c.status === 1 ? "已处理" : "未处理"
        },
      },
      {
        name: "处理时间",
        prop: "dealAt",
        width: "12%",
        render: (c) => {
          return c.dealAt ? moment(c.dealAt * 1000).format("YYYY-MM-DD HH:mm:ss") : ''
        },
      },
      {
        name: "备注信息",
        prop: "remarks",
      },
    ],
  },
  "admin/implement": {
    hasCheck: false,
    id: "storeId",
    moreBtn: [
      {
        ...SMS_TOP_UP_BTN,
        show() {
          return hasPermission('e46a6946')
        },
      },
      ASSIGN_IMPLEMENT_BTN,
      IMPLEMENT_FOLLOW_BTN,
    ],
    headers: [
      {
        name: "门店名称",
        prop: "storeName",
        width: "11%",
      },
      {
        name: "品牌商",
        prop: "brandName",
        width: "5%",
      },
      {
        name: "总订单数",
        prop: "orderNumber",
        width: "7%",
        sortFilterType: "sort",
      },
      {
        name: "联系方式",
        prop: "adminPhone",
        width: "7%",
      },
      {
        name: "大区",
        prop: "blockName",
        width: "5%",
      },
      {
        name: "经营者",
        prop: "storeOperator",
        width: "5%",
      },
      {
        name: "开单间隔(天)",
        prop: "diffDay",
        width: "9%",
        sortFilterType: "sort",
      },
      {
        name: "负责人",
        prop: "implementName",
        width: "5%",
      },
      {
        name: "是否实施",
        prop: "implement",
        width: "5%",
      },
      {
        name: "实施时间",
        prop: "implementTime",
        width: "8%",
        render: (c) => {
          return c.implementTime ? moment(c.implementTime * 1000).format("YYYY-MM-DD") : ''
        },
      },
      {
        name: "标签",
        prop: "storeTag",
        width: "5%",
        render: (c) => {
          return c.storeTag.map(item => <div key={item.id}>{item.name}</div>)
        },
      },
      {
        name: "门店状态",
        prop: "status",
        width: "6%",
        render: (c) => {
          const list = [
            {name: '未用', value: 1},
            {name: '在用', value: 2},
            {name: '会用', value: 3},
            {name: '常用', value: 4},
            {name: '睡眠', value: 5},
          ]
          return list.filter(item => item.value === c.status)[0] ? list.filter(item => item.value === c.status)[0].name : ''
        },
      },
      {
        name: "最近跟进",
        prop: "implementDynamic",
        width: "8%",
        render: (c) => {
          return c.implementDynamic
        },
      },
    ],
  },
  "admin/implement/stats": {
    hidePagenation: true,
    hasTotal: true,
    // selectTotal: ['implementNumber'],
    moreBtn: [],
    headers: [
      {
        name: "日期",
        prop: "day",
        width: "10%",
      },
      {
        name: "总门店数",
        prop: "storeNum",
        width: "6%",
      },
      {
        name: "新增实施数",
        prop: "implementNumber",
        width: "8%",
      },
      {
        name: "实施总数",
        prop: "implementTotal",
        width: "6%",
      },
      {
        name: "未用",
        prop: "unused",
        width: "6%",
      },
      {
        name: "未用占比",
        prop: "unusedRate",
        width: "7%",
        render: (c) => {
          return Number(c.unusedRate) ? `${c.unusedRate}%` : '0.0%'
        },
      },
      {
        name: "在用",
        prop: "inUse",
        width: "6%",
      },
      {
        name: "在用占比",
        prop: "inUseRate",
        width: "7%",
        render: (c) => {
          return Number(c.inUseRate) ? `${c.inUseRate}%` : '0.0%'
        },
      },
      {
        name: "会用",
        prop: "willUse",
        width: "6%",
      },
      {
        name: "会用占比",
        prop: "willUseRate",
        width: "7%",
        render: (c) => {
          return Number(c.willUseRate) ? `${c.willUseRate}%` : '0.0%'
        },
      },
      {
        name: "常用",
        prop: "oftenUse",
        width: "6%",
      },
      {
        name: "常用占比",
        prop: "oftenUseRate",
        width: "7%",
        render: (c) => {
          return Number(c.oftenUseRate) ? `${c.oftenUseRate}%` : '0.0%'
        },
      },
      {
        name: "睡眠",
        prop: "sleep",
        width: "6%",
      },
      {
        name: "睡眠占比",
        prop: "sleepRate",
        width: "7%",
        render: (c) => {
          return Number(c.sleepRate) ? `${c.sleepRate}%` : '0.0%'
        },
      },
    ],
  },
  "store/servicesSmsTemplate": {
    hasCheck: true,
    id: "id",
    moreBtn: [
      {
        name: "关闭",
        power: "onClone",
        type: 45,
        show(c) {
          return c.status === 1
        },
      },
      {
        name: "开启",
        power: "onClone",
        type: 49,
        show(c) {
          return c.status === 0
        },
      },
      EDIT_BTN,
      {
        name: "删除",
        icon: "icon-shanchu",
        type: 39,
        power: "Delete",
        btnColor: '#FE6060FF',
      },
      { ...HEADER_ADD_BTN, btnName: '新建模板' },
    ],
    headers: [
      {
        name: "类型",
        prop: "type",
        width: "7%",
        render: (c) => {
          return c.type === 1 ? '项目' : '产品'
        },
      },
      {
        name: "名称",
        prop: "name",
        width: "15%",
      },
      {
        name: "短信内容",
        prop: "content",
        width: "45%",
      },
      {
        name: "开启状态",
        prop: "status",
        width: "10%",
        render: (c) => {
          return c.status === 1 ? (
            <Status status={true}>开启</Status>
          ) : (
              <Status status={false}>关闭</Status>
            )
        },
      },
    ],
  },
}
