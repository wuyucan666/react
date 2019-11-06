/**
 * 分配权限
 * @type {Object}
 */
export const distributePer = {
  url: "admin/role/distribute",
  method: "post",
}
// 系统通知模块----------------------
/**
 * 获取通知类型
 * @type {Object}
 */
export const messageNoifyType = {
  url: "messageNoify/type",
  method: "get",
}
/**
 * 获取编辑前的数据
 * @type {Object}
 */
export const messageNoifyEdit = {
  url: "messageNoify/messageNotify/{id}/edit",
  method: "get",
}
/**
 * 获取列表详情
 * @type {Object}
 */
export const messageNoifyShow = {
  url: "messageNoify/show/{id}",
  method: "get",
}
/**
 * 添加通知
 * @type {Object}
 */
export const messageNoifyAdd = {
  url: "messageNoify/messageNotify",
  method: "post",
}
/**
 * 修改通知
 * @type {Object}
 */
export const messageNoifyPut = {
  url: "messageNoify/messageNotify/{id}",
  method: "put",
}
/**
 * 撤回通知
 * @type {Object}
 */
export const messageNoifyDel = {
  url: "messageNoify/messageNotify/{id}",
  method: "delete",
}
//----------------------------------
