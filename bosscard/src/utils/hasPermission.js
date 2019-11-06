export default function (permission) {
  const permissionRole = JSON.parse(localStorage.getItem('permissionRole'))
  return permissionRole.includes(permission)
}
