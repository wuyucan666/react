import React from 'react'
import  Redirect from 'umi/redirect'
import switchRouter from '../../../utils/switchRouter'

const permissions = [{
    key: 20,
    path: '/boss-store/speedy-billing',
  },{
  key: 21,
  path: '/boss-store/maintain-billing',
},{
  key: 24,
  path: '/boss-store/member-center/business/number-card/give',
},{
  key: 25,
  path: '/boss-store/member-center/business/extend-card',
},{
  key: 26,
  path: '/boss-store/tradingPlatform/searchClient',
},{
  key: 31,
  path: '/boss-store/member-center/business/customers-import',
},{
  key: 83,
  path: '/boss-store/pending-order',
}, {
    key: 89,
    path: '/boss-store/member-center/business/apply-card',
  },
]

export default () => {
  return(
    <Redirect  to={switchRouter(permissions)} />
  )
}
