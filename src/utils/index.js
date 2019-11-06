/* global window */
import cloneDeep from "lodash.clonedeep"

export classnames from "classnames"
export config from "./config"
export request from "./request"
export { color } from "./theme"

// 连字符转驼峰
String.prototype.hyphenToHump = function() {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function() {
  return this.replace(/([A-Z])/g, "-$1").toLowerCase()
}

// 日期格式化
Date.prototype.format = function(format) {
  const o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "H+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      `${this.getFullYear()}`.substr(4 - RegExp.$1.length)
    )
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      )
    }
  }
  return format
}

/**
 * @param  name {String}
 * @return  {String}
 */
export function queryURL(name) {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, "i")
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */

export function queryArray(array, key, keyAlias = "key") {
  if (!(array instanceof Array)) {
    return null
  }
  let item = []
  array.forEach((_) => {
    if (_[keyAlias] === key) item.push(_)
    if (_.children) {
      if (queryArray(_.children, key, keyAlias)) {
        item.push(queryArray(_.children, key, keyAlias))
      }
    }
  })
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */

export function arrayToTree(menu) {
  let data = cloneDeep(menu)
  data.map((e, i) => {
    e.id = i + 1
    if (e.children) {
      e.children.map((v, j) => {
        v.bpid = e.id
        v.mpid = e.id
        v.id = Number(String(e.id) + String(j + 1))
        if (v.children) {
          v.children.map((_, k) => {
            _.bpid = v.id
            _.mpid = v.id
            _.id = Number(String(v.id) + String(k + 1))
            return _
          })
        }
        return v
      })
    }
    return e
  })
  return data
}

/**
 * 转化后端数据为树形
 * @param  {Array} data        数据
 * @param  {String} [pid='pid'] 父级id字段
 * @param  {String} [id='id']   节点id字段
 * @param  {Number} [root=0]    祖先id
 * @return {Object}             根对象
 */
export function arrayToTreeData(data, pid = "pid", id = "id", root = 0) {
  const getchild = (obj, i) => {
    let children = data
      .filter((_) => _[pid] === i)
      .map((_) => getchild(_, _[id]))

    return { ...obj, children }
  }

  return getchild(data.find((_) => _[id] === root), root)
}

/**
 * tree 子id查所有父级
 * @param list
 * @param id
 * @param idAlias
 * @returns {number[]}
 */
export function allQueryArray(list, id, idAlias) {
  const findParent = (list, id, idAlias) => {
    for (let i in list) {
      if (list[i][idAlias] === id) {
        return list[i].pId
      } else if (list[i].children) {
        let res = findParent(list[i].children, id, idAlias)
        if (res) {
          return res ? list[i].pId + "," + res : res
        }
      }
    }
  }
  let str = findParent(list, id, idAlias) + "," + id
  str = str
    .split(",")
    .filter((item, i) => {
      return i > 0
    })
    .map((_) => {
      return _ * 1
    })
  return str
}
