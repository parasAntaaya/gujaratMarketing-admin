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
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import DefaultTable from "../../Components/DefaultTable";
import {
  EditOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import BASE_URL from "../../utils/baseURL";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import DetailsModal from "../../Components/DetailsModal/Index";
import moment from "moment";
import { toast } from "react-toastify";
import * as XLSX from "xlsx/xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
const { setSalesOfficer } = require("../../redux/reduxsauce/salesofficerRedux");

const SalesOfficer = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRole = useSelector((state) => state.auth?.user?.role);
  const user = useSelector((state) => state.auth?.user);
  const data = useSelector((state) => state.salesOfficerData?.salesOfficer);

  const [visible, setVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [salesOfficerStatus, setSalesOfficerStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
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
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (theImageURL) => (
        <Image src={theImageURL} height={100} preview={false} />
      ),
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      render: (dob) => {
        const formattedDate = dob ? moment(dob).format("DD-MM-YYYY") : "";
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Recidency Address",
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
          <div>
            <div style={actionButtonContainerStyle}>
              {visible && selectedData === record ? (
                <Button
                  className="d-flex justify-content-center align-items-center"
                  style={{ width: "20px" }}
                  onClick={() => {
                    setSelectedData(record);
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
                      navigate("edit-salesofficer", {
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
      key: "isActive",
      dataIndex: "isActive",
      align: "center",
      render: (isActive, record) => (
        <Tooltip
          title={salesOfficerStatus[record._id] ? "In Active" : "Active"}
        >
          {(userRole === "admin" ||
            (userRole === "agency" && user.statusAccess)) && (
            <Switch
              checked={salesOfficerStatus[record._id] || false}
              onChange={(checked) => handleSwitchChange(record._id, checked)}
            />
          )}
        </Tooltip>
      ),
    },
  ];
  const fetchData = () => {
    setIsLoading(true);
    const params = {
      page: 1,
      limit: 1000000,
    };
    try {
      axios
        .post("admin/sales/officer/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            dispatch(setSalesOfficer(response?.data?.data?.sales_officer_data));
            const statusMap = {};
            response?.data?.data?.sales_officer_data.forEach((salesOfficer) => {
              statusMap[salesOfficer._id] = salesOfficer.isActive;
            });
            setSalesOfficerStatus(statusMap);
            setIsLoading(false);
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
          `${BASE_URL}admin/sales/officer/delete/${recordToDelete._id}`
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
      const data = { _id: recordId, isActive: checked };
      const response = await axios.post(`admin/sales/officer/edit`, data);
      if (response.status === 200) {
        toast.success("SalesMan Successfully Updated");
        setSalesOfficerStatus((prevStatus) => ({
          ...prevStatus,
          [recordId]: checked,
        }));
      } else {
        toast.error("Failed to update SalesMan status");
      }
    } catch (error) {
      toast.error("An error occurred while updating SalesMan status");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // const showAlert = (checked) => {
  //   message.open({
  //     type: "success",
  //     content: checked ? "Active" : "In Active",
  //     style: {
  //       textAlign: "right",
  //       marginRight: 50,
  //     },
  //   });
  // };
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
    XLSX.utils.book_append_sheet(wb, ws, "SalesOfficerData");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "salesOfficer_data.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "Sr. No.",
      "Name",
      "Mobile Number",
      "Date of Birth",
      "Recidency Address",
    ];

    const filteredData = filterData(data);

    const rows = filteredData.map((item, index) => [
      index + 1,
      item.name,
      item.contact.mobile,
      item.dob,
      item.address?.address,
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
        1: { cellWidth: 30 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
        4: { cellWidth: 60 },
      },
    });

    doc.save("salesOfficer_data.pdf");
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
            <div className="col-md-6 fs-3 fw-bold">Sales Officer List</div>
            <div className="col-md-6 " style={{ textAlign: "right" }}>
              {(userRole === "admin" ||
                (userRole === "agency" && user.addAccess)) && (
                <Tooltip title=" Add Sales Officer" placement="bottom">
                  <Button
                    onClick={() => {
                      navigate("add-salesofficer");
                    }}
                    size={"large"}
                    type="primary"
                  >
                    Add Sales Officer
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
            placeholder="Search Sales Officer"
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
        <p>Are you sure you want to delete this SalesOfficer?</p>
      </Modal>
      <DetailsModal
        visible={visible}
        onClose={() => {
          setVisible(false);
          setIsModalOpen(false);
        }}
        data={selectedData}
        title="Sales Officer Details"
        from="salesOfficer"
      />
    </>
  );
};

export default SalesOfficer;
