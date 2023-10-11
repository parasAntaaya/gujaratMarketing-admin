import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, Card, DatePicker, Tooltip } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../utils/baseURL";
import { toast } from "react-toastify";
const { TextArea } = Input;
const FormData = require("form-data");
const AddOrEditFreeze = (props) => {
  
  const navigate = useNavigate();
  const formRef = useRef();
  const location = useLocation();
  const [form] = Form.useForm();
  const { state } = location;
  
  const [initialValues, setInitialValues] = useState({});
  const [imagesArrayData, setImagesArrayData] = useState([]);
  const [freezePhoto, setFreezePhoto] = useState([]);
  
  const [data, setData] = useState({
    company: "",
    image: [""],
    size: "",
    warranty: "",
  });

  const onFinish = async () => {
    let updateData = {
      company: data.company,
      size: data.size,
      warranty: data.warranty,
      image: [freezePhoto],
    };
    try {
      if (imagesArrayData.length > 0) {
        const originFile = imagesArrayData[0]?.originFileObj;
        const formData = new FormData();
        formData.append("image", originFile);
        const response = await axios.post(
          `${BASE_URL}upload/document`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response?.data?.data?.image) {
          updateData.image = response.data.data.image; 
          setFreezePhoto(response.data.data.image);
        }
      }
    } catch (error) {
      console.log("error=====", error);
      return;
    }
    console.log("params=---------------->", updateData);
    if (location.pathname == "/freeze/edit-freeze") {
      axios
        .post("admin/fridge/edit", { ...updateData, _id: state.data._id })
        .then((response) => {
          console.log("response------", response);
          toast.success("Refrigerator Sucessfully Update");
          navigate("/freeze");
        })
        .catch((error) => {
          console.log("error------", error);
        });
    } else {
      axios
        .post("admin/fridge/add", updateData)
        .then((response) => {
          if (response.status === 200) {
            console.log("response----", response);
            toast.success("Refrigerator Sucessfully Add");
            navigate("/freeze");
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
  const fetchData = () => {
    console.log("-------state", state);
    if (location.pathname == "/freeze/edit-freeze") {
      const freezeImageUrls = state.data.image;
      if (typeof freezeImageUrls === 'string') {
        const formattedImage = [
          {
            uid: freezeImageUrls,
            name: freezeImageUrls.split("/").pop(),
            status: "done",
            url: freezeImageUrls,
          },
        ];
        setImagesArrayData(formattedImage);
        setFreezePhoto(freezeImageUrls);
      } else if (Array.isArray(freezeImageUrls)) {
        const formattedImages = freezeImageUrls.map((imageUrl) => ({
          uid: imageUrl,
          name: imageUrl.split("/").pop(),
          status: "done",
          url: imageUrl,
        }));
        setImagesArrayData(formattedImages);
        setFreezePhoto(freezeImageUrls[0]);
      } else {
        console.log("Unsupported freezeImageUrls type:", typeof freezeImageUrls);
      }
      form.setFieldsValue({
        ...state.data,
        company: state.data.company,
        size: state.data.size,
        warranty: state.data.warranty,
      });
      setData({
        ...state.data,
        company: state.data.company,
        size: state.data.size,
        warranty: state.data.warranty,
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
              {state ? "Edit Refrigerator" : "Add Refrigerator"}
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
          name="company"
          label="Freeze Company"
          rules={[
            {
              required: true,
              message: "Please input freeze company!",
            },
          ]}
        >
          <Input
            placeholder="Freeze Company"
            name="company"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="size"
          label="Size"
          rules={[
            {
              required: true,
              message: "Please input size!",
            },
          ]}
        >
          <TextArea
            name="size"
            placeholder="Size"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="warranty"
          label="Warranty"
          rules={[
            {
              required: true,
              message: "Please input warranty!",
            },
          ]}
        >
          <Input
            placeholder="Warranty"
            name="warranty"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image"
          // valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            if (e && e.fileList) {
              return e.fileList;
            }
            return [];
          }}
          rules={[
            {
              required: true,
              message: "Please input your productImage!",
            },
          ]}
        >
          <Upload
            action="/upload.do"
            fileList={imagesArrayData}
            maxCount={1}
            listType="picture-card"
            onChange={({ fileList }) => setImagesArrayData(fileList)}
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
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddOrEditFreeze;
