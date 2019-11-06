import styles from './style.less'

import 'animate.css'

const List = ({ title, data, type, showDc, show }) => {

  return(
    <div>
      <div className={styles.title}>
        <span>{title}</span>
        {
          data.length > 0  &&
          <span
          className={styles.set}
          onClick={showDc.bind(this,type)}>
          <i className="iconfont icon-xiugaibianji" style={{marginRight: 6, fontSize: 12}}></i>编辑</span>
        }
      </div>
      <div>
        {
          data.map((v,i) => {
            return (
              <div className={styles['card-item'] +  ' flex'} key={i}>
                <span className="item">{v[show]}</span>
                <span style={{margin: '0 10px', color: '#666', fontWeight: 'normal'}}>{v.commodityCode}</span>
                <span>{v.discount}</span>
                <span>{v.discountType*1 === 1 ? '折' : '元'}</span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default List
