/**
 * Created by kikazheng on 2018/12/10
 */
/* 图片上传至腾讯云  antd Design Upload组件   props -> beforeUpload
*
*   beforeUpload={(file) => uploadImg(file, key, onChange)}
*
*  参数：
*   file -> beforeUpload 默认参数 ；
*   key -> 后台给你的上传目录标识；
*   onChange -> 回调函数 (id, address)=>{}  返回当前图片在服务器的id以及图片的访问地址
*
* */

import COS from 'cos-js-sdk-v5'
import services from "services"
import moment from 'moment'
import { message } from 'antd'


const uploadImg = (file, key, onChange) => {
  const imgType = ['image/jpeg', 'image/jpg', 'image/png']
  if (imgType.indexOf(file.type) === -1) {
    message.error('仅允许上传jpg、jpeg、png格式的图片')
    return false
  }
  const Bucket = 'image-1256158653'
  const Region = 'ap-guangzhou'
  services.LIST({
    keys: { name: 'file/costemptoken' },
    data: { key },
  }).then(res => {
    if (res.code === 0) {
      const cos = new COS({// 初始化实例
        getAuthorization: (options, callback) => {
          // 异步获取签名
          callback({
            TmpSecretId: res.data.credentials.tmpSecretId,
            TmpSecretKey: res.data.credentials.tmpSecretKey,
            XCosSecurityToken: res.data.credentials.sessionToken,
            ExpiredTime: res.data.expiredTime,
          })
        },
      })
      const nowName = (moment().unix() + Math.random() * 1000).toFixed(0) + file.name.slice(file.name.indexOf('.'))
      // 上传文件
      cos.putObject({
        Bucket,
        Region,
        Key: res.data.src + nowName,
        Body: file,
      }, function (err) {
        if (!err) {
          services.INSERT({
            keys: { name: 'file/cosUpload' },
            data: {
              nowName,
              name: file.name,
              key,
            },
          }).then(res => {
            if (Number(res.code) === 0) {
              onChange && onChange(res.id, res.requestAddress)
            }
          })
        } else {
          message.error('上传失败')
          console.log('上传失败', err)
        }
      })
    }
  })
  return false
}

export default uploadImg
