import React, { useEffect, useRef, useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AddOrEditVariant = () => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [form] = Form.useForm();
  const location = useLocation();
  const { state } = location;
  const [initialValues, setInitialValues] = useState({});
  const [data, setData] = useState({
    name: "",
    quantity: "",
    unit: "",
  });

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const onFinish = () => {
    let updateData = {
      name: data.name,
      quantity: data.quantity,
      unit: data.unit,
    };
    if (location.pathname == "/category/edit-category") {
      axios
        .post("admin/variant/edit", { ...updateData, _id: state.data._id })
        .then((response) => {
          navigate("/category");
        })
        .catch((error) => {
          console.log("error------", error);
        });
    } else {
      axios
        .post("admin/variant/add", updateData)
        .then((response) => {
          if (response.status === 200) {
            navigate("/category");
          }
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
        });
    }
  };

  const fetchData = () => {
    if (location.pathname == "/category/edit-category") {
      form.setFieldsValue({
        ...state.data,
        name: state.data?.name,
        quantity: state.data?.quantity,
        unit: state.data?.unit,
      });
      setData({
        ...state.data,
        name: state.data?.name,
        quantity: state.data?.quantity,
        unit: state.data?.unit,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [state, form]);

  return (
    <Card
      className="m-2"
      title={
        <div className="d-flex">
          <Button
            className="back-button mx-2 btn btn-outline-primary"
            type="default"
            onClick={() => navigate(-1)}
            icon={<LeftOutlined className="back-icon" />}
          />
          <div>
            <h4 className="fw-bold fs-4">
              {state ? "Edit Category" : "Add Category"}
            </h4>
          </div>
        </div>
      }
    >
      <Form
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
        form={form}
        onFinish={onFinish}
        name="control-hooks"
        data={data}
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
            },
          ]}
        >
          <Input placeholder="Name" name="name" onChange={handleInputChange} />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Remark"
        >
          <Input
            placeholder="Remark"
            name="quantity"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="unit"
          label="Unit"
        >
          <Input placeholder="Pcs/Cartoon " name="unit" onChange={handleInputChange} />
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
};

export default AddOrEditVariant;
