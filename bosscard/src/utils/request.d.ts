
/**请求数据方法 */
declare function request(options: Options): Promise<any>;

interface Options {
  method?: 'get' | 'post' | 'delete' | 'put'
  url: string
  data?: any
  /**当前请求的唯一标识 */
  key?: any
  proxy?: boolean
}

export default request
