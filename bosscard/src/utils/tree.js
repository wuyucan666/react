/**
 * 树形业务组件配置表
 * @type {Object}
 */
/**
 * 门店大区
 * @type {Object}
 */
const regional = {
  inheritance: false, // 是否含有继承关系
  id: "areaId", // 数据节点ID字段
  editTitle: "修改区域", // 修改表单title
  addTitle: "添加区域", // 添加表单title
  type: "regional", // 类型
  createTitle: "区域名称", // 创建表单的字段文字
  validateType: 79, // 验证规则
  api: "brand/area", // api地址
  apiName: "blockName", // 服务器返回对应的节点名称
  model: "StoreArea", //字段唯一校验model
  _var: 'string', // 字段校验唯一_var
}

/**
 * 项目分类
 * @type {Object}
 */
const projectCategory = {
  inheritance: false,
  id: "categoryId", // 数据节点ID字段
  editTitle: "修改分类", // 修改表单title
  addTitle: "添加分类", // 添加表单title
  type: "projectCategory", // 类型
  createTitle: "分类名称", // 创建表单的字段文字
  validateType: 79, // 验证规则
  api: "brand/projectcategory", // api地址
  apiName: "categoryName", // 服务器返回对应的节点名称
  model: "Category", //字段唯一校验model
  _var: {
    // 字段校验唯一_var
    _: parseInt(localStorage.getItem("loginType") - 1, 0),
    type: 1,
  },
}

/**
 * 产品分类
 * @type {Object}
 */
const productCategory = {
  // inheritance: true,
  id: "categoryId", // 数据节点ID字段
  editTitle: "修改分类", // 修改表单title
  addTitle: "添加分类", // 添加表单title
  type: "productCategory", // 类型
  createTitle: "分类名称", // 创建表单的字段文字
  validateType: 79, // 验证规则
  api: "brand/productcategory", // api地址
  apiName: "categoryName", // 服务器返回对应的节点名称
  model: "Category", //字段唯一校验model
  _var: {
    // 字段校验唯一_var
    _: parseInt(localStorage.getItem("loginType") - 1, 0),
    type: 2,
  },
}

/**
 * 项目分类
 * @type {Object}
 */
const storeProjectCategory = {
  inheritance: true, // 是否有继承关系
  id: "categoryId", // 数据节点ID字段
  editTitle: "修改分类", // 修改表单title
  addTitle: "添加分类", // 添加表单title
  type: "storeProjectCategory", // 类型
  createTitle: "分类名称", // 创建表单的字段文字
  validateType: 79, // 验证规则
  api: "store/projectcategory", // api地址
  apiName: "categoryName", // 服务器返回对应的节点名称
  model: "Category", //字段唯一校验model
  _var: {
    // 字段校验唯一_var
    _: parseInt(localStorage.getItem("loginType") - 1, 0),
    type: 1,
  },
}

/**
 * 产品分类
 * @type {Object}
 */
const storeProductCategory = {
  inheritance: true,
  id: "categoryId", // 数据节点ID字段
  editTitle: "修改分类", // 修改表单title
  addTitle: "添加分类", // 添加表单title
  type: "storeProductCategory", // 类型
  createTitle: "分类名称", // 创建表单的字段文字
  validateType: 79, // 验证规则
  api: "store/productcategory", // api地址
  apiName: "categoryName", // 服务器返回对应的节点名称
  model: "Category", //字段唯一校验model
  _var: {
    // 字段校验唯一_var
    _: parseInt(localStorage.getItem("loginType") - 1, 0),
    type: 2,
  },
}

/**
 * 门店维修分类
 * @type {Object}
 */
const storeMaintenanceCategory = {
  inheritance: true,
  id: "maintainTypeId", // 数据节点ID字段
  editTitle: "修改维修类型", // 修改表单title
  addTitle: "新增分类", // 添加表单title
  type: "storeMaintenanceCategory", // 类型
  createTitle: "名称", // 创建表单的字段文字
  validateType: 79, // 验证规则
  api: "store/maintaintype", // api地址
  apiIsNew: true, // apilist请求是否是新的风格
  apiName: "name", // 服务器返回对应的节点名称
  model: "MaintainType", //字段唯一校验model
  _var: 'string',
}

/**
 * 品牌商维修分类
 * @type {Object}
 */
const maintenanceCategory = {
  inheritance: true,
  id: "maintainTypeId", // 数据节点ID字段
  editTitle: "修改维修类型", // 修改表单title
  addTitle: "新增分类", // 添加表单title
  type: "maintenanceCategory", // 类型
  createTitle: "名称", // 创建表单的字段文字
  validateType: 79, // 验证规则
  api: "brand/maintaintype", // api地址
  apiIsNew: true,
  apiName: "name", // 服务器返回对应的节点名称
  model: "MaintainType", //字段唯一校验model
  _var: 'string',
}

export default [
  regional,
  projectCategory,
  productCategory,
  storeProjectCategory,
  storeProductCategory,
  storeMaintenanceCategory,
  maintenanceCategory,
]
