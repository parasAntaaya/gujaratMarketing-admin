import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Form, Select, Input, Upload, Card, DatePicker } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BASE_URL from "../../utils/baseURL";

const AddOrEditSalesPerson = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const formRef = useRef();
  const { TextArea } = Input;
  const { Option } = Select;
  const FormData = require("form-data");

  const user = useSelector((state) => state.auth.user);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedJoiningDate, setSelectedJoiningDate] = useState(null);
  const [selectedBirthDate, setSelectedBirthDate] = useState(null);
  const [agencyData, setAgencyData] = useState();
  const [selectedAgency, setSelectedAgency] = useState();

  const [panCardImagePath, setPanCardImage] = useState();
  const [aadharCardImageUrls, setAadharCardImageUrls] = useState([]);
  const [drivingLicenceImageUrls, setdrivingLicenceImageUrls] = useState([]);
  const [imagesArrayData, setImagesArrayData] = useState({
    aadharCardImages: [],
    image: [],
    panCardImage: [],
    drivingLicenceImage: [],
  });

  const [data, setData] = useState({
    name: "",
    dob: "",
    joiningDate: "",
    contact: {
      countryCode: "",
      mobile: "",
    },
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
    gender: "",
    image: [],
    aadharCardImage: [],
    panCardNumber: "",
    drivingLicenceImage: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    agencyId: "",
    role: "",
    roleId: "",
  });

  const fetchAgencyData = () => {
    setIsLoading(true);
    const params = {
      page: 1,
      limit: 100000,
    };
    try {
      axios
        .post("admin/agency/get/all", params)
        .then((response) => {
          setIsLoading(false);
          setAgencyData(response?.data?.data?.agency_data);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log("error-->>>>>", error?.message);
        });
    } catch (error) {
      console.log("error -=====>>", error);
    }
  };
  useEffect(() => {
    fetchAgencyData();
  }, []);

  const onFinish = async () => {
    const updateData = {
      name: data?.name,
      dob: moment(selectedBirthDate).format("YYYY-MM-DD"),
      joiningDate: moment(selectedJoiningDate).format("YYYY-MM-DD"),
      contact: {
        countryCode: "+91",
        mobile: data?.mobile,
      },
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
      gender: data?.gender,
      image: imagesArrayData.image,
      aadharCardImage: aadharCardImageUrls,
      panCardImage: panCardImagePath,
      panCardNumber: data?.panCardNumber,
      drivingLicenceImage: drivingLicenceImageUrls,
      bankName: data?.bankName,
      accountNumber: data?.accountNumber,
      ifscCode: data?.ifscCode,
      agencyId: selectedAgency,
      role: "salesman",
      roleId: "64c7acdc4836de685c930039",
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
      if (imagesArrayData?.panCardImage?.length > 0) {
        const panCardImage = await uploadImage(imagesArrayData.panCardImage[0]);
        updateData.panCardImage = panCardImage;
      }
      if (imagesArrayData?.drivingLicenceImage?.length > 0) {
        const drivingLicenceImage = await uploadImage(
          imagesArrayData.drivingLicenceImage[0]
        );
        updateData.drivingLicenceImage = drivingLicenceImage;
      }
      if (location.pathname === "/salesman/edit-salesman") {
        axios
          .post("admin/user/edit", { ...updateData, _id: state.data._id })
          .then((response) => {
            toast.success("SalesMan Sucessfully Update");
            navigate("/salesman");
          })
          .catch((error) => {
            console.log("error------", error);
          });
      } else {
        axios
          .post("admin/user/add", updateData)
          .then((response) => {
            if (response.status === 200) {
              toast.success("SalesMan Sucessfully Add");
              navigate("/salesman");
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
  const handlePanCardImageChange = (fileList) => {
    const updatedFileList = fileList.map((file) => {
      if (!file.uid) {
        file.uid = Date.now().toString();
      }
      return file;
    });
    setImagesArrayData((prevData) => ({
      ...prevData,
      panCardImage: updatedFileList,
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
  const handledrivingLicenceImageChange = (fileList) => {
    const updatedFileList = fileList.map((file) => {
      if (!file.uid) {
        file.uid = Date.now().toString();
      }
      return file;
    });
    setImagesArrayData((prevData) => ({
      ...prevData,
      drivingLicenceImage: updatedFileList,
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
  const handleDateChange = (e, type) => {
    const selectedDate = e;
    if (type === "joiningDate") {
      setSelectedJoiningDate(selectedDate);
    } else if (type === "dob") {
      setSelectedBirthDate(selectedDate);
    }
    setData((prevData) => ({
      ...prevData,
      [type]: selectedDate,
    }));
  };
  const fetchData = () => {
    if (location.pathname == "/salesman/edit-salesman") {
      setSelectedJoiningDate(
        state.data?.joiningDate ? moment(state.data?.joiningDate) : moment()
      );
      setSelectedBirthDate(
        state.data?.dob ? moment(state.data?.dob) : moment()
      );
      const panCardImageUrl = state.data.panCardImage || "";
      const drivingLicenceImageUrls = state.data.drivingLicenceImage || "";
      const ownerImageUrl = state.data.image || "";
      const aadharCardImages = state.data.aadharCardImage || [];
      const aadharCardImagesFormatted = aadharCardImages.map((url) => ({
        uid: url,
        url: `${BASE_URL}${url}`,
      }));
      setImagesArrayData((prevData) => ({
        ...prevData,
        aadharCardImage: aadharCardImagesFormatted,
        panCardImage: panCardImageUrl
          ? [{ uid: panCardImageUrl, url: `${panCardImageUrl}` }]
          : [],
        drivingLicenceImage: drivingLicenceImageUrls
          ? [
              {
                uid: drivingLicenceImageUrls,
                url: `${drivingLicenceImageUrls}`,
              },
            ]
          : [],
        image: ownerImageUrl
          ? [{ uid: ownerImageUrl, url: `${ownerImageUrl}` }]
          : [],
      }));
      formRef.current.setFieldsValue({
        ...state.data,
        agencyId: state.data.agencyId?.agencyName || null,
        name: state.data?.name,
        joiningDate: moment(state.data.joiningDate),
        dob: moment(state.data.dob),
        mobile: state.data?.contact?.mobile,
        address: state.data?.address?.address,
        gender: state.data?.gender,
        image: state.data?.image,
        aadharCardImage: state.data?.aadharCardImage,
        panCardNumber: state.data?.panCardNumber,
        bankName: state.data?.bankName,
        accountNumber: state.data.accountNumber,
        ifscCode: state.data?.ifscCode,
        role: "salesman",
        roleId: "64c7acdc4836de685c930039",
      });
      setData({
        ...state.data,
        name: state.data?.name,
        name: state.data?.name,
        dob: state.data.dob ? moment(state.data.dob, "YYYY-MM-DD") : null,
        joiningDate: state.data.joiningDate
          ? moment(state.data.joiningDate, "YYYY-MM-DD")
          : null,
        mobile: state?.data?.contact?.mobile,
        address: {
          address: state.data?.address?.address,
          googleAddress: state?.data?.address?.googleAddress,
          city: state?.data?.address?.city,
          state: state?.data?.address?.state,
          zipCode: state?.data?.address?.zipcode,
          country: state?.data?.address?.country,
          timeZone: state?.data?.address?.timeZone,
          latitude: state?.data?.address?.latitude,
          longitude: state?.data?.address?.longitude,
        },
        gender: "female",
        image: state.data?.image,
        aadharCardImage: state.data?.aadharCardImage,
        panCardNumber: state.data?.panCardNumber,
        drivingLicenceImage: state.data?.drivingLicenceImage,
        bankName: "BOB",
        accountNumber: "145236",
        ifscCode: "123654",
        agencyId: state.data?.agencyId?.agencyName || null,
        role: "salesman",
        roleId: "64c7acdc4836de685c930039",
      });
    }
  };
  useEffect(() => {
    fetchData();
    fetchAgencyData();
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
              {state ? "Edit Sales Person" : "Add Sales Person"}
            </h4>
          </div>
        </div>
      }
    >
      <Form
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
      >
        {user.isSuperAdmin && (
          <Form.Item
            name="agencyId"
            label="Select Agency"
            rules={[
              {
                required: true,
                message: "Please select an agency!",
              },
            ]}
          >
            <Select
              name="agencyId"
              showSearch={true}
              filterOption={(input, option) =>
                option.label.includes(input) ||
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              placeholder="Select an agency"
              style={{ width: "70%" }}
              options={agencyData?.map((agency) => ({
                label: agency.agencyName,
                value: agency._id,
              }))}
              onChange={(value) => setSelectedAgency(value)}
              value={selectedAgency}
            />
          </Form.Item>
        )}
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
          name="joiningDate"
          label="Joining Date"
          rules={[
            {
              required: true,
              message: "Please input your joiningDate!",
            },
          ]}
        >
          <DatePicker
            name="joiningDate"
            value={data.joiningDate}
            format={"DD-MM-YYYY"}
            onChange={(e) => handleDateChange(e, "joiningDate")}
          />
        </Form.Item>
        <Form.Item
          name="mobile"
          label="Mobile Number"
          rules={[
            {
              required: true,
              message: "Please input your Mobile Number!",
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
          name="gender"
          label="Gender"
          rules={[
            {
              required: true,
              message: "Please select your gender!",
            },
          ]}
        >
          <Select
            placeholder="Select Gender"
            style={{
              width: "70%",
            }}
            name="gender"
            onChange={(value) =>
              handleInputChange({ target: { name: "gender", value } })
            }
          >
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="dob"
          label="Date Of Birth"
          rules={[
            {
              required: true,
              message: "Please input your birthdate!",
            },
          ]}
        >
          <DatePicker
            name="dob"
            value={moment(data.dob)}
            format={"DD-MM-YYYY"}
            onChange={(e) => handleDateChange(e, "dob")}
          />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[
            {
              required: true,
              message: "Please input your address!",
            },
          ]}
        >
          <TextArea
            placeholder="Address"
            name="address"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item name="bankName" label="Bank Name">
          <Input
            placeholder="Bank Name"
            name="bankName"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item name="accountNumber" label="Account Number">
          <Input
            placeholder="Account Number"
            name="accountNumber"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item name="ifscCode" label="IFSC code">
          <Input
            placeholder="IFSC code"
            name="ifscCode"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item name="panCardNumber" label="Pan No">
          <Input
            placeholder="Pan Number"
            name="panCardNumber"
            onChange={handleInputChange}
          />
        </Form.Item>
        <br />
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
            fileList={imagesArrayData.aadharCardImages}
            listType="picture-card"
            onChange={({ fileList }) => handleAadharCardChange(fileList)}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        <Form.Item
          name="panCardImage"
          label="Pan Card Image"
          getValueFromEvent={(e) => e?.fileList}
          rules={[
            {
              required: true,
              message: "Please input Pan Card Image!",
            },
          ]}
        >
          <Upload
            maxCount={1}
            fileList={imagesArrayData.panCardImage}
            action="/upload.do"
            listType="picture-card"
            onChange={({ fileList }) => handlePanCardImageChange(fileList)}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        <Form.Item
          name="drivingLicenceImage"
          label="Driving Licence Image"
          getValueFromEvent={(e) => e?.fileList}
        >
          <Upload
            maxCount={1}
            action="/upload.do"
            fileList={imagesArrayData.drivingLicenceImage}
            listType="picture-card"
            onChange={({ fileList }) =>
              handledrivingLicenceImageChange(fileList)
            }
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
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddOrEditSalesPerson;
