import React from "react";
import { Layout } from "antd";
import Breadcrumbs from "./Breadcrumbs";
import type { MenuProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {faBell} from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Space, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

interface IHeader{
  pageName:string
}

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item
      </a>
    ),
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item
      </a>
    ),
  },
];

const CustomHeader: React.FC<IHeader> = ({pageName}) => {
  return (
    <Header style={{ padding: 0, background: "white" }}>
      <Row>
        <Col span={12}>
          <Breadcrumbs main="Home" sub={pageName} />
        </Col>
        <Col span={12}>
          <div className="space-align-block" style={{float:'right'}}>
            <Space align="center">
              <FontAwesomeIcon icon={faBell} />
              <Dropdown
                menu={{ items }}
                placement="bottomRight"
                arrow={{ pointAtCenter: true }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <FontAwesomeIcon icon={faUser} />
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </Space>
          </div>
        </Col>
      </Row>
    </Header>
  );
};

export default CustomHeader;
