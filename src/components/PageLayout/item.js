// import { Button } from 'antd'
import styles from "./style.less"

const Item = ({
  title = "",
  children = null,
  operation = undefined,
  rightTip = "" || <span />,
}) => {
  return (
    <div className="item-wrap">
      {title && <div className="flex center">
         <h3 style={{ flex: "1"}}>{title}</h3> {/*, minHeight: "21px"*/}
        {rightTip}
        {operation && (
          <div className={styles.operation}>
            {operation.map(
              (v, i) =>
                !v.hidden && (
                  <span key={i} onClick={v.handel} >
                    {v.name}
                  </span>
                )
            )}
          </div>
        )}
      </div>}
      {children}
    </div>
  )
}

export default Item
