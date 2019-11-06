/**
 * Created by kikazheng on 2019/6/17
 */

// 上传图片重构

import COS from 'cos-js-sdk-v5'
import services from "services"
import moment from 'moment'
import { message } from 'antd'

const Bucket = 'image-1256158653'
const Region = 'ap-guangzhou'

export default function (key) {
  return function ({file, onSuccess, onProgress, onError}) {
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
          onProgress: ({ total, loaded }) => {
            onProgress({ percent: Math.round(loaded / total * 100) }, file)
          },
        }, (err) => {
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
                onSuccess(res, file)
              }else {
                onError()
              }
            }).catch(() => {
              onError()
            })
          } else {
            onError()
            message.error('上传失败')
            console.log('上传失败', err)
          }
        })
      }
    })
    return {
      abort() {
        console.log('upload progress is aborted.')
      },
    }
  }
}
