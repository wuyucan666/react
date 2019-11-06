import {Tree} from 'antd'
import style from './style.less'
export default ({list, onSelect, type}) => {
  const {TreeNode} = Tree

  const loop = data => data.map((item) => {
    if (item.children && item.children.length) {
      return <TreeNode key={item.categoryId} title={item.categoryName}>{loop(item.children)}</TreeNode>
    }
    return <TreeNode key={item.categoryId} title={item.categoryName} />
  })
  const selected = list.length ? [String(list[0].categoryId)] : []
  return (
    <div className={style.tree}>
      <div className='tree-head'>
        {type === 2 ? '产品' : '项目'}分类
      </div>
      <div className='tree-body'>
      {
        selected.length ? 
        <Tree showLine onSelect={onSelect} defaultSelectedKeys={selected}>
          {loop(list)}
        </Tree>
        : null
      }
      </div>
    </div>
  )
}
