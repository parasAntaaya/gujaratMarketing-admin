import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, Card, Select, Upload, Divider } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../utils/baseURL";
import { toast } from "react-toastify";

const { TextArea } = Input;

const AddOrEditFreezeBooking = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [form] = Form.useForm();

  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [agencyData, setAgencyData] = useState(null);
  const [fridgeData, setFridgeData] = useState(null);

  const [selectedShopStatus, setSelectedShopStatus] = useState();
  const [selectedAgency, setSelectedAgency] = useState();
  const [selectedFridge, setSelectedFridge] = useState();
  const [aadharCardImageUrls, setAadharCardImageUrls] = useState([]);
  const [panCardImagePath, setPanCardImagePath] = useState([]);
  const [signatureImagePath, setsignatureImagePath] = useState([]);
  const [shopImagePath, setShopImagePath] = useState([]);
  const [shopKeeperImagePath, setShopKeeperImagePath] = useState([]);
  const [shopkeeperImageWithShopPath, setshopkeeperImageWithShopPath] =
    useState([]);

  const [imagePath, setImagePath] = useState();
  const [imagesArrayData, setImagesArrayData] = useState({
    image: [],
    aadharCardImages: [],
    panCardImage: [],
    signatureImage: [],
    shopImage: [],
    shopKeeperImage: [],
    shopkeeperImageWithShop: [],
    deliveryProofImage: [],
  });

  const [data, setData] = useState({
    name: "",
    shopName: "",
    contact: {
      countryCode: "+",
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
    panCardImage: "",
    signatureImage: "",
    shopImage: "",
    shopKeeperImage: "",
    shopkeeperImageWithShop: "",
    // deliveryProofImage: "",
    gst: "",
    serialNumber: "",
    agencyId: "",
    fridgeId: "",
    owner: "",
  });
  console.log("data=======", data);
  const params = {
    page: 1,
    limit: 100000,
  };
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
          console.log("agency response----", response);
          setAgencyData(response?.data?.data?.agency_data);
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
        });
    } catch (error) {
      console.log("error -=====>>", error);
    }
  };

  const fetchFridgeData = () => {
    setIsLoading(true);
    try {
      axios
        .post("admin/fridge/get/all", params)
        .then((response) => {
          console.log("freeze response----", response);
          setFridgeData(response?.data?.data?.fridge_data);
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
    fetchAgencyData();
    // fetchShopData();
    fetchFridgeData();
  }, []);

  // useEffect(() => {
  //   let agencyFilterData = salesmanData?.filter(
  //     (a) => a?.agencyId?._id === selectedAgency
  //   );
  //   setFilterData(agencyFilterData);
  //   console.log("-------", agencyFilterData);
  // }, [selectedAgency]);

  const onFinish = async (value) => {
    const updateData = {
      name: data?.name,
      shopName: data?.shopName,
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
      image: imagePath,
      aadharCardImage: aadharCardImageUrls,
      panCardImage: panCardImagePath,
      signatureImage: signatureImagePath,
      shopImage: shopImagePath,
      shopKeeperImage: shopKeeperImagePath,
      shopkeeperImageWithShop: shopkeeperImageWithShopPath,
      // deliveryProofImage: deliveryProofPath,
      gst: data?.gst,
      serialNumber: data?.serialNumber,
      agencyId: selectedAgency,
      fridgeId: selectedFridge,
    };
    try {
      const uploadImage = async (file) => {
        try {
          const formData = new FormData();
          formData.append("image", file.originFileObj);
          const response = await axios.post(
            `${BASE_URL}/upload/document`,
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
      // Upload  Image
      if (imagesArrayData?.image?.length > 0) {
        const image = await uploadImage(imagesArrayData.image[0]);
        updateData.image = image;
      }
      // Upload Aadhar Card Image
      if (imagesArrayData?.aadharCardImages?.length > 0) {
        const aadharCardImageUrls = await Promise.all(
          imagesArrayData.aadharCardImages.map((image) => uploadImage(image))
        );
        updateData.aadharCardImage = aadharCardImageUrls;
      } else {
        updateData.aadharCardImage = data.aadharCardImage;
      }
      // Upload Pan Card Image
      if (imagesArrayData?.panCardImage?.length > 0) {
        const panCardImage = await uploadImage(imagesArrayData.panCardImage[0]);
        updateData.panCardImage = panCardImage;
      }
      // Upload shop Image
      if (imagesArrayData?.shopImage?.length > 0) {
        const shopImage = await uploadImage(imagesArrayData.shopImage[0]);
        updateData.shopImage = shopImage;
      }
      // Upload shopkeeper Image
      if (imagesArrayData?.shopKeeperImage?.length > 0) {
        const shopKeeperImage = await uploadImage(
          imagesArrayData.shopKeeperImage[0]
        );
        updateData.shopKeeperImage = shopKeeperImage;
      }
      // Upload signature Image
      if (imagesArrayData?.signatureImage?.length > 0) {
        const signatureImage = await uploadImage(
          imagesArrayData.signatureImage[0]
        );
        updateData.signatureImage = signatureImage;
      }
      // Upload shopkeeperImageWithShop Image
      if (imagesArrayData?.shopkeeperImageWithShop?.length > 0) {
        const shopkeeperImageWithShop = await uploadImage(
          imagesArrayData.shopkeeperImageWithShop[0]
        );
        updateData.shopkeeperImageWithShop = shopkeeperImageWithShop;
      }
      if (imagesArrayData?.deliveryProofImage?.length > 0) {
        const deliveryProofImage = await uploadImage(
          imagesArrayData.deliveryProofImage[0]
        );
        updateData.deliveryProofImage = deliveryProofImage;
      }

      if (location.pathname === "/freeze-booking/edit-freeze-booking") {
        axios
          .post("admin/booking/edit", {
            ...updateData,
            _id: state.data._id,
            status: selectedShopStatus,
          })
          .then((response) => {
            console.log("response==------", response);
            toast.success("freezebooking Sucessfully Update");
            navigate("/freeze-booking");
          })
          .catch((error) => {
            console.log("error------", error);
          });
      } else {
        axios.post("admin/booking/add", updateData).then((response) => {
          console.log("response--------->", response);
          if (response.status === 200) {
            console.log("response----", response);
            toast.success("freezebooking Sucessfully Add");
            navigate("/freeze-booking");
          }
        });
      }
    } catch (error) {
      console.log("error=====", error);
      return;
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Data :", data);
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
  const handleAadharCardChange = (fileList) => {
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
  const handlepanCardImageChange = (fileList) => {
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
  const handleSignatureImage = (fileList) => {
    const updatedFileList = fileList.map((file) => {
      if (!file.uid) {
        file.uid = Date.now().toString();
      }
      return file;
    });

    setImagesArrayData((prevData) => ({
      ...prevData,
      signatureImage: updatedFileList,
    }));
  };
  const handleShopImageChange = (fileList) => {
    const updatedFileList = fileList.map((file) => {
      if (!file.uid) {
        file.uid = Date.now().toString();
      }
      return file;
    });
    setImagesArrayData((prevData) => ({
      ...prevData,
      shopImage: updatedFileList,
    }));
  };
  const handleShopKeeperImageChange = (fileList) => {
    const updatedFileList = fileList.map((file) => {
      if (!file.uid) {
        file.uid = Date.now().toString();
      }
      return file;
    });
    setImagesArrayData((prevData) => ({
      ...prevData,
      shopKeeperImage: updatedFileList,
    }));
  };
  const handleshopkeeperImageWithShop = (fileList) => {
    const updatedFileList = fileList.map((file) => {
      if (!file.uid) {
        file.uid = Date.now().toString();
      }
      return file;
    });
    setImagesArrayData((prevData) => ({
      ...prevData,
      shopkeeperImageWithShop: updatedFileList,
    }));
  };
  const handleProofImageChange = (fileList) => {
    const updatedFileList = fileList.map((file) => {
      if (!file.uid) {
        file.uid = Date.now().toString();
      }
      return file;
    });
    setImagesArrayData((prevData) => ({
      ...prevData,
      deliveryProofImage: updatedFileList,
    }));
  };
  const fetchData = () => {
    if (
      location.pathname == "/freeze-booking/edit-freeze-booking" &&
      state &&
      state.data
    ) {
      if (state && state.data) {
        const panCardImageUrl = state.data.panCardImage || "";
        const signatureImageUrl = state.data.signatureImage || "";
        const ownerImageUrl = state.data.image || "";
        const shopImageUrl = state.data.shopImage || "";
        const shopKeeperImageUrl = state.data.shopKeeperImage || "";
        const deliveryProofImageUrl = state.data.deliveryProofImage || "";

        const shopkeeperImageWithShopUrls =
          state.data.shopkeeperImageWithShop || "";
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
          signatureImage: signatureImageUrl
            ? [
                {
                  uid: signatureImageUrl,
                  url: `${signatureImageUrl}`,
                },
              ]
            : [],
          shopkeeperImageWithShop: shopkeeperImageWithShopUrls
            ? [
                {
                  uid: shopkeeperImageWithShopUrls,
                  url: `${shopkeeperImageWithShopUrls}`,
                },
              ]
            : [],
          image: ownerImageUrl
            ? [{ uid: ownerImageUrl, url: `${ownerImageUrl}` }]
            : [],
          shopImage: shopImageUrl
            ? [{ uid: shopImageUrl, url: `${shopImageUrl}` }]
            : [],
          shopKeeperImage: shopKeeperImageUrl
            ? [{ uid: shopKeeperImageUrl, url: `${shopKeeperImageUrl}` }]
            : [],
          deliveryProofImage: deliveryProofImageUrl
            ? [{ uid: deliveryProofImageUrl, url: `${deliveryProofImageUrl}` }]
            : [],
        }));

        formRef.current.setFieldsValue({
          ...state.data,
          name: state.data?.name,
          shopName: state.data?.shopName,
          mobile: state.data?.contact?.mobile,
          address: state?.data?.address?.address,
          gst: state.data?.gst,
          agencyId: state.data.agencyId?.agencyName || null,
          fridgeId: state.data.fridgeId?.company || null,
          owner: state.data?.gst,
        });
        setData({
          ...state.data,
          name: state.data?.name,
          shopName: state.data?.shopName,
          mobile: state.data?.contact?.mobile,
          address: state?.data?.address,
          gst: state.data?.gst,
          serialNumber: state.data?.serialNumber,
          agencyId: state.data.agencyId?.agencyName || null,
          fridgeId: state.data.fridgeId?.company || null,
          owner: state.data?.gst,
        });
      }
    }
  };
  useEffect(() => {
    fetchData();
    fetchAgencyData();
    if (state?.data?.agencyId) {
      setSelectedAgency(state.data.agencyId._id);
    }
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
              {state ? "Edit Refrigerator Booking" : "Add Refrigerator Booking"}
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
            defaultValue="Select Agency"
            style={{
              width: "70%",
            }}
            options={agencyData?.map((agency) => ({
              label: agency.agencyName,
              value: agency._id,
            }))}
            onChange={(value) => setSelectedAgency(value)}
            value={selectedAgency}
          />
        </Form.Item>
        {/* ------------------------------------------------------------- */}
        <Form.Item
          name="fridgeId"
          label="Select Fridge"
          rules={[
            {
              required: true,
              message: "Please input select Fridge!",
            },
          ]}
        >
          <Select
            name="fridgeId"
            defaultValue="Select Fridge"
            style={{
              width: "70%",
            }}
            options={fridgeData?.map((fridge) => ({
              label: fridge.company,
              value: fridge._id,
            }))}
            onChange={(data) => setSelectedFridge(data)}
            value={selectedFridge}
          />
        </Form.Item>
        {/* ------------------------------------------------------- */}
        <Form.Item
          name="name"
          label="Owner Name"
          rules={[
            {
              required: true,
              message: "Please input Owner Name!",
            },
          ]}
        >
          <Input
            placeholder=" Owner Name"
            name="name"
            onChange={handleInputChange}
          />
        </Form.Item>
        {/* ----------------------------------------------------------------- */}
        <Form.Item
          name="shopName"
          label="Shop Name"
          rules={[
            {
              required: true,
              message: "Please input your Shop Name!",
            },
          ]}
        >
          <Input
            placeholder="Shop Name"
            name="shopName"
            onChange={handleInputChange}
          />
        </Form.Item>
        {/* --------------------------------------------------------------- */}
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
        {/* -------------------------------------------------------------------- */}
        <Form.Item
          name="address"
          label="Address"
          rules={[
            {
              required: true,
              message: "Please input your Address!",
            },
          ]}
        >
          <TextArea
            placeholder="Address"
            name="address"
            onChange={handleInputChange}
          />
        </Form.Item>
        {/* --------------------------------------------------------------------------------- */}
        <Form.Item name="gst" label=" GST">
          <Input
            type="number"
            placeholder="GST"
            name="gst"
            onChange={handleInputChange}
          />
        </Form.Item>
        {/* ------------------------------------------------------ */}
        <Form.Item
          name="serialNumber"
          label="Serial Number"
          rules={[
            {
              required: true,
              message: "Please input your Serial Number!",
            },
          ]}
        >
          <Input
            type="number"
            placeholder="Serial Number"
            name="serialNumber"
            onChange={handleInputChange}
          />
        </Form.Item>
        {/* --------------------------------------------------------------------------------- */}

        <Form.Item
          name="owner"
          label="Owner"
          rules={[
            {
              required: true,
              message: "Please input Owner !",
            },
          ]}
        >
          <Input
            placeholder=" Owner"
            name="owner"
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
              message: "Please input  Image!",
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
            fileList={imagesArrayData.aadharCardImages || []}
            action="/upload.do"
            listType="picture-card"
            onChange={({ fileList }) => handleAadharCardChange(fileList)}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        {/* ------------------------------------------------------------------------------- */}
        <Form.Item
          name="panCardImage"
          label="Pan Card Image"
          // valuePropName="fileList"
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
            onChange={({ fileList }) => handlepanCardImageChange(fileList)}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        {/* ------------------------------------------------------------------------------- */}
        <Form.Item
          name="signatureImage"
          label="Signature Image"
          // valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
          rules={[
            {
              required: true,
              message: "Please input Signature Image!",
            },
          ]}
        >
          <Upload
            maxCount={1}
            action="/upload.do"
            fileList={imagesArrayData.signatureImage || []}
            listType="picture-card"
            onChange={({ fileList }) => handleSignatureImage(fileList)}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        {/* ------------------------------------------------------------------------------- */}
        <Form.Item
          name="shopImage"
          label="Shop Image"
          getValueFromEvent={(e) => e?.fileList}
          rules={[
            {
              required: true,
              message: "Please input Shop Image!",
            },
          ]}
        >
          <Upload
            maxCount={1}
            action="/upload.do"
            fileList={imagesArrayData.shopImage || []}
            listType="picture-card"
            onChange={({ fileList }) => handleShopImageChange(fileList)}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        {/* ------------------------------------------------------------------------------- */}
        <Form.Item
          name="shopKeeperImage"
          label="Shopkeeper Image"
          getValueFromEvent={(e) => e?.fileList}
          rules={[
            {
              required: true,
              message: "Please input Shopkeeper Image!",
            },
          ]}
        >
          <Upload
            maxCount={1}
            action="/upload.do"
            fileList={imagesArrayData.shopKeeperImage || []}
            listType="picture-card"
            onChange={({ fileList }) => handleShopKeeperImageChange(fileList)}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        {/* ------------------------------------------------------------------------------- */}
        <Form.Item
          name="shopkeeperImageWithShop"
          label="Shopkeeper with shop"
          // valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
          rules={[
            {
              required: true,
              message: "Please input Shopkeeper Image With Shop!",
            },
          ]}
        >
          <Upload
            fileList={imagesArrayData.shopkeeperImageWithShop || []}
            maxCount={1}
            action="/upload.do"
            listType="picture-card"
            onChange={({ fileList }) => handleshopkeeperImageWithShop(fileList)}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        {/* ------------------------------------------------------------------------------- */}
        <Divider />
        {location.pathname === "/freeze-booking/edit-freeze-booking" && (
          <h6>Add Proof Of Delivery :</h6>
        )}
        <br />
        {location.pathname === "/freeze-booking/edit-freeze-booking" && (
          <Form.Item
            label="Delivery Status"
            name="status"
            // rules={[
            //   {
            //     required: true,
            //     message: "Please input  Delivery Status!",
            //   },
            // ]}
          >
            <Select
              defaultValue="Pending"
              name="status"
              onChange={(value) => setSelectedShopStatus(value)}
              value={selectedShopStatus}
              // value={statusFilter}
              // onChange={(value) => {
              //   if (statusFilter != "") fetchData();
              //   setStatusFilter(value);
              // }}
              style={{ width: "100%" }}
            >
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="decline">Decline</Select.Option>
              <Select.Option value="success">Success</Select.Option>
            </Select>
          </Form.Item>
        )}
        {/* ------------------------------------------------------ */}
        {location.pathname === "/freeze-booking/edit-freeze-booking" && (
          <Form.Item
            name="deliveryProofImage"
            label="Delivery Proof Image"
            getValueFromEvent={(e) => e?.fileList}
            // rules={[
            //   {
            //     required: true,
            //     message: "Please input  Delivery Proof Image!",
            //   },
            // ]}
          >
            <Upload
              maxCount={1}
              action="/upload.do"
              fileList={imagesArrayData.deliveryProofImage || []}
              listType="picture-card"
              onChange={({ fileList }) => handleProofImageChange(fileList)}
            >
              <div>
                <PlusOutlined />
              </div>
            </Upload>
          </Form.Item>
        )}
        {/* ------------------------------------------------------ */}
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

export default AddOrEditFreezeBooking;
