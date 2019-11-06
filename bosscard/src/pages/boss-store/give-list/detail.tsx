import { Modal, Table } from 'antd';
import moment = require('moment');

/**赠送明细 */
export default function DetailModal({ data, show, close }) {
  /**渲染有效期 */
  const handleRendleDeadlineTime = time => time === -1 ? '永久' : moment.unix(time).format('YYYY-MM-DD hh:mm');

  return (
    <Modal
      visible={show}
      onOk={close}
      onCancel={close}
      title="赠送详情"
      width={570}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Table dataSource={data}>
        <Table.Column title="名称" dataIndex="name" />
        <Table.Column title="分类" dataIndex="type" />
        <Table.Column title="数量" dataIndex="num" />
        <Table.Column title="有效期" dataIndex="deadlineTime" render={handleRendleDeadlineTime} />
      </Table>
    </Modal>
  );
}
