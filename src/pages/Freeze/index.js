import {
  Button,
  Card,
  Dropdown,
  Image,
  Input,
  Menu,
  Space,
  Switch,
  Tooltip,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import DefaultTable from "../../Components/DefaultTable";
import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  DeleteOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DetailsModal from "../../Components/DetailsModal/Index";
import ImageModal from "../../Components/ImageModal";
import BASE_URL from "../../utils/baseURL";
import axios from "axios";
import { Modal } from "antd";
import { toast } from "react-toastify";
import * as XLSX from "xlsx/xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
const { setFreeze } = require("../../redux/reduxsauce/freezeRedux");
const Freeze = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userRole = useSelector((state) => state.auth?.user?.role);
  const user = useSelector((state) => state.auth?.user);
  const data = useSelector((state) => state.freezeData?.freeze);

  const [visible, setVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [fridgeStatus, setFridgeStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const buttonSpacing = "10px";
  const actionButtonContainerStyle = {
    display: "flex",
    alignItems: "center",
  };

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
      render: (text) => (
        <div>{data?.findIndex((a) => a?._id === text._id) + 1}</div>
      ),
    },
    {
      title: "Photo",
      dataIndex: "image",
      key: "image",
      render: (theImageURL) => (
        <Image preview={false} src={theImageURL[0]} height={100} />
      ),
    },
    {
      title: "Freeze Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Warranty",
      dataIndex: "warranty",
      key: "warranty",
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
              {(userRole === "admin" ||
                (userRole === "agency" && user.editAccess)) && (
                <Tooltip title="Edit">
                  <Button
                    className="d-flex justify-content-center align-items-center"
                    onClick={() => {
                      navigate("edit-freeze", {
                        state: { data: record },
                      });
                    }}
                    icon={<EditOutlined />}
                    style={{ marginLeft: buttonSpacing }}
                  />
                </Tooltip>
              )}
              {(userRole === "admin" ||
                (userRole === "agency" && user.deleteAccess)) && (
                <Tooltip title="Delete">
                  <Button
                    className="d-flex justify-content-center align-items-center"
                    onClick={() => handleDelete(record)}
                    icon={<DeleteOutlined />}
                    style={{ marginLeft: buttonSpacing, color: "red" }}
                  />
                </Tooltip>
              )}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Status",
      key: "isBlocked",
      dataIndex: "isBlocked",
      align: "center",
      render: (isBlocked, record) => (
        <Tooltip title={fridgeStatus[record._id] ? "In Active" : "Active"}>
          {(userRole === "admin" ||
            (userRole === "agency" && user.statusAccess)) && (
            <Switch
              checked={fridgeStatus[record._id] || false}
              onChange={(checked) => handleSwitchChange(record._id, checked)}
            />
          )}
        </Tooltip>
      ),
    },
  ];
  const fetchData = async () => {
    setIsLoading(true);
    const params = {
      page: 1,
      limit: 1000000,
    };
    try {
      await axios
        .post("admin/fridge/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            dispatch(setFreeze(response?.data?.data?.fridge_data));
            const statusMap = {};
            response?.data?.data?.fridge_data.forEach((freeze) => {
              statusMap[freeze._id] = freeze.isBlocked;
            });
            setFridgeStatus(statusMap);
            setIsLoading(false);
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
  const handleConfirmDelete = async () => {
    if (recordToDelete && recordToDelete._id) {
      try {
        const response = await axios.delete(
          `${BASE_URL}admin/fridge/delete/${recordToDelete._id}`
        );
        if (response.status === 200) {
          toast.success("Freeze Successfully Deleted");
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting Freeze:", error);
      }
    }
    setIsDeleteModalVisible(false);
    setRecordToDelete(null);
  };
  const handleSwitchChange = async (recordId, checked) => {
    try {
      const data = { _id: recordId, isBlocked: checked };
      const response = await axios.post(`admin/fridge/edit`, data);
      if (response.status === 200) {
        toast.success("Refrigerator Successfully Updated");
        setFridgeStatus((prevStatus) => ({
          ...prevStatus,
          [recordId]: checked,
        }));
      } else {
        toast.error("Failed to update Refrigerator status");
      }
    } catch (error) {
      toast.error("An error occurred while updating Refrigerator status");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filterData = (data) => {
    if (!data) {
      return [];
    }
    return data.filter((item) =>
      item.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  function handleDownloadExcel() {
    const jsonData = filterData(data);

    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "refrigeratorData");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "refrigerator_data.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = ["Sr. No.", "Freeze Company", "Size", "Warranty"];

    const filteredData = filterData(data);
    console.log("filteredData:", filteredData);

    const rows = filteredData.map((item, index) => [
      index + 1,
      item.company,
      item.size,
      item.warranty,
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
        1: { cellWidth: 60 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
      },
    });
    doc.save("refrigerator_data.pdf");
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
            <div className="col-md-6 fs-3 fw-bold"> Refrigerator List</div>
            <div className="col-md-6" style={{ textAlign: "right" }}>
              {(userRole === "admin" ||
                (userRole === "agency" && user.addAccess)) && (
                <Tooltip title="Add Refrigerator" placement="bottom">
                  <Button
                    className="me-2"
                    onClick={() => {
                      navigate("add-freeze");
                    }}
                    size={"large"}
                    type="primary"
                  >
                    Add Refrigerator
                  </Button>
                </Tooltip>
              )}
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
          <Input.Search
            value={searchQuery}
            placeholder="Search Freeze"
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: 16, width: "25%" }}
          />
        </div>
        <div className="table-responsive align-items-center">
          <DefaultTable
            data={filterData(data)}
            loading={isLoading}
            columns={columns}
          />
        </div>
      </Card>
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete this Refrigerator?</p>
      </Modal>
      <ImageModal
        visible={visible}
        onClose={() => {
          setVisible(false);
          setIsModalOpen(false);
        }}
        data={selectedData}
        title="Freeze Details"
        from="freezebooking"
      />
    </>
  );
};
export default Freeze;
