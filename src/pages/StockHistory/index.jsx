import {
  Button,
  Card,
  Dropdown,
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
  LeftOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import DefaultTable from "../../Components/DefaultTable";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "antd";

const StockHistory = (state) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [data, setData] = useState([]);

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setRecordToDelete(null);
  };
  const columns = [
    {
      title: "Sr no.",
      dataIndex: "srNo",
      key: "srNo",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => {
        const formattedDate = createdAt
          ? moment(createdAt).format("DD-MM-YYYY")
          : "";
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Bill No",
      dataIndex: "billNo",
      key: "billNo",
    },
    {
      title: "From:",
      dataIndex: "from",
      key: "from",
      render: (to) => {
        if (to) {
          if (to && to.agencyName) {
            return (
              <span>
                {to.agencyName}-{to.role}
              </span>
            );
          } else {
            return (
              <span>
                {to.name}-{to.role}
              </span>
            );
          }
        }
        return <span>No Data</span>;
      },
    },
    {
      title: "To:",
      dataIndex: "to",
      key: "to",
      render: (to) => {
        if (to) {
          if (to && to.agencyName) {
            return (
              <span>
                {to.agencyName}-{to.role}
              </span>
            );
          } else {
            return (
              <span>
                {to.name}-{to.role}
              </span>
            );
          }
        }
        return <span>No Data</span>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "products",
      key: "products",
      render: (products) => products?.map((qunt) => qunt.quantity).join(", "),
    },
    {
      title: "Products Name",
      dataIndex: "products",
      key: "products",
      render: (products) => products?.map((na) => na.name).join(", "),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },

    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    // {
    //         title: "Action",
    //         key: "action",
    //         dataIndex: "action",
    //         align: "center",
    //         render: (_, record) => (
    //           <Space size="middle">
    //               <Tooltip title="Delete">
    //                 <Button
    //                   className="d-flex justify-content-center align-items-center"
    //                   onClick={() => handleDelete(record)}
    //                   icon={<DeleteOutlined />}
    //                   style={{ color: "red" }}
    //                 />
    //               </Tooltip>
    //           </Space>
    //         ),
    //       },
  ];
  // const fetchData = () => {
  //   setIsLoading(true);
  //   const params = {
  //     page: "1",
  //     limit: "1000"
  //   };
  //   try {
  //     axios
  //       .post("admin/stock/history/get/all", params)
  //       .then((response) => {
  //         if (response.status === 200) {
  //           console.log("res----------->",response)
  //         // setData(response?.data?.data?.stock_history);
  //         //   const statusMap = {};
  //         //   response?.data?.data?.catlogue_data.forEach((catalogs) => {
  //         //     statusMap[catalogs._id] = catalogs.isBlocked;
  //         //   });
  //         //   setProductStatus(statusMap);
  //           setIsLoading(false);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("error-->>>>>", error?.message);
  //       });
  //   } catch (error) {
  //     console.log("error -=====>>", error);
  //   }
  // };
  const fetchStockData = () => {
    setIsLoading(true);
    const slaesmanprams = {
      page: 1,
      limit: 1000,
    };
    try {
      axios
        .post("admin/stock/history/get/all", slaesmanprams)
        .then((response) => {
          console.log(":res==============>", response);
          setData(response.data?.data?.stock_history_data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
        });
    } catch (error) {
      console.log("error -=====>>", error);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);
  // const filterData = (data) => {
  //   if (!data) {
  //     return [];
  //   }
  //   return data. filter((item) =>
  //     item.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // };
  // function handleDownloadExcel() {
  //   const jsonData = filterData(data);

  //   const ws = XLSX.utils.json_to_sheet(jsonData);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "CatalogData");

  //   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  //   saveAs(blob, "Catalog_data.xlsx");
  // }
  // const handleDownloadPDF = () => {
  //   const doc = new jsPDF();
  //   const columns = ["Sr. No.", "Name", "Category"];

  //   const filteredData = filterData(data);
  //   console.log("filteredData:", filteredData);

  //   const rows = filteredData.map((item, index) => [
  //     index + 1,
  //     item.name,
  //     item.variants,
  //   ]);
  //   const tableX = 10;
  //   const tableY = 20;
  //   const tableWidth = 180;
  //   const tableHeight = 10;
  //   doc.autoTable({
  //     head: [columns],
  //     body: rows,
  //     startY: tableY,
  //     // startY: tableY,
  //     styles: {
  //       fontSize: 12,
  //       cellPadding: 2,
  //       fillColor: [255, 255, 255],
  //       textColor: [0, 0, 0],
  //       fontStyle: "normal",
  //     },
  //     columnStyles: {
  //       0: { cellWidth: 40 },
  //       1: { cellWidth: 60 },
  //       2: { cellWidth: 60 },
  //     },
  //   });

  //   doc.save("catalog_data.pdf");
  // };
  // const handleSingleDownloadPDF = (record, index) => {
  //   const doc = new jsPDF();
  //   const columns = ["Sr. No.", "Name", "Category"];
  //   const rowData = [[1, record.name, record.variants]];
  //   const tableX = 10;
  //   const tableY = 20;
  //   const tableWidth = 180;
  //   const tableHeight = 10;
  //   doc.autoTable({
  //     head: [columns],
  //     body: rowData,
  //     startY: tableY,
  //     // startY: tableY,
  //     styles: {
  //       fontSize: 12,
  //       cellPadding: 2,
  //       fillColor: [255, 255, 255],
  //       textColor: [0, 0, 0],
  //       fontStyle: "normal",
  //     },
  //     columnStyles: {
  //       0: { cellWidth: 40 },
  //       1: { cellWidth: 60 },
  //       2: { cellWidth: 60 },
  //     },
  //   });

  //   doc.save("catalog_data.pdf");
  // };
  const menu = (
    <Menu>
      {/* <Menu.Item key="excel" onClick={() => handleDownloadExcel()}>
          <FileExcelOutlined /> Download Excel
        </Menu.Item>
        <Menu.Item key="pdf" onClick={() => handleDownloadPDF()}>
          <FilePdfFilled /> Download PDF
        </Menu.Item> */}
    </Menu>
  );
  return (
    <>
      {contextHolder}
      <Card
        className="m-2"
        title={
          <div className="d-flex">
            <Button
              className="back-button mx-2 btn btn-outline-primary"
              type="default"
              onClick={() => navigate(-1)}
              icon={<LeftOutlined className="back-icon" />}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h4 className="fw-bold fs-4">Stock History</h4>
            </div>
          </div>
        }
      >
        {/* <div style={{ display: "flex", justifyContent: "end" }}>
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
          </div> */}
        <div className="table-responsive align-items-center">
          <DefaultTable
            // data={filterData(data)}
            data={data}
            columns={columns}
            loading={isLoading}
          />
        </div>
      </Card>
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        //   onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete this Catalogue?</p>
      </Modal>
    </>
  );
};

export default StockHistory;
