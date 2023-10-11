import React, { useEffect, useRef, useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Form, Select, Input, Upload, Card, DatePicker } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
const AddOrEditShopGroup = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const location = useLocation();
  const { state } = location;
  const formRef = useRef();
  const [form] = Form.useForm();

  const [data, setData] = useState({
    name: "",
    remark: "",
  });
  const onFinish = async () => {
    let updateData = {
      name: data.name,
      remark: data.remark,
    };
    try {
      if (location.pathname === "/shopGroup/editshopGroup") {
        axios
          .post("admin/shop/group/edit", { ...updateData, _id: state.data._id })
          .then((response) => {
            console.log("response------", response);
            navigate("/shopGroup");
          })
          .catch((error) => {
            console.log("error------", error);
          });
      } else {
        axios
          .post("admin/shop/group/add", updateData)
          .then((response) => {
            if (response.status === 200) {
              console.log("response----", response);
              navigate("/ShopGroup");
            }
          })
          .catch((error) => {
            console.log("error-->>>>>", error?.message);
          });
      }
    } catch (error) {
      console.log("error=====", error);
      return;
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const fetchData = () => {
    if (
      location.pathname === "/shopGroup/editshopGroup" &&
      state &&
      state.data
    ) {
      formRef.current.setFieldsValue({
        ...state.data,
        name: state.data?.name,
        remark: state.data?.remark,
      });
      setData({
        ...state.data,
        name: state.data?.name,
        remark: state.data?.remark,
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
              {state ? "Edit Shop Group" : "Add Shop Group"}
            </h4>
          </div>
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
        onFinish={onFinish}
        name="control-hooks"
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
          <Input placeholder="Name" name="name" onChange={handleInputChange} />
        </Form.Item>
        <Form.Item
          name="remark"
          label="Remark"
          rules={[
            {
              required: true,
              message: "Please input your remark!",
            },
          ]}
        >
          <Input
            placeholder="Remark"
            name="remark"
            onChange={handleInputChange}
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
};
export default AddOrEditShopGroup;
