import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, Card } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "axios";
const { TextArea } = Input;

const AddEvent = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [form] = Form.useForm();
  const formRef = useRef();
  const [imagesArrayData, setImagesArrayData] = useState({
    image: [],
  });
  const [imagePath, setImagePath] = useState([]);

  const [data, setData] = useState({
    name: "",
    image: [""],
  });
  const onFinish = async () => {
    let updateData = {
      name: data?.name,
      image: imagePath,
    };
    console.log("updateData////",updateData);
    try {
      const uploadImage = async (file) => {
        try {
          const formData = new FormData();
          formData.append("image", file.originFileObj);
          const response = await axios.post(
            `upload/document`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response?.data?.data?.image) {
            return response.data.data.image;
          }
        } catch (error) {
          console.log("uploadImage error=====", error);
          throw error;
        }
      };
      if (imagesArrayData?.image?.length > 0) {
        const image = await uploadImage(imagesArrayData.image[0]);
        updateData.image = image;
      }
      if (location.pathname === "/events/edit-event") {
        axios
          .post("admin/event/edit", { ...updateData, _id: state.data?._id })
          .then((response) => {
            console.log("response------", response);
            toast.success("Event Updated Sucessfully");
            navigate("/events");
          })
          .catch((error) => {
            console.log("error------", error);
          });
      } else {
        console.log("=======updateData", updateData);
        axios
          .post("admin/event/add", updateData)
          .then((response) => {
            if (response.status === 200) {
              console.log("response----", response);
              toast.success("Event Add Sucessfully");
              navigate("/events");
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
    let { name, value } = e.target;
    setData({
      ...data,
      [name]:
        !isNaN(parseFloat(value)) && isFinite(value) ? parseInt(value) : value,
    });
  };
  const handleImageChange = (fileList) => {
    const updatedFileList = fileList.map((file) => {
      if (!file.uid) {
        file.uid = Date.now().toString();
      }
      return file;
    });
    setImagesArrayData((prevData) => ({
      ...prevData,
      image: updatedFileList,
    }));
  };
  const fetchData = () => {
    if (location.pathname === "/events/edit-event") {
      const PhotoUrls = state.data.image;
      setImagesArrayData((prevData) => ({
        ...prevData,
        image: PhotoUrls ? [{ uid: PhotoUrls, url: `${PhotoUrls}` }] : [],
      }));
      form.setFieldsValue({
        ...state.data,
        id: state.data?._id,
        name: state.data?.name,
      });
      setData({
        ...state.data,
        id: state.data?._id,
        name: state.data?.name,
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, [state,form]);

  return (
    <Card
      className="m-2"
      title={
        <div className="d-flex">
          <Button
            className="back-button mx-2 btn btn-outline-primary"
            type="default"
            onClick={() => navigate(-1)}
            icon={<LeftOutlined className="back-icon " />}
          />
          <div>
            <h4 className="fw-bold fs-4">
              {state ? "Edit Image" : "Add Image"}
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
          label="Event Name"
          rules={[
            {
              required: true,
              message: "Please Enter your Event Name!",
            },
          ]}
        >
          <Input
            placeholder="Event Name"
            name="name"
            onChange={handleInputChange}
          />
        </Form.Item>

        <Form.Item
          name="image"
          label="Image"
          getValueFromEvent={(e) => e?.fileList}
          rules={[
            {
              required: true,
              message: "Please Enter Event Image!",
            },
          ]}
        >
          <Upload
            maxCount={1}
            action="/upload.do"
            fileList={imagesArrayData.image || []}
            listType="picture-card"
            onChange={({ fileList }) => handleImageChange(fileList)}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 7,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Add Event
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddEvent;
