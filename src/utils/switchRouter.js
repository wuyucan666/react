// 匹配一项可以进入的路由

const switchRouter = (permissions) => {
  let path = ''
  const permissionRoles = JSON.parse(localStorage.getItem('permissionRole'))
  for(let i = 0; i < permissions.length; i++){
    if(permissionRoles.indexOf(permissions[i].key) > -1){
      path = permissions[i].path
      break
    }
  }
  return path
}

export default switchRouter
