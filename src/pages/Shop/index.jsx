import {
  Button,
  Card,
  Image,
  Space,
  Switch,
  message,
  Tooltip,
  Typography,
  Input,
  Menu,
  Dropdown,
  Radio,
} from "antd";
import React, { useEffect, useState } from "react";
import DefaultTable from "../../Components/DefaultTable";
import BASE_URL from "../../utils/baseURL";
import {
  EditOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DetailsModal from "../../Components/DetailsModal/Index";
import axios from "axios";
import { Modal } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import * as XLSX from "xlsx/xlsx";
import jsPDF from "jspdf";
const { setShop } = require("../../redux/reduxsauce/shopRedux");
const Shop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userRole = useSelector((state) => state.auth?.user?.role);
  const user = useSelector((state) => state.auth?.user);
  const data = useSelector((state) => state.shopData.shop);

  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [shopStatus, setShopStatus] = useState({});
  const [shopOpenClose, setShopOpenClose] = useState({});
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
      title: "Shop Photo",
      dataIndex: "shopImage",
      key: "shopImage",
      align: "center",
      render: (theImageURL) => (
        <div style={{ width: "100px", height: "100px", overflow: "hidden" }}>
          <Image src={theImageURL} preview={false} />
        </div>
      ),
    },
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "Shop Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Shop Group Name",
      dataIndex: "shopGroupId",
      key: "shopGroupId",
      render: (shopGroupId) => shopGroupId?.name,
    },
    {
      title: "Agency Name",
      dataIndex: "agencyId",
      key: "agencyId",
      render: (agencyId) => agencyId?.agencyName,
    },
    {
      title: "Salesman Name",
      dataIndex: "salesmanId",
      key: "salesmanId",
      render: (salesmanId) => salesmanId?.name,
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
      title: "Shop Address",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <Typography.Text>
          {address?.address},{address?.city},{address?.state}
        </Typography.Text>
      ),
    },
    {
      title: "Shop Status",
      // width: "220px",
      dataIndex: "isOpen",
      key: "isOpen",
      render: (isOpen, record) => (
        <>
          {/* <Radio.Group
            options={[
              {
                label: "Open",
                value: "Open",
              },
              {
                label: "Closed",
                value: "Closed",
              },
            ]}
            name="shopStatus"
            // checked={shopOpenClose[record._id]}
            value={isOpen ? "Open" : "Close"}
            optionType="button"
            buttonStyle="solid"
            onChange={
              (checked) => handleSwitchChange(record, checked)
              // console.log(checked.target.value === "Open" ? true : false)
            }
          /> */}
          {isOpen ? (
            <Typography.Text  style={{ color: "green" }}>{"Open"}</Typography.Text>
          ) : (
            <Typography.Text style={{ color: "red" }}>
              {"Closed"}
            </Typography.Text>
          )}
        </>
      ),
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
                      navigate("edit-shop", { state: { data: record } });
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
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record)}
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
        <Tooltip title={shopStatus[record._id] ? "Inactive" : "Active"}>
          <Switch
            checked={shopStatus[record._id] || false}
            onChange={(checked) => handleSwitchChange(record, checked)}
          />
        </Tooltip>
      ),
    },
  ];
  const fetchData = async () => {
    setIsLoading(true);
    console.log("loading on");
    const params = {
      page: 1,
      limit: 1000000,
      areaFilter: [" "],
    };
    try {
      await axios
        .post("admin/shop/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            console.log("loading off");
            dispatch(setShop(response?.data?.data?.shop_data));
            const statusMap = {};
            response?.data?.data?.shop_data.forEach((shop) => {
              statusMap[shop._id] = shop.isActive;
            });
            setShopStatus(statusMap);
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
          `${BASE_URL}admin/shop/delete/${recordToDelete._id}`
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

  const handleSwitchChange = async (recordId, checked) => {
    try {
      const shopOpenCloseStatus =
        checked?.target?.value === "Open" ? true : false;
      const shopActiveInactiveStatus = checked;

      let data;
      if (checked?.target?.name === "shopStatus") {
        data = {
          _id: recordId._id,
          isOpen: shopOpenCloseStatus,
        };
      } else {
        data = {
          _id: recordId._id,
          isActive: shopActiveInactiveStatus,
        };
      }

      const response = await axios.post(`admin/shop/edit`, data);
      if (response.status === 200) {
        toast.success("Shop Successfully Updated");
        setShopStatus((prevStatus) => ({
          ...prevStatus,
          [recordId]: checked,
        }));
        // setShopOpenClose((prevStatus) => ({
        //   ...prevStatus,
        //   [recordId]: checked,
        // }));
      } else {
        toast.error("Failed to update shop status");
      }
    } catch (error) {
      toast.error("An error occurred while updating shop status");
    }
  };

  // const handleSwitchChange = async (recordId, checked) => {
  //   try {
  //     const data = { _id:recordId, isActive: checked };
  //     const response = await axios.post(
  //       `admin/shop/edit`,
  //       data
  //     );
  //     if (response.status === 200) {
  //       toast.success("Shop Successfully Updated");
  //       fetchData();
  //     } else {
  //       toast.error("Failed to update shop status");
  //     }
  //   } catch (error) {
  //     console.error("Error updating shop status:", error);
  //     toast.error("An error occurred while updating shop status");
  //   }
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
    const columns = [
      "Sr. No.",
      "Owner Name",
      "Shop Name",
      "Agency Name",
      "Salesman Name",
      "Mobile Number",
      "Date of Birth",
      "Shop Address",
    ];

    const filteredData = filterData(data);
    const rows = filteredData.map((item, index) => [
      index + 1,
      item.ownerName,
      item.name,
      item.agencyId?.agencyName,
      item.salesmanId?.name,
      item.contact.mobile,
      item.dob,
      item.address?.address,
    ]);
    const dataSet = [
      columns,
      rows,
      // Add more data here
    ];
    const ws = XLSX.utils.aoa_to_sheet(dataSet);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, "example.xlsx");
    // const wb = XLSX.utils.book_new();
    // const parsingData = data;
    // const ws = XLSX.utils.json_to_sheet(parsingData);
    // XLSX.utils.book_append_sheet(wb, ws, "Results");
    // XLSX.writeFile(wb, 'out.xlsx', { type: 'file' });
    // const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    // const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    // saveAs(blob, "shop_data.xlsx");
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "Sr. No.",
      "Owner Name",
      "Shop Name",
      "Agency Name",
      "Salesman Name",
      "Mobile Number",
      "Date of Birth",
      "Shop Address",
    ];

    const filteredData = filterData(data);
    const rows = filteredData.map((item, index) => [
      index + 1,
      item.ownerName,
      item.name,
      item.agencyId?.agencyName,
      item.salesmanId?.name,
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
        0: { cellWidth: 10 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 40 },
        6: { cellWidth: 30 },
        7: { cellWidth: 40 },
      },
    });
    doc.save("shop_data.pdf");
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
    // fetchGroupData();
    // setDataSelect(data);
  }, []);

  return (
    <>
      <Card
        className="m-2"
        title={
          <div className="d-flex py-3">
            <div className="col-md-6 fs-3 fw-bold">Shop List</div>

            <div className="col-md-6" style={{ textAlign: "right" }}>
              <Tooltip title="Add Shop" placement="bottom">
                {(userRole === "admin" ||
                  (userRole === "agency" && user.addAccess)) && (
                  <Button
                    onClick={() => {
                      navigate("add-shop");
                    }}
                    size={"large"}
                    type="primary"
                  >
                    Add Shop
                  </Button>
                )}
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
            placeholder="Search Shop"
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
        <p>Are you sure you want to delete this Shop?</p>
      </Modal>
      <DetailsModal
        visible={visible}
        onClose={() => {
          setVisible(false);
          setIsModalOpen(false);
        }}
        data={selectedData}
        title="Shop Details"
        from="shop"
      />
    </>
  );
};

export default Shop;
