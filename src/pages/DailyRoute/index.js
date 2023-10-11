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
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../../utils/baseURL";
import axios from "axios";
import DefaultTable from "../../Components/DefaultTable";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import DetailsModal from "../../Components/DetailsModal/Index";
import { Modal } from "antd";
import { toast } from "react-toastify";
import * as XLSX from "xlsx/xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import moment from "moment";
const { setRoute } = require("../../redux/reduxsauce/routeRedux");

const DailyRoute = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.routeData?.route);
  const [visible, setVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [routeStatus, setRouteStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [totalActiveShopsCount, setTotalActiveShopsCount] = useState(0);
  const [totalInactiveShopsCount, setTotalInactiveShopsCount] = useState(0);

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

  const calculateTotalActiveShops = (data) => {
    // Assuming that 'data' is an array of objects and each object has 'totalActiveShops' and 'totalInactiveShops' properties.
    return data.reduce((total, item) => total + item.totalActiveShops, 0);
  };

  const calculateTotalInactiveShops = (data) => {
    // Assuming that 'data' is an array of objects and each object has 'totalActiveShops' and 'totalInactiveShops' properties.
    return data.reduce((total, item) => total + item.totalInactiveShops, 0);
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
      title: "Vehical Image",
      dataIndex: "vehicleImage",
      key: "vehicleImage",
      render: (theImageURL) => (
        <Image src={theImageURL} height={100} preview={false} />
      ),
      align: "center",
    },
    {
      title: " Start Time",
      dataIndex: "startTime",
      key: "startTime",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
      render: (startTime) => {
        const formattedStartTime = new Date(startTime)
          ? moment(startTime).format("HH:mm:ss")
          : "";
        return <span>{formattedStartTime}</span>;
      },
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
      render: (endTime) => {
        const formattedEndTime = endTime
          ? moment(endTime).format("HH:mm:ss")
          : "";
        return <span>{formattedEndTime}</span>;
      },
    },
    {
      title: "Route Name",
      dataIndex: "routeName",
      key: "routeName",
    },
    {
      title: "Driver Name",
      dataIndex: "driverName",
      key: "driverName",
    },
    {
      title: "Day",
      dataIndex: "day",
      key: "day",
      width: "150px",
    },
    {
      title: "Agency name",
      dataIndex: "agencyId",
      key: "agencyId",
      width: "150px",
      render: (agencyId) => agencyId?.agencyName,
    },
    {
      title: "Sales-Man name",
      dataIndex: "salesmanId",
      key: "salesmanId",
      width: "150px",
      render: (salesmanId) => salesmanId?.name,
    },
    {
      title: "Total Shop",
      key: "totalShopCount",
      render: (_, record) =>
        record?.totalActiveShops + record?.totalInactiveShops,
      width: "150px",
    },

    {
      title: "Total Active Shops",
      key: "totalActiveShopsCount",
      render: (_, record) => record?.totalActiveShops,
      width: "150px",
    },
    {
      title: "Total Inactive Shops",
      key: "totalInactiveShopsCount",
      render: (_, record) => record?.totalInactiveShops,
      width: "150px",
    },
    // {
    //   title: "Address",
    //   dataIndex: "address",
    //   key: "address",
    //   render: (address) => {
    //     return <Typography.Text>{address?.address}</Typography.Text>;
    //   },
    //   width: "150px",
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
                    navigate("edit-dailyroute", { state: { data: record } });
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
      key: "isBlocked",
      dataIndex: "isBlocked",
      align: "center",
      render: (isBlocked, record) => (
        <Tooltip title={routeStatus[record._id] ? "In Active" : "Active"}>
          <Switch
            checked={routeStatus[record._id] || false}
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
        .post("admin/route/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            dispatch(setRoute(response?.data?.data?.route_data));

            const statusMap = {};
            response?.data?.data?.route_data.forEach((route) => {
              statusMap[route._id] = route.isBlocked;
            });
            setRouteStatus(statusMap);

            const activeCount = response?.data?.data?.route_data.reduce(
              (total, route) => total + route.totalActiveShops,
              0
            );
            const inactiveCount = response?.data?.data?.route_data.reduce(
              (total, route) => total + route.totalInactiveShops,
              0
            );
            setTotalActiveShopsCount(activeCount);
            setTotalInactiveShopsCount(inactiveCount);

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
          `${BASE_URL}admin/route/delete/${recordToDelete._id}`
        );
        if (response.status === 200) {
          toast.success("Route Successfully Deleted");
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
      const data = { _id: recordId, isBlocked: checked };
      const response = await axios.post(`admin/route/edit`, data);
      if (response.status === 200) {
        toast.success("Route  Successfully Updated");
        setRouteStatus((prevStatus) => ({
          ...prevStatus,
          [recordId]: checked,
        }));
      } else {
        toast.error("Failed to update Route status");
      }
    } catch (error) {
      toast.error("An error occurred `while` updating Route status");
    }
  };

  const filterData = (data) => {
    return data?.filter(
      (item) =>
        item?.routeName?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        item?.driverName?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        item?.day?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        item?.salesmanId?.name
          ?.toLowerCase()
          .includes(searchQuery?.toLowerCase()) ||
        item?.agencyId?.agencyName
          ?.toLowerCase()
          .includes(searchQuery?.toLowerCase())
    );
  };
  function handleDownloadExcel() {
    const jsonData = filterData(data);
    console.log("jsonData:", jsonData);
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DailyRouteData");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "daily_route_data.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "Sr. No.",
      "Route Name",
      "Driver Name",
      "Day",
      "Agency Name",
      "Shop",
    ];

    const filteredData = filterData(data);
    const rows = filteredData.map((item, index) => [
      index + 1,
      item.routeName,
      item.driverName,
      item.day,
      item.agencyId?.agencyName || "",
      item.totalActiveShops || "",
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
    doc.save("daily_route_data.pdf");
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
            <div className="col-md-6 fs-3 fw-bold">Daily Route</div>
            <div className="col-md-6 " style={{ textAlign: "right" }}>
              <Tooltip
                title="Add Route"
                overlayClassName="custom-tooltip"
                placement="bottom"
              >
                <Button
                  onClick={() => {
                    navigate("add-dailyroute");
                  }}
                  size={"large"}
                  type="primary"
                >
                  Add Route
                </Button>
              </Tooltip>
            </div>
          </div>
        }
      >
        <div className="table-responsive align-items-center">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
              placeholder="Search Route"
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: 16, width: "25%" }}
            />
          </div>
          <DefaultTable
            // data={data}
            data={filterData(data)}
            columns={columns}
            loading={isLoading}
          />
        </div>
        {/* <PDFViewer width="100%" height="500px">
          <PDFDocument data={data} />
        </PDFViewer> */}
      </Card>
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete this Route?</p>
      </Modal>
      <DetailsModal
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        data={selectedData}
        title="Route Details"
        from="route"
      />
    </>
  );
};
export default DailyRoute;
