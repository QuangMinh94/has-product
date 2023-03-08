import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dropdown, MenuProps } from 'antd'

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        Export to csv
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        Export to xlsx
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        Export to pdf
      </a>
    ),
  },
]

const ExportMenu = () => {
  return (
    <Dropdown
      menu={{ items }}
      placement="bottomLeft"
      trigger={['click']}
      arrow={{ pointAtCenter: false }}
    >
      <FontAwesomeIcon icon={faEllipsisVertical} size="lg" cursor="pointer" />
    </Dropdown>
  )
}

export default ExportMenu
