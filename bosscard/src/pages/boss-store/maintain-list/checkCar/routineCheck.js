import  React ,{ Component } from "react"
import  styles  from '../customerInfor/components/cardInformation/component/styles.less'
import style from '../styles.less'
import  img from '../images/yanche.png'
import BigPic from '../customerInfor/components/Essential-infor/openpic.js'
import { message } from 'antd'
import {  reportData , CarDes  } from '../detail/data'
import { feature , goods  } from '../../maintain-billing/cacheData'
import cheyou from '../images/cheyou.png'
import cheding from '../images/cheding.png'
import chetou from '../images/chetou.png'
import chezuo from '../images/chezuo.png'
import chewei from '../images/chewei.png'
import services from "services"
const Car = [ { width:'437px',img:cheyou  } , { width:'184px', img:cheding } ,{ width:'189px',img:chetou  } , { width:'437px',img:chezuo } ,{ width:'189px',img:chewei } ]
const position = [ { top:70,left:30 },{ left:30,top:400 },{ left:600,top:56 },{left:860,top:69 },{ left:860,top:400 } ]

//标记验证操作
const checkCar=(item,idx)=>{
        var left=item.x + position[item.position-1].left+'px'
        var top=item.y + position[item.position-1].top+'px'
        var value=item.value
        .map((item,idx)=>{
           return idx === 0 ? item : '/'+item
        }).join('')
        return <strong key={idx}  style={ { left,top}   } > {value} </strong>
}
class Checkcar extends Component {
    constructor(){
        super()
        this.state={
            data:reportData,
            imgShow:false,
            picIndex:null,
            imgList:[],
            checkCarData:null,
        }
    }
    renderFailureStatus=(feature,data,color)=>{
       let definedData = data
        .filter(item=>item.defined === true  )
       definedData
        .forEach(item=>{ item.index=0   })
       let index = data
        .map(item=>item.index)
       index
        .push(0)
       return [...feature,...definedData]
       .map((item,i)=>{
            return <span key={ i } > { item.text } <i   style={ { backgroundColor:index.indexOf(item.index)>=0 ? color.color1 : color.color2  } }   ></i> </span>
       })
    }
    async componentDidMount(){
        const { orderId } = this.props
        await services.checkCarReport({ keys: {name: 'maintain/report/',id:orderId },data:{ report:'convention'  } }).then(res=>{
            res.success ? this.setState({
                 data:res.data ,
                 imgList:res.data.images,
                 checkCarData:res.data.appearance,
            },()=>{
                console.log( this.state.checkCarData )
            }) : message.info('网络出现错误')
        })
    //    //进行验车标记操作
    //     const { data } = this.state
    //     checkCar(data)
    }
    imgBanner=(idx)=>{
        const  { imgShow  }=this.state
       this.setState({
           picIndex:idx,
           imgShow:!imgShow,
       })
    }
    onBoxshow=()=>{
       this.setState({
           imgShow:!this.state.imgShow,
       })
    }
    render(){
        const { data } = this.state
        const {  imgShow , picIndex , imgList , checkCarData } =this.state
        console.log(checkCarData)
        return  <div className={styles.checkdiv} style={ { paddingBottom:'32px' }  } >
                    <div className={styles.topT}>
                        <img src={img} alt=''  />
                        <div>
                            <p>常规验车</p>
                            <div>通过验车自检，物品确认，外观检查等常规方法确认车辆基本车况和确认车辆进店前的状态</div>
                        </div>
                    </div>
                    <div className={ style.zl_checkCarOneH } >
                       功能确认：正常<span></span>故障<span></span>
                    </div>
                    <div className={ style.zl_checkCarOneC } >
                       <p>{  this.renderFailureStatus(feature,data.functions || [],{ color1 : 'rgba(255,89,106,1)' , color2 : 'rgba(178,222,255,1)'  }) }</p>
                    </div>
                    <div className={ style.zl_checkCarOneH } >
                       物品确认：有<span></span>无<span style={ { backgroundColor:'rgba(217,217,217,1)' } } ></span>
                    </div>
                    <div className={ style.zl_checkCarOneC } >
                       <p>{  this.renderFailureStatus(goods,data.items || [],{ color1 : 'rgba(178,222,255,1)' , color2 : 'rgba(217,217,217,1)'  }) }</p>
                    </div>
                    <div className={ style.zl_checkCarThreeH } >
                       外观确认：
                    </div>
                    <div className={ style.zl_checkCarOneC }  style={ { height:'600px' } }  id='box'  >
                        { Car.map((item,i)=><img key={ i } alt='' src={ item.img } style={{ width:item.width }} />) }
                        { CarDes.map((item,i)=><span key={i}  style={ item.style } >{item.name}</span>) }
                        {  checkCarData===null || checkCarData.map((item,idx)=>{
                             return checkCar(item,idx)
                        }) }
                    </div>
                    <div className={ style.zl_checkCarOneH }  >
                       其他图片
                    </div>
                    <div className={ style.zl_checkCarOneC }  style={ { paddingTop:'24px' } }  >
                        { data.images.map((item,idx)=><div className={ style.zl_bannerImg }  key={ idx }  style={ { position:'relative',display:'inline-block', width:'64px',height:'64px',marginRight:'24px' } } ><span  onClick={ this.imgBanner.bind(this,idx)  }   className={ style.zl_imgSpan } > <i   style={ { color:'#fff' } } className="iconfont icon-chazhao" ></i> </span><img alt='图片加载失败'    src={ item.requestAddress } style={ {position:'static', width:'64px',height:'64px' } } /></div>) }
                        <p className={ style.zl_checkCarRemark } >备注</p>
                        { data.remark===''|| <p className={ style.zl_Remark } >{ data.remark }</p>  }
                    </div>
                   { !imgShow || <BigPic onBox={this.onBoxshow} indexs={picIndex} list={ imgList }/>  }
                 </div>
    }
}
export default Checkcar
