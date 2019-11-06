/**
 * 获取供应商银行卡
 * @type {Object}
 */
export const supplierBank = {
  url: "store/supplier/bank",
  method: "get",
}
/**
 * 获取产品分类
 * @type {Object}
 */
export const productStoreCategory = {
  url: "store/productcategory/list",
  method: "get",
}
/**
 * 获取产品单位
 * @type {Object}
 */
export const productUnit = {
  url: "store/unit/list",
  method: "get",
}
/**
 * 获取项目分类
 * @type {Object}
 */
export const projectStoreCategory = {
  url: "store/projectcategory/list",
  method: "get",
}
/**
 * 获取产项目位
 * @type {Object}
 */
export const projectUnit = {
  url: "store/unit/list",
  method: "get",
}
/**
 * 获取门店仓库列表
 * @type {Object}
 */
export const warehouseList = {
  url: "store/warehouse/list",
  method: "get",
}

/**
 * 获取门店支付方式列表
 * @type {Object}
 */
export const paymentList = {
  url: "store/payment/list",
  method: "get",
}

/**
 * 获取卡种详情
 * @type {Object}
 */
export const cardsDetail = {
  url: "store/species/details",
  method: "post",
}

/**
 * 搜索会员
 */
export const searchMember = {
  url: "store/client/quick-search",
  method: "get",
}

export const getMemberDetail = {
  url: "store/client/details",
  method: "post",
}
/**
 * 获取车价区间
 * @type {Object}
 */
export const cardPrice = {
  url: "erp/carpricerange/selector",
  method: "get",
}
//设置默认车牌
export const setPlate = {
  url: "store/setting/update",
  method: "post",
}
//获取车品牌
export const getCarBrand = {
  url: "common/carBrand/tree",
  method: "get",
}
/**
 * 获取车价区间
 * @type {Object}
 */
export const goodsTypeMenu = {
  url: "common/category/tree",
  method: "get",
}
/**
 * 获取入库管理商品分类
 * @type {Object}
 */

export const getTypeGoods = {
  url: "erp/stock/inventory",
  method: "get",
}
/**
 * 出库调整
 * @type {Object}
 */
export const outStore = {
  url: "erp/stock/inventory/storage/output",
  method: "post",
}
/**
 * 入库调整
 * @type {Object}
 */
export const inStore = {
  url: "erp/stock/inventory/storage/input",
  method: "post",
}
/**
 * 获取员工列表
 * @type {Object}
 */
export const getStaffList = {
  url: "store/staff/list",
  method: "get",
}
/**
 * 获取员工列表
 * @type {Object}
 */
export const staffListData = {
  url: "store/staff/list",
  method: "get",
  data: { isJob: 1 },
}
/**
 * 获取员工列表
 * @type {Object}
 */
export const getTypeProduct = {
  url: "erp/product/selector",
  method: "get",
}
/**
 * 获取出入库类型
 * @type {Object}
 */
export const storeType = {
  url: "erp/stock/types",
  method: "get",
}
/**
 * 获取库存调整详情
 * @type {Object}
 */

export const storeAdjustmentDetail = {
  url: "erp/stock/inventory/adjustment/{id}",
  method: "get",
}

/**
 * 畅销商品排行
 * @type {Object}
 */
export const getbestselling = {
  url: "erp/statistics/bestselling",
  method: "get",
}
/**
 * 提交盘点
 * @type {Object}
 */
export const stocktakingInsert = {
  url: "{name}",
  method: "post",
}
/**
 * 提交盘点审核
 * @type {Object}
 */
export const stocktakingPut = {
  url: "{name}/{id}",
  method: "put",
}

/**
 * 办理计次卡
 */
export const createNumberCard = {
  url: "store/workbench/counting",
  method: "post",
}

/**
 * 办理赠送卡
 */
export const createGives = {
  url: "store/workbench/presenter",
  method: "post",
}

/**
 * 充值
 */
export const recharge = {
  url: "store/workbench/recharge",
  method: "post",
}
/**
 * 获取寄存数据
 * @type {Object}
 */
export const inventoryLockersearch = {
  url: "erp/inventoryLockerClientFilter",
  method: "get",
}
/**
 * 获取寄存产品搜索
 * @type {Object}
 */
export const inventoryLockerProductFilter = {
  url: "erp/inventoryLockerProductFilter",
  method: "get",
}
/**
 * 获取维修订单列表
 * @type {Object}
 */
export const maintainList = {
  url: "maintain/order",
  method: "get",
}
export const mytest = {
  url: "maintain/order",
  method: "get",
}
/**
 * 获取b订单列表
 * @type {Object}
 */
export const Blist = {
  url: "store/vice/order",
  method: "get",
}
/**
 * 获取维修订单修改记录列表
 * @type {Object}
 */
export const maintainHistoryList = {
  url: "order/change/record/{id}",
  method: "get",
}
/**
 * 获取维修订单详情
 * @type {Object}
 */
export const maintainListDetail = {
  url: "maintain/order/{id}",
  method: "get",
}
/**
 * 获取快捷开单详情
 * @type {Object}
 */
export const maintainKlistDetail = {
  url: "quick/order/{id}",
  method: "get",
}
/**
 * 获取B订单详情
 * @type {Object}
 */
export const maintainBlistDetail = {
  url: "store/vice/order/{id}",
  method: "get",
}
/**
 * 生成B单
 * @type {Object}
 */
export const produceBlist = {
  url: "store/vice/order",
  method: "post",
}
/**
 * 生成B单
 * @type {Object}
 */
export const checkCarReport = {
  url: "maintain/report/{id}",
  method: "get",
}

/**
 * 基本信息
 * @type {Object}
 */
export const essyinformation = {
  url: "store/clientInformation",
  method: "get",
}
/**
 * 车辆信息
 * @type {Object}
 */
export const clientCarInfo = {
  url: "store/clientCarInfo",
  method: "get",
}
/**
 * 获取会员卡
 * @type {Object}
 */
export const clientCard = {
  url: "store/clientCard",
  method: "get",
}
/**
 * 获取会员卡
 * @type {Object}
 */
export const clientCardInfo = {
  url: "store/clientCardInfo",
  method: "get",
}

/**
 * 卡项消费记录
 * @type {Object}
 */
export const clientCardRecording = {
  url: "store/clientCardRecording",
  method: "get",
}
/**
 * 获取结算单设置内容显示
 * @type {Object}
 */
export const printingSetting = {
  url: "printing/setting/order",
  method: "get",
}
/**
 * 设置结算单的内容
 * @type {Object}
 */
export const SettingPrinting = {
  url: "printing/setting/order",
  method: "post",
}
/**
 * 获取小票默认值
 * @type {Object}
 */
export const printingReceipt = {
  url: "printing/setting/ticket",
  method: "get",
}
/**
 * 小票设置修改
 * @type {Object}
 */
export const printingReceiptSetting = {
  url: "printing/setting/ticket",
  method: "post",
}
/**
 * 小票设置修改
 * @type {Object}
 */
export const getPersonListTotal = {
  url: "maintain/maintainTotal",
  method: "get",
}
/**
 * 结算单打印
 * @type {Object}
 */
export const printingOperationMaintain = {
  url: "printing/operation/order/statements/{id}",
  method: "get",
}
/**
 * 结算单(快捷单)打印
 * @type {Object}
 */
export const printingOperationQuick = {
  url: "printing/operation/order/quick/{id}",
  method: "get",
}
/**
 * 结算单(B单)打印
 * @type {Object}
 */
export const printingOperationB = {
  url: "printing/operation/order/normal/billing/{id}",
  method: "get",
}
/**
 * 快捷单(B单)打印
 * @type {Object}
 */
export const printingOperationQuikeB = {
  url: "printing/operation/order/quick/billing/{id}",
  method: "get",
}
/**
 * 开单小票打印
 * @type {Object}
 */
export const printingMaintainReceipt = {
  url: "printing/operation/billing/{id}",
  method: "get",
}
/**
 * 领料单打印
 * @type {Object}
 */
export const printingOperationMaterialPick = {
  url: "printing/operation/material/pick/{id}",
  method: "get",
}
/**
 * 退料单打印
 * @type {Object}
 */
export const printingOperationMaterialReturn = {
  url: "printing/operation/material/return/{id}",
  method: "get",
}
/**
 * 施工单打印
 * @type {Object}
 */
export const printingConstruct = {
  url: "printing/operation/construction/{id}",
  method: "get",
}
/**
 * 会员卡管理支付方式列表
 */
export const getPaytypeList = {
  url: "store/clientcard/paytype",
  method: "get",
}
/**
 * 会员卡管理列表详情
 */
export const getClientcardOperation = {
  url: "store/clientcard/operation/{id}",
  method: "get",
}
/**
 * 会员卡管理列表编辑提交
 */
export const clientcardOperationsubmit = {
  url: "store/clientcard/operation/{id}",
  method: "PUT",
}
/**
 * 修改会员卡项目有效期
 */
export const updateCardInfo = {
  url: "store/updateCardInfo",
  method: "POST",
}
/**
 * 修改会员卡绑定车辆
 */
export const updateCardLimit = {
  url: "store/updateCardLimit",
  method: "POST",
}
/**
 * 附加项目列表维修类型列表
 */
export const getMaintaintype = {
  url: "store/maintaintype",
  method: "get",
}
/**
 * 营收汇总-商品列表
 */
export const revenueProductList = {
  url: "wide-business/marketing/product",
  method: "get",
}
/**
 * 营收汇总-项目列表
 */
export const revenueProjectList = {
  url: "wide-business/marketing/project",
  method: "get",
}
/**
 * 业绩明细-项目列表
 */
export const detailProject = {
  url: "wide-business/achievement/project",
  method: "get",
}
/**
 * 业绩明细-产品列表
 */
export const detailProduct = {
  url: "wide-business/achievement/product",
  method: "get",
}
/**
 * 业绩明细-附加项目列表
 */
export const detailAdditional = {
  url: "wide-business/achievement/additional",
  method: "get",
}
/**
 * 业绩明细-充值卡列表
 */
export const detailSpecies = {
  url: "wide-business/achievement/species",
  method: "get",
}
/**
 * 业绩明细-计次卡列表
 */
export const detailRecords = {
  url: "wide-business/achievement/records",
  method: "get",
}
/**
 * 营收-营收汇总
 */
export const marketingCollect = {
  url: "wide-business/marketing/collect",
  method: "get",
}
/**
 * 营收-营收汇总
 */
export const getPaymentTypeCollect = {
  url: "wide-business/payment/type/collect",
  method: "get",
}

/**
 * 业绩明细——汇总数据
 */
export const typeCollectAchievement = {
  url: "wide-business/achievement/collect",
  method: "get",
}
/**
 * 业绩提成汇总-走势图
 */
export const performanceDeductTrend = {
  url: "wide-performance/performance/deduct/trend",
  method: "get",
}
/**
 * 维修类型-走势图接口
 */
export const maintaintype = {
  url: "wide-business/maintain/type/trend",
  method: "get",
}
/**
 * 员工产值-走势图接口
 */
export const outputTrend = {
  url: "wide-business/staff/output/trend",
  method: "get",
}
/**
 * 数据统计会员卡统计
 */
export const getWideClientCard = {
  url: "wide-client/card/collect",
  method: "get",
}
/**
 * 营收-数据明细
 */
export const getPaymentTypeList = {
  url: "wide-business/payment/type/list",
  method: "get",
}
/**
 * 营收-支付方式列表
 */
export const getPaymentList = {
  url: "wide-business/paymentType/list",
  method: "get",
}

/**
 * 获取回访列表
 *
 * */
export const getVisitList = {
  url: "store/returnVisit",
  method: "get",
}
/**
 * 回访汇总
 */
export const getReviewTotal = {
  url: "returnVisit/summary",
  method: "get",
}
/**
 * 获取自定义提醒列表
 *
 * */
export const remindList = {
  url: "setting/remind",
  method: "get",
}
/**
 * 新增自定义提醒
 *
 * */
export const addRemind = {
  url: "setting/remind",
  method: "post",
}
/**
 * 修改自定义提醒
 *
 * */
export const editRemind = {
  url: "setting/remind",
  method: "put",
}
/**
 * 获取添加回访记录
 */
export const getReturnVisitRecord = {
  url: "returnVisit/record/{id}",
  method: "get",
}
/**
 * 添加自定义提醒
 */
export const addRemindWarn = {
  url: "returnVisit/visit",
  method: "post",
}
/**
 * 获取回访计数器
 */
export const getReturnTatal = {
  url: "returnVisit/count",
  method: "get",
}
/**
 * 添加回访记录
 */
export const addReturnVisitRecord = {
  url: "returnVisit/record",
  method: "post",
}
/**
 * 回访项目删除
 */
// export const deleteReturnVisit={
//   url:'returnVisit/visit/{id}',
//   method:'delete',
// }
/**
 * 项目设置删除
 */
export const deteteProject = {
  url: "returnVisit/item/{id}",
  method: "delete",
}
/**
 * 获取项目设置列表
 */
export const getReturnProject = {
  url: "returnVisit/item",
  method: "get",
}
/**
 * 回访项目修改
 */
export const editReturnProject = {
  url: "returnVisit/item",
  method: "post",
}
/**
 * 获取关联订单号
 */
export const getOrderNo = {
  url: "maintain/selector",
  method: "get",
}
/**
 * 回访项目设置
 */
export const setReturnProject = {
  url: "returnVisit/item/0",
  method: "put",
}
/**
 * 获取班次列表
 *
 * */
export const getStoreShift = {
  url: "brand/shift",
  method: "get",
}
/**
 * 添加班次
 *
 * */
export const addStoreShift = {
  url: "brand/shift",
  method: "post",
}
/**
 * 获取班次信息
 *
 * */
export const giveStoreShift = {
  url: "brand/shift/{id}",
  method: "get",
}
/**
 * 编辑班次
 *
 * */
export const setStoreShift = {
  url: "brand/shift/{id}",
  method: "put",
}
/**
 * 获取班次列表
 *
 * */
export const storeShiftList = {
  url: "store/shift",
  method: "get",
}

/** 品牌商-薪资列表 */
export const getBrandWagesData = {
  url: "brand/wages",
  method: "get",
}

/** 门店-薪资列表 */
export const getStoreWagesData = {
  url: "store/wages",
  method: "get",
}

/** 品牌商-薪资调整 */
export const getBrandWagesChange = {
  url: "brand/wages/{id}",
  method: "put",
}

/** 门店-薪资调整 */
export const getStoreWagesChange = {
  url: "store/wages/{id}",
  method: "put",
}

/** 品牌商-计算薪资 */
export const getBrandWagesCalculation = {
  url: "brand/wages/calc",
  method: "post",
}
/** 门店-计算薪资 */
export const getStoreWagesCalculation = {
  url: "store/wages/calc",
  method: "post",
}
/** 保存排班 */
export const saveScheduling = {
  url: "store/scheduling",
  method: "post",
}
/** 出勤调整 */
export const schedulingAdjustment = {
  url: "store/scheduling/{id}",
  method: "put",
}
/** 员工排班列表 */
export const schedulingList = {
  url: "store/scheduling",
  method: "get",
}

/** 品牌商-锁定考勤 */
export const getBrandLock = {
  url: "brand/work/locking",
  method: "post",
}

/** 门店-锁定考勤 */
export const getStoreLock = {
  url: "store/work/locking",
  method: "post",
}

/** 品牌商-考勤状态 */
export const getBrandStatus = {
  url: "brand/work/locking",
  method: "get",
}

/** 门店-考勤状态 */
export const getStoreStatus = {
  url: "store/work/locking",
  method: "get",
}

/** 门店首页-获取运营发展趋势数据 */
export const getStoreIndexOperationDevelopmentTrendData = {
  url: "store/index/trend",
  method: "get",
}

/** 门店首页-获取聚合数据 */
export const getStoreIndexPolymerizationData = {
  url: "store/index/collect",
  method: "get",
}

/** 门店首页-获取员工排名数据 */
export const getStoreIndexStaffSortData = {
  url: "store/index/staff/sort",
  method: "get",
  data: {
    limit: 50,
  },
}
/** 门店首页-获取计次卡排名数据 */
export const getStoreIndexMeteringCardSortData = {
  url: "store/index/card/record/sort",
  method: "get",
}
/** 本月应休列表 */
export const shouldRestList = {
  url: "store/scheduling/shouldRest",
  method: "get",
}
/** 保存本月应休 */
export const saveShouldRest = {
  url: "store/scheduling/shouldRest",
  method: "post",
}
/** 门店计划数据 */
export const getStorePlanData = {
  url: "store/plan/show",
  method: "get",
}
/** 门店员工计划数据 */
export const getStoreStaffplan = {
  url: "store/staffplan",
  method: "get",
}

/**
 * 畅销价格趋势
 * @type {Object}
 */
export const bestselling = {
  url: "/erp/statistics/bestselling/{id}",
  method: "get",
}

/**
 * 续卡
 */
export const extendCard = {
  url: "refill/renewal",
  method: "post",
}
/**
 * 获取可用短信数量
 */
export const msmNum = {
  url: "store/smsGroupMessage/create",
  method: "get",
}
/**
 * 添加短信获取会员数据
 */
export const getMenberData = {
  url: "store/smsGroupMessage/{id}",
  method: "get",
}
/**
 * 发送短信
 */
export const sentNote = {
  url: "store/smsGroupMessage",
  method: "post",
}
/**
 * 列表删除短信
 */
export const deleteNote = {
  url: "store/smsGroupMessage/{id}",
  method: "put",
}
/*
 * 获取生日列表
 */
export const brithdayList = {
  url: 'store/clientBirthday',
  method: 'get',
}
/**
 * 超级权限
 */
export const superPrivilege = {
  url: 'store/superPrivilege',
  method: 'post',
}
/**
 * 会员卡阶段关联
 */
export const cardStage = {
  url: 'card/stage',
  method: 'get',
}
/**
 * 修改卡项关联
 */
export const reviseCardState = {
  url: 'card/stage/{id}',
  method: 'put',
}
/**
 * 公共接口 - 会员简单搜索
 */
export const clientQuickSearch = {
  url: 'client/simple-selector',
  method: 'get',
}
/**
 * 库存成本调整
 */
export const costAdjustment = {
  url: 'store/inventory/cost-detail/{id}',
  method: 'put',
}
/*
 * 公共接口 - 畅销产品排行
 */
export const productHot = {
  url: 'maintain/product/hot',
  method: 'get',
}
/**
 * 公共接口 - 畅销项目排行
 */
export const projectHot = {
  url: 'maintain/project/hot',
  method: 'get',
}
/**
 * 门店 - 财务报表接口
 */
export const financeReport = {
  url: 'wide-transaction/finance/report',
  method: 'get',
}
/**
 * 门店 - 财务报表汇总接口
 */
export const financeReportTotal = {
  url: 'wide-transaction/finance/report/total',
  method: 'get',
}
/**
 * 门店 - 门店信息设置获取
 */
export const getStoreSetInfo = {
  url: 'printing/setting/order',
  method: 'get',
}
/**
 * 门店 - 门店信息设置请求
 */
export const setStoreInfo = {
  url: 'printing/setting/order',
  method: 'post',
}
/**
 * 门店 - 获取门店通知列表
 */
export const messageNoifyStore = {
  url: 'messageNoify/store',
  method: 'get',
}

/**
 * 门店 - 订单详情反结
 */
export const repeatCreate = {
  url: 'maintain/repeatCreate/{order_id}',
  method: 'get',
}

/**
 * 今日报表 - 业务类型(不分页)
 */
export const wideReportMaintian = {
  url: 'wide-report/daily/maintain/type',
  method: 'get',
}
/**
 * 今日报表 - 项目(不分页)
 */
export const wideReportProject = {
  url: 'wide-report/daily/project',
  method: 'get',
}
/**
 * 今日报表 - 产品(不分页)
 */
export const wideReportProduct = {
  url: 'wide-report/daily/product',
  method: 'get',
}
/**
 * 今日报表 - 员工排名
 */
export const wideReportStaff = {
  url: 'wide-ranking/details?driver=staffPerformance',
  method: 'get',
}
