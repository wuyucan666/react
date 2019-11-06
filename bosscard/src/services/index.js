/**
 * 页面所有接口
 * 接口label属性不能重复
 */
import request from "../utils/request"
import { message } from "antd"
import * as app from "./app"
import * as admin from "./admin"
import * as brand from "./brand"
import * as store from "./store"

let modules = [app, admin, brand, store]
let apis = {}

/**
 * 序列化api配置为promise函数
 * @param  {[type]} _ [description]
 * @return {[type]}   [description]
 */
// eslint-disable-next-line
modules.map((_) =>
  Object.keys(_).forEach((v) => {
    if (apis[v]) {
      throw new Error("重复申明的api: " + v)
    } else {
      try {
        apis[v] = (arg) => request({ ..._[v], ...arg })
      } catch (e) {
        message.error(e.message)
      }
    }
  })
)
export default apis
