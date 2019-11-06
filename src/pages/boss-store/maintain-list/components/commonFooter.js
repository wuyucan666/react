import React,{ Component } from 'react'
import { Pagination } from 'antd'
import  styles  from '../styles.less'
import {connect}   from 'dva'
import empty from '../images/none.png'
class CommonFooter extends Component{
   constructor(){
       super()
       this.state={
           number:null,
       }
      
   }
   onChange=(val)=>{
     this.props.changePage(val)
    }
   render(){
     const {  selectList ,maxNumL , currentPage ,totalSize  }= this.props
       return <div>
                     { selectList.length===0 ? 
                    <div className={ styles.zl_noData } >
                       <div> 
                           <img alt="图片加载失败" src={empty} />
                           <p>抱歉，暂无相关数据</p>
                       </div>
                    </div>
                    :
                     <div className={ styles.zl_formFoot } >
                      <p  style={{ float:'left',marginTop:'24px' }}  >本页显示<span>{selectList.length}</span>条记录，共<span>{ totalSize || maxNumL ? maxNumL:0  }</span>条记录</p>
                      <Pagination  style={{ float :'right',marginTop:'24px',marginRight:'112px' }}  pageSize={15}  showQuickJumper defaultCurrent={1}  current={currentPage}  total={ totalSize  || maxNumL ? maxNumL:0} onChange={this.onChange} />
                     </div>  }
              </div>
   }
}
function mapStateToProps(state) {
    const { maxNumL  } = state.maintianList
    return { maxNumL  }
  }

export default connect(mapStateToProps)(CommonFooter)