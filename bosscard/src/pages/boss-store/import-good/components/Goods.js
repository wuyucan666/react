/**
 * Created by kikazheng on 2019/5/20
 */
import React, {Component} from 'react'
import {Empty} from 'antd'

import style from '../index.less'

class Goods extends Component{
  render(){
    const {categoryName, data, goodSelect, ids} = this.props
    return(
      <div>
        <div className={style.category}>
          <div className={style.categoryName}>{categoryName}</div>
          {
            !!data.length ? (
              <div className={style.goodList}>
                {
                  data.map(item => (
                    <div className={style.goodWrapper} key={item.id}>
                      <div
                        className={ids.includes(item.id) ? style.good + ' ' +  style.selected :style.good}
                        onClick={() => goodSelect(item.id)}
                      >
                        {item.name}
                        {ids.includes(item.id) && <i className='iconfont icon-xuazhong' />}
                      </div>
                    </div>
                  ))
                }
                {/*<div className={style.goodWrapper}>*/}
                {/*<div className={style.good + ' ' +  style.selected}>分隔符 <i className='iconfont icon-xuazhong'> </i></div>*/}
                {/*</div>*/}
                {/*<div className={style.goodWrapper}>*/}
                {/*<div className={style.good}>分隔符</div>*/}
                {/*</div>*/}
                {/*<div className={style.goodWrapper}>*/}
                {/*<div className={style.good}>分隔符</div>*/}
                {/*</div>*/}
                {/*<div className={style.goodWrapper}>*/}
                {/*<div className={style.good}>分隔符</div>*/}
                {/*</div>*/}
                {/*<div className={style.goodWrapper}>*/}
                {/*<div className={style.good}>分隔符</div>*/}
                {/*</div>*/}
                {/*<div className={style.goodWrapper}>*/}
                {/*<div className={style.good}>分隔符</div>*/}
                {/*</div>*/}
              </div>
            ) :(
              <Empty/>
            )
          }
        </div>
      </div>
    )
  }
}

export default Goods
