import React, { Component } from "react"
import style from './style.less'
import { Icon ,Tooltip , Pagination   } from 'antd'
import services from "services"
import router from 'umi/router'
class Table extends Component {
    constructor(props){
        super(props)
        this.state={
            activeIndex:[], //高亮数组
            totalPage:null,//总页码数
            totalSize:null,//数据总条数
            key:null,
            page:1,
            objOrder:null,
            timeSearch:{},
            dataList:[//数据渲染源
                // {
                //    projectName:'项目名称项目名称',
                //    projectId:1, //项目id
                //    type:'汽车', //所属分类
                //    count:122,//数量
                //    output:100,//业绩
                //    cost:1223,//成本
                //    profit:1222,//毛利
                //    cardName:'及撒不撒饿得哇sadasdw adsd 的哎是',
                // },
                // {
                //     projectId:2,
                //     projectName:'项目名称项目名称', //项目名称
                //     type:'汽车', //所属分类
                //     count:122,//数量
                //     output:100,//业绩
                //     cost:1223,//成本
                //     profit:1222,//毛利
                //     cardName:'及撒不撒饿得哇sadasdw adsd 的哎是',
                //  },
                // {
                //     projectId:3,
                //     projectName:'项目名称项目名称', //项目名称
                //     type:'汽车', //所属分类
                //     count:122,//数量
                //     output:100,//业绩
                //     cost:1223,//成本
                //     profit:1222,//毛利
                //     cardName:'及撒不撒饿得哇sadasdw adsd 的哎是',
                //  },
            ],
        }
    }
    //排序
    sortUp=(key,idx,status)=>{
      let  scope
      status==='up' ? scope=1 : scope=2
      this.setState({
        activeIndex:[idx,scope],
      })
      const { timeSearch } =this.state
      //进行排序操作
      if(key==='project' || key==='product' ){
          switch(idx){
             case 2 :
               status==='up' ? this.getData(key,{ count:1 }) : this.getData(key,{ count:2 },timeSearch)
             break
             case 3 :
               status==='up' ? this.getData(key,{ output:1 }) : this.getData(key,{ output:2 },timeSearch)
             break
             case 4 :
               status==='up' ? this.getData(key,{ cost:1 }) : this.getData(key,{ cost:2 },timeSearch)
             break
             case 5 :
               status==='up' ? this.getData(key,{ profit:1 }) : this.getData(key,{ profit:2 },timeSearch)
             break
             default:
             break
          }
      }
      else if( key==='additional'  ){
        switch(idx){
            case 1 :
              status==='up' ? this.getData(key,{ count:1 }) : this.getData(key,{ count:2 },timeSearch)
            break
            case 2 :
              status==='up' ? this.getData(key,{ output:1 }) : this.getData(key,{ output:2 },timeSearch)
            break
            case 3 :
              status==='up' ? this.getData(key,{ cost:1 }) : this.getData(key,{ cost:2 },timeSearch)
            break
            case 4 :
              status==='up' ? this.getData(key,{ profit:1 }) : this.getData(key,{ profit:2 },timeSearch)
            break
            default:
            break
         }
      }
      else if( key==='species' || key==='records' ){
          if(idx===1){
            status==='up' ? this.getData(key,{ count:1 }) : this.getData(key,{ count:2 },timeSearch)  
          }
          else if( idx===2 ){
            status==='up' ? this.getData(key,{ output:1 }) : this.getData(key,{ output:2 },timeSearch) 
          }
      }

    }
    getData=(key,objOrder,objTime)=>{
        const { page } =this.state
        var o
        objOrder ?  o={ by : { ...objOrder } } : o={}
        //保存信息素
        this.setState({
           objOrder,
        })
        switch(key){
            case 'project':
            services.detailProject({ 
                 keys: {name: 'wide-business/achievement/project' },
                 data:{ q:{ where:{  ...objTime    } ,...o ,limit:10,page } } ,
                })
            .then(res=>{
                if(res.code==='0'){
                    let { list ,totalPage ,totalSize } = res
                    this.setState({
                        dataList:list,
                        totalPage,
                        totalSize,
                    })
                }
            })
            break
            case 'product':
            services.detailProduct({ 
                 keys: {name: 'wide-business/achievement/product' },
                 data:{ q:{ where:{  ...objTime    } ,...o ,limit:10,page } } ,
                 })
            .then(res=>{
                if(res.code==='0'){
                    let { list ,totalPage ,totalSize } = res
                    this.setState({
                        dataList:list,
                        totalPage,
                        totalSize,
                    })
                }
            })
            break
            case 'additional':
            services.detailAdditional({ 
                 keys: {name: 'wide-business/achievement/additional' },
                 data:{ q:{ where:{  ...objTime    } ,...o ,limit:10,page } } ,
                 })
            .then(res=>{
                if(res.code==='0'){
                    let { list ,totalPage ,totalSize } = res
                    this.setState({
                        dataList:list,
                        totalPage,
                        totalSize,
                    })
                }
            })
            break
            case 'species':
            services.detailSpecies({ 
                 keys: {name: 'wide-business/achievement/species' },
                 data:{ q:{ where:{  ...objTime    } ,...o,limit:10,page } } ,
                 })
            .then(res=>{
                if(res.code==='0'){
                    let { list ,totalPage ,totalSize } = res
                    this.setState({
                        dataList:list,
                        totalPage,
                        totalSize,
                    })
                }
            })
            break
            case 'records':
            services.detailRecords({ 
                 keys: {name: 'wide-business/achievement/records' },
                 data:{ q:{ where:{  ...objTime    } ,...o ,limit:10 ,page} } ,
                 })
            .then(res=>{
                if(res.code==='0'){
                    let { list ,totalPage ,totalSize } = res
                    this.setState({
                        dataList:list,
                        totalPage,
                        totalSize,
                    })
                }
            })
            break
            default:
            break
        }
    }
    componentDidMount(){
        const { tableConfig , timeSearch }=this.props
        const { key } = tableConfig
        this.setState({
            key,
        })
        this.getData(key,null,timeSearch)
    }
    changePage=(page)=>{
         const { key ,objOrder ,timeSearch }=this.state
       this.setState({
          page,
       },()=>{
           this.getData(key,objOrder,timeSearch)
       })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
       const { timeSearch   } = nextProps
       const { key ,  objOrder  } = this.state
       var o={ ...timeSearch }
       if(timeSearch===this.state.timeSearch){
           return
       }
       this.setState({
           timeSearch:o,
       },()=>{
           this.getData(key,objOrder,timeSearch)
       })
    }
    routergo=()=>{
      router.push('/boss-store/performance-report')
    }
    renderTable=(tableConfig,dataList)=>{
        const { activeIndex }= this.state
        const { key, children } = tableConfig
        if(key==='project'){
            return    <div>
                        {  
                        dataList.map((item,idx)=><ul className={ style.zl_tableItem }  key={idx} > 
                            <li style={{ width: children[0].value+'%'  }} ><Tooltip title={item.projectName || item.productName } ><span style={{ color: 0===activeIndex[0]  ? '#4aacf7' : '#666' }} >{ item.projectName ?  item.projectName: item.productName }</span></Tooltip></li>
                            <li style={{ width: children[1].value+'%'  }} ><Tooltip title={item.categoryName} ><span style={{ color: 1===activeIndex[0]  ? '#4aacf7' : '#666' }} >{ item.categoryName}</span></Tooltip></li>
                            <li style={{ width: children[2].value+'%'  }} ><Tooltip title={item.count} ><span style={{ color: 2===activeIndex[0]  ? '#4aacf7' : '#666' }} >{ item.count}</span></Tooltip></li>
                            <li style={{ width: children[3].value+'%'  }} ><Tooltip title={item.output} ><span style={{ color: 3===activeIndex[0]  ? '#4aacf7' : '#666' }} >{ item.output }</span></Tooltip></li>
                            <li style={{ width: children[4].value+'%'  }} ><Tooltip title={item.cost} ><span style={{ color: 4===activeIndex[0]  ? '#4aacf7' : '#666' }} >{ item.cost }</span></Tooltip></li>
                            <li className={ style.zl_icon }   style={{ width: children[5].value+'%'  }} ><Tooltip title={item.profit} ><span style={{ color: 5===activeIndex[0]  ? '#4aacf7' : '#666' }} >{ item.profit }</span></Tooltip><Tooltip title='业绩报表'  ><Icon  onClick={ this.routergo }  type='login'  style={{ float:'right',color:'#999',fontSize:'20px',marginRight:'32px',marginTop:'18px'  }}   /></Tooltip> </li>
                        </ul>)
                        }
                      </div>
        }
        else if(key==='product'  ){
            return    <div>
                        {  
                        dataList.map((item,idx)=><ul className={ style.zl_tableItem }  key={idx} > 
                            <li style={{ width: children[0].value+'%'  }} ><Tooltip title={item.projectName || item.productName } ><span style={{ color: 0===activeIndex[0]  ? '#4aacf7' : '#666' }} >{ item.projectName ?  item.projectName: item.productName }</span></Tooltip></li>
                            <li style={{ width: children[1].value+'%'  }} ><Tooltip title={item.commodityCode} ><span style={{ color: 1===activeIndex[0]  ? '#4aacf7' : '#666' }} >{ item.commodityCode}</span></Tooltip></li>
                            <li style={{ width: children[2].value+'%'  }} ><Tooltip title={item.categoryName} ><span style={{ color: 1===activeIndex[0]  ? '#4aacf7' : '#666' }} >{ item.categoryName}</span></Tooltip></li>
                            <li style={{ width: children[3].value+'%'  }} ><Tooltip title={item.count} ><span style={{ color: 2===activeIndex[0]  ? '#4aacf7' : '#666' }} >{ item.count}</span></Tooltip></li>
                            <li style={{ width: children[4].value+'%'  }} ><Tooltip title={item.output} ><span style={{ color: 3===activeIndex[0]  ? '#4aacf7' : '#666' }} >{ item.output }</span></Tooltip></li>
                            <li style={{ width: children[5].value+'%'  }} ><Tooltip title={item.cost} ><span style={{ color: 4===activeIndex[0]  ? '#4aacf7' : '#666' }} >{ item.cost }</span></Tooltip></li>
                            <li className={ style.zl_icon }   style={{ width: children[5].value+'%'  }} ><Tooltip title={item.profit} ><span style={{ color: 5===activeIndex[0]  ? '#4aacf7' : '#666' }} >{ item.profit }</span></Tooltip><Tooltip title='业绩报表'  ><Icon  onClick={ this.routergo }  type='login'  style={{ float:'right',color:'#999',fontSize:'20px',marginRight:'32px',marginTop:'18px'  }}   /></Tooltip> </li>
                        </ul>)
                        }
                      </div>
        }
        else if( key==='additional' ) {
            return <div>
                        {  
                        dataList.map((item,idx)=><ul className={ style.zl_tableItem }  key={idx} > 
                            <li style={{ width: children[0].value+'%'  }} ><Tooltip title={item.projectName  } ><span>{   item.projectName }</span></Tooltip></li>
                            <li style={{ width: children[1].value+'%'  }} ><Tooltip title={item.count} ><span>{ item.count}</span></Tooltip></li>
                            <li style={{ width: children[2].value+'%'  }} ><Tooltip title={item.output} ><span>{ item.output }</span></Tooltip></li>
                            <li style={{ width: children[3].value+'%'  }} ><Tooltip title={item.cost} ><span>{ item.cost }</span></Tooltip></li>
                            <li  className={ style.zl_icon }  style={{ width: children[4].value+'%'  }} ><Tooltip title={item.profit} ><span>{ item.profit }</span></Tooltip><Tooltip title='业绩报表'  ><Icon type='login' onClick={ this.routergo }   style={{ float:'right',color:'#999',fontSize:'20px',marginRight:'32px',marginTop:'18px'  }}   /></Tooltip> </li>
                        </ul>)
                        }
                     </div>
        }
        else if( key==='species' || key==='records'  ){
            return  <div>
                            {  
                            dataList.map((item,idx)=><ul className={ style.zl_tableItem }  key={idx} > 
                                <li style={{ width: children[0].value+'%'  }} ><Tooltip title={item.cardName  } ><span>{ item.cardName }</span></Tooltip></li>
                                <li style={{ width: children[1].value+'%'  }} ><Tooltip title={item.count} ><span>{ item.count}</span></Tooltip></li>
                                <li className={ style.zl_icon } style={{ width: children[2].value+'%'  }} ><Tooltip title={item.output} ><span>{ item.output }</span></Tooltip><Tooltip title='业绩报表'  ><Icon type='login' onClick={ this.routergo }    style={{ float:'right',color:'#999',fontSize:'20px',marginRight:'32px',marginTop:'18px'  }}   /></Tooltip> </li>
                            </ul>)
                            }
                   </div>
        }
    }
    render(){
        const { tableConfig }= this.props
        const { children ,key  } =tableConfig
        const { activeIndex , dataList  ,totalSize  ,page } = this.state
        return <div className={ style.zl_table } >
                <ul className={style.zl_table_header} >
                  { children.map((item,idx)=><li key={idx} style={{ width:item.value+'%' }}  >{ item.name } {  !item.sort ||  <span className={ style.zl_paixu } > <Icon type="caret-up"  onClick={this.sortUp.bind(this,key,idx,'up')}  style={{ position:'absolute',left:'7px',top:'5px',fontSize:'12px',color: idx===activeIndex[0] && activeIndex[1]===1 ? '#4aacf7' : '#999' }}  /> <Icon type="caret-down"  style={{ position:'absolute',left:'7px',top:'12px',fontSize:'12px', color: idx===activeIndex[0] && activeIndex[1]===2 ? '#4aacf7' : '#999'   }} onClick={this.sortUp.bind(this,key,idx,'down')} />  </span>   } </li>) }
                </ul>
                {  this.renderTable( tableConfig, dataList )  }
                <div className={ style.zl_foot }  >
                  <p> 本页显示<span>{ dataList.length }</span>条记录，共<span>{ totalSize }</span>条记录 </p>
                  <Pagination style={ { float:'right' } }  pageSize={10} current={page}   onChange={this.changePage.bind(this)}  total={totalSize}  showQuickJumper  />
                </div>
              </div>
    }
}
export default Table