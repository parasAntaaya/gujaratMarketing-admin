import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import DefaultTable from "../../Components/DefaultTable";
import { useSelector } from "react-redux";

import axios from "axios";
import YourTableComponent from "../../Components/DefaultTable/indexTable";

const { Title, Text } = Typography;

const UpdateStock = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const userRole = useSelector((state) => state.auth?.user?.role);

  const [isTransferEnabled, setIsTransferEnabled] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState([]);

  const [availableProducts, setAvailableProducts] = useState([]);

  const [salesmanName, setSalesmanName] = useState();
  const [salesfilterData, setSalesFilterData] = useState(null);

  // API calling data set
  const [agencyData, setAgencyData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [salesmanData, setSalesmanData] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProductData, setFilteredProductData] = useState(productData);

  // --------------------------------------------------------------------------------
  // dropdown values set
  // const [values, setValues] = useState();
  const [productValue, setProductValue] = useState();
  const [agencyValue, setAgencyValue] = useState();
  const [agencyName, setAgencyNAme] = useState();
  const [quantity, setQuantity] = useState();
  const [dateValue, setDateValue] = useState();
  const [billNo, setBillNo] = useState();
  const [remarkValue, setRemarkValue] = useState();
  const [salesmanValue, setSalesmanValue] = useState();
  // --------------------------------------------------------------------------------
  // updated products API res data
  const [updatedProducts, setUpdatedProducts] = useState([]);
  // --------------------------------------------------------------------------------
  const handleRemark = (value) => {
    setRemarkValue(value?.target?.value);
  };
  // --------------------------------------------------------------------------------
  const handleBillNo = (value) => {
    setBillNo(value?.target?.value);
  };
  const handleAgencyChange = (value) => {
    setAgencyValue(value);
    const selectedAgency = agencyData.find((agency) => agency._id === value);
    setProductData(selectedAgency?.products?.map((pr) => pr?.productId));
    console.log("selected + + +  + ", selectedAgency);
  };

  const handleQuantityChange = (value, productId) => {
    const newSelectedProducts = [...selectedProducts];
    const existingProductIndex = newSelectedProducts.findIndex(
      (product) => product.productId === productId
    );
    if (existingProductIndex !== -1) {
      newSelectedProducts[existingProductIndex].quantity = value;
    } else {
      newSelectedProducts.push({ productId, quantity: value });
    }
    setSelectedProducts(newSelectedProducts);
  };

  const columns = [
    {
      title: "Sr no.",
      dataIndex: "srno",
      key: "srno",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
    },
    {
      title: "Update Quantity",
      key: "update_quantity",
      dataIndex: " ",
      align: "center",
      style: { backgroundColor: "#FF0000" },
      render: (text, record) => (
        <Input
          disabled={record?.quantity == 0 ? true : false}
          maxLength={6}
          onChange={(value) =>
            handleQuantityChange(value.target.value, record._id)
          }
          onKeyPress={(e) => {
            const keyCode = e.which || e.keyCode;
            if (keyCode < 48 || keyCode > 57) {
              e.preventDefault();
            }
          }}
          style={{ width: "100%" }}
          value={text}
        />
      ),
    },
  ];

  const availableStock = () => {
    setLoading(true);
    const params = {};
    try {
      axios
        .get("/admin/stock/available", params)
        .then((response) => {
          if (response.status === 200) {
            setAvailableProducts(response?.data?.data?.productsWithAgencyCount);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
          setLoading(false);
        });
    } catch (error) {
      console.log("error -=====>>", error);
    }
  };

  // ---------------------------------------------------------------------------------------------------------
  // update product API call
  const getAllSalesman = async () => {
    const requestBody = {
      page: 1,
      limit: 100,
      roleFilter: "salesman",
    };
    axios
      .post("/admin/user/get/all", requestBody)
      .then((response) => {
        if (response.status === 200) {
          const allSalesman = response.data.data;
          setSalesmanData(allSalesman?.user_data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
        setLoading(false);
      });
  };
  // ---------------------------------------------------------------------------------------------------------

  // apii call for all agencies
  const fetchAgencyData = () => {
    setLoading(true);
    const params = {
      page: 1,
      limit: 100,
    };
    try {
      axios
        .post("/admin/agency/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            const agencyData = response?.data?.data?.agency_data;
            setAgencyData(agencyData);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
          setLoading(false);
        });
    } catch (error) {
      console.log("error -=====>>", error);
    }
  };

  // ---------------------------------------------------------------------------------------------------------
  // update product API call
  const handleDateChange = (date, dateString) => {
    setDateValue(dateString);
  };
  const handleSalesmanChange = (value) => {
    setSalesmanValue(value?.target?.value);
  };
  const filterData = (data) => {
    if (!data) {
      return [];
    }
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  useEffect(() => {
    fetchAgencyData();
    getAllSalesman();
  }, []);

  useEffect(() => {
    availableStock();
  }, [agencyValue]);

  useEffect(() => {
    let agencyFilterData = salesmanData?.filter(
      (a) => a?.agencyId?._id === agencyValue
    );
    setSalesFilterData(agencyFilterData);
  }, [agencyValue]);

  const onFinish = (values) => {
    form
      .validateFields()
      .then(() => {
        const tranferToSalesman = {
          date: values?.date,
          billNo: values?.billNo,
          remark: values?.remark,
          agencyId: agencyValue,
          userId: salesmanValue,
          products: selectedProducts.map((product) => ({
            productId: product.productId,
            quantity: parseInt(product.quantity),
          })),
        };
        console.log("Data +++++++++ :", tranferToSalesman);
        axios
          .post("admin/stock/transfer/salesman", tranferToSalesman)
          .then((response) => {
            if (response.status === 200) {
              console.log("response + + + + + + ", response);
              const updatedProductData = response.data.data;
              setSalesmanName(response.data?.data?.salesman);
              const agencyName = updatedProductData?.agency;
              setUpdatedProducts(updatedProductData?.stockHistory);
              toast.success("Stock transfer to Salesman");
            }
          })
          .catch((error) => {
            toast.error("Error transferring stock. Please try again later.");
          });
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };
  return (
    <Form form={form} onFinish={onFinish}>
      {/* <Card
        className="m-2"
        
        title={
          
          <div className="col-md-6 fs-3 fw-bold">Transfer to salesman</div>
        }
      > */}
      <Card
        className="m-2"
        title={
          <div >
            <Row gutter={[24, 24]}>
              <Col span={1}>
            <Button
              className="back-button mx-2 btn btn-outline-primary"
              type="default"
              onClick={() => navigate("/stock")}
              icon={<LeftOutlined className="back-icon " />}
            ></Button>
            </Col>
            <Col span={20}>
            <div>
              <h4 className="fw-bold fs-4">Agency to Salesman Stock Transfer</h4>
            </div>
            </Col>
            <Col span={3}>
            <Button 
            className="fw-bold" 
            type="link"
            onClick={() => {
              navigate("/stockHistory");
            }}
            // onClick={() => navigate("StockHistory")}
            >
              Stock History</Button>
            </Col>
            </Row>
          </div>
        }
      >
        <Row className="mb-4" gutter={[24, 24]}>
          {/* Date */}
          <Col span={5}>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format={"DD-MM-YYYY"}
                onChange={handleDateChange}
              />
            </Form.Item>
          </Col>

          {/* Agency */}
          {userRole !== "agency" && (
            <Col span={5}>
              <Form.Item
                name="agency"
                label="Agency"
                rules={[{ required: true, message: "Please select an agency" }]}
              >
                <Select
                  placeholder="Agency"
                  onChange={handleAgencyChange}
                  style={{ width: "100" }}
                  options={agencyData?.map((data) => ({
                    label: data?.agencyName,
                    value: data?._id,
                  }))}
                />
              </Form.Item>
            </Col>
          )}

          {/* Salesman */}
          {userRole === "admin" && (
            <Col span={5}>
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
                    name="userId"
                    placeholder="Select salesman"
                    style={{ width: "100%" }}
                    options={salesfilterData?.map((salesman) => ({
                      label: salesman.name,
                      value: salesman._id,
                    }))}
                    onChange={(data) => setSalesmanValue(data)}
                    value={salesmanValue}
                  />
                ) : (
                  <Select
                    name="userId"
                    defaultValue="Select Salesman"
                    style={{ width: "100%" }}
                    options={salesmanData?.map((salesman) => ({
                      label: salesman.name,
                      value: salesman._id,
                    }))}
                    onChange={(data) => setSalesmanValue(data)}
                    value={salesmanValue}
                  />
                )}
              </Form.Item>
            </Col>
          )}
          {userRole !== "admin" && (
            <Col span={4} className="gutter-row">
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
                <Select
                  name="userId"
                  placeholder="Select salesman"
                  style={{ width: "100%" }}
                  options={salesmanData?.map((salesman) => ({
                    label: salesman.name,
                    value: salesman._id,
                  }))}
                  onChange={(data) => setSalesmanValue(data)}
                  value={salesmanValue}
                />
              </Form.Item>
            </Col>
          )}
          </Row>
          <Row className="mb-4" gutter={[24, 24]}>
          <Col span={5}>
            <Form.Item
              name="billNo"
              label="Bill No."
              rules={[{ required: true, message: "Please type an Bill No." }]}
            >
              <Input  style={{ width: "100%" }} placeholder="Bill NO." />
            </Form.Item>
          </Col>

          {/* Remark */}
          <Col span={5}>
            <Form.Item
              name="remark"
              label="Remark"
              rules={[{ required: true, message: "Please select an Remark" }]}
            >
              <Input  style={{ width: "100%" }} placeholder="Remark" />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Button type="primary" htmlType="submit">
              Transfer Stock
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          {/* Product Table */}
          <Col xs={24} md={12} span={12}>
            <Card
              style={{
                maxHeight: "70%",
                overflow: "hidden",
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Title level={3}>Assigned Product ({productData?.length})</Title>
                <Input.Search
                  value={searchQuery}
                  placeholder="Search products"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ marginBottom: 16, width: "50%" }}
                />
              </div>

              <DefaultTable
                data={filterData(productData)}
                columns={columns}
                loading={loading}
              />
            </Card>

          </Col>

          {/* Transfered Product Table */}
          <Col xs={24} md={12} span={12}>
            <Card
              style={{
                maxHeight: "70%",
                overflow: "hidden",
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Title level={3}>Updated Product</Title>
              </div>
              <YourTableComponent
                loading={loading}
                data={updatedProducts}
                salesman={salesmanName}
              />
              {/* <DefaultTable data={updatedProducts} columns={updatedCcolumns} /> */}
            </Card>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default UpdateStock;
