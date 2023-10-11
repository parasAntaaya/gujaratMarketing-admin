import {
  Button,
  Card,
  Dropdown,
  Input,
  Menu,
  Modal,
  Space,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import moment from "moment";
import DefaultTable from "../../Components/DefaultTable";
import BASE_URL from "../../utils/baseURL";
import { toast } from "react-toastify";
import axios from "axios";
import DetailsModal from "../../Components/DetailsModal/Index";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx/xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
const { setComplain } = require("../../redux/reduxsauce/complainRedux");

const Complain = () => {
  const data = useSelector((state) => state.complainData?.complain);
  const user = useSelector((state) => state.auth.user);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const handleDelete = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalVisible(true);
  };
  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  const buttonSpacing = "10px";
  const actionButtonContainerStyle = {
    display: "flex",
    alignItems: "center",
  };
  const columns = [
    {
      title: "Sr. No.",
      key: "serialNumber",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "ownerId",
      key: "ownerId",
      render: (ownerId) => ownerId?.ownerName,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => {
        const formattedDate = date ? moment(date).format("DD-MM-YYYY") : "";
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Role",
      dataIndex: "ownerId",
      key: "ownerId",
      render: (ownerId) => ownerId?.role,
    },
    {
      title: "Complain",
      dataIndex: "attachments",
      key: "attachments",
    },

    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <div>
            <div style={actionButtonContainerStyle}>
              {visible && selectedData === record ? (
                <Button
                  className="d-flex justify-content-center align-items-center"
                  style={{ width: "20px" }}
                  onClick={() => {
                    setIsModalOpen(false);
                    setVisible(false);
                  }}
                >
                  <EyeOutlined />
                </Button>
              ) : (
                <Tooltip title="Detail">
                  <Button
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: "20px" }}
                    onClick={() => {
                      setSelectedData(record);
                      setIsModalOpen(true);
                      setVisible(true);
                    }}
                  >
                    <EyeInvisibleOutlined />
                  </Button>
                </Tooltip>
              )}
              {user == "admin" || user?.deleteAccess ? (
                <Tooltip title="Delete" overlayClassName="custom-tooltip">
                  <Button
                    className="d-flex justify-content-center align-items-center"
                    onClick={() => handleDelete(record)}
                    icon={<DeleteOutlined />}
                    style={{ marginLeft: buttonSpacing, color: "red" }}
                  />
                </Tooltip>
              ) : null}
            </div>
          </div>
        </Space>
      ),
    },
  ];
  const fetchData = async () => {
    setIsLoading(true);
    const params = {
      page: 1,
      limit: 100000,
    };
    try {
      await axios
        .post("admin/complain/get/all", params)
        .then((response) => {
          console.log("response----", response);
          dispatch(setComplain(response?.data?.data?.complain_data));
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

  const handleConfirmDelete = async () => {
    if (recordToDelete && recordToDelete._id) {
      try {
        const response = await axios.delete(
          `${BASE_URL}admin/complain/delete/${recordToDelete._id}`
        );
        if (response.status === 200) {
          toast.success("Complain Successfully Deleted");
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
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
      item?.ownerId?.ownerName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  };
  function handleDownloadExcel() {
    const jsonData = filterData(data);

    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "complainData");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "complain_data.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = ["Sr. No.", "Name", "Date", "Role", "Complain"];

    const filteredData = filterData(data);
    console.log("filteredData:", filteredData);

    const rows = filteredData.map((item, index) => [
      index + 1,
      item.ownerId?.ownerName,
      item.date,
      item.role,
      item.attachments,
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
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: 70 },
        3: { cellWidth: 20 },
        4: { cellWidth: 35 },
        5: { cellWidth: 20 },
      },
    });

    doc.save("complain_data.pdf");
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
          <div className="d-flex py-3">
            <div className="col-md-6 fs-3 fw-bold">Complain</div>
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
            placeholder="Search Complain"
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: 16, width: "25%" }}
          />
        </div>
        <div className="table-responsive align-items-center">
          <DefaultTable
            data={filterData(data)}
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
        <p>Are you sure you want to delete this Agency?</p>
      </Modal>
      <DetailsModal
        visible={visible}
        onClose={() => {
          setVisible(false);
          setIsModalOpen(false);
        }}
        data={selectedData}
        title="Complain Details"
        from="complain"
      />
    </>
  );
};
export default Complain;
