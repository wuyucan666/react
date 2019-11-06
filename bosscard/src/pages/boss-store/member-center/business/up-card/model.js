const intialState = {
  memberId: 0,
  selectCardDetail: {},
  selectCard: 0,
  selectPay: [],
  selectStaff: [],
  selectCar: [],
  remark: "",
}

export default {
  namespace: "upcard",
  state: { ...intialState },
  reducers: {
    setMemberId(state, { payload }) {
      return {
        ...state,
        memberId: payload,
      }
    },
    setSelectCard(state, { payload }) {
      return {
        ...state,
        selectCard: payload,
      }
    },
    setSelectCar(state, { payload }) {
      return {
        ...state,
        selectCar: payload,
      }
    },
    setSelectPay(state, { payload }) {
      return {
        ...state,
        selectPay: payload,
      }
    },
    setSelectStaff(state, { payload }) {
      return {
        ...state,
        selectStaff: payload,
      }
    },
    setRemark(state, { payload }) {
      return {
        ...state,
        remark: payload,
      }
    },
    setCardDetail(state, { payload }) {
      return {
        ...state,
        selectCardDetail: payload,
      }
    },
    reset() {
      return {
        ...intialState,
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
          location.pathname === "/boss-store/member-center/business/up-card"
        ) {
          dispatch({
            type: "reset",
          })
        }
      })
    },
  },
}
