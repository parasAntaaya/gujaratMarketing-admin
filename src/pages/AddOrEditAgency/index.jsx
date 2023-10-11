import "./AddOrEditAgency.css";
import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Upload,
  Card,
  DatePicker,
  Tooltip,
  Space,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import BASE_URL from "../../utils/baseURL";
import { Switch } from "antd";

const { TextArea } = Input;
const FormData = require("form-data");
const AddOrEditAgency = (props) => {
  const formRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [selectedJoiningDate, setSelectedJoiningDate] = useState(moment());
  const [selectedBirthDate, setSelectedBirthDate] = useState(moment());
  const [imagesArrayData, setImagesArrayData] = useState({
    aadharCardImages: [],
    image: [],
    gumastadharaImage: [],
    foodLicenceImage: [],
    panCardImage: [],
    gstImage: [],
  });
  const [aadharCardImagePath, setAadharCardImagePath] = useState([]);
  const [aadharCardImageUrls, setAadharCardImageUrls] = useState([]);

  const [gumastadharaImagePath, setGumastadharaImagePath] = useState([]);
  const [foodLicenceImagePath, setFoodLicenceImagePath] = useState([]);
  const [panCardImagePath, setPanCardImagePath] = useState([]);
  const [gstImagePath, setgstImagePath] = useState([]);
  const [imagePath, setImagePath] = useState([]);
  const [access, setAccess] = useState(false);
  const [transfer, setTransfer] = useState(false);

  const { state } = location;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    agencyName: "",
    joiningDate: "",
    ownerName: "",
    contact: {
      countryCode: "",
      mobile: "",
    },
    dob: "",
    area: "",
    email: "",
    officialEmail: "",
    setting: "",
    godownAddress: {
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
    image: [""],
    aadharCardImage: [],
    panCardImage: "",
    panCardNumber: "",
    foodLicenceImage: "",
    gumastadharaImage: "",
    gstImage: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    creditLimit: "",
    creditDays: "",
    active: true,
    isStockTransfer: "",
    role: "",
    roleId: "",
  });
  const onFinish = async () => {
    let updateData = {
      joiningDate: data?.joiningDate,
      ownerName: data?.ownerName,
      contact: {
        countryCode: "+91",
        mobile: data?.mobile,
      },
      dob: data?.dob,
      setting: data?.setting,
      godownAddress: {
        address: data?.godownAddress?.godownAddress,
        googleAddress: "google address-static",
        city: "city-static",
        state: "state-static",
        zipCode: "zipCode-static",
        country: "country-static",
        timeZone: "timeZone-static",
        latitude: "123",
        longitude: "234",
      },
      creditLimit: data?.creditLimit,
      creditDays: data?.creditDays,

      image: imagePath,
      gstImage: gstImagePath,
      panCardImage: panCardImagePath,
      foodLicenceImage: foodLicenceImagePath,
      gumastadharaImage: gumastadharaImagePath,
      aadharCardImage: aadharCardImageUrls,
      panCardNumber: data?.panCardNumber,
      agencyName: data?.agencyName,
      email: data?.email,
      officialEmail: data?.officialEmail,
      area: data?.area,
      bankName: data?.bankName,
      accountNumber: data?.accountNumber,
      ifscCode: data?.ifscCode,
      active: true,
      setting: access,
      isStockTransfer:transfer,
      role: "agency",
      roleId: "64a40299f200c0d9a1ace7f9",
    };
    console.log("updateData---------------", updateData);
    try {
      const uploadImage = async (file) => {
        try {
          setIsLoading(true);
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
            setIsLoading(false);
            return response.data.data.image;
          }
        } catch (error) {
          setIsLoading(false);
          console.log("uploadImage error=====", error);
          throw error;
        }
      };
      if (imagesArrayData?.image?.length > 0) {
        const image = await uploadImage(imagesArrayData.image[0]);
        updateData.image = image;
        // setImagePath(image);
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
        // setPanCardImagePath(panCardImage);
      }
      if (imagesArrayData?.gstImage?.length > 0) {
        const gstImage = await uploadImage(imagesArrayData.gstImage[0]);
        updateData.gstImage = gstImage;
        // setgstImagePath(gstImage);
      }
      if (imagesArrayData?.foodLicenceImage?.length > 0) {
        const foodLicenceImage = await uploadImage(
          imagesArrayData.foodLicenceImage[0]
        );
        updateData.foodLicenceImage = foodLicenceImage;
        // setFoodLicenceImagePath(foodLicenceImage);
      }
      if (imagesArrayData?.gumastadharaImage?.length > 0) {
        const gumastadharaImage = await uploadImage(
          imagesArrayData.gumastadharaImage[0]
        );
        updateData.gumastadharaImage = gumastadharaImage;
        // setGumastadharaImagePath(gumastadharaImage);
      }
      if (location.pathname === "/agency/edit-agency") {
        console.log("Update data :", updateData);
        setIsLoading(true);
        axios
          .post("admin/agency/edit", { ...updateData, _id: state.data?._id })
          .then((response) => {
            console.log("response------", response);
            setIsLoading(false);
            toast.success("Agency Sucessfully Update");
            navigate("/agency");
          })
          .catch((error) => {
            setIsLoading(false);
            toast.error("Agency Couldn't Updated");
            console.log("error------", error);
          });
      } else {
        console.log("Update data :", updateData);
        setIsLoading(true);
        await axios
          .post("admin/agency/add", updateData)
          .then((response) => {
            if (response.status === 200) {
              console.log("response----", response);
              setIsLoading(false);
              toast.success("Agency Sucessfully Add");
              navigate("/agency");
            }
          })
          .catch((error) => {
            setIsLoading(false);
            toast.error(error?.message);
          });
      }
    } catch (error) {
      setIsLoading(false);
      console.log("error=====", error);
      return;
    }
    
  };

  // const handleImageChange = (fileList) => {
  //   const updatedFileList = fileList.map((file) => {
  //     if (!file.uid) {
  //       file.uid = Date.now().toString();
  //     }
  //     return file;
  //   });
  //   setImagesArrayData((prevData) => ({
  //     ...prevData,
  //     image: updatedFileList,
  //   }));
  // };
  const handlegstImageChange = (fileList) => {
    const updatedFileList = fileList.map((file) => {
      if (!file.uid) {
        file.uid = Date.now().toString();
      }
      return file;
    });
    setImagesArrayData((prevData) => ({
      ...prevData,
      gstImage: updatedFileList,
    }));
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
  // const handleAadharCardChange = async (fileList) => {
  //   const updatedFileList = fileList.map((file) => {
  //     if (!file.uid) {
  //       file.uid = Date.now().toString();
  //     }
  //     if (!file.url) {
  //       file.url = "";
  //     }
  //     return file;
  //   });
  //   setImagesArrayData((prevData) => ({
  //     ...prevData,
  //     aadharCardImages: updatedFileList,
  //   }));
  // };
  // const handlePanCardImageChange = (fileList) => {
  //   const updatedFileList = fileList.map((file) => {
  //     if (!file.uid) {
  //       file.uid = Date.now().toString();
  //     }
  //     return file;
  //   });
  //   setImagesArrayData((prevData) => ({
  //     ...prevData,
  //     panCardImage: updatedFileList,
  //   }));
  // };
  const handleFoodLicenceImageChange = (fileList) => {
    const updatedFileList = fileList.map((file) => {
      if (!file.uid) {
        file.uid = Date.now().toString();
      }
      return file;
    });
    setImagesArrayData((prevData) => ({
      ...prevData,
      foodLicenceImage: updatedFileList,
    }));
  };
  const handleGumastaLicenceChange = (fileList) => {
    const updatedFileList = fileList.map((file) => {
      if (!file.uid) {
        file.uid = Date.now().toString();
      }
      return file;
    });
    setImagesArrayData((prevData) => ({
      ...prevData,
      gumastadharaImage: updatedFileList,
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "godownAddress"
        ? {
            godownAddress: {
              ...prevData?.godownAddress,
              [name]: value,
            },
          }
        : {}),
    }));
  };
  const handleDateChange = (date, type) => {
    const selectedDate = date.format("YYYY-MM-DD");
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
    if (location.pathname == "/agency/edit-agency") {
      console.log("state========", state);
      if (state && state.data) {
        setSelectedJoiningDate(
          state.data?.joiningDate ? moment(state.data?.joiningDate) : moment()
        );
        setSelectedBirthDate(
          state.data?.dob ? moment(state.data?.dob) : moment()
        );
        const panCardImageUrl = state.data.panCardImage || "";
        const foodLicenceImageUrl = state.data.foodLicenceImage || "";
        const gumastadharaImageUrl = state.data.gumastadharaImage || "";
        const ownerImageUrl = state.data.image || "";
        const gstImageUrls = state.data.gstImage || "";
        const aadharCardImages = state.data.aadharCardImage || [];
        const aadharCardImagesFormatted = aadharCardImages.map((url) => ({
          uid: url,
          url: `${BASE_URL}${url}`,
        }));

        setAccess(state.data.setting);
        

        setImagesArrayData((prevData) => ({
          ...prevData,
          aadharCardImage: aadharCardImagesFormatted,
          panCardImage: panCardImageUrl
            ? [{ uid: panCardImageUrl, url: `${panCardImageUrl}` }]
            : [],
          foodLicenceImage: foodLicenceImageUrl
            ? [
                {
                  uid: foodLicenceImageUrl,
                  url: `${foodLicenceImageUrl}`,
                },
              ]
            : [],
          gumastadharaImage: gumastadharaImageUrl
            ? [
                {
                  uid: gumastadharaImageUrl,
                  url: `${gumastadharaImageUrl}`,
                },
              ]
            : [],
          image: ownerImageUrl
            ? [{ uid: ownerImageUrl, url: `${ownerImageUrl}` }]
            : [],
          gstImage: gstImageUrls
            ? [{ uid: gstImageUrls, url: `${gstImageUrls}` }]
            : [],
        }));
        form.setFieldsValue({
          ...state.data,
          joiningDate: moment(state.data?.joiningDate),
          dob: moment(state.data?.dob),
          ownerName: state.data?.ownerName,
          mobile: state.data?.contact?.mobile,
          residencyAddress: state?.data?.address?.address,
          godownAddress: state?.data?.godownAddress.address,
          panCardNumber: state.data.panCardNumber,
          creditLimit: state.data?.creditLimit,
          creditDays: state.data?.creditDays,
          agencyName: state.data?.agencyName,
          email: state.data?.email,
          officialEmail: state.data?.officialEmail,
          area: state.data?.area,
          bankName: state.data?.bankName,
          accountNumber: state.data?.accountNumber,
          ifscCode: state.data?.ifscCode,
          role: "agency",
          roleId: "64a40299f200c0d9a1ace7f9",
        });
        setData({
          ...state.data,
          creditLimit: state?.data?.creditLimit,
          creditDays: state?.data?.creditDays,
          residencyAddress: state?.data?.address?.address,
          panCardNumber: state.data?.panCardNumber,
          agencyName: state?.data?.agencyName,
          joiningDate: state?.data?.joiningDate,
          ownerName: state?.data?.ownerName,
          mobile: state?.data?.contact?.mobile,
          dob: state?.data?.dob,
          godownAddress: {
            godownAddress: state?.data?.godownAddress?.address,
            googleAddress: state?.data?.godownAddress?.googleAddress,
            city: state?.data?.godownAddress?.city,
            state: state?.data?.godownAddress?.state,
            zipCode: state?.data?.godownAddress?.zipcode,
            country: state?.data?.godownAddress?.country,
            timeZone: state?.data?.godownAddress?.timeZone,
            latitude: state?.data?.godownAddress?.latitude,
            longitude: state?.data?.godownAddress?.longitude,
          },
          email: state.data?.email,
          officialEmail: state?.data?.officialEmail,
          area: state?.data?.area,
          bankName: state?.data?.bankName,
          accountNumber: state?.data?.accountNumber,
          ifscCode: state?.data?.ifscCode,
          role: "agency",
          roleId: "64a40299f200c0d9a1ace7f9",
        });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [state, form]);
  // useEffect(() => {
  //   if (location.pathname === "/agency/edit-agency") {
  //     fetchData();
  //   }
  // }, [location.pathname]);

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
              {state ? "Edit Agency" : "Add Agency"}
            </h4>
          </div>
        </div>
      }
    >
      <Form
        form={form}
        labelCol={{
          flex: "180px",
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
          name="ownerName"
          label=" Owner Name"
          rules={[
            {
              required: true,
              message: "Please input Name!",
            },
          ]}
        >
          <Input
            placeholder=" Owner Name"
            name="ownerName"
            onChange={handleInputChange}
          />
        </Form.Item>
        <br />
        <Form.Item
          name="agencyName"
          label="Agency Name"
          rules={[
            {
              required: true,
              message: "Please input your Agency Name!",
            },
          ]}
        >
          <Input
            placeholder="Agency Name"
            name="agencyName"
            onChange={handleInputChange}
          />
        </Form.Item>
        <br />
        <Form.Item
          name="joiningDate"
          label="Joining Date"
          rules={[
            {
              required: true,
              message: "Please input your Joining Date!",
            },
          ]}
        >
          <DatePicker
            name="joiningDate"
            style={{ width: "100%" }}
            format={"DD-MM-YYYY"}
            value={moment(data?.joiningDate)}
            onChange={(date) => handleDateChange(date, "joiningDate")}
          />
        </Form.Item>
        <br />
        <Form.Item name="email" label="Email">
          <Input
            placeholder="Email"
            name="email"
            onChange={handleInputChange}
          />
        </Form.Item>
        <br />
        <Form.Item
          name="officialEmail"
          label="Official Email"
          rules={[
            {
              required: true,
              message: "Please input your Official Email!",
            },
          ]}
        >
          <Input
            placeholder="Official Gmail"
            name="officialEmail"
            onChange={handleInputChange}
          />
        </Form.Item>
        <br />
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
        <br />
        <Form.Item
          name="dob"
          label="Date Of Birth"
          rules={[
            {
              required: true,
              message: "Please input your Birth Date!",
            },
          ]}
        >
          <DatePicker
            name="dob"
            style={{ width: "100%" }}
            format={"DD-MM-YYYY"}
            value={moment(data?.dob)}
            onChange={(date) => handleDateChange(date, "dob")}
          />
        </Form.Item>
        <br />
        <Form.Item
          name="area"
          label="Area"
          rules={[
            {
              required: true,
              message: "Please input your area!",
            },
          ]}
        >
          <Input placeholder="Area" name="area" onChange={handleInputChange} />
        </Form.Item>
        <br />
        <Form.Item
          name="godownAddress"
          label="Godown Address"
          rules={[
            {
              required: true,
              message: "Please input your Godown Address!",
            },
          ]}
        >
          <TextArea
            placeholder="Godown Address"
            name="godownAddress"
            onChange={handleInputChange}
          />
        </Form.Item>
        <br />
        {/* --------------------------------------------------------------------------------- */}
        <Form.Item
          name="panCardNumber"
          label="Pan No"
          rules={[
            {
              required: true,
              message: "Please input your Pan Number!",
            },
          ]}
        >
          <Input
            name="panCardNumber"
            placeholder="Pan No"
            onChange={handleInputChange}
          />
        </Form.Item>
        <br />
        {/* --------------------------------------------------------------------------------- */}
        <Form.Item name="setting" label="Stock Transfer Access">
          {/* <Switch onChange={(value) => {console.log("Val :", value)}} /> */}
          <Switch
            // value={access}
            checked={access}
            onChange={(value) => {
              setAccess(value);
            }}
          />
        </Form.Item>
        <br />
        {/* ------------------------------------------------------------------------------- */}
        <Form.Item name="isStockTransfer" label="Agency To Agency Transfer">
          <Switch
            value={transfer}
            name="isStockTransfer"
            checked={transfer}
            onChange={(value) => {
              setTransfer(value);
              console.log("value",value);
            }}
          />
        </Form.Item>
        <br />
        {/* ------------------------------------------------------------------------------- */}
        <br />
        <hr />
        <h5>Bank details</h5>
        <br />
        <Form.Item
          name="bankName"
          label="Bank Name"
          rules={[
            {
              required: true,
              message: "Please input your Bank Name!",
            },
          ]}
        >
          <Input
            name="bankName"
            placeholder="Bank Name"
            onChange={handleInputChange}
          />
        </Form.Item>
        <br />
        <Form.Item
          name="accountNumber"
          label="Account Number"
          rules={[
            {
              required: true,
              message: "Please input your Account Number!",
            },
          ]}
        >
          <Input
            name="accountNumber"
            placeholder="Account Number"
            onChange={handleInputChange}
          />
        </Form.Item>
        <br />
        {/* ------------------------------------------------------------------------------- */}
        <Form.Item
          name="ifscCode"
          label="IFSC code"
          rules={[
            {
              required: true,
              message: "Please input your IFSC Code!",
            },
          ]}
        >
          <Input
            name="ifscCode"
            placeholder="IFSC code"
            onChange={handleInputChange}
          />
        </Form.Item>
        <br />
        {/* ------------------------------------------------------------------------------- */}
        <Form.Item name="creditLimit" label="Credit limit">
          <Input
            name="creditLimit"
            placeholder="Credit Limit"
            onChange={handleInputChange}
          />
        </Form.Item>
        <br />
        {/* ------------------------------------------------------------------------------- */}
        <Form.Item name="creditDays" label="Credit Days">
          <Input
            name="creditDays"
            placeholder="Credit Days"
            onChange={handleInputChange}
          />
        </Form.Item>
        <br />
        <hr />
        <Form.Item
          name="image"
          label="Owner Image"
          // valuePropName="fileList"
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
            // previewFile={false}
            fileList={imagesArrayData.image}
            action="/upload.do"
            listType="picture-card"
            onChange={({ fileList }) => {
              setImagesArrayData((prevData) => ({
                ...prevData,
                image: fileList,
              }));
            }}
            // onChange={({ fileList }) => handleImageChange(fileList)}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        {/* ------------------------------------------------------------------------------- */}
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
            // onChange={({ fileList }) => {
            //   setImagesArrayData((prevData) => ({
            //     ...prevData,
            //     aadharCardImages: fileList,
            //   }));
            // }}
            onChange={({ fileList }) => handleAadharCardChange(fileList)}
          >
            {imagesArrayData.aadharCardImages.length >= 2 ? null : (
              <div>
                <PlusOutlined />
              </div>
            )}
          </Upload>
        </Form.Item>

        {/* ------------------------------------------------------------------------------- */}
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
            fileList={imagesArrayData.panCardImage || []}
            action="/upload.do"
            listType="picture-card"
            onChange={({ fileList }) => {
              setImagesArrayData((prevData) => ({
                ...prevData,
                panCardImage: fileList,
              }));
            }}
            // onChange={({ fileList }) => handlePanCardImageChange(fileList)}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        <Form.Item
          name="gstImage"
          label="Gst Image"
          // valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
          rules={[
            {
              required: true,
              message: "Please Add Gst Image!",
            },
          ]}
        >
          <Upload
            maxCount={1}
            fileList={imagesArrayData.gstImage || []}
            action="/upload.do"
            listType="picture-card"
            onChange={({ fileList }) => {
              setImagesArrayData((prevData) => ({
                ...prevData,
                gstImage: fileList,
              }));
            }}
            // onChange={({ fileList }) => handlegstImageChange(fileList)}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        {/* ------------------------------------------------------------------------------- */}
        <Form.Item
          name="foodLicenceImage"
          label="Food Licence Image"
          getValueFromEvent={(e) => e?.fileList}
        >
          <Upload
            maxCount={1}
            fileList={imagesArrayData.foodLicenceImage || []}
            action="/upload.do"
            listType="picture-card"
            onChange={({ fileList }) => {
              setImagesArrayData((prevData) => ({
                ...prevData,
                foodLicenceImage: fileList,
              }));
            }}
            // onChange={({ fileList }) => handleFoodLicenceImageChange(fileList)}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        {/* ------------------------------------------------------------------------------- */}
        <Form.Item
          name="gumastadharaImage"
          label="Gumasta Licence"
          getValueFromEvent={(e) => e?.fileList}
        >
          <Upload
            fileList={imagesArrayData.gumastadharaImage || []}
            maxCount={1}
            action="/upload.do"
            listType="picture-card"
            onChange={({ fileList }) => {
              setImagesArrayData((prevData) => ({
                ...prevData,
                gumastadharaImage: fileList,
              }));
            }}
            // onChange={({ fileList }) => handleGumastaLicenceChange(fileList)}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        {/* ------------------------------------------------------------------------------- */}
        <br />
        <hr />

        <br />
        <br />
        {/* --------------------------------------------------------------------------------- */}
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
export default AddOrEditAgency;
