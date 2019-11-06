import PropTypes from 'prop-types'
import { connect } from 'dva'
import style from './index.less'
const customerCard = ({customer}) => {
 return (
    <div className={style.card}>
      <div className={style.cardName}>
        <span>NO:12345</span>
        <span>{customer.name}</span>
      </div>
      <div className={style.cardPhone}>
        <span>{customer.phone}</span>
      </div>
      <div className={style.cardPrice}>
        <span>¥{customer.price}</span>
        <span>{customer.plate}</span>
      </div>
    </div>
  )
}

customerCard.propTypes = {
  name: PropTypes.string,
  refresh: PropTypes.bool,
}
export default connect(({ table }) => ({ table }))(customerCard)
