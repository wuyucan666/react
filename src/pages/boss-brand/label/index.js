/**
 * Created by kikazheng on 2019/4/4
 */
import { Component } from "react"
import {Button, Table, Spin, Tooltip, message} from 'antd'

import Add from './components/Add'
import LabelBox from './components/LabelBox'
import services from '../../../services'
import empty from './imgs/none.png'
import style from  './style.less'


const {Column} = Table

class Index extends Component{
  state = {
    loading: false,
    editItem: {},
    add: false,
    list: [],
  }
  componentDidMount(){
    this.getList()
  }
  getList = () => {
    this.setState({loading: true})
    services.LIST({keys: {name: 'clientLabel/labelType'}}).then(res => {
      this.setState({loading: false})
      if(res.success){
        this.setState({
          list: res.list,
        })
      }
    }).catch(() => {
      this.setState({loading: false})
      message.error('请求出错')
    })
  }
  toggleAdd = () => {
    this.setState((preState) => {
      return {
        editItem: {},
        add: !preState.add,
      }
    })
  }
  handleEdit = (editItem) => {
    this.setState({
      add: true,
      editItem,
    })
  }
  render(){
    const {list, add, editItem, loading} = this.state
    return(
      <Spin spinning={loading}>
        <div className={style.labels}>
          <div className='flex center between'>
            <span>为顾客创建一些常用的标签，例如收入水平、兴趣爱好等，可以更加精细的管理顾客，提升顾客服务体验。</span>
            <Button type='primary' size='large' icon='plus' onClick={this.toggleAdd}>新建分类</Button>
          </div>
          {
            !!list.length ? (
              <Table
                style={{marginTop: 30}}
                rowKey={record => record.id}
                dataSource={list}
                pagination={false}
              >
                <Column
                  title="序号"
                  dataIndex="index"
                  key="index"
                  render={(text,record, index) => ++index}
                />
                <Column
                  title="标签分类"
                  dataIndex="classify"
                  key="classify"
                />
                <Column
                  title="标签"
                  dataIndex="label"
                  key="label"
                  render={(text,record) => (
                    <div className={style.labelBox}>
                      {
                        record.label.map(item => (
                          <LabelBox
                            key={item.labelId}
                            id={record.id}
                            data={item}
                            onOk={this.getList}
                          />
                        ))
                      }
                      <LabelBox
                        id={record.id}
                        data={{}}
                        onOk={this.getList}
                      />
                    </div>
                  )}
                />
                <Column
                  title=" "
                  dataIndex="action"
                  key="action"
                  render={(text, record) => (
                    <div className={style.action}>
                      <Tooltip title="修改标签分类">
                        <span className='iconfont icon-bianji' onClick={() => this.handleEdit(record)}/>
                      </Tooltip>
                    </div>
                  )}
                />
              </Table>
            ):(
              <div className={style.empty}>
                <img className='animated bounceIn' src={empty} alt="暂无数据"/>
                <div>暂无顾客相关标签</div>
                <Button type='primary' size='large' onClick={this.toggleAdd}>新建标签分类</Button>
              </div>
            )
          }
          <Add
            visible={add}
            editItem={editItem}
            toggle={this.toggleAdd}
            onOk={this.getList}
          />
        </div>
      </Spin>
    )
  }
}

export default Index
