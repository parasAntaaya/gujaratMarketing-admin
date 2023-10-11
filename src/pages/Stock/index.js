import {
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Input,
  Menu,
  Modal,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {
  DownOutlined,
  FileExcelOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import DefaultTable from "../../Components/DefaultTable";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx/xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { useSelector } from "react-redux";
const { Text } = Typography;

const Stock = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userRole = useSelector((state) => state.auth?.user?.role);
  const user = useSelector((state) => state.auth?.user);
  const columns = [
    {
      title: "Sr no.",
      dataIndex: "_id",
      key: "srno",
      align: "center",
      render: (text) => (
        <div>{data?.findIndex((a) => a?._id === text) + 1}</div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Category",
      dataIndex: "variantId",
      key: "variantId",
      align: "center",
      render: (variantId) => variantId?.name,
    },
    // (userRole === "admin" &&
    {
      title: "Available Stock",
      dataIndex: "totalAgencyProduct",
      key: "totalAgencyProduct",
      align: "center",
    },
    // ),
    {
      title: "Reserve quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "center",
    },
  ];
  const [data, setData] = useState([]);
  const [availableProduct, setAvailableProduct] = useState(0);
  const [dispatchProduct, setDispatchProduct] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    try {
      axios
        .get("/admin/stock/available")
        .then((response) => {
          if (response.status === 200) {
            setData(response?.data?.data?.productsWithAgencyCount);
            const {
              availableProduct,
              dispatchProduct,
              totalProduct,
              productsWithAgencyCount,
            } = response.data.data;
            setData(productsWithAgencyCount);
            setAvailableProduct(availableProduct);
            setDispatchProduct(dispatchProduct);
            setTotalProduct(totalProduct);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching stock data:", error);
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
      console.log("error :", error);
    }
  }, []);

  const filterData = (data) => {
    if (!data) {
      return [];
    }
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  function handleDownloadExcel() {
    const jsonData = filterData(data);

    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "stockData");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "stock_data.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "Sr. No.",
      "Name",
      "Category",
      "Available Stock",
      "Reserve quantity",
      "Total",
    ];

    const filteredData = filterData(data);
    console.log("filteredData:", filteredData);

    const rows = filteredData.map((item, index) => [
      index + 1,
      item.name,
      item.variantId?.name,
      item.totalAgencyProduct,
      item.quantity,
      item.total,
    ]);

    const tableX = 10;
    const tableY = 20;
    const tableWidth = 180;
    const tableHeight = 10;

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: tableY,
      // startY: tableY,
      styles: {
        fontSize: 12,
        cellPadding: 2,
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "normal",
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
      },
    });
    doc.save("stock_data.pdf");
  };
  const menu = (
    <Menu>
      <Menu.Item key="excel" onClick={() => handleDownloadExcel()}>
        <FileExcelOutlined /> Download Excel
      </Menu.Item>
      <Menu.Item key="pdf" onClick={() => handleDownloadPDF()}>
        <FilePdfFilled /> Download PDF
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Card
        className="m-2"
        title={
          <>
          <Row gutter={[24 , 24]} >
            {/* <Col span={userRole == "agency" ? 12 : 10}> */}
            <Col span={24} >
              <Typography.Title style={{ marginTop: "20px" }}>
                {user?.role === "admin" ? "Admin" : "Agency"} Stock
              </Typography.Title>
            </Col>
          </Row>
        {/* <Divider/> */}
          <Row justify="end" style={{ marginBottom: "20px" }} gutter={[24, 24]}>
            <Col span={4}>
           <Button
                onClick={() => {
                  navigate("agency-stock-transfer");
                }}
                size="large"
                type="primary"
                style={{width: '100%', whiteSpace: 'normal'}}
              >
                Admin to Agency Transfer
              </Button>
             </Col>
             {userRole !== "agency" && (
             <Col span={4}>
           <Button
                onClick={() => {
                  navigate("agency-stock-transfer");
                }}
                size="large"
                type="primary"
                style={{width: '100%', whiteSpace: 'normal'}}
              >
                Agency to SalesPerson Transfer
              </Button>
             </Col>
              )}
             <Col span={4}>
           <Button
                  onClick={() => {
                    navigate("agencytoagency-stock-transfer");
                  }}
                size="large"
                type="primary"
                style={{width: '100%', whiteSpace: 'normal'}}
              >
               Agency to Agency Transfer
              </Button>
             </Col>
          </Row>
          </>
        }
      >
        <Row justify="space-around" gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8}>
            <Card
              size="small"
              style={{ minWidth: 100, backgroundColor: "rgb(237 237 237)" }}
            >
              <Row justify="space-between" align="middle">
                <Text className="fs-4" strong>
                  Total Carton
                </Text>
                <Text className="fs-6" strong>
                  {totalProduct}
                  {/* ctn. */}
                </Text>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              size="small"
              style={{ minWidth: 100, backgroundColor: "rgb(237 237 237)" }}
            >
              <Row justify="space-between" align="middle">
                <Text className="fs-4" strong>
                  Dispatch Stock
                </Text>
                <Text className="fs-6" strong>
                  {dispatchProduct}
                  {/* ctn. */}
                </Text>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              size="small"
              style={{ minWidth: 100, backgroundColor: "rgb(237 237 237)" }}
            >
              <Row justify="space-between" align="middle">
                <Text className="fs-4" strong>
                  Available Stock
                </Text>
                <Text className="fs-6" strong>
                  {availableProduct}
                  {/* ctn. */}
                </Text>
              </Row>
            </Card>
          </Col>
        </Row>
        <div
          style={{ display: "flex", justifyContent: "end", marginTop: "10px" }}
        >
          <div style={{ margin: "0 25px 0 0" }}>
            <Dropdown overlay={menu}>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                }}
                style={{ minWidth: "90px" }}
              >
                <Space style={{ color: "black" }}>
                  {"Download"}
                  <DownOutlined style={{ marginBottom: "5px" }} />
                </Space>
              </Link>
            </Dropdown>
          </div>
          <Input.Search
            value={searchQuery}
            placeholder="Search Stock"
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "25%" }}
          />
        </div>
        <div className="table-responsive align-items-center mt-2 ">
          <DefaultTable
            data={filterData(data) || null}
            columns={columns}
            loading={isLoading}
          />
        </div>
      </Card >
    </>
  );
};

export default Stock;
