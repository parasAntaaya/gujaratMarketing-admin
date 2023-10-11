import { Typography, Card, message, Row, Col } from "antd";
import { Link } from "react-router-dom";
import {
  TeamOutlined,
  ShopOutlined,
  InboxOutlined,
  StockOutlined,
  PartitionOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { Space, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const { Text, Title } = Typography;
const Dashboard = () => {
  const [data, setData] = useState([]);
  const user = useSelector((state) => state.auth?.user);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const dataSource = [
    {
      key: "1",
      role: "Agency",
      total_applicants: data?.data?.totalAgency,
      applicants: data?.data?.activeAgency,
      rejected_applicants: data?.data?.totalAgency - data?.data?.activeAgency,
    },
    {
      key: "2",
      role: "SalesMan",
      total_applicants: data?.data?.totalSalesMan,
      applicants: data?.data?.activeSalesMan,
      rejected_applicants:
        data?.data?.totalSalesMan - data?.data?.activeSalesMan,
    },
    {
      key: "3",
      role: "Delivery Person",
      total_applicants: data?.data?.totalDeliveryMan,
      applicants: data?.data?.activeDeliveryMan,
      rejected_applicants:
        data?.data?.totalDeliveryMan - data?.data?.activeDeliveryMan,
    },
    {
      key: "4",
      role: "Shop",
      total_applicants: data?.data?.totalShop,
      applicants: data?.data?.activeShop,
      rejected_applicants: data?.data?.totalShop - data?.data?.activeShop,
    },
    {
      key: "5",
      role: "Sales Officer",
      total_applicants: data?.data?.totalSalesOfficer,
      applicants: data?.data?.activeSalesOfficer,
      rejected_applicants:
        data?.data?.totalSalesOfficer - data?.data?.activeSalesOfficer,
    },
    {
      key: "6",
      role: "Route",
      total_applicants: data?.data?.totalRoute,
      applicants: data?.data?.activeRoute,
      rejected_applicants: data?.data?.totalRoute - data?.data?.activeRoute,
    },
    {
      key: "7",
      role: "Product",
      total_applicants: data?.data?.totalProduct,
      applicants: data?.data?.activeProduct,
      rejected_applicants: data?.data?.totalProduct - data?.data?.activeProduct,
    },
    {
      key: "7",
      role: "Refrigerator",
      total_applicants: data?.data?.totalFridge,
      applicants: data?.data?.activeFridge,
      rejected_applicants: data?.data?.totalFridge - data?.data?.activeFridge,
    },
  ];

  // const columns = [
  //   {
  //     title: "Role",
  //     dataIndex: "role",
  //     key: "role",
  //     align: "center",
  //   },
  //   {
  //     title: "Total Applicants",
  //     dataIndex: "total_applicants",
  //     key: "total_applicants",
  //     align: "center",
  //   },
  //   {
  //     title: "Applicants",
  //     dataIndex: "applicants",
  //     key: "applicants",
  //     align: "center",
  //   },
  //   {
  //     title: "Rejected Applicants",
  //     dataIndex: "rejected_applicants",
  //     key: "rejected_applicants",
  //     align: "center",
  //   },
  // ];

  // const data = [
  //   {
  //     key: 1,
  //     name: "Jan",
  //     price: 150,
  //   },
  //   {
  //     key: 2,
  //     name: "Fab",
  //     price: 50,
  //   },
  //   {
  //     key: 3,
  //     name: "March",
  //     price: 80,
  //   },
  //   {
  //     key: 4,
  //     name: "April",
  //     price: 70,
  //   },
  //   {
  //     key: 5,
  //     name: "May",
  //     price: 25,
  //   },
  //   {
  //     key: 6,
  //     name: "Jun",
  //     price: 10,
  //   },
  //   {
  //     key: 7,
  //     name: "July",
  //     price: 99,
  //   },
  //   {
  //     key: 8,
  //     name: "Augest",
  //     price: 20,
  //   },
  //   {
  //     key: 9,
  //     name: "September",
  //     price: 65,
  //   },
  //   {
  //     key: 10,
  //     name: "Oct",
  //     price: 45,
  //   },
  //   {
  //     key: 11,
  //     name: "November",
  //     price: 72,
  //   },
  //   {
  //     key: 12,
  //     name: "December",
  //     price: 38,
  //   },
  // ];

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/admin/dashboard")
      .then((response) => {
        setIsLoading(false);
        setData(response?.data);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="m-2 mt-4">
      {contextHolder}
      <Title level={3} className="col-md-6 fs-3 fw-bold">
        Welcome {user.role === "admin" ? "Admin" : "Agency"}
      </Title>
      <Title level={5} className="mt-5">
        Total Applicants
      </Title>
      <Row justify="space-around" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Link className="text-decoration-none" to="/agency">
            <Card size="small" style={{ minWidth: 100 }}>
              <Row justify="space-between" align="middle">
                <div>
                  <PartitionOutlined
                    style={{ color: "#a62239", fontSize: "30px" }}
                  />
                </div>
                <div>
                  <div style={{ color: "green" }}>
                    Active :{" "}
                    {!isLoading ? (
                      data?.data?.activeAgency
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                  <div style={{ color: "red" }}>
                    InActive:{" "}
                    {!isLoading ? (
                      data?.data?.totalAgency - data?.data?.activeAgency
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                </div>

                <div>
                  <Title level={3}>
                    {!isLoading ? (
                      data?.data?.totalAgency
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </Title>
                  <Text>Total Agency</Text>
                </div>
              </Row>
            </Card>
          </Link>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Link className="text-decoration-none" to="/salesman">
            <Card size="small" style={{ minWidth: 100 }}>
              <Row justify="space-between" align="middle">
                <div>
                  <TeamOutlined
                    style={{ color: "#a62239", fontSize: "30px" }}
                  />
                </div>
                <div>
                  <div style={{ color: "green" }}>
                    Active :
                    {!isLoading ? (
                      data?.data?.activeSalesMan
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                  <div style={{ color: "red" }}>
                    InActive:{" "}
                    {!isLoading ? (
                      data?.data?.totalSalesMan - data?.data?.activeSalesMan
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                </div>
                <div className="align-items-center">
                  <Title level={3}>
                    {!isLoading ? (
                      data?.data?.totalSalesMan
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </Title>
                  <Text>Total Salesman</Text>
                </div>
              </Row>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Link className="text-decoration-none" to="/deliveryman">
            <Card size="small" style={{ minWidth: 100 }}>
              <Row justify="space-between" align="middle">
                <div>
                  <TeamOutlined
                    style={{ color: "#a62239", fontSize: "30px" }}
                  />
                </div>
                <div>
                  <div style={{ color: "green" }}>
                    Active :
                    {!isLoading ? (
                      data?.data?.activeDeliveryMan
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                  <div style={{ color: "red" }}>
                    InActive:{" "}
                    {!isLoading ? (
                      data?.data?.totalDeliveryMan -
                      data?.data?.activeDeliveryMan
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                </div>
                <div className="align-items-center">
                  <Title level={3}>
                    {!isLoading ? (
                      data?.data?.totalDeliveryMan
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </Title>
                  <Text>Total Delivery Person</Text>
                </div>
              </Row>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Link className="text-decoration-none" to="/shop">
            <Card size="small" style={{ minWidth: 100 }}>
              <Row justify="space-between" align="middle">
                <div>
                  <ShopOutlined
                    style={{ color: "#a62239", fontSize: "30px" }}
                  />
                </div>
                <div>
                  <div style={{ color: "green" }}>
                    Active :
                    {!isLoading ? (
                      data?.data?.activeShop
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                  <div style={{ color: "red" }}>
                    InActive:{" "}
                    {!isLoading ? (
                      data?.data?.totalShop - data?.data?.activeShop
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                </div>
                <div className="align-items-center">
                  <Title level={3}>
                    {!isLoading ? (
                      data?.data?.totalShop
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </Title>
                  <Text>Total Shop</Text>
                </div>
              </Row>
            </Card>
          </Link>
        </Col>
      </Row>
      <Title level={5} className="mt-4">
        Total Applicants
      </Title>
      <Row justify="space-around" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Link className="text-decoration-none" to="/salesofficer">
            <Card size="small" style={{ minWidth: 100 }}>
              <Row justify="space-between" align="middle">
                <div>
                  <StockOutlined
                    style={{ color: "#a62239 ", fontSize: "30px" }}
                  />
                </div>
                <div>
                  <div style={{ color: "green" }}>
                    Active :
                    {!isLoading ? (
                      data?.data?.activeSalesOfficer
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                  <div style={{ color: "red" }}>
                    InActive:{" "}
                    {!isLoading ? (
                      data?.data?.totalSalesOfficer -
                      data?.data?.activeSalesOfficer
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                </div>
                <div className="align-items-center">
                  <Title level={3}>
                    {!isLoading ? (
                      data?.data?.totalSalesOfficer
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </Title>
                  <Text>Total Sales Officer</Text>
                </div>
              </Row>
            </Card>
          </Link>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Link
            className="text-decoration-none"
            to="/dailyroute/add-dailyroute"
          >
            <Card size="small" style={{ minWidth: 100 }}>
              <Row justify="space-between" align="middle">
                <div>
                  <ShoppingCartOutlined
                    style={{ color: "#a62239", fontSize: "30px" }}
                  />
                </div>
                <div>
                  <div style={{ color: "green" }}>
                    Active :
                    {!isLoading ? (
                      data?.data?.activeRoute
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                  <div style={{ color: "red" }}>
                    InActive:{" "}
                    {!isLoading ? (
                      data?.data?.totalRoute - data?.data?.activeRoute
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                </div>
                <div className="align-items-center">
                  <Title level={3}>
                    {!isLoading ? (
                      data?.data?.totalRoute
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </Title>
                  <Text>Routes</Text>
                </div>
              </Row>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Link className="text-decoration-none" to="/product">
            <Card size="small" style={{ minWidth: 100 }}>
              <Row justify="space-between" align="middle">
                <div>
                  <InboxOutlined
                    style={{ color: "#a62239", fontSize: "30px" }}
                  />
                </div>
                <div>
                  <div style={{ color: "green" }}>
                    Active :
                    {!isLoading ? (
                      data?.data?.activeProduct
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                  <div style={{ color: "red" }}>
                    InActive:{" "}
                    {!isLoading ? (
                      data?.data?.totalProduct - data?.data?.activeProduct
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                </div>
                <div className="align-items-center">
                  <Title level={3}>
                    {!isLoading ? (
                      data?.data?.totalProduct
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </Title>
                  <Text> Total Product</Text>
                </div>
              </Row>
            </Card>
          </Link>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Link className="text-decoration-none" to="/freeze-booking">
            <Card size="small" style={{ minWidth: 100 }}>
              <Row justify="space-between" align="middle">
                <div>
                  <StockOutlined
                    style={{ color: "#a62239 ", fontSize: "30px" }}
                  />
                </div>
                <div>
                  <div style={{ color: "green" }}>
                    Active :
                    {!isLoading ? (
                      data?.data?.activeFridge
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                  <div style={{ color: "red" }}>
                    InActive:{" "}
                    {!isLoading ? (
                      data?.data?.totalFridge - data?.data?.activeFridge
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </div>
                </div>
                <div className="align-items-center">
                  <Title level={3}>
                    {!isLoading ? (
                      data?.data?.totalFridge
                    ) : (
                      // <Spin style={{ margin: "0 0 0 10px" }} size="small" />
                      <LoadingOutlined
                        style={{
                          fontSize: 18,
                          margin: "0 0 0 18px",
                        }}
                        spin
                      />
                    )}
                  </Title>
                  <Text>Refrigerator</Text>
                </div>
              </Row>
            </Card>
          </Link>
        </Col>
      </Row>
      {/* <Row
        className="mt-5"
        gutter={[16, 8]}
        style={
          user?.role === "agency" ? { display: "none" } : { display: "block" }
        }
      >
        <Col md={24} lg={24}>
          <Title level={4}>Applicants</Title>
          <Table columns={columns} dataSource={dataSource} pagination={false} />
        </Col>
      </Row> */}
    </div>
  );
};

export default Dashboard;
