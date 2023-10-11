import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DefaultTable from "../../Components/DefaultTable";
import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";

const UpdateStock = () => {
  const navigate = useNavigate();
  const { Title } = Typography;
  const [form] = Form.useForm();
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);

  // API calling data set
  const [agencyData, setAgencyData] = useState([]);
  const [productData, setProductData] = useState([]);
  // --------------------------------------------------------------------------------
  // dropdown values set
  const [agencyValue, setAgencyValue] = useState();
  const [productValue, setProductValue] = useState();
  const [agencyName, setAgencyName] = useState();
  const [dateValue, setDateValue] = useState();
  const [isLoading, setIsLoading] = useState(false);
  var updatedProducts = [];
  // --------------------------------------------------------------------------------
  // updated products API res data
  const [updatedNewProducts, setUpdatedNewProducts] = useState(null);
  // --------------------------------------------------------------------------------

  const handleAgencyChange = (value) => {
    setAgencyValue(value);
    const selectedAgency = agencyData.find((agency) => agency._id === value);
    setProductData(selectedAgency?.products?.map((pr) => pr));
  };
  const handleQuantityChange = (value, productId) => {
    let quantity = parseInt(value);

    for (let i = 0; i < productData.length; i++) {
      const element = productData[i];
      if (element?.productId._id === productId) {
        const existingProductIndex = updatedProducts.findIndex(
          (product) => product.productId === productId
        );

        if (existingProductIndex !== -1) {
          updatedProducts[existingProductIndex].quantity = quantity;
        } else {
          updatedProducts.push({ productId: productId, quantity: quantity });
        }
      }
    }
  };
  const columns = [
    {
      title: "Sr no.",
      dataIndex: "srno",
      key: "srno",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
      render: (_, __, record) => record + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
      render: (quantity, record) => record.productId.name,
    },
    {
      title: "Category",
      dataIndex: "variantId",
      key: "variantId",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
      render: (variantId, record) =>
        record.productId.variantId ? record.productId.variantId.unit : "",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
      render: (quantity, record) =>
        record.quantity < 0 ? "0" : record.quantity,
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
            handleQuantityChange(value.target.value, record.productId._id)
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

  const TransferredColumns = [
    {
      title: "Sr no.",
      dataIndex: "srNo",
      key: "srNo",
      align: "center",
      render: (_, __, record) => record + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => record?.productId?.name,
    },

    {
      title: "Agency Point",
      dataIndex: "agency_point",
      key: "agency_point",
      render: (text, record) => {
        return (
          <p style={{ textAlign: "center" }}>
            {record?.agencyPoint ? record?.agencyPoint : "-"}
          </p>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
      render: (quantity, record) =>
        record.quantity < 0 ? "0" : record.quantity,
    },
  ];

  // api call for all stocks
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

  // -----------------------------------------------------------------------------------------
  const handleDateChange = (date, dateString) => {
    setDateValue(dateString);
  };
  const filterData = (data) => {
    if (!data) {
      return [];
    }
    return data.filter((item) =>
      item?.productId?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  // -----------------------------------------------------------------------------------------
  useEffect(() => {
    availableStock();
  }, [agencyValue]);
  // -----------------------------------------------------------------------------------------

  useEffect(() => {
    fetchAgencyData();
    setSelectedProducts([]);
  }, []);
  // ---------------------------------------------------------------------------------------------------------
  // update product API call
  const onFinish = async (values) => {
    try {
      form.validateFields().then(async () => {
        const tranferData = {
          date: values?.date,
          remark: values?.remark,
          billNo: values?.billNo,
          agencyId: values?.agencyId,
          products: updatedProducts,
        };
        console.log("tranferData-------->>>>", tranferData);
        setIsLoading(true);
        await axios
          .post("/admin/stock/transfer", tranferData)
          .then((response) => {
            if (response.status === 200) {
              console.log("resdata========>>>", response);
              // const updatedProductData = response.data.data;
              setAgencyName(response.data?.data?.agency);
              setUpdatedNewProducts(response.data?.data?.agency?.products);
              toast.success("Stock transferred");
              setIsLoading(false);
            }
          })
          .catch((error) => {
            toast.error("Error transferring stock. Please try again later.");
          });
      });
    } catch (error) {
      console.log("Error :", error);
    }
  };

  return (
    <>
      <Card
        className="m-2"
        title={
          <div className="d-flex">
            <Button
              className="back-button mx-2 btn btn-outline-primary"
              type="default"
              onClick={() => navigate("/stock")}
              icon={<LeftOutlined className="back-icon " />}
            ></Button>
            <div>
              <h4 className="fw-bold fs-4">Admin to Agency Stock Transfer</h4>
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
          <Title level={5}>
            {" "}
            <strong> Agency Points : 0</strong>{" "}
          </Title>
          <Divider />
          <Row className="mb-4" gutter={[24, 24]}>
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

            <Col span={5}>
              <Form.Item
                name="agencyId"
                label="Agency"
                rules={[{ required: true, message: "Please select an agency" }]}
              >
                <Select
                  name="agencyId"
                  placeholder="Agency"
                  onChange={handleAgencyChange}
                  style={{ width: "100%" }}
                  options={agencyData?.map((data) => ({
                    label: data?.agencyName,
                    value: data?._id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name="billNo"
                label="Bill No."
                rules={[{ required: true, message: "Please type an Bill No." }]}
              >
                <Input placeholder="Bill NO." style={{ width: "100%" }}  />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name="remark"
                label="Remark"
                rules={[{ required: true, message: "Please select an Remark" }]}
              >
                <Input style={{ width: "100%" }} placeholder="Remark" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="submit">
                <Button type="primary" htmlType="submit" isLoading>
                  Add Stock
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row className="mb-4" gutter={[24, 24]}>
          <Col xs={24} md={12} span={12}>
            <Card
              style={{
                maxHeight: "auto",
                overflow: "hidden",
                overflowY: "auto",
              }}
            >
              {/* {console.log("selectedProducts :", selectedProducts)} */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Title level={3}>
                  Assigned Products ({productData?.length})
                </Title>
                <Input.Search
                  value={searchQuery}
                  placeholder="Search Product"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ marginBottom: 16, width: "50%" }}
                />
              </div>
              <DefaultTable
                data={filterData(productData)}
                // data={productData}
                columns={columns}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} md={12} span={12}>
            <Card
              style={{
                maxHeight: "auto",
                overflow: "hidden",
                overflowY: "auto",
              }}
            >
              {/* {console.log("selectedProducts :", selectedProducts)} */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Title level={3}>
                  Updated Products
                </Title>
                {/* <Input.Search
                  value={searchQuery}
                  placeholder="Search Product"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ marginBottom: 16, width: "50%" }}
                /> */}
              </div>
              <DefaultTable
                // data={filterData(productData)}
                data={updatedNewProducts}
                columns={TransferredColumns}
                loading={loading}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default UpdateStock;
