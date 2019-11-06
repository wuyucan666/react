
import List from './list'
import { Button } from 'antd'
const Cards = ({ data, deleteItem, setSingle, Show } ) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <List title='项目折扣' 
            type="1" 
            show="categoryName"
            data={data.projectSelect} 
            deleteItem={deleteItem} 
            showDc={() => Show(1)}
            setSingle={setSingle}
            >
            </List>
            {
              data.projectSelect.length === 0 &&
              <Button type="dashed" onClick={() => Show(1)} size="large">添加项目分类</Button>
            }
          </td>
          <td>
            <List title='产品折扣' 
            type="2" 
            show="categoryName"
            data={data.productSelect} 
            deleteItem={deleteItem} 
            showDc={() => Show(2)}
            setSingle={setSingle}
            >
            </List>
            {
              data.productSelect.length === 0 &&
              <Button type="dashed" onClick={() => Show(2)} size="large">添加产品分类</Button>
            }
          </td>
          <td>
            <List title='特殊项目折扣' 
            type="3"
            show="projectName"
            showDc={() => Show(3)}
            data={data.projectItem} 
            deleteItem={deleteItem} 
            setSingle={setSingle}
            >
            </List>
            {
              data.projectItem.length === 0 &&
              <Button type="dashed" onClick={() => Show(3)} size="large">添加项目</Button>
            }
          </td>
          <td>
            <List title='特殊产品折扣' 
            type="4"
            show="productName"
            showDc={() => Show(4)}
            data={data.productItem} 
            deleteItem={deleteItem} 
            setSingle={setSingle}
            >
            </List>
            {
              data.productItem.length === 0 &&
              <Button type="dashed" onClick={() => Show(4)} size="large">添加产品</Button>
            }
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default Cards