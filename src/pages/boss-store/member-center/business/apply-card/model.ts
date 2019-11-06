/*
 * @Description: 办卡的mode
 * @Author: lifeng
 * @Date: 2019-06-12 17:38:48
 * @LastEditTime: 2019-08-09 18:45:17
 * @LastEditors: Please set LastEditors
 */
import { Model } from "dva"

export interface State {
  selectedCardStatus: boolean
  selectedCard: any
  selectedCardId: number
  /**选择的卡的类型 1 计次卡 2 充值卡 3 自定义卡 */
  selectedCardType: number
  /**是否显示批量修改 */
  showAllValidit: boolean
  /**会员的ID */
  memberId: number
  /**选择的员工 */
  selectStaff: Array<any>
  /**选择的绑定车辆 */
  selectCar: Array<any>
  /**赠送列表 */
  gives: Array<any>
  /**金额 */
  price: number
  /**折扣 */
  discount: number
  payments: Array<any>
  member: Object
}

const initState: State = {
  selectedCardStatus: false,
  selectedCard: {},
  selectedCardId: 0,
  selectedCardType: 1,
  showAllValidit: false,
  memberId: 0,
  selectStaff: [],
  selectCar: [],
  gives: [],
  price: 0.0,
  discount: 10.0,
  payments: [],
  member: {},
}

export default <Model>{
  namespace: "applyCard",
  state: {
    ...initState,
  },
  reducers: {
    setCardDetail(state, { payload }) {
      return {
        ...state,
        selectedCard: payload,
        price: parseFloat(payload.rechargeMoney || payload.amount) || 0,
      }
    },
    setCardId(state, { payload }) {
      return {
        ...state,
        selectedCardId: payload.id,
        selectedCardType: payload.type,
      }
    },
    setAllValidity(state, { payload }) {
      return {
        ...state,
        showAllValidit: payload,
      }
    },
    setMemberId(state, { payload }) {
      return {
        ...state,
        member: payload.member,
        memberId: payload.value,
      }
    },
    setStaff(state, { payload }) {
      return {
        ...state,
        selectStaff: payload,
      }
    },
    setCar(state, { payload }) {
      return {
        ...state,
        selectCar: payload,
      }
    },
    setPayments(state, { payload }) {
      return {
        ...state,
        payments: payload,
      }
    },
    setGives(state, { payload }) {
      return {
        ...state,
        gives: payload,
      }
    },
    setPrice(state, { payload }) {
      return {
        ...state,
        price: payload.price,
        discount: payload.discount,
      }
    },
    reset(state) {
      return {
        ...state,
        ...initState,
      }
    },
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      // 监听history变化
      history.listen((location) => {
        /*
         * 当跳去进入办理计次卡和赠送卡的时候重置state
         */
        if (
          location.pathname === "/boss-store/member-center/business/apply-card"
        ) {
          dispatch({
            type: "reset",
          })
        }
      })
    },
  },
}
