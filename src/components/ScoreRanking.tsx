import {
  faEllipsisVertical,
  faExpand,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, Layout, Segmented, Select, Space } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import ExportMenu from './ExportMenu'

const { Content } = Layout

interface DataType {
  key: string
  name: React.ReactNode
  department: React.ReactNode
  score: React.ReactNode
}

const columns: ColumnsType<DataType> = [
  {
    title: 'STT',
    dataIndex: 'key',
    align: 'center',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Department',
    dataIndex: 'department',
    align: 'center',
  },
  {
    title: 'Score',
    dataIndex: 'score',
    align: 'center',
  },
]

const dataSource = [
  {
    key: '1',
    name: 'Johnathan John',
    department: 'HR',
    score: 10,
  },
  {
    key: '2',
    name: 'Anna',
    department: 'IT',
    score: 20,
  },
]

const ScoreRanking = () => {
  const [value, setValue] = useState<string | number>('This week')
  return (
    <Card
      title="Score ranking"
      style={{ width: '50%' }}
      headStyle={{ backgroundColor: '#eeeeee' }}
      extra={
        <>
          <FontAwesomeIcon
            icon={faRefresh}
            size="lg"
            style={{ marginRight: '10px' }}
          />
          <FontAwesomeIcon icon={faExpand} size={'lg'} />
        </>
      }
      onResize={(e) => console.log(e)}
    >
      <div style={{ marginBottom: '10px' }}>
        <Select
          showSearch
          style={{ width: 200 }}
          defaultValue="Not Identified"
          onSelect={(e) => console.log(e)}
          placeholder="Search to Select"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '').includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={[
            {
              value: '1',
              label: 'Not Identified',
            },
            {
              value: '2',
              label: 'Closed',
            },
            {
              value: '3',
              label: 'Communicated',
            },
            {
              value: '4',
              label: 'Identified',
            },
            {
              value: '5',
              label: 'Resolved',
            },
            {
              value: '6',
              label: 'Cancelled',
            },
          ]}
        />
        <Space direction="horizontal" align="center" style={{ float: 'right' }}>
          <Segmented
            options={['This week', 'This month', 'This year']}
            value={value}
            onChange={(e) => {
              setValue(e)
            }}
          />
          <ExportMenu />
        </Space>
      </div>
      <Table
        rowClassName={(record, index) => 'table-row'}
        showHeader={false}
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        size="middle"
      />
    </Card>
  )
}

export default ScoreRanking
