import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dropdown, MenuProps, Select, Space, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import GetAllUsers from '../data/allUsers'
import { Users } from '../data/database/Users'
import FindIcon from '../data/util'
import IconGroup from './IconGroup'
import UserIcon from './UserIcon'

let assignees: Users[] = []

const UserListComp = () => {
  const [data, setData] = useState<Users[]>([])
  const [assignee, setAssignee] = useState<Users[]>([])

  useEffect(() => {
    GetAllUsers('/api/users/getalluser').then((r) => {
      setData(r)
    })
  }, [])

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
        <Space align="baseline">
          <IconGroup inputList={assignee} />
          <Dropdown menu={{ items }} trigger={['click']}>
            <FontAwesomeIcon icon={faUserPlus} />
          </Dropdown>
        </Space>
      </>
    )
  }
}

export default UserListComp
