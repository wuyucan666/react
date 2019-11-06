/**
 * 获取产品分类
 * @type {Object}
 */
export const productCategory = {
  url: "brand/productcategory/list",
  method: "get",
}
/**
 * 获取产品单位
 * @type {Object}
 */
export const productUnitBrand = {
  url: "brand/unit/list",
  method: "get",
}

/**
 * 分配权限
 * @type {Object}
 */
export const distributeBrandPer = {
  url: "admin/role/distribute",
  method: "post",
}

/**
 * 获取品牌商角色
 * @type {Object}
 */
export const brandRole = {
  url: "brand/manage/role/list",
  method: "get",
}

/**
 * 获取品牌商门店列表
 * @type {Object}
 */
export const brandStore = {
  url: "brand/store/list",
  method: "get",
}
/**
 * 维修类型列表
 */
export const getBrandMaintaintype = {
  url: "brand/maintaintype",
  method: "get",
}
/**
 * 库存总览
 */
export const inventoryView = {
  url: "brand/wide/inventory/overview/index",
  method: "get",
}
/**
 *  库存总览-出入库
 */
export const inventoryStore = {
  url: "brand/wide/inventory/overview/inventory",
  method: "get",
}
/**
 *  品牌商-财务报表
 */
export const brandSalaryReport = {
  url: "brand/wide/center/collect/report",
  method: "get",
}
/**
 *  品牌商-获取品牌商通知列表
 */
export const messageNoifyBrand = {
  url: "messageNoify/brand",
  method: "get",
}
