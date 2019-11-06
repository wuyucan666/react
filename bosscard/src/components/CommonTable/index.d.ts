export interface CommonTable {
	/**
	 * 表格的模块名称
	 *
	 * 此模块名对应后端接口的模块地址
	 *
	 * 需要在uilts/table.js下配置 name: {} 之后可以正常运行
	 *
	 */
  name: string;
	/**
	 * 是否是新业务表格
	 *
	 * 新业务表格的所有接口遵守RESTful
	 *
	 * https://baike.baidu.com/item/RESTful/4406165?fr=aladdin
	 */
  New?: boolean;
	/**
	 * 是否开始mock数据获取
	 *
	 * 开启之后，相当于services服务请求时带上proxy代理
	 *
	 * 所有数据由eolinker平台对应模块的mock规则生成
	 */
  mock?: boolean;
	/**
	 * 当配置的按钮被点击时
	 *
	 * 通过当前函数监听所有的按钮事件
	 * @param type 当前触发事件的类型
	 * @param item 当前触发事件的row数据
	 */
  onTableChange?: (type: number, item: any) => any;
	/**
	 * 当数据已经获取，render到表格组件之前的事件
	 *
	 * 可以用来对数据进行二次处理
	 * @param data 当前表格即将使用的数据
	 */
  onDataChangeBefore?: (data: Array<any>, total: any) => any;
	/**
	 * 重置之后的事件
	 */
  onReSet?: () => any;

  /**表格配置 */
  tableConfig: TableConfig;
}

export interface TableConfig {
  /**唯一id 每一行数据的key*/
  id: string;
  /**是否横向滚动 */
  isScroll?: boolean;
  /**是否有总计数据行 */
  hasTotal?: boolean;
  /**选择项计算合计 */
  selectTotal?: boolean;
  /**筛选条件项 */
  screen?: Screen;
  /**操作按钮集合 */
  moreBtn: Btn[];
  /**表格头配置 */
  headers: HeadersItem[];
  /**是否隐藏序号 */
  hideFirstCol?: boolean;
  /**是否需要选择框 */
  hasCheck?: boolean;
  /**是否隐藏分页 */
  hidePagenation?: boolean;
}
export interface Screen {
  /**最外层的条件，与 q 同级，请求不同类型的数据 */
  wrapperQuery?: any;
  /**默认的查询条件，重置之后不会被清空，但会被控件值覆盖/ */
  query?: any;
  /**默认的排序条件，没有重置，但会被控件值覆盖, 只能同时排序一个字段
   *
   * ascend 降序
   *
   * descend 升序
   */
  order?: { [key: string]: 'descend' | 'ascend' }
  /**查询规则列表 */
  rules: RulesItem[];
}
interface RulesItem {
  /**
   * 类型
   *
   * date 日期筛选
   *
   * date<> 日期范围筛选
   *
   * month 月份筛选
   *
   * text 文字筛选，不显示label，可同时筛选多个字段
   *
   * text-cell 文字筛选，显示label
   *
   * list 下拉列表单选
   *
   * check 开关勾选框
   *
   * component 自定义组件
   *
   * tree 树形选择
   * */
  type: 'date' | 'date<>' | 'month' | 'text' | 'text-cell' | 'list' | 'check' | 'component' | 'tree';
  /**默认提示 */
  placeholder?: string;
  /**字段名称 */
  prop: string;
  /**字段显示的中文名称 */
  label?: string;
  /**类型为筛选时，待选择列表 */
  list?: RulesItemListItem[];
  /**当前筛选组件的默认值，只会被当前控件值覆盖，在所有默认值里优先级最高，且不会被重置清空 */
  defaultValue?: any
  /**筛选项宽度倍数 默认为1 */
  converWidth?: number
}
interface HeadersItem {
  /**字段显示的中文名称 */
  name: string;
  /**字段名称 */
  prop: string;
  /**当前列的宽度 */
  width: string;
	/**渲染方法
   * 所有渲染方式中，优先级最高
	 * @param record 表格行数据
	 */
  render?: (record: any, text: any) => any;
  /**渲染类型
   *
   * switch 状态类型的渲染
   */
  contentType?: 'switch';
  /**表头是否排序 */
  sortFilterType?: 'sort';
}

interface Btn {
  /**按钮名称 */
  name: string;
  /**按钮用到的 icon class 名称 */
  icon?: string;
  /**类型
   *
   * 200 以下显示在表格内最后一列，用来控制每一行的数据
   *
   * 200 以上显示在表格外面，用来控制选中的数据
   *  */
  type: number;
  /**按钮的权限，没有权限时，置灰 */
  power?: string;
  /**按钮的颜色 */
  btnColor?: string;
  /**是否显示按钮
   *
   * @param record {Object} 当前行数据
   */
  show?: (record) => any
}

interface RulesItemListItem {
  name: string;
  /**如果是 ‘全部’ 选项  设置为 -999 */
  value: any;
}

/**
 * 全局通用业务表格
 * @param opts CommonTable Component Props
 */
export default function (opts: CommonTable): any;
