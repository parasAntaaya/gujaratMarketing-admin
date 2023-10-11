import { Button, Card, Dropdown, Input, Menu, Space, Tooltip } from "antd";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultTable from "../../Components/DefaultTable";
import BASE_URL from "../../utils/baseURL";
import { toast } from "react-toastify";
import { Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import axios from "axios";
import * as XLSX from "xlsx/xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
const { setShopGroup } = require("../../redux/reduxsauce/ShopGroupRedux");

const ShopGroup = () => {
  const buttonSpacing = "10px";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const data = useSelector((state) => state.shopgroupData.shopGroup);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
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
              <Tooltip title="Edit">
                <Button
                  className="d-flex justify-content-center align-items-center"
                  onClick={() => {
                    navigate("editshopGroup", { state: { data: record } });
                  }}
                  icon={<EditOutlined />}
                  style={{ marginLeft: buttonSpacing }}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  className="d-flex justify-content-center align-items-center"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record)}
                  style={{ marginLeft: buttonSpacing, color: "red" }}
                />
              </Tooltip>
            </div>
          </div>
        </Space>
      ),
    },
  ];

  const fetchData = () => {
    setIsLoading(true);
    const params = {
      page: 1,
      limit: 1000000,
      areaFilter: [" "],
    };
    try {
      axios
        .post("admin/shop/group/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            console.log("shop - get- all- response----", response);
            dispatch(setShopGroup(response?.data?.data?.shop_group_data));

            const statusMap = {};
            response?.data?.data?.shop_group_data.forEach((shopGroup) => {
              statusMap[shopGroup._id] = shopGroup.isActive;
            });
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmDelete = async () => {
    if (recordToDelete && recordToDelete._id) {
      try {
        const response = await axios.delete(
          `${BASE_URL}admin/shop/group/delete/${recordToDelete._id}`
        );
        if (response.status === 200) {
          toast.success("Shop Successfully Deleted");
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
    setIsDeleteModalVisible(false);
    setRecordToDelete(null);
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
    XLSX.utils.book_append_sheet(wb, ws, "shopGroupData");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "ShopGroup_data.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = ["Sr. No.", "Name", "Remark"];

    const filteredData = filterData(data);
    console.log("filteredData:", filteredData);

    const rows = filteredData.map((item, index) => [
      index + 1,
      item.name,
      item.remark,
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
        0: { cellWidth: 50 },
        1: { cellWidth: 60 },
        2: { cellWidth: 60 },
      },
    });

    doc.save("shopGroup_data.pdf");
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
            <div className="col-md-6 fs-3 fw-bold">Shop Group List</div>
            <div className="col-md-6" style={{ textAlign: "right" }}>
              <Tooltip title="Add Shop Group" placement="bottom">
                <Button
                  onClick={() => {
                    navigate("addshopGroup");
                  }}
                  size={"large"}
                  type="primary"
                >
                  Add Shop Group
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
            placeholder="Search Shop Group"
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
        <p>Are you sure you want to delete this Shop Group?</p>
      </Modal>
    </>
  );
};
export default ShopGroup;
