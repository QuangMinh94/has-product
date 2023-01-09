import React, { useState } from 'react';
import { Button, Form, Input, Layout, Radio } from 'antd';
import DropdownProps from './Dropdown';

type LayoutType = Parameters<typeof Form>[0]['layout'];

const SubTask: React.FC = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>('inline');

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };


  return (
    <Layout>
    <Form
      layout={formLayout}
      form={form}
      initialValues={{ layout: 'inline' }}
      onValuesChange={onFormLayoutChange}
    >
      <Form.Item>
        <Input placeholder="Your subtask" />
      </Form.Item>
      <Form.Item >
        <Button type="primary">Submit</Button>
      </Form.Item>
      <Form.Item >
        <DropdownProps type={'Status'} text={'To do'}/>
      </Form.Item>
    </Form>
    </Layout>
  );
};

export default SubTask;