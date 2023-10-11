import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, Card } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
const { TextArea } = Input;

const AddOrEditCatalog = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = location;
  const formRef = useRef();
  const [imagesArrayData, setImagesArrayData] = useState({
    catalogImage: [],
  });
  const [catalogueImagePath, setCatalogueImagePath] = useState([]);
  const [data, setData] = useState({
    name: "",
    image: [""],
    variants: "",
  });
  const onFinish = async (values) => {
    const textareaValue = Array.isArray(values?.variants)
      ? values?.variants[0]?.toString()
      : values?.variants?.toString();
    let arrayValue = textareaValue ? textareaValue?.split(",") : [];
    let updateData = {
      name: values?.name,
      image: catalogueImagePath,
      variants: arrayValue,
    };

    // upload api calling on onFinish ---------------------------------

    try {
      const uploadImage = async (file) => {
        try {
          const formData = new FormData();
          formData.append("image", file.originFileObj);
          const response = await axios.post(`upload/document`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response?.data?.data?.image) {
            return response.data.data.image;
          }
        } catch (error) {
          console.log("uploadImage error=====", error);
          throw error;
        }
      };
      if (imagesArrayData?.catalogImage?.length > 0) {
        const catalogImage = await uploadImage(imagesArrayData.catalogImage[0]);
        updateData.image = catalogImage;
      }
    } catch (error) {
      console.log("error=====", error);
      return;
    }
    if (location.pathname === "/catalog/edit-catalog") {
      await axios
        .post("admin/catlogue/edit", { ...updateData, _id: state.data._id })
        .then((response) => {
          navigate("/catalog");
        })
        .catch((error) => {
          console.log("error------", error);
        });
    } else {
      axios
        .post("admin/catlogue/add", updateData)
        .then((response) => {
          if (response.status === 200) {
            navigate("/catalog");
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
      [name]:
        !isNaN(parseFloat(value)) && isFinite(value) ? parseInt(value) : value,
    });
  };
  const fetchData = () => {
    if (location.pathname === "/catalog/edit-catalog") {
      const catalogueImageUrls = state.data.image;
      setImagesArrayData((prevData) => ({
        ...prevData,
        catalogImage: catalogueImageUrls
          ? [{ uid: catalogueImageUrls, url: `${catalogueImageUrls}` }]
          : [],
      }));
      form.setFieldsValue({
        ...state.data,
        id: state.data?._id,
        name: state.data?.name,
        variants: state.data?.variants,
      });
      setData({
        ...state.data,
        id: state.data?._id,
        name: state.data?.name,
        variants: state.data?.variants,
      });
    }
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
      catalogImage: updatedFileList,
    }));
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
              {state ? "Edit Catalog" : "Add Catalog"}
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
              message: "Please input your catalogue name!",
            },
          ]}
        >
          <Input
            placeholder="Catalog Name"
            name="name"
            onChange={handleInputChange}
          />
        </Form.Item>

        <Form.Item
          name="variants"
          label=" Category"
          rules={[
            {
              required: true,
              message: "Please input your catalogue category!",
            },
          ]}
        >
          <TextArea
            placeholder="catalogue Category"
            name="variants"
            onChange={handleInputChange}
          />
        </Form.Item>

        {/* ------------------------------------------------------------------------------- */}
        <Form.Item
          name="image"
          label="Image"
          getValueFromEvent={(e) => e?.fileList}
          rules={[
            {
              required: true,
              message: "Please Select Image!",
            },
          ]}
        >
          <Upload
            maxCount={1}
            action="/upload.do"
            fileList={imagesArrayData.catalogImage || []}
            listType="picture-card"
            onChange={({ fileList }) => handleImageChange(fileList)}
            rules={[
              {
                required: true,
                message: "Please input Catalogue Image!",
              },
            ]}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        {/* ------------------------------------------------------------------------------- */}

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

export default AddOrEditCatalog;
