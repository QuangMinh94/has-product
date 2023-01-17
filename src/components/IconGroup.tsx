import React from 'react'
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Divider, Tag, Tooltip } from 'antd'
import { Users } from '../data/database/Users'
import UserIcon from './UserIcon'

interface InputList {
  inputList: Users[]
  maxCount?: number
}

const IconGroup: React.FC<InputList> = ({ inputList, maxCount }) => {
  return (
    <>
      <Avatar.Group
        maxCount={maxCount ? maxCount : 2}
        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
      >
        {inputList.map((d) => {
          return (
            <UserIcon
              username={d.Name}
              userColor={d.Color}
              tooltipName={d.UserName}
              userInfo={d}
              key={d._id}
            />
          )
        })}
        {/* <Avatar src="https://joeschmoe.io/api/v1/random" />
      <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
      <Tooltip title="Ant User" placement="top">
        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
      </Tooltip>
      <Avatar style={{ backgroundColor: '#1890ff' }} icon={<AntDesignOutlined />} /> */}
      </Avatar.Group>
    </>
  )
}

export default IconGroup
