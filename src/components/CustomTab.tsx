import React from 'react';
import { Tabs } from 'antd';
import SettingPage from '../pages/Settings';

const onChange = (key: string) => {
  //maybe call ws here and fetch data
  console.log(key);
};

const App: React.FC = () => (
  <Tabs
    defaultActiveKey="1"
    onChange={onChange}
    items={[
      {
        label: `My task`,
        key: '1',
        children: 'Content of Tab 1',
      },
      {
        label: `Report to me`,
        key: '2',
        children: `Content of Tab Pane 2`,
      },
    ]}
  />
);

export default App;