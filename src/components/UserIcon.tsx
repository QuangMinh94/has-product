import React, { useEffect, useState } from 'react'
import { Avatar, Badge, Button, Tag, Tooltip } from 'antd'
import { Users } from '../data/database/Users'

interface User {
  username?: React.ReactNode
  userColor?: string
  tooltipName?: string
  userInfo?: Users
}

//const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']
const GapList = [4, 3, 2, 1]

const UserIcon: React.FC<User> = ({
  username,
  userColor,
  tooltipName,
  userInfo,
}) => {
  let user = username
  const [gap, setGap] = useState(GapList[0])

  const changeGap = () => {
    const index = GapList.indexOf(gap)
    setGap(index < GapList.length - 1 ? GapList[index + 1] : GapList[0])
  }

  const firstNameLetter = userInfo?.FirstName?.substring(0, 1).toUpperCase()
  const lastNameLetter = userInfo?.LastName?.substring(0, 1).toUpperCase()
  user = firstNameLetter + '' + lastNameLetter
  return (
    <>
      <Tooltip title={tooltipName} placement="top">
        <Avatar
          style={{
            backgroundColor:
              userColor !== ''
                ? userColor
                : (Math.random() * 16777215).toString(
                    16,
                  ) /* , verticalAlign: 'middle' */,
          }} /* size="large"  gap={gap} */
        >
          {user}
        </Avatar>
      </Tooltip>
    </>
  )
}

export default UserIcon
