import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Tag, Tooltip } from 'antd';

interface User{
    username?: string;
    userColor? :string;
    tooltipName?: string;
}

//const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const GapList = [4, 3, 2, 1];

const UserIcon: React.FC<User> = ({username,userColor,tooltipName}) => {
  const [user, setUser] = useState(username);
  const [gap, setGap] = useState(GapList[0]);

  const changeGap = () => {
    const index = GapList.indexOf(gap);
    setGap(index < GapList.length - 1 ? GapList[index + 1] : GapList[0]);
  };

  return (
    <>
    <Tooltip title={tooltipName} placement="top">      
      <Avatar style={{ backgroundColor: userColor !== ''? userColor: (Math.random()*16777215).toString(16)/* , verticalAlign: 'middle' */ }}  /* size="large"  gap={gap} */>
        {user}
      </Avatar>
      </Tooltip>
    </>
  );
};

export default UserIcon;