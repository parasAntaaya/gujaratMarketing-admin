import {
  Button,
  Card,
  Image,
  Space,
  Tooltip,
  Switch,
  message,
  Dropdown,
  Typography,
  Modal,
  Input,
  Menu,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import * as XLSX from "xlsx/xlsx";
import BASE_URL from "../../utils/baseURL";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import DefaultTable from "../../Components/DefaultTable";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import DetailsModal from "../../Components/DetailsModal/Index";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import axios from "axios";
const RefrigeratorBooking = () => {
  const buttonSpacing = "10px";
  const actionButtonContainerStyle = {
    display: "flex",
    alignItems: "center",
  };
  const switchContainerStyle = {
    marginTop: "7px",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  console.log("isLoading :", isLoading);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState();
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
      key: "id",
      align: "center",
      render: (text) => (
        <div>{data?.findIndex((a) => a?._id === text._id) + 1}</div>
      ),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",

      render: (theImageURL) => (
        <Image src={theImageURL} height={100} preview={false} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Freeze Name",
      dataIndex: "fridgeId",
      key: "fridgeId",
      render: (fridgeId) => fridgeId.company,
    },
    {
      title: "Shop Name",
      dataIndex: "shopName",
      key: "shopName",
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
      title: "Shop Address",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <Typography.Text>
          {address?.address}, {address?.city},{address?.state}
        </Typography.Text>
      ),
      width: "150px",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   // width:"50%",
    //   render: (text, record) => {
    //     return (
    //       <Select
    //         defaultValue="Pending"
    //         name="status"
    //         style={{ width: "100%" }}
    //         onChange={(e) => handleStatusChange(e, record)}
    //       >
    //         <Select.Option value="pending">Pending</Select.Option>
    //         <Select.Option value="decline">Decline</Select.Option>
    //         <Select.Option value="success">Success</Select.Option>
    //       </Select>
    //     )

    //   },
    // },
    // {
    //   title: "Manage Status",
    //   dataIndex: "save",
    //   key: "save",
    //   render: (text, record) => (
    //     <Space size="middle">
    //       <Button
    //         type="primary"
    //         disabled={record?.status == "pending" ? true : false}
    //       >
    //         Save
    //       </Button>
    //     </Space>
    //   )
    // },

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
                    navigate("edit-freeze-booking", {
                      state: { data: record },
                    });
                  }}
                  icon={<EditOutlined />}
                  style={{ marginLeft: buttonSpacing }}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  className="d-flex justify-content-center align-items-center"
                  onClick={() => handleDelete(record)}
                  icon={<DeleteOutlined />}
                  style={{ marginLeft: buttonSpacing, color: "red" }}
                />
              </Tooltip>
            </div>
            <div style={switchContainerStyle}>
              <Switch onChange={(checked) => showAlert(checked)} />
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
      limit: 1000000,
    };
    try {
      await axios
        .post("admin/booking/get/all", params)
        .then((response) => {
          if (response) {
            // setData(setFreezeBooking(response?.data?.data?.booking_data))
            setData(response?.data?.data?.booking_data);
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
  const handleConfirmDelete = async () => {
    if (recordToDelete && recordToDelete._id) {
      try {
        const response = await axios.delete(
          `${BASE_URL}/admin/booking/delete/${recordToDelete._id}`
        );
        if (response.status === 200) {
          toast.success("Freeze Booking Successfully Deleted");
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting Freeze Booking:", error);
      }
    }
    setIsDeleteModalVisible(false);
    setRecordToDelete(null);
  };
  const showAlert = (checked) => {
    message.open({
      type: "success",
      content: checked ? "Active" : "In Active",
      style: {
        textAlign: "right",
        marginRight: 50,
      },
    });
  };
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
    XLSX.utils.book_append_sheet(wb, ws, "FreezeBooking Data");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "refrigerator_booking_data.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "Sr. No.",
      "Name",
      "Freeze Name",
      "Shop Name",
      "Mobile Number",
      "Shop Address",
    ];

    const filteredData = filterData(data);

    const rows = filteredData.map((item, index) => [
      index + 1,
      item.name,
      item.fridgeId?.company || "",
      item.shopName,
      item.contact?.mobile || "",
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
        0: { cellWidth: 15 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 20 },
        4: { cellWidth: 35 },
        5: { cellWidth: 20 },
      },
    });
    doc.save("refrigerator_booking_data.pdf");
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Card
        className="m-2"
        title={
          <div className="d-flex row py-3">
            <div className="col-md-6 fs-3 fw-bold">
              Refrigerator Booking List
            </div>
            <div className="col-md-6" style={{ textAlign: "right" }}>
              <Tooltip
                title="Add Refrigerator Booking"
                overlayClassName="custom-tooltip"
                placement="bottom"
              >
                <Button
                  onClick={() => {
                    navigate("add-freeze-booking");
                  }}
                  size={"large"}
                  type="primary"
                >
                  Add Refrigerator Booking
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
          <Input.Search
            value={searchQuery}
            placeholder="Search freezeBooking Name"
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
        <p>Are you sure you want to delete this Refrigerator Booking?</p>
      </Modal>
      <DetailsModal
        visible={visible}
        onClose={() => {
          setVisible(false);
          setIsModalOpen(false);
        }}
        data={selectedData}
        title="Refrigerator Booking Details"
        from="refrigeratorBookng"
      />
    </>
  );
};
export default RefrigeratorBooking;
