import PropTypes from "prop-types"
import style from "./table.less"
// import { Tooltip } from "antd"

const rowBtns = ({ moreBtn, itemClick, item }) => {
  const icon = (_, key) => {
    const disabled = _.disabled ? _.disabled(item) : false
    const showBtn = _.show ? _.show(item) : true
    return (
      showBtn && (
        <span style={{color: _.btnColor ? _.btnColor : '#4AACF7FF'}} key={key} onClick={() => itemClick(_.type, item)} className={
          style.cursor +
          " " +
          style["row-icon"] +
          " " +
          (disabled ? "disabled" : "")
        }>
          {_.name}
        </span>
        // <Tooltip title={_.name} key={key}>
        //   <i
        //     onClick={() => itemClick(_.type, item)}
        //     className={
        //       "iconfont " +
        //       _.icon +
        //       " " +
        //       style.cursor +
        //       " " +
        //       style["row-icon"] +
        //       " " +
        //       (disabled ? "disabled" : "")
        //     }
        //   />
        // </Tooltip>
      )
    )
  }
  return (
    <div>
      <div className="btn-wrap">{moreBtn.map((_, key) => icon(_, key))}</div>
    </div>
  )
}

rowBtns.propTypes = {
  moreBtn: PropTypes.array,
  itemClick: PropTypes.func,
}

export default rowBtns
