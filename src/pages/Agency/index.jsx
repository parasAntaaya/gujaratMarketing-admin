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
  message,
} from "antd";
// import "./Agency.css";
import {
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../../utils/baseURL";
import axios from "axios";
import DefaultTable from "../../Components/DefaultTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DetailsModal from "../../Components/DetailsModal/Index";
import { Modal } from "antd";
import { toast } from "react-toastify";
import * as XLSX from "xlsx/xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import PdfModal from "../../Components/PdfModal/index";
const { setAgency } = require("../../redux/reduxsauce/agencyRedux");

const Agency = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.agencyData?.agency);
  const [pdfvisible, setPdfVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [agencyStatus, setAgencyStatus] = useState({});
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
  const switchContainerStyle = {
    marginTop: "7px",
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
      title: "Agency Photo",
      dataIndex: "image",
      key: "image",
      render: (theImageURL) => (
        <Image src={theImageURL[0]} height={100} preview={false} />
      ),
      align: "center",
    },
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "Agency Name",
      dataIndex: "agencyName",
      key: "agencyName",
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
      title: "Area",
      dataIndex: "area",
      key: "area",
      width: "150px",
    },
    {
      title: "Godown address",
      dataIndex: "godownAddress",
      key: "godownAddress",
      render: (godownAddress) => {
        return <Typography.Text>{godownAddress?.address}</Typography.Text>;
      },
      width: "150px",
    },
    {
      title: "Access",
      key: "setting",
      dataIndex: "setting",
      align: "center",
      render: (_, record) =>
        record.setting ? (
          <span>Yes</span>
        ) : (
          <span style={{ color: "#cf2129" }}>No access</span>
        ),
      // console.log("Sett :", )
      // <Switch
      //   // defaultChecked
      //   checked={record.setting}
      //   // onChange={onChange}
      // />
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
                <Tooltip title="Details" overlayClassName="custom-tooltip">
                  <Button
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: "20px" }}
                    onClick={() => {
                      setSelectedData(record);
                      setVisible(true);
                      setIsModalOpen(true);
                    }}
                  >
                    <EyeInvisibleOutlined />
                  </Button>
                </Tooltip>
              )}
              <Tooltip title="Edit" overlayClassName="custom-tooltip">
                <Button
                  className="d-flex justify-content-center align-items-center"
                  onClick={() => {
                    navigate("edit-agency", { state: { data: record } });
                  }}
                  icon={<EditOutlined />}
                  style={{ marginLeft: buttonSpacing }}
                />
              </Tooltip>
              <Tooltip title="Delete" overlayClassName="custom-tooltip">
                <Button
                  className="d-flex justify-content-center align-items-center"
                  onClick={() => handleDelete(record)}
                  icon={<DeleteOutlined />}
                  style={{ marginLeft: buttonSpacing, color: "red" }}
                />
              </Tooltip>
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
      render: (active, record) => (
        <Tooltip title={agencyStatus[record._id] ? "In Active" : "Active"}>
          <Switch
            checked={agencyStatus[record._id] || false}
            onChange={(checked) => handleSwitchChange(record._id, checked)}
          />
        </Tooltip>
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
        .post("admin/agency/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            console.log("agency - get- all- response----", response);
            dispatch(setAgency(response?.data?.data?.agency_data));
            const statusMap = {};
            response?.data?.data?.agency_data.forEach((agency) => {
              statusMap[agency._id] = agency.isActive;
            });
            setAgencyStatus(statusMap);
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
          `${BASE_URL}admin/agency/delete/${recordToDelete._id}`
        );
        if (response.status === 200) {
          toast.success("Agency Successfully Deleted");
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
    setIsDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  const handleSwitchChange = async (recordId, checked) => {
    try {
      const data = { _id: recordId, isActive: checked };
      const response = await axios.post(`admin/agency/edit`, data);
      if (response.status === 200) {
        toast.success("Agency Successfully Updated");
        setAgencyStatus((prevStatus) => ({
          ...prevStatus,
          [recordId]: checked,
        }));
        // fetchData();
      } else {
        toast.error("Failed to update Agency status");
      }
    } catch (error) {
      toast.error("An error occurred while updating Agency status");
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
      item.agencyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  function handleDownloadExcel() {
    const jsonData = filterData(data);

    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "agencyData");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "agency_data.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "Sr. No.",
      "Owner Name",
      "Agency Name",
      "Mobile Number",
      "Area",
      "Godown address",
    ];

    const filteredData = filterData(data);
    console.log("filteredData:", filteredData);

    const rows = filteredData.map((item, index) => [
      index + 1,
      item.ownerName,
      item.agencyName,
      item.contact.mobile,
      item.area,
      item.godownAddress?.address,
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
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
        5: { cellWidth: 40 },
      },
    });
    doc.save("agency_data.pdf");
  };
  const menu = (
    <Menu>
      <Menu.Item key="excel" onClick={() => handleDownloadExcel()}>
        <FileExcelOutlined /> Download Excel
      </Menu.Item>
      <Menu.Item
        key="pdf"
        onClick={() => {
          setPdfVisible(true);
          setIsModalOpen(true);
        }}
      >
        <FilePdfFilled /> Download PDF
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Card
        className="m-2"
        title={
          <div className="d-flex row py-3">
            <div className="col-md-6 fs-3 fw-bold">Agency List</div>
            <div className="col-md-6 " style={{ textAlign: "right" }}>
              <Tooltip
                title="Add Agency"
                overlayClassName="custom-tooltip"
                placement="bottom"
              >
                <Button
                  onClick={() => {
                    navigate("add-agency");
                  }}
                  size={"large"}
                  type="primary"
                >
                  Add Agency
                </Button>
              </Tooltip>
            </div>
          </div>
        }
      >
        <div className="table-responsive align-items-center">
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
              placeholder="Search Agency"
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: 16, width: "25%" }}
            />
          </div>
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
        }}
        data={selectedData}
        title="Agency Details"
        from="agency"
      />
      <PdfModal
        visible={pdfvisible}
        onClose={() => {
          setPdfVisible(false);
        }}
        data={selectedData}
        title="Agency Details PDF"
        from="agency"
      />
    </>
  );
};
export default Agency;
