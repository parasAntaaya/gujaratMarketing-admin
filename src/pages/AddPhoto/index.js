import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, Card, Select } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../../utils/baseURL";
import { toast } from "react-toastify";
import axios from "axios";

const AddPhoto = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [form] = Form.useForm();
  const formRef = useRef();

  const [eventData, setEventData] = useState();
  const [selectedEvent, setSelectedEvent] = useState();
  const [imageUrls, setImageUrls] = useState([]);
  const [imagesArrayData, setImagesArrayData] = useState({
    image: [],
  });
  const [data, setData] = useState({
    eventId: "",
    description: "",
    image: [""],
  });
  const onFinish = async () => {
    let updateData = {
      eventId: selectedEvent,
      description: data?.description,
      image: imageUrls,
    };
    try {
      const uploadImage = async (file) => {
        try {
          const formData = new FormData();
          formData.append("image", file.originFileObj);
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
            return response.data.data.image;
          }
        } catch (error) {
          console.log("uploadImage error=====", error);
          throw error;
        }
      };
      // if (imagesArrayData?.image?.length > 0) {
      //   const image = await uploadImage(imagesArrayData.image[0]);
      //   updateData.image = image;
      // }
      if (imagesArrayData?.image?.length > 0) {
        const image = await Promise.all(
          imagesArrayData.image.map((image) => uploadImage(image))
        );
        updateData.image = image;
      } else {
        updateData.image = data.image;
      }
      if (location.pathname === "/photogallery/edit-photo") {
        axios
          .post("admin/gallery/edit", { ...updateData, _id: state.data?._id })
          .then((response) => {
            console.log("editresponse------", response);
            toast.success("gallery Sucessfully Update");
            navigate("/photogallery");
          })
          .catch((error) => {
            console.log("error------", error);
          });
      } else {
        axios
          .post("admin/gallery/add", updateData)
          .then((response) => {
            if (response.status === 200) {
              console.log("addresponse----", response);
              toast.success("gallery Sucessfully Add");
              navigate("/photogallery");
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

  const handleImageChange = (fileList) => {
    const updatedFileList = fileList.map((file) => {
      if (!file.uid) {
        file.uid = Date.now().toString();
      }
      if (!file.url) {
        file.url = "";
      }
      return file;
    });
    setImagesArrayData((prevData) => ({
      ...prevData,
      image: updatedFileList,
    }));
  };

  const fetchData = () => {
    if (location.pathname === "/photogallery/edit-photo") {
      console.log("state==========", state);
      if (state && state.data) {
        //  const PhotoUrls = state.data.image || [];
        const image = state.data.aadharCardImage || [];
        const imagesFormatted = image.map((url) => ({
          uid: url,
          url: `${BASE_URL}${url}`,
        }));
        setImagesArrayData((prevData) => ({
          ...prevData,
          image: imagesFormatted,
        }));
        formRef.current.setFieldsValue({
          ...state.data,
          description: state.data?.description,
          // image: state.data?.image,
          eventId: state.data?.eventId?.name || null,
        });
        setData({
          ...state.data,
          description: state.data?.description,
          // image: state.data?.image,
          eventId: state.data?.eventId,
        });
      }
    }
  };

  const fetchEventData = () => {
    const params = {
      page: 1,
      limit: 10000,
    };
    try {
      axios
        .post("admin/event/get/all", params)
        .then((response) => {
          console.log("eventresponse----", response);
          //   dispatch(setImage(response?.data?.data?.gallery_data));
          setEventData(response.data?.data?.event_data);
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
        });
    } catch (error) {
      console.log("error -=====>>", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [state]);

  useEffect(() => {
    fetchEventData();
  }, []);

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
          name="eventId"
          label="Select Event"
          rules={[
            {
              required: true,
              message: "Please Select Event!",
            },
          ]}
        >
          <Select
            name="eventId"
            placeholder="Select Event"
            style={{
              width: "70%",
            }}
            options={eventData?.map((event) => ({
              label: event.name,
              value: event._id,
            }))}
            onChange={(data) => setSelectedEvent(data)}
            value={selectedEvent}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: "Please input your Description!",
            },
          ]}
        >
          <Input
            placeholder="Description"
            name="description"
            onChange={handleInputChange}
          />
        </Form.Item>

        <Form.Item
          name="image"
          label="Image"
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
          rules={[
            {
              required: true,
              message: "Please input Shop Image!",
            },
          ]}
        >
          <Upload
            multiple
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
            Add
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddPhoto;
