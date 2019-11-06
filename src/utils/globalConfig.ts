/**
 * 全局常量集合
 * 业务数据基本类型集合
 */

/**项目类型值 */
export const __PROJECT_TYPE__ = 1
/**产品类型值 */
export const __PRODUCT_TYPE__ = 2

/**提成类型 */
export const __COMMISSION_TYPES__ = [
  { name: '实收比例', value: 1 },
  { name: '原价比例', value: 2 },
  { name: '固定金额', value: 4 },
  { name: '利润比例', value: 5 },
  { name: '毛利提成', value: 6 },
]

/**服务类型 */
export const __SERVICE_TYPES__ = [
  { name: '产品', value: 1 },
  { name: '项目', value: 2 },
  { name: '计次卡', value: 3 },
  { name: '充值卡', value: 4 },
]

/**订单类型 */
export const __ORDER_TYPES__ = [
  { name: '充值卡', value: 1 },
  { name: '计次卡', value: 2 },
  { name: '维修单', value: 3 },
  { name: '快捷开单', value: 4 },
  { name: '赠送卡', value: 5 },
  { name: '挂账还款', value: 6 },
  { name: '续卡', value: 7 },
]
