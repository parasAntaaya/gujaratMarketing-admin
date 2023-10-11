import { Button, Card, Form, Input } from 'antd'
import React, { useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import TextArea from 'antd/es/input/TextArea';

 const Notification = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const location = useLocation();
  const { state } = location;
  return (
    <Card
        className="m-2"
        title={
          <div className="d-flex py-3">
            <div className="col-md-6 fs-3 fw-bold">Notification</div>
          </div>
        }
      >
      <Form
        form={form}
        labelCol={{
          flex: "170px",
        }}
        labelAlign="left"
        wrapperCol={{
          span: 18,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
          marginLeft: "100px",
        }}
        ref={formRef}
        // onFinish={onFinish}
        name="control-hooks"
        // initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input your  name!",
            },
          ]}
        >
          <Input
            placeholder="Catalog Name"
            name="name"
            // onChange={}
          />
        </Form.Item>

        <Form.Item
          name="notification"
          label=" Notification"
          rules={[
            {
              required: true,
              message: "Please input your notification!",
            },
          ]}
        >
          <TextArea
            placeholder="notification"
            name="notification"
            // onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 7,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
export default Notification
