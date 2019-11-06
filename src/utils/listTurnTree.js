/**
 * list 数据转 tree 常用于下拉树形
 * stone
 * @param myId 当前id
 * @param pId  父级id
 * @param list
 * @returns {Array}
 */

export default function listTurnTree(myId,pId,list){
  let exists = (list, parentId) => {
    for(let i=0; i<list.length; i++){
      if (list[i][myId] === parentId) return true
    }
    return false
  }
  let nodes = []
  for(let i = 0; i<list.length; i++){
    let row = list[i]
    if (!exists(list, row[pId])){
      nodes.push(row)
    }
  }

  let toDo = []
  for(let i = 0; i<nodes.length; i++){
    toDo.push(nodes[i])
  }
  while(toDo.length){
    let node = toDo.shift()
    for(let i = 0; i<list.length; i++){
      let row = list[i]
      if (row[pId] === node[myId]){

        if (node.children){
          node.children.push(row)
        } else {
          node.children = [row]
        }
        toDo.push(row)
      }
    }
  }
  return nodes
}
