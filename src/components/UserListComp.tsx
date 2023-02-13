import { Dropdown, Select, Space, Tag, Tooltip } from 'antd'
import type { MenuProps } from 'antd'
import React, { useEffect, useState } from 'react'
import { InputTasks } from '../data/database/InputTasks'
import { Users } from '../data/database/Users'
import { UpdateTask } from '../data/tasks'
import { UPDATE_MODE } from '../util/ConfigText'
import IconGroup from './IconGroup'
import UserIcon from './UserIcon'

interface UserData {
  userData: Users[]
  maxCount: number
  icon: React.ReactNode
  tooltipText?: string
  inputUserData?: Users[]
  onClickMenu?: (e: any) => void
  disabled?: boolean
  mode?: string
  assigneeUpdate?: boolean
  taskId?: string
  userItems?: MenuProps['items']
}

const UserListComp: React.FC<UserData> = ({
  userData,
  maxCount,
  icon,
  tooltipText,
  inputUserData,
  onClickMenu,
  mode,
  assigneeUpdate,
  taskId,
  userItems,
}) => {
  const [data, setData] = useState<Users[]>(userData)
  const [assignee, setAssignee] = useState<Users[]>(
    inputUserData ? inputUserData : [],
  )
  //const [items, setItems] = useState<MenuProps['items']>([])

  useEffect(() => {
    setData(userData)
  }, [])
  //const [assignee, setAssignee] = useState<Users>()

  //const [items, setItems] = useState<MenuProps['items']>([])
  const items: MenuProps['items'] = []

  const AddAssignee = (id: string) => {
    data.filter(async (obj) => {
      if (obj._id === id) {
        // assignees.push(obj)
        //setAssignee([...assignee, obj])
        setAssignee([obj])
        //call update service here man
        if (mode === undefined || mode === UPDATE_MODE) {
          //update goes here
          if (assigneeUpdate === true) {
            //update assignee
            const users: Users[] = [obj]
            const inputTasks: InputTasks = {
              Assignee: users,
            }
            await UpdateTask('/api/task/' + taskId, inputTasks)
          } else {
            //update reporter
            const inputTasks: InputTasks = {
              Reporter: obj,
            }
            await UpdateTask('/api/task/' + taskId, inputTasks)
          }
        }

        return assignee
      }
    })
  }

  for (let index = 0; index < data.length; index++) {
    items?.push({
      label: (
        <Space size="small" align="center">
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

  return (
    <>
      <Space className="ant-group-item-icons" size={0} align="baseline">
        <IconGroup inputList={assignee} maxCount={maxCount} />

        <Tooltip title={tooltipText}>
          <Dropdown
            menu={{ items: items, onClick: onClickMenu }}
            trigger={['click']}
          >
            {/*  <FontAwesomeIcon icon={faUserPlus} /> */}
            {icon}
          </Dropdown>
        </Tooltip>
      </Space>
    </>
  )
}

export default UserListComp
