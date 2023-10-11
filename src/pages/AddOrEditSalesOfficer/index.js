import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Select,
  Input,
  Upload,
  Card,
  DatePicker,
  Space,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment/moment";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../utils/baseURL";
import LocaleProvider from "antd/es/locale";
import enUS from "antd/es/calendar/locale/en_US";

const AddOrEditSalesOfficer = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { TextArea } = Input;
  const { state } = location;
  const [form] = Form.useForm();
  const formRef = useRef();

  const [initialValues, setInitialValues] = useState([]);
  const [imagesArrayData, setImagesArrayData] = useState({
    aadharCardImages: [],
    image: [],
  });
  const [aadharCardImageUrls, setAadharCardImageUrls] = useState([]);
  const [selectedBirthDate, setSelectedBirthDate] = useState(null);
  console.log("selectedBirthDate :", selectedBirthDate);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    uniqueId: "",
    contact: {
      countryCode: "",
      mobile: "",
    },
    dob: "",
    address: {
      address: "",
      googleAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      timeZone: "",
      latitude: "",
      longitude: "",
    },
    aadharCardImage: [],
    image: [],
    roleId: "",
  });
  const onFinish = async () => {
    const updateData = {
      name: data?.name,
      uniqueId: data?.uniqueId,
      contact: {
        countryCode: "+91",
        mobile: data?.mobile,
      },
      dob: moment(selectedBirthDate).format("YYYY-MM-DD"),
      address: {
        address: data?.address?.address,
        googleAddress: "google address-static",
        city: "city-static",
        state: "state-static",
        zipCode: "zipCode-static",
        country: "country-static",
        timeZone: "timeZone-static",
        latitude: "123",
        longitude: "234",
      },
      image: imagesArrayData,
      aadharCardImage: aadharCardImageUrls,
      roleId: "64a50c57a9d34f05c8424a1e",
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
      if (imagesArrayData?.image?.length > 0) {
        const image = await uploadImage(imagesArrayData.image[0]);
        updateData.image = image;
      }
      if (imagesArrayData?.aadharCardImages?.length > 0) {
        const aadharCardImageUrls = await Promise.all(
          imagesArrayData.aadharCardImages.map((image) => uploadImage(image))
        );
        updateData.aadharCardImage = aadharCardImageUrls;
      } else {
        updateData.aadharCardImage = data.aadharCardImage;
      }
      if (location.pathname === "/salesofficer/edit-salesofficer") {
        setIsLoading(true);
        axios
          .post("admin/sales/officer/edit", {
            ...updateData,
            _id: state.data._id,
          })
          .then((response) => {
            if (response.status === 200) {
              setIsLoading(false);
              toast.success("salesofficer Sucessfully Update");
              navigate("/salesofficer");
            }
          })
          .catch((error) => {
            setIsLoading(false);
            console.log("error------", error);
          });
      } else {
        setIsLoading(true);
        axios.post("admin/sales/officer/add", updateData).then((response) => {
          if (response.status === 200) {
            setIsLoading(false);
            toast.success("salesofficer Sucessfully Add");
            navigate("/salesofficer");
          }
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log("error=====", error);
      return;
    }
  };
  const handleAadharCardChange = async (fileList) => {
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
      aadharCardImages: updatedFileList,
    }));
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "address"
        ? {
            address: {
              ...prevData?.address,
              [name]: value,
            },
          }
        : {}),
    }));
  };
  const handleDateChange = (date, dateString) => {
    // console.log("date", date.target.value);
    const a = moment(dateString).format("YYYY-MM-DD");
    setSelectedBirthDate(a);
  };
  const fetchData = () => {
    if (
      location.pathname == "/salesofficer/edit-salesofficer" &&
      state &&
      state.data
    ) {
      const dob = state.data?.dob
        ? moment(state.data?.dob).format("DD-MM-YYYY")
        : null;
      setSelectedBirthDate(dob);
      const ownerImageUrl = state.data.image || "";
      const aadharCardImages = state.data.aadharCardImage || [];
      const aadharCardImagesFormatted = aadharCardImages.map((url) => ({
        uid: url,
        url: `${BASE_URL}${url}`,
      }));
      setImagesArrayData((prevData) => ({
        ...prevData,
        aadharCardImage: aadharCardImagesFormatted,
        image: ownerImageUrl
          ? [{ uid: ownerImageUrl, url: `${ownerImageUrl}` }]
          : [],
      }));
      formRef.current.setFieldsValue({
        ...state.data,
        name: state.data?.name,
        // dob: moment(state.data?.dob),
        mobile: state.data?.contact?.mobile,
        address: state?.data?.address?.address,
        uniqueId: state.data?.uniqueId,
        roleId: "64a50c57a9d34f05c8424a1e",
      });
      setData({
        ...state.data,
        name: state?.data?.name,
        mobile: state?.data?.contact?.mobile,
        // dob: state?.data?.dob,
        address: state?.data?.address,
        uniqueId: state.data?.uniqueId,
        roleId: "64a50c57a9d34f05c8424a1e",
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, [state]);
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
              {state ? "Edit Sales Officer" : "Add Sales Officer"}
            </h4>
          </div>
        </div>
      }
    >
      <Form
        form={form}
        className="mb-3"
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
          name="name"
          label="Full Name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
            },
          ]}
        >
          <Input
            placeholder="Full Name"
            name="name"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="mobile"
          label="Mobile Number"
          rules={[
            {
              required: true,
              message: "Please input your mobileNumber!",
            },
          ]}
        >
          <Input
            type="number"
            placeholder="Mobile Number"
            name="mobile"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="dob"
          label="Date Of Birth"
          rules={[
            {
              required: true,
              message: "Please input your BirthDate!",
            },
          ]}
        >
          {/* <input
            name="dob"
            type="date"
            style={{
              padding: "4px 18px",
              borderRadius: "6px",
              border: "none",
              width:"100%",
              border: "1px solid lightgrey",
              outline:"none"
            }}
            placeholder="select date"
            onChange={handleDateChange}
            value={moment(selectedBirthDate).format("DD-MM-YYYY")}
          /> */}

          <Space direction="vertical">
            <DatePicker
              name="dob"
              format={"DD-MM-YYYY"}
              defaultValue={selectedBirthDate}
              // value={moment(selectedBirthDate, "YYYY-MM-DD")}
              onChange={handleDateChange}
              // onChange={(e) => handleDateChange(e, "dob")}
            />
          </Space>
        </Form.Item>
        <Form.Item name="uniqueId" label="Email ID">
          <Input
            name="uniqueId"
            type="gmail"
            placeholder="Email ID"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[
            {
              required: true,
              message: "Please input your residency address!",
            },
          ]}
        >
          <TextArea
            placeholder="Address"
            name="address"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="image"
          label="Profile Image"
          getValueFromEvent={(e) => e?.fileList}
          rules={[
            {
              required: true,
              message: "Please input Owner Image!",
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
          name="aadharCardImage"
          label="Aadhar Card Image"
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
          rules={[
            {
              required: true,
              message: "Please input Aadhar Card Image!",
            },
          ]}
        >
          <Upload
            maxCount={2}
            action="/upload.do"
            fileList={imagesArrayData.aadharCardImages || []}
            listType="picture-card"
            onChange={({ fileList }) => handleAadharCardChange(fileList)}
          >
            {imagesArrayData.aadharCardImages.length >= 2 ? null : (
              <div>
                <PlusOutlined />
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 7,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddOrEditSalesOfficer;
