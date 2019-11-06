import React,{ Component } from 'react'
import styles from '../style.less'
import { Radio , Button  ,message } from 'antd'
import R from '../receipts/billingReceipt'
import { data } from '../data'
import services from 'services'
const RadioGroup = Radio.Group
class receipt extends Component{
    constructor(){
        super()
        this.state={
            value:1,
        }
    }
    onChange=(e)=>{
        this.setState({
            value:e.target.value,
        })
    }
    handerSubmit=()=>{
        const { value } = this.state
        services.printingReceiptSetting({ keys: {name: 'printing/setting/ticket'} ,data:{ printPiece:value } }).then(res=>{
            res.success ? message.success('修改成功') : message.info('网络出现错误')
        })
    }
    componentDidMount(){
        services.printingReceipt({ keys: {name: 'printing/setting/ticket'} }).then(res=>{
           if(res.code==='0'){
            this.setState({ value:res.data.printPiece })
           }
        })
    }
    render(){
        const { value  } = this.state
        return <div className={ styles.zl_Receipt } >
                   <div className={ styles.zl_ReceiptLeft }   >
                    默认打印份数 
                      <div>
                        <RadioGroup onChange={this.onChange}  value={ value } >
                                <Radio value={1}>1份</Radio>
                                <Radio value={2}>2份</Radio>
                        </RadioGroup>
                      </div>
                     <Button  onClick={ this.handerSubmit }  type="primary"  style={ { height:'40px',width:"120px",position:'absolute',left:0,top:'20%' } } >保存</Button>
                   </div>
                   <div className={ styles.zl_ReceiptRight } >
                      <div style={ { display:'flex',marginRight:'60px' } } >
                          <p className={ styles.zl_ReceiptRightOne } >开单办卡 \ 小票</p>
                          <div className={styles.zl_ReceiptRightOneContent } >
                             <R 
                             scale={0.398}
                             print={false}
                             type={1}
                             data={data }
                              />
                          </div>
                      </div>
                      <div style={ { display:'flex' } } >
                          <p className={ styles.zl_ReceiptRightTwo } >充值小票</p>
                          <div className={styles.zl_ReceiptRightTwoContent } >
                            <R 
                             print={false}
                             scale={0.378}
                             type={0}
                             data={data}
                              />
                          </div>
                      </div> 
                   </div>
               </div>
    }
}
export default receipt