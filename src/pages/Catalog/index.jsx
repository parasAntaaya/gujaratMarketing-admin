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
import {
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfFilled,
  DownloadOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import DefaultTable from "../../Components/DefaultTable";
import { useSelector } from "react-redux";
import axios from "axios";
import BASE_URL from "../../utils/baseURL";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "antd";
import { toast } from "react-toastify";
import * as XLSX from "xlsx/xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
const { setCatalogs } = require("../../redux/reduxsauce/catalogRedux");

const Catalog = (state) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userRole = useSelector((state) => state.auth?.user?.role);
  const user = useSelector((state) => state.auth?.user);
  const data = useSelector((state) => state.catalogsData.catalogs);

  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [catlogueStatus, setProductStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

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
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (theImageURL) => (
        <Image src={theImageURL[0]} height={100} preview={false} />
      ),
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Category",
      dataIndex: "variants",
      key: "variants",
      align: "center",
      render: (variants) => {
        return variants?.map((variants) => (
          <div key={variants.key}>{variants}</div>
        ));
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          {(userRole === "admin" ||
            (userRole === "agency" && user.editAccess)) && (
            <Tooltip title="Edit">
              <Button
                className="d-flex justify-content-center align-items-center"
                onClick={() => {
                  navigate("edit-catalog", { state: { data: record } });
                }}
                icon={<EditOutlined />}
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
                style={{ color: "red" }}
              />
            </Tooltip>
          )}
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
    {
      title: "Status",
      key: "isBlocked",
      dataIndex: "isBlocked",
      align: "center",
      render: (isBlocked, record) => (
        <Tooltip title={catlogueStatus[record._id] ? "In Active" : "Active"}>
          <Switch
            checked={catlogueStatus[record._id] || false}
            onChange={(checked) => handleSwitchChange(record._id, checked)}
          />
        </Tooltip>
      ),
    },
  ];
  const fetchData = () => {
    setIsLoading(true);
    const params = {
      page: "1",
      limit: "1000000",
    };
    try {
      axios
        .post("admin/catlogue/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            dispatch(setCatalogs(response?.data?.data?.catlogue_data));
            const statusMap = {};
            response?.data?.data?.catlogue_data.forEach((catalogs) => {
              statusMap[catalogs._id] = catalogs.isBlocked;
            });
            setProductStatus(statusMap);
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
          `${BASE_URL}admin/catlogue/delete/${recordToDelete._id}`
        );
        if (response.status === 200) {
          toast.success("Catlogue Successfully Deleted");
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
      const response = await axios.post(`admin/catlogue/edit`, data);
      if (response.status === 200) {
        toast.success("Catlogue  Successfully Updated");
        setProductStatus((prevStatus) => ({
          ...prevStatus,
          [recordId]: checked,
        }));
      } else {
        toast.error("Failed to update Catlogue  status");
      }
    } catch (error) {
      toast.error("An error occurred while updating Catlogue  status");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  // const filterData = (data) => {
  //   return data.filter((item) =>
  //     item.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
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
    XLSX.utils.book_append_sheet(wb, ws, "CatalogData");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "Catalog_data.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = ["Sr. No.", "Name", "Category"];

    const filteredData = filterData(data);
    console.log("filteredData:", filteredData);

    const rows = filteredData.map((item, index) => [
      index + 1,
      item.name,
      item.variants,
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
        1: { cellWidth: 60 },
        2: { cellWidth: 60 },
      },
    });

    doc.save("catalog_data.pdf");
  };
  const handleSingleDownloadPDF = (record, index) => {
    const doc = new jsPDF();
    const columns = ["Sr. No.", "Name", "Category"];
    const rowData = [[1, record.name, record.variants]];
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
        0: { cellWidth: 40 },
        1: { cellWidth: 60 },
        2: { cellWidth: 60 },
      },
    });

    doc.save("catalog_data.pdf");
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
            <div className="col-md-6 fs-3 fw-bold">Catalog List</div>
            <div className="col-md-6" style={{ textAlign: "right" }}>
              {(userRole === "admin" ||
                (userRole === "agency" && user.addAccess)) && (
                <Tooltip title="Add Catalog" placement="bottom">
                  <Button
                    onClick={() => {
                      navigate("add-catalog");
                    }}
                    size="large"
                    type="primary"
                  >
                    Add Catalog
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
            placeholder="Search catalog"
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
        <p>Are you sure you want to delete this Catalogue?</p>
      </Modal>
    </>
  );
};

export default Catalog;
