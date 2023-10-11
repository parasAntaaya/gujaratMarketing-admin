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
  Typography,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DefaultTable from "../../Components/DefaultTable";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import axios from "axios";
const {
  Title,
} = Typography;
const AddStock = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchName, setSearchName] = useState("");

  const [productData, setProductData] = useState();
  const [selectedProductArrays, setSelectedProductArrays] = useState([{
    "productId": "",
    "quantity": null
  }]);
  const [dateValue, setDateValue] = useState();
  const [billNo, setBillNo] = useState();
  const [remarkValue, setRemarkValue] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isQuantityInputted, setIsQuantityInputted] = useState(); // Step 1
  var updatedProducts = []

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
      title: "Category",
      dataIndex: "variantId",
      key: "variantId",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
      render: (variantId) => variantId ? variantId.unit : "",
    },
    {
      title: "Update Quantity",
      key: "update_quantity",
      dataIndex: "update_quantity",
      align: "center",
      style: { backgroundColor: "#FF0000" },
      render: (text, record) => (
        <Form.Item
          name="quantity"
          rules={[{ required: true, message: "Please input a Quantity" }]}
        >
          <Input
            maxLength={6}
            onChange={(value) =>
              handleQuantityChange(value.target.value, record)
            }
            style={{ width: "100%" }}
            value={text}
          />
        </Form.Item>
      ),
    },
  ];
  const updatedCcolumns = [
    {
      title: "Sr no.",
      dataIndex: "srNo", 
      key: "name",
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
      title: "Category",
      dataIndex: "variantId", 
      key: "variantId",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
      render: (variantId) => variantId?.unit,
    },
    {
      title: "Quantity",
      dataIndex: "quantity", 
      key: "quantity",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
    },
  ];
  const handleRemark = (value) => {
    setRemarkValue(value?.target?.value);
   
  };
 
  const handleBillNo = (value) => {
    setBillNo(value?.target?.value);
   
  };
  const handleQuantityChange = (value, record) => {
   
    let quantity = parseInt(value)
   
    for (let i = 0; i < productData.length; i++) {
      const element = productData[i];
      if (element?._id === record?._id) {
        
        const existingProductIndex = updatedProducts.findIndex(
          (product) => product.productId === record._id
        );

        if (existingProductIndex !== -1) {
          
          updatedProducts[existingProductIndex].quantity = quantity;
        } else {
         
          updatedProducts.push({ productId: record._id, quantity: quantity });
        }
      }
      
    };
    setIsQuantityInputted(updatedProducts.some((product) => product.quantity !== null));
  }
  
  const fetchProductData = () => {
    setIsLoading(true);
    const params = {
      page: 1,
      limit: 100,
    };
    try {
      axios
        .post("/admin/product/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            setProductData(response?.data?.data?.product_data);
            setIsLoading(false);
          }
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
    fetchProductData();
  }, []);
 
  const onFinish = async () => {
    try {
      form.validateFields().then(async () => {
        if (!isQuantityInputted) {
          // Step 3: Prevent form submission if no quantity inputted
          toast.error("Please input at least one quantity before submitting.");
          return;
        }
        console.log("Transfer product API ");
        const tranferData = {
          date: dateValue,
          remark: remarkValue,
          billNo: billNo,
          isProductUpdate: true,
          products: updatedProducts
        };
        setIsLoading(true);
        console.log("tranferData-------------------- :", tranferData);
        if (updatedProducts) {
          await axios
            .post("/admin/product/edit", tranferData)
            .then((response) => {
              console.log("productresponse;;;;;;;;", response);
              if (response.status === 200) {
                const productDataRes = response?.data?.data.product;
                console.log("productDataRes------->>>", productDataRes);
                toast.success("Product transferred");
                fetchProductData()
                setIsLoading(false);
                form.resetFields(["update_quantity","date","remark","billNo"]);
                navigate("/purchase-bill");
              }
            })
            .catch((error) => {
              setIsLoading(false);
              toast.error("Error transferring product. Please try again later.");
              console.log("error-->>>>>", error?.message);
            });
        }
      });
    } catch (error) {
      console.log("Error :", error);
    }
  };
  const handleDateChange = (date, dateString) => {
    const selectedDate = date?.format("YYYY-MM-DD")
    setDateValue(selectedDate);
  };
  const filterData = (data) => {
    if (!data) {
      return [];
    }
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  const searchData = (data) => {
    if (!data) {
      return [];
    }
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchName.toLowerCase())
    );
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
              onClick={() => navigate("/purchase-bill")}
              icon={<LeftOutlined className="back-icon " />}
            ></Button>
            <div>
              <h4 className="fw-bold fs-4">Add Purchase Bill</h4>
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
          <Divider />
          <Row className="mb-4" gutter={[24, 24]}>
            <Col span={6}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: "Please select a date" }]}
              >
                <DatePicker
                  name="date"
                  style={{ width: "100%" }}
                  format={"DD-MM-YYYY"}
                  value={moment(dateValue)}
                  onChange={(date) => handleDateChange(date, "date")}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="billNo"
                label="Bill No."
                rules={[{ required: true, message: "Please type an Bill No." }]}
              >
                <Input
                  style={{
                    width: "100%",
                  }}
                  placeholder="Bill NO."
                  onChange={handleBillNo}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="remark"
                label="Remark"
              >
                <Input
                  style={{
                    width: "100%",
                  }}
                  placeholder="Remark"
                  onChange={handleRemark}
                />
              </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="submit">
                  <div
                    style={{
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={isLoading}
                    >
                      Submit
                    </Button>
                  </div>
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Title level={3}>
                  All Products ({productData?.length})
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
                columns={columns}
                loading={isLoading}
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
               <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Title level={3}>Updated Products</Title>
              <Input.Search
                  value={searchName}
                  placeholder="Search Product"
                  onChange={(e) => setSearchName(e.target.value)}
                  style={{ marginBottom: 16, width: "50%" }}
                />
                </div>
              <DefaultTable
               data={searchData(productData)}
                columns={updatedCcolumns}
                loading={isLoading}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default AddStock;
