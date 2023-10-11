import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Select,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import BASE_URL from "../../utils/baseURL";
import moment from "moment";

const AddOrEditScheme = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [form] = Form.useForm();
  const formRef = useRef();
 
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [initialValues, setInitialValues] = useState({});
  const [filterData, setFilterData] = useState(null);
  const [selectedAgency, setSelectedAgency] = useState(
    state?.data?.agencyId?.agencyName || null
  );
  const [salesmanData, setSalesmanData] = useState(null);
  const [shopsData, setShopsData] = useState(null);
  const [selectedSalesman, setSelectedSalesman] = useState(
    state?.data?.salesmanId?.name || null
  );
  const [selectedShop, setSelectedShop] = useState();
  const [imagesArrayData, setImagesArrayData] = useState({
    image: [],
  });
  const [data, setData] = useState({
    offer: "",
    startDate: "",
    endDate: "",
    image: [],
    shopId: "",
    salesmanId: "",
  });

  //   const fetchAgencyData = () => {
  //     const params = {
  //       page: 1,
  //       limit: 100000,
  //     };
  //     try {
  //       axios
  //         .post("admin/agency/get/all", params)
  //         .then((response) => {
  //           setAgencyData(response?.data?.data?.agency_data);
  //         })
  //         .catch((error) => {
  //           console.log("error-->>>>>", error?.message);
  //         });
  //     } catch (error) {
  //       console.log("error -=====>>", error);
  //     }
  //   };

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
          setSalesmanData(response?.data?.data?.user_data);
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
        });
    } catch (error) {
      console.log("error -=====>>", error);
    }
  };
  const fetchShopsData = () => {
    setIsLoading(true);
    const shopsParams = {
      page: 1,
      limit: 100000,
    };
    try {
      axios
        .post("admin/shop/get/all", shopsParams)
        .then((response) => {
          setShopsData(response?.data?.data?.shop_data);
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
        });
    } catch (error) {
      console.log("error -=====>>", error);
    }
  };
  useEffect(() => {
    // fetchAgencyData();
    fetchSalesmanData();
    fetchShopsData();
  }, []);
  useEffect(() => {
    let agencyFilterData = salesmanData?.filter(
      (a) => a?.agencyId?._id === selectedAgency
    );
    setFilterData(agencyFilterData);
  }, [selectedAgency]);

  // ========================onfinish=============================//
 
  const onFinish = async (values) => {
    const updateData = {
      startDate: data.startDate,
      endDate: data.endDate,
      offer: data?.offer,
      remark:data?.remark,
      image: imagesArrayData.image,
      shopId:selectedShop,
      salesmanId: selectedSalesman,
    };
    console.log("updatedata +++++++++++++", updateData);
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
      if (location.pathname === "/scheme/edit-scheme") {
        axios
          .post("admin/scheme/edit", {
            ...updateData,
            _id: state.data._id,
          })
          .then((response) => {
            toast.success("Scheme Update");
            navigate("/scheme");
          })
          .catch((error) => {
            console.log("error------", error);
          });
      } else {
        axios.post("admin/scheme/add", updateData).then((response) => {
          if (response.status === 200) {
            console.log("response ++++++++", response);
            toast.success("Scheme Sucessfully Add");
            navigate("/scheme");
          }
        });
      }
    } catch (error) {
      console.log("error=====", error);
      return;
    }
  };
  // ==================================================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleDateChange = (date, type) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : null;
    if (type === "startDate") {
      setSelectedStartDate(formattedDate);
    } else if (type === "endDate") {
      setSelectedEndDate(formattedDate);
    }
    setData((prevData) => ({
      ...prevData,
      [type]: formattedDate,
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

  const fetchData = () => {
    if (location.pathname == "/scheme/edit-scheme" && state && state.data) {
      if (state && state.data) {
        setSelectedStartDate(
          state.data?.startDate ? moment(state.data?.startDate) : moment()
        );
        setSelectedEndDate(
          state.data?.endDate ? moment(state.data?.endDate) : moment()
        );
        const ownerImageUrl = state.data.image || "";
        setImagesArrayData((prevData) => ({
            ...prevData,
            image: ownerImageUrl
              ? [{ uid: ownerImageUrl, url: `${ownerImageUrl}` }]
              : [],
          }));
        formRef.current.setFieldsValue({
          ...state.data,
          startDate: moment(state.data?.startDate),
          endDate: moment(state.data?.endDate),
          offer: state.data?.offer,
          image: state.data?.image,
          remark:state.data?.remark,
          shopsId: state.data.shopId?.name,
          salesmanId: selectedSalesman,
        });
        setData({
          ...state.data,
          startDate: state.data?.startDate,
          endDate: state.data?.endDate,
          offer: state.data?.offer,
          image: state.data?.image,
          remark:state.data?.remark,
          shopsId: state.data?.shopsId?.name || null,
          salesmanId: selectedSalesman,
        });
      }
    }
  };
  useEffect(() => {
    // fetchAgencyData();
    fetchSalesmanData();
    fetchData();
    if (state?.data?.agencyId) {
      setSelectedAgency(state.data.agencyId._id);
    }
    if (state?.data?.salesmanId) {
      setSelectedSalesman(state.data.salesmanId._id);
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
            <div>
              <h4 className="fw-bold fs-4">
                {state ? "Edit Scheme" : "Add Scheme"}
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
            name="startDate"
            label="Start Date"
            rules={[
              {
                required: true,
                message: "Please input your Start Date !",
              },
            ]}
          >
            <DatePicker
              name="startDate"
              value={selectedStartDate}
              format={"DD-MM-YYYY"}
              onChange={(e) => handleDateChange(e, "startDate")}
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="End Date"
            rules={[
              {
                required: true,
                message: "Please input your End Date!",
              },
            ]}
          >
            <DatePicker
              name="endDate"
              value={selectedEndDate}
              format={"DD-MM-YYYY"}
              onChange={(e) => handleDateChange(e, "endDate")}
            />
          </Form.Item>

          {/* <Form.Item
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
              // style={{ width: "22%" }}
              options={agencyData?.map((agency) => ({
                label: agency.agencyName,
                value: agency._id,
              }))}
              onChange={(value) => setSelectedAgency(value)}
              value={selectedAgency}
            />
          </Form.Item> */}

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
                // style={{ width: "22%" }}
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
                // style={{ width: "22%" }}
                options={salesmanData?.map((salesman) => ({
                  label: salesman.name,
                  value: salesman._id,
                }))}
                onChange={(data) => setSelectedSalesman(data)}
              />
            )}
          </Form.Item>
          <Form.Item
            name="shopsId"
            label="Shops"
            placeholder="Select Shops"
            rules={[
              {
                required: true,
                message: "Please Select Shops!",
              },
            ]}
          >
            <Select
              defaultValue="Select Shops"
              //   mode="multiple"
              // style={{ width: "22%" }}
              options={shopsData?.map((shop) => ({
                label: shop.name,
                value: shop._id,
              }))}
              onChange={(value) => setSelectedShop(value)}
              value={selectedShop}
            />
          </Form.Item>
          <Form.Item
            name="remark"
            label="Remark"
            rules={[
              {
                required: true,
                message: "Please input your Offer!",
              },
            ]}
          >
            <TextArea
              // style={{ width: "22%" }}
              placeholder="Remark"
              name="remark"
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            name="offer"
            label="Offer"
            rules={[
              {
                required: true,
                message: "Please input your Offer!",
              },
            ]}
          >
            <TextArea
              // style={{ width: "22%" }}
              placeholder="Offer"
              name="offer"
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
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};
export default AddOrEditScheme;
