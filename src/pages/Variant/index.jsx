import React, { useEffect, useState } from "react";
import DefaultTable from "../../Components/DefaultTable";
import {
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
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
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../../utils/baseURL";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Modal } from "antd";
import { toast } from "react-toastify";
import * as XLSX from "xlsx/xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
const Variant = () => {
  const navigate = useNavigate();
  // const data = useSelector((state) => state.shopData.shop);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [variantData, setVariantData] = useState();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [variantStatus, setVariantStatus] = useState({});
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
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (_, record) => (
        <div style={actionButtonContainerStyle}>
          <Space size="middle">
            <Tooltip title="Edit">
              <Button
                className="d-flex justify-content-center align-items-center"
                onClick={() => {
                  navigate("edit-category", { state: { data: record } });
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
                style={{ color: "red" }}
              />
            </Tooltip>
          </Space>
        </div>
      ),
    },
    {
      title: "Status",
      key: "isBlocked",
      dataIndex: "isBlocked",
      align: "center",
      render: (isBlocked, record) => (
        <Tooltip title={variantStatus[record._id] ? "In Active" : "Active"}>
          <Switch
            checked={variantStatus[record._id] || false}
            onChange={(checked) => handleSwitchChange(record._id, checked)}
          />
        </Tooltip>
      ),
    },
  ];
  const fetchVariantData = async () => {
    setIsLoading(true);
    const params = {
      page: 1,
      limit: 1000,
    };
    try {
      await axios
        .post("admin/variant/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            setVariantData(response.data?.data?.variant_data);
            const statusMap = {};
            response?.data?.data?.variant_data.forEach((variant) => {
              statusMap[variant._id] = variant.isBlocked;
            });
            setVariantStatus(statusMap);
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
          `${BASE_URL}admin/variant/delete/${recordToDelete._id}`
        );
        if (response.status === 200) {
          toast.success("Category Successfully Deleted");
          fetchVariantData();
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
      const response = await axios.post(`admin/variant/edit`, data);
      if (response.status === 200) {
        toast.success("Catagory Successfully Updated");
        setVariantStatus((prevStatus) => ({
          ...prevStatus,
          [recordId]: checked,
        }));
      } else {
        toast.error("Failed to update Catagory status");
      }
    } catch (error) {
      toast.error("An error occurred while updating Catagory status");
    }
  };

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
    const jsonData = filterData(variantData);

    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "categoryData");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "category_data.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = ["Sr. No.", "Name", "Unit", "Remark"];

    const filteredData = filterData(variantData);
    const rows = filteredData.map((item, index) => [
      index + 1,
      item.name,
      item.unit,
      item.quantity,
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

    doc.save("category_data.pdf");
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
    fetchVariantData();
  }, []);

  return (
    <>
      <Card
        className="m-2"
        title={
          <div className="d-flex py-3">
            <div className="col-md-6 fs-3 fw-bold">Category List</div>

            <div className="col-md-6" style={{ textAlign: "right" }}>
              <Tooltip title="Add Category" placement="bottom">
                <Button
                  onClick={() => {
                    navigate("add-category");
                  }}
                  size={"large"}
                  type="primary"
                >
                  Add Category
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
            placeholder="Search Category"
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: 16, width: "25%" }}
          />
        </div>
        <DefaultTable
          columns={columns}
          loading={isLoading}
          data={filterData(variantData)}
        />
      </Card>
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete this Category?</p>
      </Modal>
    </>
  );
};

export default Variant;
