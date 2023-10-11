import {
  Button,
  Card,
  Image,
  Space,
  Switch,
  message,
  Tooltip,
  Input,
  Menu,
  Dropdown,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import DefaultTable from "../../Components/DefaultTable";
import { useSelector } from "react-redux";
import BASE_URL from "../../utils/baseURL";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "antd";
import * as XLSX from "xlsx/xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
const { setProducts } = require("../../redux/reduxsauce/productRedux");

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRole = useSelector((state) => state.auth?.user?.role);
  const user = useSelector((state) => state.auth?.user);
  const data = useSelector((state) => state.productData?.products);

  const [messageApi, contextHolder] = message.useMessage();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [productStatus, setProductStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
      key: "_id",
      align: "center",
      render: (text) => (
        <div>{data?.findIndex((a) => a?._id === text._id) + 1}</div>
      ),
    },
    {
      title: "Image",
      dataIndex: "productImage",
      key: "productImage",
      render: (theImageURL) => (
        <Image src={theImageURL[0]} height={100} preview={false} />
      ),
      align: "center",
      width: "150px",
    },
    {
      title: " Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Description",
      dataIndex: "descripation",
      key: "descripation",
      align: "center",
    },
    {
      title: "Category",
      dataIndex: "variantId",
      key: "variantId",
      align: "center",
      render: (record) => {
        return record?.unit;
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "MRP",
      dataIndex: "pcsPrice",
      key: "pcsPrice",
      align: "center",
    },
    {
      title: "Cartoon Price",
      dataIndex: "cartoonPrice",
      key: "cartoonPrice",
      align: "center",
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
                  navigate("edit-product", { state: { data: record } });
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
        </Space>
      ),
    },
    {
      title: "Status",
      key: "isBlocked",
      dataIndex: "isBlocked",
      align: "center",
      render: (isBlocked, record) => (
        <Tooltip title={productStatus[record._id] ? "In Active" : "Active"}>
          {(userRole === "admin" ||
            (userRole === "agency" && user.statusAccess)) && (
            <Switch
              checked={productStatus[record._id] || false}
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
      limit: 100,
    };
    try {
      axios
        .post("admin/product/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            dispatch(setProducts(response?.data?.data?.product_data));
            const statusMap = {};
            response?.data?.data?.product_data.forEach((products) => {
              statusMap[products._id] = products.isBlocked;
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
          `${BASE_URL}/admin/product/delete/${recordToDelete._id}`
        );
        if (response.status === 200) {
          toast.success("Product Successfully Deleted");
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
      const response = await axios.post(`admin/product/edit`, data);
      if (response.status === 200) {
        toast.success("Product Successfully Updated");
        setProductStatus((prevStatus) => ({
          ...prevStatus,
          [recordId]: checked,
        }));
      } else {
        toast.error("Failed to update DeliveryMan status");
      }
    } catch (error) {
      toast.error("An error occurred while updating DeliveryMan status");
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
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  function handleDownloadExcel() {
    const jsonData = filterData(data);
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "productData");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "product_data.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "Sr. No.",
      " Name",
      "Description",
      "Category",
      "Quantity",
      "MRP",
      "Cartoon Price",
    ];

    const filteredData = filterData(data);
    const rows = filteredData.map((item, index) => [
      index + 1,
      item.name,
      item.descripation,
      item.variantId?.unit,
      item.quantity,
      item.pcsPrice,
      item.cartoonPrice,
    ]);

    const tableX = 10;
    const tableY = 20;
    const tableWidth = 180;
    const tableHeight = 10;

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: tableY,
      styles: {
        fontSize: 12,
        cellPadding: 2,
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "normal",
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 20 },
        2: { cellWidth: 60 },
        3: { cellWidth: 30 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 40 },
      },
    });
    doc.save("product_data.pdf");
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
            <div className="col-md-6 fs-3 fw-bold">Product List</div>
            <div className="col-md-6" style={{ textAlign: "right" }}>
              {(userRole === "admin" ||
                (userRole === "agency" && user.addAccess)) && (
                <Tooltip title="Add Product" placement="bottom">
                  <Button
                    onClick={() => {
                      navigate("add-product");
                    }}
                    size="large"
                    type="primary"
                  >
                    Add Product
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
            placeholder="Search Products"
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
        <p>Are you sure you want to delete this Product?</p>
      </Modal>
    </>
  );
};

export default Product;
