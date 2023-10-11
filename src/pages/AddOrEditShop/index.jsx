import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Select, Input, Upload, Card, DatePicker } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import BASE_URL from "../../utils/baseURL";
const { setRoute } = require("../../redux/reduxsauce/routeRedux");

const AddOrEditShop = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const formRef = useRef();
  const [form] = Form.useForm();
  const user = useSelector((state) => state.auth.user);
  const routesData = useSelector((state) => state.routeData?.route);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBirthDate, setSelectedBirthDate] = useState();
  const [filterData, setFilterData] = useState(null);
  const [agencyData, setAgencyData] = useState();
  const [selectedAgency, setSelectedAgency] = useState();
  const [salesmanData, setSalesmanData] = useState(null);
  const [selectedSalesman, setSelectedSalesman] = useState();
  const [shopGroupData, setShopGroupData] = useState([]);
  const [selectedShopGroup, setSelectedShopGroup] = useState();
  const [selectedShopStatus, setSelectedShopStatus] = useState();

  const [imagesArrayData, setImagesArrayData] = useState({
    shopImage: [],
  });
  const [data, setData] = useState({
    name: "",
    ownerName: "",
    contact: {
      countryCode: "",
      mobile: "",
    },
    dob: "",
    role: "",
    roleId: "",
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
    agencyId: "",
    salesmanId: "",
    shopGroupId: "",
    routeId: "",
    village: "",
    routeId: [],
    shopImage: [],
    isOpen: "",
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
          setAgencyData(null);
          setAgencyData(response?.data?.data?.agency_data);
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
        });
    } catch (error) {
      console.log("error -=====>>", error);
    }
  };
  const fetchSalesmanData = () => {
    setIsLoading(true);
    const slaesmanprams = {
      page: 1,
      limit: 100000,
      roleFilter: "salesman",
    };
    try {
      axios
        .post("admin/user/get/all", slaesmanprams)
        .then((response) => {
          return setSalesmanData(response?.data?.data?.user_data);
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
          setIsLoading(false);
        });
    } catch (error) {
      console.log("error -=====>>", error);
    }
  };
  const fetchShopGroupData = () => {
    setIsLoading(true);
    const shopGroupParams = {
      page: 1,
      limit: 100000,
    };
    try {
      axios
        .post("admin/shop/group/get/all", shopGroupParams)
        .then((response) => {
          setShopGroupData(response?.data?.data?.shop_group_data);
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
  const onFinish = async () => {
    let updateData = {
      name: data.name,
      ownerName: data.ownerName,
      dob: selectedBirthDate,
      contact: {
        countryCode: "+91",
        mobile: data.mobile,
      },
      address: {
        address: data?.address.address,
        googleAddress: "google address-static",
        city: "city-static",
        state: "state-static",
        zipCode: "zipCode-static",
        country: "country-static",
        timeZone: "timeZone-static",
        latitude: "123",
        longitude: "234",
      },
      village: data.village,
      taluko: data?.taluko,
      district: data?.district,
      agencyId: selectedAgency,
      salesmanId: selectedSalesman,
      routeId: data?.routeId,
      shopGroupId: selectedShopGroup,
      shopImage: imagesArrayData,
      isOpen:
        selectedShopStatus === undefined ||
        (selectedShopStatus === null ? true : selectedShopStatus),
      role: "shop",
      roleId: "64bfa4b5154d155352754944",
    };

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
            return response.data.data.image;
            setIsLoading(false);
          }
        } catch (error) {
          console.log("uploadImage error=====", error);
          throw error;
        }
      };
      if (imagesArrayData?.shopImage?.length > 0) {
        const shopImage = await uploadImage(imagesArrayData.shopImage[0]);
        updateData.shopImage = shopImage;
      }
      if (location.pathname === "/shop/edit-shop") {
        console.log(updateData);
        setIsLoading(true);

        axios
          .post("admin/shop/edit", { ...updateData, _id: state.data._id })
          .then((response) => {
            setIsLoading(false);
            navigate("/shop");
          })
          .catch((error) => {
            setIsLoading(false);
            console.log("error------", error);
          });
      } else {
        console.log(updateData);
        setIsLoading(true);
        axios
          .post("admin/shop/add", updateData)
          .then((response) => {
            if (response.status === 200) {
              setIsLoading(false);
              navigate("/shop");
            }
          })
          .catch((error) => {
            setIsLoading(false);
            console.log("error-->>>>>", error?.message);
          });
      }
    } catch (error) {
      setIsLoading(false);
      console.log("error=====", error);
      return;
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
      shopImage: updatedFileList,
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
              [name]: value,
            },
          }
        : {}),
    }));
  };
  const handleDateChange = (e, type) => {
    const selectedDate = e.format("YYYY-MM-DD");
    if (type === "dob") {
      setSelectedBirthDate(selectedDate);
    }
    setData((prevData) => ({
      ...prevData,
      [type]: selectedDate,
    }));
  };
  const fetchData = () => {
    if (location.pathname === "/shop/edit-shop" && state && state.data) {
      const shopPhotoUrls = state.data.shopImage || "";
      setImagesArrayData((prevData) => ({
        ...prevData,
        shopImage: shopPhotoUrls
          ? [{ uid: shopPhotoUrls, url: `${shopPhotoUrls}` }]
          : [],
      }));
      formRef.current.setFieldsValue({
        ...state.data,
        name: state.data?.name,
        ownerName: state.data?.ownerName,
        mobile: state.data?.contact?.mobile,
        dob: state.data.dob ? moment(state.data.dob, "DD-MM-YYYY") : null,
        address: state.data?.address?.address,
        routeId: state.data.routeId?._id,
        village: state.data?.village,
        agencyId: state.data.agencyId?.agencyName || null,
        salesmanId: state.data?.salesmanId?.name || null,
        shopGroupId: state.data.shopGroupId?.name || null,
        // routeId:state?.data?.routeId.map((route) => route._id),
        taluko: state.data?.taluko,
        district: state.data?.district,
        isOpen: state.data?.isOpen,
        role: "deliveryman",
        roleId: "64a7f89431428923351b75ef",
      });
      setSelectedBirthDate(state.data?.dob);
      setData({
        ...state.data,
        name: state.data?.name,
        ownerName: state.data?.ownerName,
        mobile: state?.data?.contact?.mobile,
        address: state?.data?.address,
        agencyId: state.data.agencyId,
        salesmanId: state.data.salesmanId,
        shopGroupId: state.data.shopGroupId,
        routeId: state.data.routeId?._id,
        village: state.data?.village,
        taluko: state.data?.taluko,
        district: state.data?.district,
        // routeId:state?.data?.routeId?.map((route) => route._id),
        isOpen: state.data?.isOpen,
        role: "deliveryman",
        roleId: "64a7f89431428923351b75ef",
      });
    }
  };

  const fetchRoutesData = async () => {
    setIsLoading(true);
    const params = {
      page: 1,
      limit: 100000,
    };
    try {
      await axios
        .post("admin/route/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            dispatch(setRoute(response?.data?.data?.route_data));
            setIsLoading(false);
          }
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
    if (agencyData != null) {
      fetchSalesmanData();
    }
    fetchShopGroupData();
    let agencyFilterData = salesmanData?.filter(
      (a) => a?.agencyId?._id === selectedAgency
    );
    return setFilterData(agencyFilterData);
  }, [selectedAgency]);

  useEffect(() => {
    if (location.pathname === "/shop/edit-shop") {
      fetchData();
    }
    fetchRoutesData();
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
            icon={<LeftOutlined className="back-icon" />}
          />
          <div>
            <h4 className="fw-bold fs-4">{state ? "Edit Shop" : "Add Shop"}</h4>
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
        <div
          style={{
            display: "flex",
          }}
        >
          {/* <AddRoutesModal setRoutesData={setRoutesData} /> */}
        </div>
        {user.isSuperAdmin && (
          <>
            <Form.Item
              name="agencyId"
              label="Select Agency"
              rules={[
                {
                  required: true,
                  message: "Please your agency!",
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
            <Form.Item
              name="salesmanId"
              label="Select Salesman"
              rules={[
                {
                  required: true,
                  message: "Please Select Salesman!",
                },
              ]}
            >
              {filterData ? (
                <Select
                  name="salesmanId"
                  showSearch={true}
                  filterOption={(input, option) =>
                    option.label.includes(input) ||
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  placeholder="Select salesman"
                  style={{
                    width: "70%",
                  }}
                  options={filterData?.map((salesman) => ({
                    label: salesman.name,
                    value: salesman._id,
                  }))}
                  onChange={(data) => setSelectedSalesman(data)}
                  value={selectedSalesman}
                />
              ) : (
                <Select
                  name="salesmanId"
                  showSearch={true}
                  filterOption={(input, option) =>
                    option.label.includes(input) ||
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  placeholder="Select Salesman"
                  style={{
                    width: "70%",
                  }}
                  options={salesmanData?.map((salesman) => ({
                    label: salesman.name,
                    value: salesman._id,
                  }))}
                  onChange={(data) => setSelectedSalesman(data)}
                  value={selectedSalesman}
                />
              )}
            </Form.Item>
            <Form.Item
              name="routeId"
              label="Route"
              rules={[
                {
                  required: true,
                  message: "Please your route!",
                },
              ]}
            >
              <Select
                name="routeId"
                showSearch={true}
                filterOption={(input, option) =>
                  option.label.includes(input) ||
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                placeholder="Select Route"
                style={{
                  width: "70%",
                }}
                options={routesData?.map((route) => ({
                  label: route.routeName,
                  value: route._id,
                }))}
                onChange={(value) =>
                  setData((prevVal) => ({ ...prevVal, routeId: value }))
                }
                value={data?.routeId}
              />
            </Form.Item>
          </>
        )}
        <Form.Item
          name="ownerName"
          label="Owner Name"
          rules={[
            {
              required: true,
              message: "Please input your Owner Name!",
            },
          ]}
        >
          <Input
            placeholder="Owner Name"
            name="ownerName"
            style={{
              width: "70%",
            }}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="Shop Name"
          rules={[
            {
              required: true,
              message: "Please input your shop name!",
            },
          ]}
        >
          <Input
            name="name"
            placeholder="Shop Name"
            style={{
              width: "70%",
            }}
            onChange={handleInputChange}
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
            name="mobile"
            type="number"
            maxLength={12}
            placeholder="Mobile Number"
            style={{
              width: "70%",
            }}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item name="dob" label="Date Of Birth">
          <DatePicker
            name="dob"
            value={moment(data.dob)}
            format={"DD-MM-YYYY"}
            style={{
              width: "70%",
            }}
            onChange={(e) => handleDateChange(e, "dob")}
          />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[
            {
              required: true,
              message: "Please input your shop address!",
            },
          ]}
        >
          <Input
            name="address"
            placeholder="Shop Address"
            style={{
              width: "70%",
            }}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="village"
          label="Village"
          rules={[
            {
              required: true,
              message: "Please input your village!",
            },
          ]}
        >
          <Input
            name="village"
            placeholder="Village"
            style={{
              width: "70%",
            }}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item name="taluko" label="Taluka">
          <Input
            name="taluko"
            placeholder="Taluka"
            style={{
              width: "70%",
            }}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          name="district"
          label="District"
          rules={[
            {
              required: true,
              message: "Please input your District!",
            },
          ]}
        >
          <Input
            name="district"
            placeholder="District"
            style={{
              width: "70%",
            }}
            onChange={handleInputChange}
          />
        </Form.Item>
        {/* ------------------------------------------------------------------------------- */}
        {location.pathname === "/shop/edit-shop" && (
          <Form.Item
            label="Shop Status"
            name="isOpen"
            rules={[
              {
                required: true,
                message: "Please input Shop Status!",
              },
            ]}
          >
            <Select
              name="isOpen"
              style={{
                width: "70%",
              }}
              value={selectedShopStatus}
              defaultValue="Select Shop Status "
              onChange={(value) => setSelectedShopStatus(value)}
            >
              <Select.Option value={true}>Open</Select.Option>
              <Select.Option value={false}>Close</Select.Option>
            </Select>
          </Form.Item>
        )}
        {/* ------------------------------------------------------------------------------- */}
        <Form.Item
          name="shopGroupId"
          label="Select Shop Group"
          rules={[
            {
              required: true,
              message: "Please input Shop Group!",
            },
          ]}
        >
          <Select
            name="shopGroupId"
            defaultValue="Select Shop Group"
            style={{
              width: "70%",
            }}
            options={shopGroupData?.map((shopgroup) => ({
              label: shopgroup.name,
              value: shopgroup._id,
            }))}
            onChange={(data) => setSelectedShopGroup(data)}
            value={selectedShopGroup}
          />
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
            onChange={({ fileList }) => handleImageChange(fileList)}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>
        {/* ------------------------------------------------------------------------------- */}
        {/* <Form.Item
          wrapperCol={{
            offset: 7,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form.Item> */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default AddOrEditShop;
