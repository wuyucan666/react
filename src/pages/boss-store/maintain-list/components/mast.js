import { Component } from 'react'
import style from '../styles.less'
import { Icon  ,Select } from 'antd'
import services from "services"
const Option = Select.Option


export default class Mast extends Component{
    constructor(props){
       super(props)
       this.state={
          dataSource:[],
          hotList:[],
       }
    }
    handleSearch=(val)=>{
        const { type } = this.props
        let name
        type === 'product' ? name = 'maintain/product/list' : name='maintain/project/list'
        services.LIST({ keys:{ name } , data:{ q: {"where":{"name[~]|commodityCode[~]":val}} }  })
        .then(res=>{
            if(res.code==='0'){
                const { list } = res
                this.setState({
                    dataSource:list,
                })
            }
        })
    }
    onSelect=(val)=>{
       const { dataSource } = this.state
       const { handBack , type } = this.props
       let value = dataSource.filter(i=>i.id===val)[0]
       handBack({
           value,
           type,
       })
    }
    UNSAFE_componentWillMount(){
        const { type } = this.props
        if(type==='product'){
            services.productHot().then(res=>{
                if(res.code==='0'){
                    this.setState({
                       hotList:res.list,
                    })
                }
            })
        }else{
            services.projectHot().then(res=>{
                if(res.code==='0'){
                    this.setState({
                       hotList:res.list,
                    })
                }
            })
        }
        this.handleSearch('')
    }
    selectHot=(value)=>{
        const { handBack , type } = this.props
        handBack({
            type,
            value,
        })
    }
    onBlur=()=>{
      this.handleSearch('')
    }
    render(){
        const { type  , closeMast } = this.props
        const { dataSource ,hotList } = this.state
        return <div className={style.zl_b_mast}  >
                 <div className={style.zl_b_content} >
                   <p>{ type === 'product' ? '添加产品' : '添加项目'   } <Icon  onClick={ ()=>closeMast() }  style={ { fontSize:'16px' ,color:'#999' , marginTop:'30px',float:'right'  } }  type="close" /> </p>
                   {
                     type === 'product'?
                     <Select
                     size='large'
                     style={{ width: 460 , height:42+'px'  , marginLeft:'55px' ,boxShadow:'0 0 12px 0 rgba(153,153,153,0.1)'}}
                     onSelect={this.onSelect}
                     showSearch
                     showArrow={false}
                     placeholder="搜索产品/编码"
                     onSearch={this.handleSearch}
                     defaultActiveFirstOption={false}
                     filterOption={false}
                     // value={value ? value : undefined}
                     onBlur={this.onBlur}
                     >
                     {
                       dataSource.map((i,idx)=>(<Option key={idx} value={i.id} ><span style={{ color:'#70C1FF'  }} >{ i.name}</span><span style={{ float:'right' }} >{ i.price}</span> </Option>))
                     }
                     </Select>
                     :  
                     <Select
                     size='large'
                     style={{ width: 460 , height:42+'px'  , marginLeft:'55px' ,boxShadow:'0 0 12px 0 rgba(153,153,153,0.1)'}}
                     onSelect={this.onSelect}
                     showSearch
                     showArrow={false}
                     placeholder="搜索项目"
                     onSearch={this.handleSearch}
                     defaultActiveFirstOption={false}
                     filterOption={false}
                     // value={value ? value : undefined}
                     onBlur={this.onBlur}
                     >
                     {
                       dataSource.map((i,idx)=>(<Option key={idx} value={i.id} ><span style={{ color:'#70C1FF'  }} >{ i.name}</span><span style={{ float:'right' }} >{ i.price}</span> </Option>))
                     }
                     </Select>
                   }
                   <div className={style.zl_b_quc} >
                       <p>{ type === 'product' ? '常用产品' : '常用项目' }</p>
                       {
                         hotList.map((item,i)=><span key={i} onClick={ this.selectHot.bind(this,item) }  >{item.name}</span>)
                       }
                   </div>
                 </div>
              </div>
    }
}