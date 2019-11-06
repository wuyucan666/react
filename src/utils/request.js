/* global window */
import axios from "axios"
import cloneDeep from "lodash.clonedeep"
import { message } from "antd"
import { api } from "./config"

let copyUrl = ""

const fetch = (options) => {
  // console.log("请求配置", options)
  let { method = "get", data, url, keys = {} } = options
  if (keys) {
    const setKey = (key) => url.replace(new RegExp("{" + key + "}"), keys[key])
    Object.keys(keys).map((k) => (url = setKey(k)))
  }

  const cloneData = cloneDeep(data) || {}

  try {
    // http://eolinker.zanbogroup.com/server/index.php?g=Web&c=Mock&o=mock&projectID=6&uri=
    url =
      (options.proxy
        ? "http://geteway.zanbogroup.com/mock/50"
        : api.domain) +
      "/" +
      url
    copyUrl = url
  } catch (e) {
    message.error(e.message)
  }

  if (sessionStorage.getItem("tk")) {
    cloneData.token = sessionStorage.getItem("tk")
  }

  switch (method.toLowerCase()) {
    case "get":
      return axios.get(url, {
        params: cloneData,
        headers: { Authorization: sessionStorage.getItem("tk") },
      })
    case "delete":
      return axios.delete(url, {
        data: cloneData,
      })
    case "post":
      return axios.post(url, cloneData)
    case "put":
      return axios.put(url, cloneData)
    case "patch":
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}
export default function request(options) {
  let startTime = new Date()
  return fetch(options)
    .then((response) => {
      let endTime = new Date()

      const {
        data: { content, code },
      } = response
      if (
        Number(code) === 10902 ||
        Number(code) === 10113 ||
        Number(code) === 10903
      ) {
        message.error("需要登录")
        setTimeout(() => {
          window.location.href = "/login"
        }, 500)
      } else if (Number(code) === 10901) {
        message.error("无权限访问")
      } else if (Number(code) !== 0 && Number(code) !== 10200 && !options.skip && Number(code) !== 10215 && Number(code) !== 10213 && Number(code) !== 10214) {
        message.error(content || '请求出错')
      }
      // 输出日志
      let retrunInfo = {
        url: copyUrl,
        key: options.key,
        requestData: JSON.stringify(options.data),
        returnData: response.data,
        spendTime: (endTime - startTime) / 1000 + "s",
      }
      if (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
      ) {
        console.log(retrunInfo)
      }

      return Promise.resolve({
        success: Number(code) === 0,
        message: content,
        statusCode: code,
        key: options.key,
        ...response.data,
      })
    })
    .catch((error) => {
      if (options.isTableRequest) {
        return false
      }
      message.error('请求出错')
      let endTime = new Date()
      const { response } = error
      let msg
      let statusCode
      if (response && response instanceof Object) {
        const { code, content } = response
        statusCode = code
        msg = content || "网络出错"
      } else {
        statusCode = 600
        msg = error.message || "网络出错"
      }

      let retrunInfo = {
        url: copyUrl,
        requestData: JSON.stringify(options.data),
        returnData: msg,
        spendTime: (endTime - startTime) / 1000 + "s",
      }
      if (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
      ) {
        console.log(retrunInfo)
      }
      /* eslint-disable */
      return Promise.reject({ success: false, statusCode, message: msg })
    })
}
