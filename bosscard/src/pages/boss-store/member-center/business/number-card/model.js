const intialState = {
  memberId: 0,
  selectCardDetail: {},
  selectCard: 0,
  selectPay: [],
  selectStaff: [],
  selectCar: [],
  remark: "",
  showAllValidit: false, // 是否显示批量设置的弹层
  selectGiveItems: [],
  member: {},
}

export default {
  namespace: "numbercard",
  state: {
    ...intialState,
  },
  reducers: {
    setMemberId(state, { payload }) {
      return {
        ...state,
        member: payload.member,
        memberId: payload.value,
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
    setCardAllValidity(state, { payload }) {
      return {
        ...state,
        showAllValidit: payload,
      }
    },
    setSelectGiveItems(state, { payload }) {
      return {
        ...state,
        selectGiveItems: payload,
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
          location.pathname ===
            "/boss-store/member-center/business/number-card" ||
          location.pathname ===
            "/boss-store/member-center/business/number-card/give"
        ) {
          dispatch({
            type: "reset",
          })
        }
      })
    },
  },
}
