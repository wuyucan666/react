
const Mock = require('mockjs')

// const staffList = Mock.mock({
//   "name:|1-3": '林郑里',
// })

const staffList = [{
  id: 1,
  name: '郑凯',
},{
  id: 2,
  name: '李冯',
},{
  id: 3,
  name: '啊风',
}]
// 卡内 产品/项目
const incardList = [{
  id: 1,
  name: '项目1',
  consume: 10, //消费
  residue: 5, //剩余
  expireTime: '2011-11-19', //到期时间
  priceTem: 100, //价格
  commodityCode: 'GT610',
  type: 1, // 1为产品
},{
  projectId: 2,
  projectName: '项目2',
  consume: 10,
  residue: 5,
  expireTime: '2011-11-19',
  priceTem: 100,
  commodityCode: 'GT610',
},{
  productId: 1,
  productName: '产品1',
  consume: 10,
  residue: 5,
  expireTime: '2011-11-19',
  priceTem: 100,
  commodityCode: 'GT610',
},{
  productId: 2,
  productName: '产品2',
  consume: 10,
  residue: 5,
  expireTime: '2011-11-19',
  priceTem: 100,
  commodityCode: 'GT610',
}]

// 附加产品
let addition = [{
  projectId: 1,
  projectName: '项目1',
  priceTem: 100,
  commodityCode: 'GT610',
},{
  projectId: 2,
  projectName: '项目2',
  priceTem: 100,
  commodityCode: 'GT610',
},{
  projectId: 3,
  projectName: '项目3',
  priceTem: 100,
  commodityCode: 'GT610',
}]

//会员卡
let memberCard = [
  {
    clientCardId: 1,
    cardNo: 222,
    cardName: '大保健卡',
    rechargeMoney: 50,
    giveMoney: 50,
    project: [
      {
        name: '按摩',
        goodId: 1,
        discountType: 1,
        discount: 4,
      },
      {
        name: 'mashaki',
        goodId: 2,
        discountType: 1,
        discount: 7,
      },
    ],
    product: [
    ],
    specialProject: [
      {
        name: '按摩',
        goodId: 1,
        discountType: 1,
        discount: 6,
      },
    ],
    specialProduct: [
      {
        name: '海飞丝',
        goodId: 1,
        discountType: 1,
        discount: 5,
      },
    ],
  },
  {
    clientCardId: 2,
    cardNo: 222,
    cardName: '大保健卡2222',
    rechargeMoney: 400,
    giveMoney: 40,
    project: [
      {
        name: '按摩',
        goodId: 0,
        discountType: 1,
        discount: 6,
      },
    ],
    product: [],
    specialProject: [
      {
        name: '按摩',
        goodId: 1,
        discountType: 1,
        discount: 4,
      },
    ],
    specialProduct: [
      {
        name: '海飞丝',
        goodId: 1,
        discountType: 1,
        discount: 3,
      },
    ],
  },
]

let order = {
  amount: 1930,
  buckle: 20,
  offer: 50,
  totalAmount: 2000,
  project: [
    {
      projectId: 1,
      categoryId: 1,
      projectName: '盲人按摩',
      priceTem: 50,
      num: 3,
      discount: 7,
      itemTotal: 200,
      offer: 100,
    },
  ],
  product: [
    {
      productId: 1,
      categoryId: 1,
      productName: '海飞丝',
      priceTem: 50,
      num: 3,
      discount: 7,
      itemTotal: 300,
      offer: 100,
    },
    // {
    //   productId: 2,
    //   categoryId: 2,
    //   productName: '霸王',
    //   priceTem: 50,
    //   num: 3,
    //   discount: 7,
    //   itemTotal: 600,
    //   offer: 100,
    // },
  ],
}

module.exports = {
  [`GET /getCard`](req, res) {
    res.status(200).json({
      code: 0,
      list: memberCard,
    })
  },
  [`GET /getOrder`](req, res) {
    res.status(200).json({
      code: 0,
      data: order,
    })
  },
  [`GET /staff/list`](req, res) {
    res.status(200).json({
      code: 0,
      list: staffList,
    })
  },
  [`GET /incard/list`](req, res) {
    const { query } = req
    if(query.where) {
      res.status(200).json({
        code: 0,
        list: incardList.filter(v => v.productId),
      })
    } else {
      res.status(200).json({
        code: 0,
        list: incardList.filter(v => v.projectId),
      })
    }
  },
  [`GET /additon/list`] (req, res) {
    res.status(200).json({
      code: 0,
      list: addition,
    })
  },
  [`GET /addition/insert`] (req, res) {
    let obj = Mock.mock({
      "id|5-100": 100,
    })
    const { query } = req
    addition.push({...query, id: obj.id, priceTem: 100})
    res.status(200).json({
      code: 0,
    })
  },
  [`GET /getStuff`] (req, res) {
    res.status(200).json(Mock.mock({
      'code': '0',
      'pickId|+1': 1,
    }))
  },
  [`GET /returnStuff`] (req, res) {
    res.status(200).json({
      code: '0',
    })
  },
  [`GET /getCarInfo`] (req, res) {
    const {Random} = Mock
    res.status(200).json(
      Mock.mock({
        "code":0,
        "list|1-10": [
          {
            "clientId|+1": 1,
            "carId|+1": 1,
            "icon|1850-2024": 1850,
            "plate": Random.cword('粤赣京湘')+Random.cword('ABCDEFG')+'·'+Random.cword('0123456789', 4),
            "model": Random.cword('宝马奔驰法拉路路虎',2)+Random.cword('1234A56B78D90',4),
            "name":Random.cword(3),
            "sex|1-2":1,
            "tag|1-2":Random.cword(2),
            "wx|1-2":1,
            "money|1000-20000":1000,
            "card|1-10":1,
            "coupon|1-10":1,
            "prevMileage|1000-101000":2000,
            "vin|1000-101000":2224,
            "engineNo|1000-101000":4556,
            "phone|17688478846-18999999999":17688478846,
          },
        ],
      })
    )
  },
  [`GET /getGuide`] (req, res) {
    res.status(200).json(
      Mock.mock({
        "code":0,
        "list":  {
          "totalMoney|1850-2024": 1850,
          "onceMoney|1850-2024": 1850,
          "debt|1850-2024": 1850,
          "totalTime|10-100": 11,
          "prevTime|1100243398-1544243398": 1100243398,
        },
      })
    )
  },
  [`GET /getProject`] (req, res) {
    const {Random} = Mock
    res.status(200).json(
      Mock.mock({
        "code":0,
        "list|1-10": [
          {
            "id|+1": 1,
            "residue|1-100": 1,
            "expireTime|1100243398-1544243398": 1100243398,
            "consume|1850-2024": 1850,
            "name": Random.cword(3),
          },
        ],
      })
    )
  },
}
