import React from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { priority, status } from "../data/menuProps";
import FindIcon from "../data/util";

interface Type {
  type: string;
  text: string
}

let items: MenuProps["items"] = [];

const DropdownProps: React.FC<Type> = ({ type ,text}) => {
  if (type === "Priority") {
    items = priority;
  } else {
    items = status;
  }

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <FindIcon type={type} text={text}/>
        </Space>
      </a>
    </Dropdown>
  );
};

export default DropdownProps;
