/**
 * Created by kikazheng on 2019/7/26
 */
import React from 'react'
import  Redirect from 'umi/redirect'
import switchRouter from '../../../utils/switchRouter'

const permissions = [{
  key: 35,
  path: '/boss-store/maintain-list/orderAll',
},{
  key: 'c7ef7040',
  path: '/boss-store/maintain-list/blist',
},
]

export default () => {
  return(
    <Redirect  to={switchRouter(permissions)} />
  )
}
