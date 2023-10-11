import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, Card, Select } from "antd";
import { DatePicker } from "antd";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import BASE_URL from "../../utils/baseURL";
import axios from "axios";
import { toast } from "react-toastify";
const { TextArea } = Input;
const AddOrEditDeliveryman = (props) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const [initialValues, setInitialValues] = useState({});
  const [selectedJoiningDate, setSelectedJoiningDate] = useState(null);
  const [selectedBirthDate, setSelectedBirthDate] = useState(null);
  const { state } = location;
  const formRef = useRef();
  const [agencyData, setAgencyData] = useState();
  const [selectedAgency, setSelectedAgency] = useState();
  const [imagesArrayData, setImagesArrayData] = useState({
    aadharCardImages: [],
    image: [],
    panCardImage: [],
    drivingLicenceImage: [],
  });
  const [ownerPath, setOwnerPath] = useState();
  const [panCardImagePath, setPanCardImage] = useState();
  const [aadharCardImageUrls, setAadharCardImageUrls] = useState([]);
  const [drivingLicenceImageUrls, setdrivingLicenceImageUrls] = useState([]);
  const [data, setData] = useState({
    name: "",
    dob: "",
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
    image: "",
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
    const params = {
      page: 1,
      limit: 100000,
    };
    try {
      axios
        .post("admin/agency/get/all", params)
        .then((response) => {
          console.log("response----", response);
          setAgencyData(response?.data?.data?.agency_data);
        })
        .catch((error) => {
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
      dob: selectedBirthDate,
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
      image: imagesArrayData.image,
      aadharCardImage: aadharCardImageUrls,
      panCardImage: panCardImagePath,
      panCardNumber: data?.panCardNumber,
      drivingLicenceImage: drivingLicenceImageUrls,
      bankName: data?.bankName,
      accountNumber: data?.accountNumber,
      ifscCode: data?.ifscCode,
      agencyId: selectedAgency,
      role: "deliveryman",
      roleId: "64a7f89431428923351b75ef",
    };
    console.log("updateData------------------------", updateData);

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
      console.log("updateData--------------------".updateData);
      if (location.pathname === "/deliveryman/edit-deliveryman") {
        axios
          .post("admin/user/edit", { ...updateData, _id: state.data._id })
          .then((response) => {
            console.log("response------", response);
            toast.success("DeliveryMan Sucessfully Update");
            navigate("/deliveryman");
          })
          .catch((error) => {
            console.log("error------", error);
          });
      } else {
        axios
          .post("admin/user/add", updateData)
          .then((response) => {
            console.log("add delivery man--------->response", response);
            if (response.status === 200) {
              console.log("response----", response);
              toast.success("DeliveryMan Sucessfully Add");
              navigate("/deliveryman");
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
    const selectedDate = e.format("YYYY-MM-DD");
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
    if (location.pathname == "/deliveryman/edit-deliveryman") {
      console.log("state------------", state);
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
      const selectedAgencyId = state.data?.agencyId;

      formRef.current.setFieldsValue({
        ...state.data,
        name: state.data?.name,
        dob: moment(state.data.dob),
        mobile: state.data?.contact?.mobile,
        address: state.data?.address?.address,
        image: state.data?.image,
        aadharCardImage: state.data?.aadharCardImage,
        panCardNumber: state.data?.panCardNumber,
        drivingLicenceImage: state.data?.drivingLicenceImage,
        bankName: state.data.bankName,
        accountNumber: state.data.accountNumber,
        ifscCode: state.data.bankName,
        agencyId: state.data.agencyId?.agencyName || null,
        role: "deliveryman",
        roleId: "64a7f89431428923351b75ef",
      });
      setData({
        ...state.data,
        name: state.data?.name,
        dob: state.data.dob ? moment(state.data.dob, "YYYY-MM-DD") : null,
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
        panCardNumber: state.data?.panCardNumber,
        drivingLicenceImage: state.data?.drivingLicenceImage,
        bankName: state.data?.bankName,
        accountNumber: state?.data.accountNumber,
        ifscCode: state.data?.bankName,
        agencyId:state.data.agencyId,
        role: "deliveryman",
        roleId: "64a7f89431428923351b75ef",
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
            icon={<LeftOutlined className="back-icon" />}
          />
          <div>
            <h4 className="fw-bold fs-4">
              {state ? "Edit Delivery Person" : "Add Delivery Person"}
            </h4>
          </div>
        </div>
      }
    >
      <Form
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
          name="mobile"
          label="Mobile Number"
          rules={[
            {
              required: true,
              message: "Please input your mobile number!",
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
          name="bankName"
          label="Bank Name"
        >
          <Input
            placeholder="Bank Name"
            name="bankName"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="accountNumber"
          label="Account Number"
        >
          <Input
            placeholder="Account Number"
            name="accountNumber"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="ifscCode"
          label="IFSC code"
        >
          <Input
            placeholder="IFSC code"
            name="ifscCode"
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="panCardNumber"
          label="Pan No"
        >
          <Input
            placeholder="Pan Number"
            name="panCardNumber"
            onChange={handleInputChange}
          />
        </Form.Item>
        <br/>
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
          // fileList={aadharCardImagePath}
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
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddOrEditDeliveryman;
