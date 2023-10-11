import { Button, Card, Dropdown, Menu, Space, Tooltip, message } from "antd";
import {
  DownOutlined,
  FileExcelOutlined,
  FilePdfFilled,
  DownloadOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import DefaultTable from "../../Components/DefaultTable";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx/xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

const PurchaseBill = (state) => {
  const navigate = useNavigate();

  const userRole = useSelector((state) => state.auth?.user?.role);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [billData, setBillData] = useState();

  const columns = [
    {
      title: "Sr. No.",
      key: "serialNumber",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => {
        const formattedDate = date ? moment(date).format("DD-MM-YYYY") : "";
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Bill No",
      dataIndex: "billNo",
      key: "billNo",
      align: "center",
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Total Quantity",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Download Pdf">
            <Button
              className="d-flex justify-content-center align-items-center"
              onClick={() => handleSingleDownloadPDF(record)}
              icon={<DownloadOutlined />}
              style={{ color: "blue" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  const fetchData = () => {
    setIsLoading(true);
    let stockHistoryTypeFilter = "";

    if (userRole === "admin") {
      stockHistoryTypeFilter = "adminToAgency";
    } else if (userRole === "agency") {
      stockHistoryTypeFilter = "agencyToSalesman";
    } else if (userRole === "salesman") {
      stockHistoryTypeFilter = "salesmanToShop";
    } else if (userRole === "shop") {
      stockHistoryTypeFilter = "shopToSalesman";
    } else if (userRole === "deliveryman") {
      stockHistoryTypeFilter = "deliverymanToAgency";
    }
    const params = {
      page: 1,
      limit: 10000,
      stockHistoryTypeFilter: stockHistoryTypeFilter,
    };
    try {
      axios
        .post("admin/stock/history/get/all", params)
        .then((response) => {
          console.log("stock-history-response-----", response);
          if (response.status === 200) {
            setBillData(response?.data?.data?.stock_history_data);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log("error-->>>>>|", error?.message);
        });
    } catch (error) {
      console.log("error -=====>>||", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  // const filterData = (data) => {
  //   if (!data) {
  //     return [];
  //   }
  //   return data.filter((item) =>
  //     item.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // };
  function handleDownloadExcel() {
    const jsonData = billData;

    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "purchasebillData");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "purchasebill_data.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = ["Sr. No.", "Date", "Bill No.", "Remark", "Total Quantity"];

    const filteredData = billData;
    console.log("filteredData:", filteredData);

    const rows = filteredData.map((item, index) => [
      index + 1,
      item.date,
      item.billNo,
      item.remark,
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
        0: { cellWidth: 20 },
        1: { cellWidth: 50 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
      },
    });

    doc.save("purchasebill_data.pdf");
  };
  const handleSingleDownloadPDF = (record, index) => {
    const doc = new jsPDF();
    const columns = ["Sr. No.", "Date", "Bill No.", "Remark", "Total Quantity"];
    const rowData = [
      [1, record.date, record.billNo, record.remark, record.total],
    ];
    const tableX = 10;
    const tableY = 20;
    const tableWidth = 180;
    const tableHeight = 10;
    doc.autoTable({
      head: [columns],
      body: rowData,
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
        0: { cellWidth: 20 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
      },
    });
    doc.save("single_purchasebill_data.pdf");
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
      {contextHolder}
      <Card
        className="m-2"
        title={
          <div className="d-flex py-3">
            <div className="col-md-6 fs-3 fw-bold">Purchase Bill List</div>
            <div className="col-md-6" style={{ textAlign: "right" }}>
              <Tooltip title="Add Catalog" placement="bottom">
                <Button
                  onClick={() => {
                    navigate("add-stock");
                  }}
                  size="large"
                  type="primary"
                >
                  Add Purchase Bill
                </Button>
              </Tooltip>
            </div>
          </div>
        }
      >
        <div style={{ display: "flex", justifyContent: "end" }}>
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
          {/* <Input.Search
              value={searchQuery}
              placeholder="Search purchase bill"
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: 16, width: "25%" }}
            /> */}
        </div>
        <div className="table-responsive align-items-center">
          <DefaultTable
            // data={filterData(billData)}
            data={billData}
            columns={columns}
            loading={isLoading}
          />
        </div>
      </Card>
    </>
  );
};

export default PurchaseBill;
