import "./addOrEditProduct.css";
import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Form, Select, Input, Upload, Card, Switch } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../../utils/baseURL";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
const { TextArea } = Input;
const FormData = require("form-data");
const AddOrEditProduct = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { state } = location;
  const formRef = useRef();
  const [form] = Form.useForm();
  const [categoryData, setCategoryData] = useState();
  const [selectedCategory, setSelectedCategory] = useState(
    state?.data?.variantId?._id || null
  );
  const [imagesArrayData, setImagesArrayData] = useState([]);
  const [productPhoto, setProductPhoto] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [data, setData] = useState({
    name: "",
    productImage: [""],
    descripation: "",
    cartoonPrice: "",
    pcsPerCartoon: "",
    isPcsForSell: false,
    pcsPrice: "",
    quantity: "",
    variantId: "",
  });
  const fetchCategoryData = () => {
    setIsLoading(true);
    const params = {
      page: 1,
      limit: 100000,
    };
    try {
      axios
        .post("admin/variant/get/all", params)
        .then((response) => {
          setCategoryData(response?.data?.data?.variant_data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
          setIsLoading(false);
        });
    } catch (error) {
      console.log("error -=====>>", error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);
  const onFinish = async () => {
    let updateData = {
      name: data.name,
      productImage: [productPhoto],
      descripation: data.descripation,
      cartoonPrice: data.cartoonPrice,
      pcsPerCartoon: data.pcsPerCartoon,
      isPcsForSell: data.isPcsForSell,
      pcsPrice: data.pcsPrice,
      quantity: data.quantity,
      variantId: selectedCategory,
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
          updateData.productImage = response.data.data.image;
          setProductPhoto(response.data.data.shopImage);
        }
      }
    } catch (error) {
      console.log("error=====", error);
      return;
    }
    if (location.pathname == "/product/edit-product") {
      await axios
        .post("admin/product/edit", { ...updateData, _id: state.data._id })
        .then((response) => {
          navigate("/product");
        })
        .catch((error) => {
          console.log("error------", error);
        });
    } else {
      axios
        .post("admin/product/add", updateData)
        .then((response) => {
          if (response.status === 200) {
            toast.success(response.data?.message);
            navigate("/product");
          }
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
        });
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
  const handleChange = (value) => {
    setData({ ...data, isPcsForSell: value });
  };
  const fetchData = () => {
    if (location.pathname == "/product/edit-product") {
      const productImageUrls = state.data.productImage;

      if (typeof productImageUrls === "string") {
        const formattedImage = [
          {
            uid: productImageUrls,
            name: productImageUrls.split("/").pop(),
            status: "done",
            url: productImageUrls,
          },
        ];
        setImagesArrayData(formattedImage);
        setProductPhoto(productImageUrls);
      } else if (Array.isArray(productImageUrls)) {
        const formattedImages = productImageUrls.map((imageUrl) => ({
          uid: imageUrl,
          name: imageUrl.split("/").pop(),
          status: "done",
          url: imageUrl,
        }));
        setImagesArrayData(formattedImages);
        setProductPhoto(productImageUrls[0]);
      } else {
        console.log(
          "Unsupported productImageUrls type:",
          typeof productImageUrls
        );
      }
      form.setFieldsValue({
        ...state.data,
        name: state.data?.name,
        descripation: state.data?.descripation,
        cartoonPrice: state.data?.cartoonPrice,
        pcsPrice: state.data?.pcsPrice,
        pcsPerCartoon: state.data?.pcsPerCartoon,
        isPcsForSell: state.data?.isPcsForSell,
        quantity: state.data.quantity,
        variantId: state.data?.variantId?.name || null,
      });
      setData({
        ...state.data,
        name: state.data?.name,
        descripation: state.data?.descripation,
        cartoonPrice: state.data?.cartoonPrice,
        pcsPrice: state.data?.pcsPrice,
        pcsPerCartoon: state.data?.pcsPerCartoon,
        isPcsForSell: state.data?.isPcsForSell,
        quantity: state.data.quantity,
        variantId: state.data?.variantId?._id || null,
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
              {state ? "Edit Product" : "Add Product"}
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
          name="variantId"
          label="Select Category"
          rules={[
            {
              required: true,
              message: "Please input select category!",
            },
          ]}
        >
          <Select
            defaultValue="Select Category"
            style={{ width: "70%" }}
            options={categoryData?.map((category) => ({
              label: category.name,
              value: category._id,
            }))}
            onChange={(value) => setSelectedCategory(value)}
            value={selectedCategory}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input your product name!",
            },
          ]}
        >
          <Input
            placeholder="Product Name"
            name="name"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item name="descripation" label="Descripation">
          <TextArea
            placeholder="Product Descripation"
            name="descripation"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="pcsPrice"
          label="MRP"
          rules={[
            {
              required: true,
              message: "Please input your pcsPrice!",
            },
          ]}
        >
          <Input
            placeholder="MRP"
            type="number"
            name="pcsPrice"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="pcsPerCartoon"
          label="Pcs per Cartoon"
          rules={[
            {
              required: true,
              message: "Please input your pcsPerCartoon!",
            },
          ]}
        >
          <Input
            placeholder="Piece per Cartoon"
            type="number"
            name="pcsPerCartoon"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="cartoonPrice"
          label="Carton price"
          rules={[
            {
              required: true,
              message: "Please input cartoonPrice!",
            },
          ]}
        >
          <Input
            placeholder="Carton Price"
            type="number"
            name="cartoonPrice"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Opning Stock"
          rules={[
            {
              required: true,
              message: "Please input Stock!",
            },
          ]}
        >
          <Input
            placeholder="Stock"
            type="number"
            name="quantity"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="isPcsForSell"
          label="Sale For Pcs"
          valuePropName="checked"
        >
          <Switch onChange={handleChange} checked={data.isPcsForSell} />
        </Form.Item>
        <Form.Item
          name="productImage"
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
            previewFile={false}
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
export default AddOrEditProduct;
