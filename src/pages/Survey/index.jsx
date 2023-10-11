import {
  Button,
  Card,
  Dropdown,
  Input,
  Menu,
  Space,
  Tooltip,
  message,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import DefaultTable from "../../Components/DefaultTable";
import axios from "axios";
import BASE_URL from "../../utils/baseURL";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { toast } from "react-toastify";
import * as XLSX from "xlsx/xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

const Survey = (state) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [catlogueStatus, setProductStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [surveyData, setSurveyData] = useState();
  const handleDelete = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalVisible(true);
  };
  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  const columns = [
    {
      title: "Sr. No.",
      key: "serialNumber",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Shop Name",
      dataIndex: "shopName",
      key: "shopName",
      align: "center",
    },
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
      align: "center",
    },
    {
      title: "Daawat",
      dataIndex: "daawat",
      key: "daawat",
      align: "center",
      render: (daawat) => (
        <Typography.Text>{daawat == true ? "Yes" : "No"}</Typography.Text>
      ),
    },
    {
      title: "Mobile Number",
      dataIndex: "contact",
      key: "contact",
      render: (contact) => (
        <Typography.Text>
          {contact ? `${contact.countryCode} ${contact.mobile}` : "N/A"}
        </Typography.Text>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <Typography.Text>
          {address?.address}, {address?.city},{address?.state}
        </Typography.Text>
      ),
      width: "150px",
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Delete">
            <Button
              className="d-flex justify-content-center align-items-center"
              onClick={() => handleDelete(record)}
              icon={<DeleteOutlined />}
              style={{ color: "red" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  const fetchData = () => {
    //   setIsLoading(true);
    const params = {
      page: "1",
      limit: "1000000",
    };
    try {
      axios
        .post("admin/survey/get/all", params)
        .then((response) => {
          console.log("survey-response", response);
          if (response.status === 200) {
            setSurveyData(response?.data?.data?.survey_data);
            //   setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
        });
    } catch (error) {
      console.log("error -=====>>", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (recordToDelete && recordToDelete._id) {
      try {
        const response = await axios.delete(
          `${BASE_URL}admin/survey/delete/${recordToDelete._id}`
        );
        if (response.status === 200) {
          toast.success("survey Successfully Deleted");
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting survey:", error);
      }
    }
    setIsDeleteModalVisible(false);
    setRecordToDelete(null);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filterData = (data) => {
    if (!data) {
      return [];
    }
    return data.filter((item) =>
      item.shopName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  function handleDownloadExcel() {
    const jsonData = filterData(surveyData);

    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SurveyData");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "Survey_data.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "Sr. No.",
      "Shop Name",
      "Owner Name",
      "Daawat",
      "Mobile Number",
      "Address",
    ];

    const filteredData = filterData(surveyData);
    console.log("filteredData:", filteredData);

    const rows = filteredData.map((item, index) => [
      index + 1,
      item.shopName,
      item.ownerName,
      item.daawat,
      item.contact.mobile,
      item.address?.address,
    ]);
    const tableY = 20;
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
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 30 },
        5: { cellWidth: 50 },
      },
    });

    doc.save("survey_data.pdf");
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
            <div className="col-md-6 fs-3 fw-bold">Survey List</div>
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
          <Input.Search
            value={searchQuery}
            placeholder="Search survey"
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: 16, width: "25%" }}
          />
        </div>
        <div className="table-responsive align-items-center">
          <DefaultTable
            data={filterData(surveyData)}
            //   data={surveyData}

            columns={columns}
            loading={isLoading}
          />
        </div>
      </Card>
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete this Survey?</p>
      </Modal>
    </>
  );
};

export default Survey;
