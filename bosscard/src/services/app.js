/**
 * 登录
 * @type {Object}
 */
export const login = {
  url: "login",
  method: "post",
}

/**
 * 列表数据
 * @type {Object}
 */
export const list = {
  url: "{name}/list",
  isTableRequest: true,
}

/**
 * 添加数据
 * @type {Object}
 */
export const insert = {
  url: "{name}/insert",
  method: "post",
}

/**
 * 删除数据
 * @type {Object}
 */
export const del = {
  url: "{name}/delete",
  method: "post",
}

/**
 * 撤销删除
 * @type {Object}
 */
export const revoke = {
  url: "{name}/revoke",
  method: "post",
}

/**
 * 更新数据
 * @type {Object}
 */
export const update = {
  url: "{name}/update",
  method: "post",
}

/**
 * 数据详情
 * @type {Object}
 */
export const detail = {
  url: "{name}/details",
  method: "post",
}

/**
 * 禁用
 * @type {Object}
 */
export const disable = {
  url: "{name}/disable",
  method: "post",
}
/**
 * 复制
 * @type {Object}
 */
export const cardSpeciesCopy = {
  url: "store/cardSpeciesCopy",
  method: "post",
}
/**
 * 校验数据唯一
 * @type {Object}
 */
export const validate = {
  // 新增时校验
  url: "data/validate",
  method: "get",
}

export const validateEdit = {
  // 编辑修改时校验
  url: "data/validate/{id}",
  method: "get",
}

/**
 * 获取门店角色
 * @type {Object}
 */
export const role = {
  url: "store/stafflevel/getrole",
  method: "get",
}

/**
 * 获取品牌商角色
 * @type {Object}
 */
export const brandRoles = {
  url: "brand/stafflevel/getrole",
  method: "get",
}

/**
 * 获取管理员角色
 * @type {Object}
 */
export const roleList = {
  url: "brand/manage/role/list",
  method: "get",
}

/**
 * 新列表数据
 * @type {Object}
 */
export const LIST = {
  url: "{name}",
  method: "get",
  isTableRequest: true,
}

export const LIST_proxy = {
  url: "{name}",
  method: "get",
  proxy: true,
  isTableRequest: true,
}

/**
 * 新列表新建
 * @type {Object}
 */
export const INSERT = {
  url: "{name}",
  method: "post",
}

/**
 * 新数据更新
 * @type {Object}
 */
export const UPDATE = {
  url: "{name}/{id}",
  method: "put",
}

/**
 * 新数据删除
 * @type {Object}
 */
export const DELETE = {
  url: "{name}/{id}",
  method: "delete",
}

/**
 * 新数据详情
 * @type {Object}
 */
export const DETAIL = {
  url: "{name}/{id}",
  method: "get",
}

/**
 * 新数据详情
 * @type {Object}
 */
export const EDIT = {
  url: "{name}/{id}/edit",
  method: "get",
}

export const DOWNLOAD = {
  url: "{name}/{id}/download",
  method: "get",
}

export const request = {
  url: "{link}",
  method: "post",
}

export const PUT = {
  url: "{link}",
  method: "put",
}
