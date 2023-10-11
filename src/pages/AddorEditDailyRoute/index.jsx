import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  TimePicker,
  Typography,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import AddShopRouteModal from "../../Components/AddShopRouteModal";
import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";
import AddShopsModal from "../../Components/AddShopsModal/AddShopsModal";
import { Option } from "antd/es/mentions";
const { Title } = Typography;
const { RangePicker } = TimePicker;

const AddOrEditDailyRoute = () => {
  const navigate = useNavigate();
  const [isShopRouteModalOpen, setisShopRouteModalOpen] = useState(false);
  const [shopRouteVisible, setShopRouteVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const location = useLocation();
  const [selectedTime, setSelectedTime] = useState(null);
  const { state } = location;
  const [form] = Form.useForm();
  const formRef = useRef();

  const [selectedTimes, setSelectedTimes] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [initialValues, setInitialValues] = useState({});
  const [filterData, setFilterData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [agencyData, setAgencyData] = useState();
  const [selectedAgency, setSelectedAgency] = useState(
    state?.data?.agencyId?.agencyName || null
  );
  const [salesmanData, setSalesmanData] = useState(null);
  const [shopsData, setShopsData] = useState([]);

  const [selectedSalesman, setSelectedSalesman] = useState(
    state?.data?.salesmanId?.name || null
  );
  const [imagesArrayData, setImagesArrayData] = useState("");
  const [data, setData] = useState({
    routeName: "",
    vehicleName: "",
    vehicleNumber: "",
    driverName: "",
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
    startTime: "",
    endTime: "",
    day: "",
    shopsIds: [],
    vehicleImage: "",
    agencyId: "",
    salesmanId: "",
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
    const slaesmanprams = {
      page: 1,
      limit: 100000,
      roleFilter: "salesman",
    };
    try {
      axios
        .post("admin/user/get/all", slaesmanprams)
        .then((response) => {
          if (response.status === 200) {
            setSalesmanData(response?.data?.data?.user_data);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.log("error-->>>>>", error?.message);
        });
    } catch (error) {
      console.log("error -=====>>", error);
    }
  };

  // ========================onfinish=============================//
  const onFinish = async (values) => {
    const updateData = {
      routeName: data?.routeName,
      vehicleName: data?.vehicleName,
      vehicleNumber: data?.vehicleNumber,
      driverName: data?.driverName,
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
      startTime: moment(startTime),
      endTime: moment(endTime),
      day: data?.day,
      vehicleImage: imagesArrayData,
      shopsIds: shopsData.map((shop) => shop._id),
      agencyId: selectedAgency,
      salesmanId: selectedSalesman,
    };
    console.log("updateData-----------", updateData);
    try {
      const uploadImage = async (file) => {
        try {
          setIsLoading(true);
          const formData = new FormData();
          formData.append("image", file[0].originFileObj);
          const response = await axios.post(`/upload/document`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("response :", response);
          if (response?.data?.data?.image) {
            return response.data.data.image;
            setIsLoading(false);
          }
        } catch (error) {
          console.log("uploadImage error=====", error);
          throw error;
        }
      };
      if (imagesArrayData) {
        const vehicleImage = await uploadImage(imagesArrayData);
        updateData.vehicleImage = vehicleImage;
      }
      if (location.pathname === "/dailyroute/edit-dailyroute") {
        console.log("Edit API log", updateData);
        await axios
          .post("/admin/route/edit", {
            ...updateData,
            _id: state.data._id,
          })
          .then((response) => {
            toast.success("Route Sucessfully Update");
            navigate("/dailyroute");
          })
          .catch((error) => {
            console.log("error------", error);
          });
      } else {
        if (values?.day.length > 0) {
          for (let index = 0; index < values?.day.length; index++) {
            console.log("Add API log", updateData);
            setIsLoading(true);
            await axios
              .post("/admin/route/add", {
                ...updateData,
                day: values?.day[index],
              })
              .then((response) => {
                if (response.status === 200) {
                  navigate("/dailyroute");
                  setIsLoading(false);
                  console.log("log res :", response);
                  toast.success("Route Sucessfully Add");
                }
              })
              .catch((error) => {
                setIsLoading(false);
                toast.success(error);
              });
          }
        }
      }
    } catch (error) {
      console.log("error=====", error);
      return;
    }
  };
  // const handleTimeChange = (Times) => {
  //   console.log("Selected Times:", Times);
  //   const startTime = new Date(Times[0]);
  //   const endTime = new Date(Times[1]);
  //   if (startTime && endTime) {
  //     setSelectedTime({
  //       startTime: startTime,
  //       endTime: endTime,
  //     });
  //     setStartTime(startTime);
  //     setEndTime(endTime);
  //   }
  // };
  const handleTimeChange = (Times) => {
    console.log("Selected Times:", Times);
    const startTime = new Date(Times[0]);
    const endTime = new Date(Times[1]);
    if (startTime && endTime) {
      setSelectedTime({
        startTime: startTime,
        endTime: endTime,
      });
      setStartTime(startTime);
      setEndTime(endTime);

      setSelectedTimes([moment(startTime), moment(endTime)]);
    }
  };

  // ==================================================================
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

  const handleImageChange = (fileList) => {
    console.log("file list :", fileList);
    // const updatedFileList = fileList.map((file) => {
    //   if (!file.uid) {
    //     file.uid = Date.now().toString();
    //   }
    //   return file;
    // });
    setImagesArrayData(fileList);
    // setImagesArrayData((prevData) => ({
    //   ...prevData,
    //   vehicleImage: updatedFileList,
    // }));
  };
  const fetchData = () => {
    if (
      location.pathname == "/dailyroute/edit-dailyroute" &&
      state &&
      state.data
    ) {
      if (state?.data?.startTime && state?.data?.endTime) {
        const startTime = moment(state.data?.startTime, "HH:mm:ss");
        const endTime = moment(state.data?.endTime, "HH:mm:ss");
        const selectedTimesValue = [startTime, endTime];

        // Set the selected times in the form
        formRef.current.setFieldsValue({
          time: selectedTimesValue,
        });
      }

      const vehicleImageURL = state.data.vehicleImage;
      const formattedImage = [
        {
          uid: vehicleImageURL,
          name: vehicleImageURL.split("/").pop(),
          status: "done",
          url: vehicleImageURL,
        },
      ];

      setImagesArrayData(formattedImage);
      formRef.current.setFieldsValue({
        ...state.data,
        routeName: state.data?.routeName,
        vehicleName: state.data?.vehicleName,
        vehicleNumber: state.data?.vehicleNumber,
        driverName: state.data?.driverName,
        salesmanId: selectedSalesman,
        agencyId: selectedAgency,
        address: state?.data?.address?.address,
        day: state.data?.day,
        shopsIds: state.data.shopsIds.map((shop) => shop._id),
      });
      setData({
        ...state.data,
        routeName: state.data?.routeName,
        vehicleName: state.data?.vehicleName,
        vehicleNumber: state.data?.vehicleNumber,
        driverName: state.data?.driverName,
        salesmanId: selectedSalesman,
        agencyId: selectedAgency,
        address: state?.data?.address,
        day: state.data?.day,
        shopsIds: state.data.shopsIds.map((shop) => shop._id),
      });
    }
  };

  const routeDaysArray = [
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
    { label: "Sunday", value: "Sunday" },
  ];
  useEffect(() => {
    let agencyFilterData = salesmanData?.filter(
      (a) => a?.agencyId?._id === selectedAgency
    );
    setFilterData(agencyFilterData);
  }, [selectedAgency]);

  useEffect(() => {
    fetchAgencyData();
    fetchSalesmanData();
    fetchData();
    if (state?.data?.agencyId) {
      setSelectedAgency(state.data.agencyId._id);
    }
    if (state?.data?.salesmanId) {
      setSelectedSalesman(state.data.salesmanId._id);
    }
  }, [state]);

  useEffect(() => {
    if (state?.data) {
      const startTime = moment(state.data.startTime, "HH:mm:ss");
      const endTime = moment(state.data.endTime, "HH:mm:ss");
      setStartTime(startTime);
      setEndTime(endTime);
    }
  }, [state]);
  return (
    <>
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
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h4 className="fw-bold fs-4">
                {state ? "Edit Route" : "Add Route"}
              </h4>
            </div>
          </div>
        }
      >
        <Form
          form={form}
          labelAlign="left"
          layout="horizontal"
          style={{
            maxWidth: "auto",
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
            <AddShopsModal setShopsData={setShopsData} />
          </div>
          <br />
          <Row>
            <Col span={24}>
              <Form.Item
                name="time"
                label="Select Time"
                rules={[
                  { required: true, message: "Please select a Time range" },
                ]}
              >
                <RangePicker
                  format={"HH:mm:ss"}
                  value={[startTime, endTime]}
                  onChange={handleTimeChange}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="mb-4" gutter={[24]}>
            <Col span={6}>
              <Form.Item
                name="routeName"
                label="Route Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your select routeName!",
                  },
                ]}
              >
                <Input
                  placeholder="Route Name"
                  name="routeName"
                  // style={{ width: "22%" }}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="address"
                label="Route Address"
                rules={[
                  {
                    required: true,
                    message: "Please input your Route Address!",
                  },
                ]}
              >
                <TextArea
                  placeholder="Route Address"
                  name="address"
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="vehicleName"
                label=" Vehicle Name."
                rules={[
                  {
                    required: true,
                    message: "Please input Vehicle Name.!",
                  },
                ]}
              >
                <Input
                  placeholder="Vehicle Name."
                  name="vehicleName"
                  // style={{ width: "auto" }}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-4" gutter={[24]}>
            <Col span={6}>
              <Form.Item
                name="vehicleNumber"
                label="Vehicle No."
                rules={[
                  {
                    required: true,
                    message: "Please input Vehicle No.!",
                  },
                ]}
              >
                <Input
                  maxLength={12}
                  placeholder="Vehicle No."
                  name="vehicleNumber"
                  // style={{ width: "22%" }}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="driverName"
                label="Driver Name."
                rules={[
                  {
                    required: true,
                    message: "Please input Driver Name.!",
                  },
                ]}
              >
                <Input
                  placeholder="Driver Name."
                  name="driverName"
                  // style={{ width: "auto" }}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              {location.pathname === "/dailyroute/edit-dailyroute" ? (
                <Form.Item
                  name="day"
                  label="Route days"
                  placeholder="Select Day"
                  rules={[
                    {
                      required: true,
                      message: "Please input your select Route days!",
                    },
                  ]}
                >
                  <Select
                    name="day"
                    style={{ width: "100%" }}
                    onChange={(value) =>
                      handleInputChange({ target: { name: "day", value } })
                    }
                  >
                    {routeDaysArray.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                    ]
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item
                  name="day"
                  label="Route days"
                  style={{ width: "100%" }}
                  rules={[
                    {
                      required: true,
                      message: "Please input your select Route days!",
                    },
                  ]}
                >
                  <Select
                    name="day"
                    mode="multiple"
                    placeholder="Select Days"
                    onChange={(value) =>
                      handleInputChange({ target: { name: "day", value } })
                    }
                  >
                    {routeDaysArray.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                    ]
                  </Select>
                </Form.Item>
              )}
            </Col>
          </Row>
          <Row className="mb-4" gutter={[24]}>
            <Col span={6}>
              <Form.Item
                name="agencyId"
                label="Select Agency"
                rules={[
                  {
                    required: true,
                    message: "Please select agency!",
                  },
                ]}
              >
                <Select
                  defaultValue="Select Agency"
                  options={agencyData?.map((agency) => ({
                    label: agency.agencyName,
                    value: agency._id,
                  }))}
                  onChange={(value) => setSelectedAgency(value)}
                  value={selectedAgency}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="salesmanId"
                label="Select Salesman"
                rules={[
                  {
                    required: true,
                    message: "Please select salesman!",
                  },
                ]}
              >
                {filterData ? (
                  <Select
                    defaultValue="Select Salesman"
                    options={filterData?.map((salesman) => ({
                      label: salesman.name,
                      value: salesman._id,
                    }))}
                    onChange={(data) => setSelectedSalesman(data)}
                    value={selectedSalesman}
                  />
                ) : (
                  <Select
                    defaultValue="Select Salesman"
                    options={salesmanData?.map((salesman) => ({
                      label: salesman.name,
                      value: salesman._id,
                    }))}
                    onChange={(data) => setSelectedSalesman(data)}
                  />
                )}
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="vehicleImage"
                label="Vehicle Image"
                getValueFromEvent={(e) => e?.fileList}
                rules={[
                  {
                    required: true,
                    message: "Please input Vehicle Image !",
                  },
                ]}
              >
                <Upload
                  maxCount={1}
                  action="/upload.do"
                  fileList={imagesArrayData || []}
                  listType="picture-card"
                  onChange={({ fileList }) => handleImageChange(fileList)}
                >
                  <div>
                    <PlusOutlined />
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <AddShopRouteModal
        visible={shopRouteVisible}
        onClose={() => {
          setShopRouteVisible(false);
          setisShopRouteModalOpen(false);
        }}
        data={selectedData}
        title="Add Shop Group"
      />
    </>
  );
};
export default AddOrEditDailyRoute;
