import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Form, Select, Input, Upload, Card, Switch } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
const { TextArea } = Input;
const AddOrEditOrder = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const formRef = useRef();
  const location = useLocation();
  const { state } = location;
  const [initialValues, setInitialValues] = useState({});
  const [data, setData] = useState({
    products: [
      {
        productId: "",
        price: "",
        quantity: "",
        unitType: "",
      },
    ],
    total: "",
    gst: "",
    agencyId: "",
    salesmanId: "",
    shopId: "",
    delieverymanId: "",
  });
  console.log("state-----", state);
  const onFinish = () => {
    let updateData = {
      products: [
        {
          productId: "",
          price: "",
          quantity: "",
          unitType: "",
        },
      ],
      total: "",
      gst: "",
      agencyId: "",
      salesmanId: "",
      shopId: "",
      delieverymanId: "",
    };
    console.log("updateData---", updateData);
    if (location.pathname == "/order/edit-order") {
      console.log("data----", data);
      axios
        .post("admin/order/edit", { ...updateData, _id: state.data._id })
        .then((response) => {
          console.log("response------", response);
          navigate("/order");
        })
        .catch((error) => {
          console.log("error------", error);
        });
    } else {
      axios
        .post("admin/order/add", updateData)
        .then((response) => {
          if (response.status === 200) {
            console.log("response----", response);
            toast.success(response.data?.message);
            navigate("/order");
          }
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
        });
    }
  };
  const handleInputChange = (e) => {
    console.log("e-->>>>>", e);
    let { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const handleChange = (value) => {
    setData({ ...data, isPcsForSell: value });
  };
  const fetchData = () => {
    if (location.pathname == "/product/edit-product") {
      form.setFieldsValue({
        ...state.data,
        products: [
          {
            productId: "",
            price: "",
            quantity: "",
            unitType: "",
          },
        ],
        total: "",
        gst: "",
        agencyId: "",
        salesmanId: "",
        shopId: "",
        delieverymanId: "",
      });
      setData({
        ...state.data,
         products: [
          {
            productId: "",
            price: "",
            quantity: "",
            unitType: "",
          },
        ],
        total: "",
        gst: "",
        agencyId: "",
        salesmanId: "",
        shopId: "",
        delieverymanId: "",
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
              {state ? "Edit Order" : "Add Order"}
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
        initialValues={initialValues}
      >
        <Form.Item
          name="products"
          label="Products"
          rules={[
            {
              required: true,
              message: "Please input your product name!",
            },
          ]}
        >
          <Input
            placeholder="Product Name"
            name="products"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="total"
          label="Total"
          rules={[
            {
              required: true,
              message: "Please input your Total!",
            },
          ]}
        >
          <Input
            placeholder="Total"
            name="total"
            onChange={handleInputChange}
          />
        </Form.Item>

        <Form.Item
          name="gst"
          label="GST NO"
          rules={[
            {
              required: true,
              message: "Please input GST Number!",
            },
          ]}
        >
          <Input
            placeholder="GST Number "
            name="gst"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="isPcsForSell"
          label="Sale For Pieces"
          valuePropName="checked"
          rules={[
            {
              required: true,
              message: "Please input your isPcsForSell!",
            },
          ]}
        >
          <Switch onChange={handleChange} checked={data.isPcsForSell} />
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
export default AddOrEditOrder;
