import {
  faEllipsisVertical,
  faExpand,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, Layout, Segmented, Select, Space, Tooltip } from 'antd'
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

const PersonalScore = () => {
  const [value, setValue] = useState<string | number>('This week')
  const [toolTipTitle, setToolTipTitle] = useState('prompt text')
  const [hideTooltip, setHideTooltip] = useState(false)
  return (
    <Card
      title="Personal Score"
      style={{ width: '20%' }}
      headStyle={{ backgroundColor: '#eeeeee' }}
      extra={
        <>
          <FontAwesomeIcon
            icon={faRefresh}
            size="lg"
            style={{ marginRight: '10px' }}
          />
          <FontAwesomeIcon icon={faExpand} size="lg" />
        </>
      }
    >
      <Space
        direction="horizontal"
        align="center"
        style={{ float: 'right', marginBottom: '10px', width: 'auto' }}
      >
        <p style={{ float: 'left', width: 'auto' }}></p>
        <Segmented
          options={['This week', 'This month', 'This year']}
          value={value}
          onChange={(e) => {
            setValue(e)
          }}
        />
        <ExportMenu />
      </Space>

      <p style={{ fontSize: '90px', textAlign: 'center' }}>
        {hideTooltip === false ? (
          <Tooltip
            title={toolTipTitle}
            color="#eeeeee"
            placement="left"
            overlayInnerStyle={{ color: 'black' }}
          >
            90
          </Tooltip>
        ) : (
          <p>90</p>
        )}
      </p>
    </Card>
  )
}

export default PersonalScore
