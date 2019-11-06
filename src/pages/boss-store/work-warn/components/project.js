import React, { Component } from 'react'
import  styles  from '../style.less'
import { Button,Table,Input,Tree,Icon,Tag } from "antd"
import services from '../../../../services'
// import { connect } from 'dva'
const { TreeNode } = Tree
class Project extends Component {
    constructor(props){
        super(props)
        this.state={
          data:[
            {
              projectName:'大保健',
              commodityCode:'0101',
              priceTem:1321321,          
              },
            {
              projectName:'大保健',
              commodityCode:'13213131',
              priceTem:1231212,
            },
            {
              projectName:'大保健',
              commodityCode:'sasldlasdj',
              priceTem:1212121,
            },
            {
              commodityCode:'44234344',
              projectName:'大保健',
              priceTem:63463545,
            },
          ],
          category:[],
          productList:[],
        }
    }
    UNSAFE_componentWillMount(){
      services.list({keys:{name:'store/projectcategory'}}).then(res=>{
        console.log('res',res)
        this.setState({
          category:res.list,
        })
      })
      services.list({keys:{name:'store/order/product'}}).then(res=>{
        this.setState({
          productList:res.list,
        })
        console.log('ressdfadf',res.list)
      })
    }
    onSelect = (selectedKeys, info) => {
      services.list({keys:{name:'store/order/product'},data:{q:{where:{'categoryId[~]':selectedKeys[0]}}}}).then(res=>{
        this.setState({
          productList:res.list,
        })
      })
      }
  render() {
    const {data,category,productList} =this.state
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode key={item.categoryId} title={item.categoryName}>{loop(item.children)}</TreeNode>
      }
      return <TreeNode key={item.categoryId} title={item.categoryName} />
    })
    const selected = category.length ? [String(category[0].categoryId)] : []
     const columns = [{
       title:'项目名称',
       dataIndex:'productName',
     },
     {title:'项目编码',
     dataIndex:'commodityCode',
    },
    {
      title:'售价',
      dataIndex:'priceTem',
    },
    ]
    return (
      <div className={styles.addProject}>
  <div style={{marginBottom:'12px'}}><Input placeholder='名称/编码' style={{ width: '125px' }} prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
        >
        </Input>
          <Button type="primary" style={{ width: '44px',padding:'0',textAlign:'center', marginLeft: '10px' }}>查询</Button>
          <Button style={{ width: '44px',padding:'0',textAlign:'center', marginLeft: '10px' }}>重置</Button>
        </div>
        <div style={{display:'flex',border:'1px solid #f4f4f4'}}>
          <div style={{width:'109px',borderRight:'1px solid #f4f4f4'}}>
            <div className={styles.treeHeader} >项目分类</div>
            <div style={{borderRight:'1px solid #f4f4f4'}}>
            {selected.length&&<Tree
              showLine
              defaultSelectedKeys={selected}
              onSelect={this.onSelect.bind(this)}
            >{loop(category)}
            </Tree>}
            </div>
          </div>
          <div className={styles.modalTable} style={{flex:'1'}}>
            <Table rowSelection={{type:'radio',columnWidth:'1'}} dataSource={productList} pagination={false} columns={columns}></Table>
          </div>
        </div>
        <div style={{marginTop:'12px'}}><span style={{color:'#333333',marginRight:'10px'}}>已选择</span> <Tag style={{borderColor:'#4AACF7'}}>
           爱丽
            </Tag></div>
      </div>
    )
  }
}
// function mapStateToProps(state) {
//   const { editItem } = state.cards
//   return { editItem }
// }
// export default connect(mapStateToProps)(Index)
export default Project

