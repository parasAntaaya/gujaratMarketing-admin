import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, Card, Space } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const { TextArea } = Input;

const AddOrEditReason = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const { state } = location;
  const formRef = useRef();
  const [data, setData] = useState({
      reason: "" ,
  });
  const onFinish = async (values) => {
    let updateData = {
      reason:  values?.reason,
    };
    if (location.pathname === "/reason/edit-reason") {
      setIsLoading(true);
      await axios
        .post("admin/reason/edit", { ...updateData, _id: state.data._id })
        .then((response) => {
          console.log("edit-reason--response---->",response);
          setIsLoading(false);
          toast.success("Reason Sucessfully Update");
          navigate("/reason");
        })
        .catch((error) => {
          console.log("error------", error);
          setIsLoading(false);
          toast.error("Reason Couldn't Updated");
        });
    } else {
      setIsLoading(true);
      axios
        .post("admin/reason/add", updateData)
        .then((response) => {
          console.log("add-reason--response---->",response);
          if (response.status === 200) {
            setIsLoading(false);
            toast.success("Reason Sucessfully Add");
            navigate("/reason");
          }
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
          setIsLoading(false);
          toast.error(error?.message);
        });
    }
  };
  const handleInputChange = (e) => {
    console.log("e-->>>>>", e);
    let { name, value } = e.target;
    setData({
      ...data,
      [name]:
        !isNaN(parseFloat(value)) && isFinite(value) ? parseInt(value) : value,
    });
  };
  const fetchData = () => {
    if (location.pathname === "/reason/edit-reason") {
      form.setFieldsValue({
        ...state.data,
        id: state.data?._id,
        reason: state.data?.reason,
     
      });
      setData({
        ...state.data,
        id: state.data?._id,
        reason: state.data?.reason,
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
              {state ? "Edit Reason" : "Add Reason"}
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
          name="reason"
          label="Reason"
          rules={[
            {
              required: true,
              message: "Please input your Reason",
            },
          ]}
        >
          <Input
            placeholder="Reason"
            name="reason"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 7,
            span: 16,
          }}
        >
          {/* <Button >
            Submit
          </Button>
          <Space direction="vertical"> */}
          <Space wrap>
            {isLoading ? (
              <Button type="primary" htmlType="submit" loading>
                Submiting..
              </Button>
            ) : (
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            )}
            {/* <Button type="primary" htmlType="submit">
              Submit
            </Button> */}
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddOrEditReason;
