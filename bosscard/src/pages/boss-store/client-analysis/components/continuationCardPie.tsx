import React, { Component } from 'react';
import services from 'services';
import Title from './title';
import { Select, Spin } from 'antd';
import * as moment from 'moment';
import { G2, Chart, Geom, Tooltip, Coord, Guide } from 'bizcharts';

G2.Global.renderer = 'svg'

interface Props { }

interface State {
  data: Data;
  loading: boolean;
  created: Array<number>;
  selected: '1' | '2';
}

/**服务端数据格式 */
interface Data {
  /**计次卡续卡率 */
  cardRecordsRate: string;
  /**充值卡续卡率	 */
  cardSpeciesRate: string;
  car: Car;
  clientType: ClientType;
}
interface Car {
  /**会员车辆	 */
  clientVehicles: string;
  /**散客车辆	 */
  touristVehicles: string;
}
/**用户类型	 */
interface ClientType {
  /**个人 */
  personal: number;
  /**企业 */
  enterprise: number;
}

const { Option } = Select;
const { Html } = Guide;

const selectMonthUnixs = {
  '1': [
    moment()
      .startOf('month')
      .unix(),
    moment()
      .endOf('month')
      .unix()
  ],
  '2': [
    moment()
      .subtract(1, 'month')
      .startOf('month')
      .unix(),
    moment()
      .subtract(1, 'month')
      .endOf('month')
      .unix()
  ]
};

/**顾客及续卡分析 圆环进度图表 */
export default class ContinuationCardPie extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        cardRecordsRate: '',
        cardSpeciesRate: '',
        car: {
          clientVehicles: '0',
          touristVehicles: '0'
        },
        clientType: {
          personal: 0,
          enterprise: 0
        }
      },
      loading: true,
      created: selectMonthUnixs['1'], // 筛选时间用的时间戳范围
      selected: '1'
    };
  }

  componentWillMount() {
    this.getData();
  }
  getData() {
    this.setState({ loading: true });
    services
      .LIST({
        keys: { name: 'store/index/client' },
        data: { q: { where: { 'created[<>]': this.state.created } } }
      })
      .then(res => {
        if (res.code === '0') {
          this.setState({
            data: res.data,
            loading: false
          });
        }
      });
  }
  /**监听选择框 */
  handlerSelectChange(value) {
    this.setState({ selected: value, created: selectMonthUnixs[value] }, this.getData);
  }
  render() {
    const carPieData = [
      {
        label: '散客车辆',
        count: Number(this.state.data.car.touristVehicles)
      },
      {
        label: '会员车辆',
        count: Number(this.state.data.car.clientVehicles)
      },
      {}
    ];
    const clientPieData = [
      {
        label: '个人客户',
        count: Number(this.state.data.clientType.personal)
      },
      {
        label: '单位客户',
        count: Number(this.state.data.clientType.enterprise)
      }
    ];
    /** 充值卡续卡率 */
    const cardSpeciesRate = [
      {
        label: '未完成',
        count: (10000 - parseFloat(this.state.data.cardSpeciesRate) * 100) / 100
      },
      {
        label: '充值卡续卡率',
        count: parseFloat(this.state.data.cardSpeciesRate)
      }
    ];

    /** 计次卡续卡率 */
    const cardRecordsRate = [
      {
        label: '未完成',
        count: (10000 - parseFloat(this.state.data.cardRecordsRate) * 100) / 100
      },
      {
        label: '充值卡续卡率',
        count: parseFloat(this.state.data.cardRecordsRate)
      }
    ];
    const colors: [string, string[]] = ['label', ['#1890FF', '#F04864']];
    const progressColors: [string, string[]] = ['label', ['#eceef1', '#1890FF']];

    const cars: number = Number(this.state.data.car.clientVehicles) + Number(this.state.data.car.touristVehicles);

    /**散客车辆率 */
    const touristVehiclesRate = (cars !== 0
      ? (Number(this.state.data.car.touristVehicles) / cars) * 100
      : 0
    ).toFixed(2);
    /**会员车辆率 */
    const clientVehiclesRate = (cars !== 0 ? (Number(this.state.data.car.clientVehicles) / cars) * 100 : 0).toFixed(
      2
    );

    const clients: number =
      Number(this.state.data.clientType.enterprise) + Number(this.state.data.clientType.personal);

    /** 企业会员率 */
    const enterpriseRate = (clients !== 0
      ? (Number(this.state.data.clientType.enterprise) / clients) * 100
      : 0
    ).toFixed(2);
    /** 企业会员率 */
    const personalRate = (clients !== 0
      ? (Number(this.state.data.clientType.personal) / clients) * 100
      : 0
    ).toFixed(2);

    return (
      <div style={{ gridColumnEnd: 'span 4' }}>
        <Title title="客户/续卡分析">
          <div className="select-component">
            <Select
              size="large"
              style={{ width: 140, marginTop: -30 }}
              value={this.state.selected}
              onChange={this.handlerSelectChange.bind(this)}
            >
              <Option value="1">本月</Option>
              <Option value="2">上月</Option>
            </Select>
          </div>
        </Title>
        <div className="continuation-card-pie">
          <div className="flex center top">
            <div style={{ width: '100%' }}>
              <div className="flex center" style={{ lineHeight: 1, padding: '30px 0 20px 0' }}>
                散客/会员车辆占比
							</div>
              <Spin spinning={this.state.loading}>
                <div className="pie-wrap">
                  <Chart height={220} padding={'auto'} data={carPieData} forceFit >
                    <Coord type="theta" innerRadius={0.75} />
                    <Tooltip showTitle={false} />
                    <Geom
                      type="intervalStack"
                      position="count"
                      color={colors}
                      shape="sliceShape"
                      select={false}
                    />
                  </Chart>
                </div>
                <div className="color-tip flex center column">
                  <div className="flex center left">
                    <div className="color" style={{ background: '#1890FF' }} />
                    <div className="text">
                      散客车辆： {this.state.data.car.touristVehicles}， {touristVehiclesRate}%
										</div>
                  </div>
                  <div className="flex center left">
                    <div className="color" style={{ background: '#F04864' }} />
                    <div className="text">
                      会员车辆： {this.state.data.car.clientVehicles}， {clientVehiclesRate}%
										</div>
                  </div>
                </div>
              </Spin>
            </div>
          </div>
          <div className="flex center top">
            <div style={{ width: '100%' }}>
              <div className="flex center" style={{ lineHeight: 1, padding: '30px 0 20px 0' }}>
                个人/单位客户占比
							</div>
              <Spin spinning={this.state.loading}>
                <div className="pie-wrap">
                  <Chart height={220} padding={'auto'} data={clientPieData} forceFit >
                    <Coord type="theta" innerRadius={0.75} />
                    <Tooltip showTitle={false} />
                    <Geom
                      type="intervalStack"
                      position="count"
                      color={colors}
                      shape="sliceShape"
                      select={false}
                    />
                  </Chart>
                </div>
                <div className="color-tip flex center column">
                  <div className="flex center left">
                    <div className="color" style={{ background: '#1890FF' }} />
                    <div className="text">
                      个人客户： {this.state.data.clientType.personal}， {personalRate}%
										</div>
                  </div>
                  <div className="flex center left">
                    <div className="color" style={{ background: '#F04864' }} />
                    <div className="text">
                      单位客户： {this.state.data.clientType.enterprise}， {enterpriseRate}%
										</div>
                  </div>
                </div>
              </Spin>
            </div>
          </div>
          <div className="flex center top">
            <div style={{ width: '100%' }}>
              <div className="flex center" style={{ lineHeight: 1, padding: '30px 0 20px 0' }}>
                充值卡续卡率
							</div>
              <Spin spinning={this.state.loading}>

                <div className="pie-wrap">
                  <Chart height={220} padding={'auto'} data={cardSpeciesRate} forceFit >
                    <Coord type={'theta'} innerRadius={0.75} />
                    <Guide>
                      <Html
                        position={['50%', '50%']}
                        html={`<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;"><span style="color:#262626;font-size:2.5em">${parseFloat(
                          this.state.data.cardSpeciesRate
                        ).toFixed(1)}</span>%</div>`}
                        alignX="middle"
                        alignY="middle"
                      />
                    </Guide>
                    <Geom
                      color={progressColors}
                      type="interval"
                      position="count"
                      select={false}
                      active={false}
                    />
                  </Chart>
                </div>

                <div className="bottom-tip flex center">
                  <i className="iconfont icon-wenhao" />
                  统计周期内，续充值卡订单/办充值卡订单
								</div>
              </Spin>
            </div>
          </div>
          <div className="flex center top">
            <div style={{ width: '100%' }}>
              <div className="flex center" style={{ lineHeight: 1, padding: '30px 0 20px 0' }}>
                计次卡续卡率
							</div>
              <Spin spinning={this.state.loading}>

                <div className="pie-wrap">
                  <Chart height={220} padding={'auto'} data={cardRecordsRate} forceFit >
                    <Coord type={'theta'} innerRadius={0.75} />
                    <Guide>
                      <Html
                        position={['50%', '50%']}
                        html={`<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;"><span style="color:#262626;font-size:2.5em">${parseFloat(
                          this.state.data.cardRecordsRate
                        ).toFixed(1)}</span>%</div>`}
                        alignX="middle"
                        alignY="middle"
                      />
                    </Guide>
                    <Geom
                      color={progressColors}
                      type="interval"
                      position="count"
                      select={false}
                      active={false}
                    />
                  </Chart>
                </div>

                <div className="bottom-tip flex center">
                  <i className="iconfont icon-wenhao" />
                  （办记次卡数-第一次办计次卡数）/办计次卡数
								</div>
              </Spin>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
