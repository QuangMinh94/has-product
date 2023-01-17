import { Dropdown, MenuProps, Select, Space, Tag, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Users } from '../data/database/Users'
import IconGroup from './IconGroup'
import UserIcon from './UserIcon'

interface UserData {
  userData: Users[]
  maxCount: number
  icon: React.ReactNode
  tooltipText?: string
}

const UserListComp: React.FC<UserData> = ({
  userData,
  maxCount,
  icon,
  tooltipText,
}) => {
  const [data, setData] = useState<Users[]>(userData)
  const [assignee, setAssignee] = useState<Users[]>(userData)

  let items: MenuProps['items'] = []

  const AddAssignee = (id: string) => {
    data.filter((obj) => {
      if (obj._id === id) {
        // assignees.push(obj)
        setAssignee([...assignee, obj])
        return assignee
      }
    })
  }

  for (let index = 0; index < data.length; index++) {
    items?.push({
      label: (
        <Space size="small" align="center">
          {/* <Tag icon={<UserIcon
            username={data[index].Name}
            userColor={data[index].Color}
            tooltipName={data[index].UserName}
          />}
          closable>
    </Tag> */}
          <UserIcon
            username={data[index].Name}
            userColor={data[index].Color}
            tooltipName={data[index].UserName}
            userInfo={data[index]}
          />
          <h4>{data[index].Name}</h4>
        </Space>
      ),
      key: data[index]._id as string,
      onClick: (e) => {
        return AddAssignee(e.key)
      },
    })

    items?.push({
      type: 'divider',
    })
  }

  if (items.length === 0) {
    return <>Please wait</>
  } else {
    return (
      <>
        <Space className="ant-group-item-icons" size={0} align="baseline">
          <IconGroup inputList={assignee} maxCount={maxCount} />
          <Tooltip title={tooltipText}>
            <Dropdown menu={{ items }} trigger={['click']} disabled>
              {/*  <FontAwesomeIcon icon={faUserPlus} /> */}
              {icon}
            </Dropdown>
          </Tooltip>
        </Space>
      </>
    )
  }
}

export default UserListComp
