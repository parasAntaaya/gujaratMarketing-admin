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
  Input,
  Menu,
  Space,
  Tooltip,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal } from "antd";
import { toast } from "react-toastify";
import * as XLSX from "xlsx/xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";


const Reason = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [reasonData, setResonData] = useState();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
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
      render: (text) => (
        <div>{reasonData.findIndex((a) => a?._id === text._id) + 1}</div>
     ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
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
                  navigate("edit-reason", { state: { data: record } });
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
  ];
  const fetchReasonData = async () => {
    setIsLoading(true);
    const params = {
      page: 1,
      limit: 1000,
    };
    try {
      await axios
        .post("/admin/reason/get/all", params)
        .then((response) => {
          console.log("reason-get-allresponse",response);
          if (response.status === 200) {
            setResonData(response.data?.data?.reason_data);
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
          `/admin/reason/delete/${recordToDelete._id}`
        );
        if (response.status === 200) {
          toast.success("Reason Successfully Deleted");
          fetchReasonData();
        }
      } catch (error) {
        console.error("Error deleting reason:", error);
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
      item?.reason?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );
  };

  function handleDownloadExcel() {
    const jsonData = filterData(reasonData);

    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "reasonData");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "reason.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = ["Sr. No.", "Reason"];

    const filteredData = filterData(reasonData);
    const rows = filteredData.map((item, index) => [
      index + 1,
      item.reason,
    ]);

    // const tableX = 10;
    const tableY = 20;
    // const tableWidth = 180;
    // const tableHeight = 10;

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
        0: { cellWidth: 60 },
        1: { cellWidth: 100},
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
    fetchReasonData();
  }, []);

  return (
    <>
      <Card
        className="m-2"
        title={
          <div className="d-flex py-3">
            <div className="col-md-6 fs-3 fw-bold">Reasons List</div>

            <div className="col-md-6" style={{ textAlign: "right" }}>
              <Tooltip title="Add Reason" placement="bottom">
                <Button
                  onClick={() => {
                    navigate("add-reason");
                  }}
                  size={"large"}
                  type="primary"
                >
                  Add Reason
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
            placeholder="Search Reason"
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: 16, width: "25%" }}
          />
        </div>
        <DefaultTable
          columns={columns}
          loading={isLoading}
          data={filterData(reasonData)}
        />
      </Card>
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete reason?</p>
      </Modal>
    </>
  );
};

export default Reason;
