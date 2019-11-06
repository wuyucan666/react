import React,{ Component } from 'react'
import styles from './styles.less'
import services from 'services'
import { Form ,Input , Select,InputNumber ,Button ,TreeSelect,message} from 'antd'
import validate from "../../utils/validate"
const TreeNode = TreeSelect.TreeNode
const FormItem = Form.Item
const Option =Select.Option
class Add extends Component{
    constructor(props){
        super(props)
        this.state={
            warehouseList:[],
            productUnit:[],
            product_name: '',
            commodity_code: '',
        }
    }
      //递归形成树状菜单
    getMenu=(dataList)=>{
       if(dataList.children){
           return  dataList.children.map((item)=>{
                   return <TreeNode   value={ String(item.id)}   title={item.name} key={item.id} > { this.getMenu(item) } </TreeNode>
                   })
       }
       else {  return  }
   }
    dShow=()=>{
     this.props.goAddProduct()
    }
    UNSAFE_componentWillMount(){
        services.warehouseList( { keys: {name: 'store/warehouse/list'}  } ).then(res=>{
            this.setState({
                warehouseList:res.list,
            })
        })
        services.productUnit(  { keys: {name: 'store/unit/list'}  }  ).then(res=>{
            this.setState({
                productUnit:res.list,
            })
        })
    }
    handleSubmit=(e)=>{
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if(!err){

                let o ={ ...values }
                o.consume=0
                if(!values.minimumStock) o.minimumStock=0
                services.insert({data: o, keys: {'name': 'store/product'}}).then(res => {
                    if(res.code==='0'){
                        message.success('添加成功!')
                        this.dShow()

                    }else{
                        message.error(res.content)

                    }
                })
            }
        })
    }
    render(){
        const { warehouseList,productUnit } =this.state
        const { productTypeList } =this.props
        const { getFieldDecorator } = this.props.form
        return(
                  <div className={ styles.zl_mast }  >
                       <div className={ styles.zl_mast_content } >
                         <p  style={{ border:'0 none',marginRight:0 }} >新建商品 <span onClick={ this.dShow  } ><i  className="iconfont icon-quxiao" ></i></span> </p>
                         <div className={ styles.zl_form } >
                         <Form onSubmit={this.handleSubmit}  layout="inline" style={{ padding:'0 40px 34px 40px ',overflowY:'auto' }} >
                            <p>基本信息</p>
                            <FormItem   style={ { marginBottom:'40px' } }  hasFeedback  label="商品名称" >
                            {getFieldDecorator(
                              'productName',
                              validate("产品名称", {
                                required: true,
                                max: 30,
                                type: "string",
                                sole: true,
                                key: 'name',
                                model: 'Product',
                                _var: { '_': Number(localStorage.getItem('coiling')) === 1 ? '1|2' : 2, commodity_code: this.state.commodity_code},
                              })
                            )(
                                <Input 
                                placeholder="输入产品名称" 
                                onChange={(e) => {
                                    this.setState({product_name: e.target.value}, () => {
                                      this.props.form.validateFields(['commodityCode'],{force: true})
                                    })
                                }}
                                />
                            )}
                            </FormItem>

                            <FormItem hasFeedback  style={{ float:'right',marginBottom:'38px' }}  label="编码" >
                            {getFieldDecorator(
                              'commodityCode',
                              validate("编码", {
                                required: true,
                                max: 30,
                                sole: true,
                                model: 'Product',
                                _var:  { '_': Number(localStorage.getItem('coiling')) === 1 ? '1|2' : 2, product_name: this.state.product_name},
                              })
                            )(
                                <Input  
                                placeholder="编码"  
                                onChange={(e) => {
                                    this.setState({commodity_code: e.target.value}, () => {
                                      this.props.form.validateFields(['productName'],{force: true})
                                    })
                                }}
                                />
                            )}
                            </FormItem>

                            <FormItem    style={ { marginBottom:'40px' } }  hasFeedback  label="单位" >
                            {getFieldDecorator('unitId', {
                                rules: [{ required: true, message: '请填写商品单位' }],
                            })(
                                <Select   placeholder="选择单位" style={{ width: 350  }}  size='large'>
                                  {
                                    productUnit.map(v => {
                                        return <Option key={v} value={v.unitId}>{v.unitName}</Option>
                                    })
                                }
                                </Select>
                            )}
                            </FormItem>

                              <FormItem hasFeedback  style={{ float:'right',marginBottom:'38px',position:'relative' }}  label="销售价格" >
                            {getFieldDecorator('sellingPriceTem', {
                                rules: [{ required: true, message: '请填写商品销售价格' }],
                            })(
                                <InputNumber min={0} style={ { width:'350px',height:'41px' } }  placeholder="输入金额" />
                               
                            )}
                             <span className={ styles.zl_yuan } >元</span>
                            </FormItem>

                             <FormItem    style={ { marginBottom:'40px' } }  hasFeedback  label="所属分类" >
                            {getFieldDecorator('categoryId', {
                                rules: [{ required: true, message: '请填写商品分类' }],
                            })(


                                <TreeSelect
                                showSearch
                                size="large"
                                style={ {width:350 } }
                                dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                                placeholder="请选择分类"
                                allowClear
                                treeDefaultExpandAll
                                onChange={this.onChange}
                                >
                                {
                                        productTypeList.map((item)=>{
                                            return <TreeNode  value={ String(item.id) }   style={ { width:350 } }    title={item.name} key={item.id}  > { this.getMenu(item) } </TreeNode>
                                        })
                                }
                                </TreeSelect>


                            )}
                            </FormItem>

                              <FormItem hasFeedback  style={{ float:'right',marginBottom:'38px' }}  label="配件属性" >
                            {getFieldDecorator('accessoryProperties', {

                            })(
                                 <Select   placeholder="选择分类" style={{ width: 350  }}  size='large'>
                                        <Option style={{ width: 350 ,zIndex:5000 }}  key={1}  value="1">原厂</Option>
                                        <Option style={{ width: 350 ,zIndex:5000 }}  key={2}  value="2">同质</Option>
                                        <Option style={{ width: 350 ,zIndex:5000 }}  key={3}  value="3">修复</Option>
                                        <Option style={{ width: 350 ,zIndex:5000 }}  key={4}  value="4">其他</Option>
                                  </Select>
                            )}
                            </FormItem>

                            <FormItem   style={ { marginBottom:'40px' } }  hasFeedback  label="条形码" >
                            {getFieldDecorator(
                              'barCodeNumber',
                              validate("条形码", {
                                required: true,
                                max: 30,
                                type: "number",
                                sole: true,
                                model: 'Product',
                              })
                            )(
                                <Input    placeholder="输入条形码"
                                />
                            )}
                            </FormItem>

                            <FormItem hasFeedback  style={{ float:'right',marginBottom:'40px' }}  label="型号" >
                            {getFieldDecorator('modelTem', {
                            })(
                                <Input  placeholder="输入型号" />
                             )}
                            </FormItem>

                              <FormItem hasFeedback  style={{ marginBottom:'40px' }}  label="规格" >
                            {getFieldDecorator('specificationTem', {
                            })(
                                <Input  placeholder="输入规格" />
                            )}
                            </FormItem>
                            <p>库存信息</p>

                            <FormItem   style={ { marginBottom:'40px' } }  hasFeedback  label="默认仓库" >
                            {getFieldDecorator('warehouseId', {
                            })(
                                <Select  onChange={ this.changeType }  placeholder="选择默认仓库" style={{ width: 350 }}  size='large'>
                               {
                                   warehouseList.map(item => (
                                    <Option key={item.warehouseId}  value={item.warehouseId}>{item.warehouseName}</Option>
                                    ))
                               }
                               </Select>
                           )}
                            </FormItem>

                            <FormItem hasFeedback  style={{ float:'right',marginBottom:'38px' }}  label="最低库存" >
                            {getFieldDecorator('highestInventory',
                             {
                              
                            })(
                                <InputNumber  max={9999999}  min={0} style={ { width:'350px',height:'41px' } }  placeholder="最低库存" />
                             )}
                            </FormItem>

                             <FormItem hasFeedback  style={{ marginBottom:'40px' }}  label="最高库存" >
                            {getFieldDecorator('minimumStock',
                             {
                                  
                            })(
                                <InputNumber  max={9999999}  style={ { width:'350px',height:'41px' } }  placeholder="最高库存" />
                             )}
                            </FormItem>

                            <FormItem hasFeedback  style={{ float:'right' }}  label="备注" >
                            {getFieldDecorator('remark', {
                            })(
                                <Input  style={ { height:'80px' } } />
                             )}
                            </FormItem>
                            {/* <FormItem   style={{ float:'right' }}  label="" >
                            {getFieldDecorator('consume', {
                            })(
                                <Input value="0"  style={ { height:'80px' } }  type='hidden' />
                             )}
                            </FormItem> */}
                            <FormItem    >
                                        <Button  style={{ marginLeft:'77px',marginTop:'40px' }}  type="primary" htmlType="submit"   >
                                           发布
                                        </Button>
                            </FormItem>



                             <Button style={ { marginTop:'40px' }} onClick={ this.dShow } >取消</Button>

                         </Form>
                         </div>
                       </div>
                  </div>
               )
    }
   }
   export default Form.create()(Add)
