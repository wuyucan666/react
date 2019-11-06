const o = [
  { name: '总业绩', prop: 'output' },
  { name: '总消耗', prop: 'consume' },
  { name: '到店台次', prop: 'inshopCar' },
  { name: '会员车辆数', prop: 'clientVehicles' },
  { name: '散客车辆数', prop: 'touristVehicles' },
  { name: '充值卡业绩', prop: 'speciesOutput' },
  { name: '计次卡业绩', prop: 'recordsOutput' },
  { name: '充值卡数', prop: 'speciesCount' },
  { name: '计次卡消耗', prop: 'recordsConsume' },
  { name: '充值卡消耗', prop: 'speciesConsume' },
  { name: '项目消耗', prop: 'projectConsume' },
]
const d = [
  { name: '总业绩', prop: 'output' },
  { name: '总消耗', prop: 'consume' },
  { name: '车辆数', prop: 'carCount' },
  { name: '会员车辆数', prop: 'clientVehicles' },
  { name: '散客车辆数', prop: 'touristVehicles' },
  { name: '充值卡业绩', prop: 'speciesOutput' },
  { name: '计次卡业绩', prop: 'recordsOutput' },
  { name: '计次卡消耗', prop: 'recordsConsume' },
  { name: '充值卡消耗', prop: 'speciesConsume' },
  { name: '产品消耗', prop: 'productConsume' },
  { name: '项目消耗', prop: 'projectConsume' },
  { name: '单车产值', prop: 'perCarOutput' },
]
function setPlan(a, b, c) {
  let arr = []
  for (let i in a) {
    let obj = {}
    for (let j in b) {
      let p = parseFloat(a[i]) ? parseFloat(a[i]) : 0
      let t = parseFloat(b[j]) ? parseFloat(b[j]) : 0
      let d = (p && t) ? (t / p) >= 1 ? 100 : parseInt(t / p * 100) : 0
      if (i === j) {
        obj = {
          prop: i,
          plandata: p, // 计划
          plandataEdit: p, // 原计划（编辑时用到）
          totaldata: t, // 已完成
          not: (p - t) > 0 ? parseInt(p - t) : 0, // 未完成
          ontPlan: parseInt(100 - d),  // 未完成进度
          complete: d, // 已完成进度（不超100%）
          progress: (p && t) ? parseInt(t / p * 100) : 0, // 已完成进度（超100%）
          completeEdit: d, // 已完成进度（不超100%）编辑时用到）
          progressEdit: (p && t) ? parseInt(t / p * 100) : 0, // 已完成进度（超100%）编辑时用到）
        }
      }
    }
    if (obj.prop) { arr.push(obj) }
  }
  let f = c ? d : o
  let ary = f.map(v => {
    let d = arr.filter(_ => _.prop === v.prop)
    return {
      ...v,
      ...d[0],
    }
  })
  return ary
}
export {
  setPlan,
}
