import { Button, Card, Image, Space, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import DefaultTable from "../../Components/DefaultTable";
import BASE_URL from "../../utils/baseURL";
import {
  EditOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DetailsModal from "../../Components/DetailsModal/Index";
import axios from "axios";
import { Modal } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
const { setScheme } = require("../../redux/reduxsauce/schemeRedux");

const Scheme = () => {
  const buttonSpacing = "10px";
  const actionButtonContainerStyle = {
    display: "flex",
    alignItems: "center",
  };

  const navigate = useNavigate();
  const data = useSelector((state) => state.schemeData?.Scheme);
  const [dataSelect, setDataSelect] = useState();
  const dispatch = useDispatch();
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

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
        <div>{data.findIndex((a) => a?._id === text._id) + 1}</div>
      ),
    },
    {
      title: "Photo",
      dataIndex: "image",
      key: "image",
      render: (theImageURL) => (
        <Image preview={false} src={theImageURL} height={100} />
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate) => {
        const formattedDate = startDate
          ? moment(startDate).format("DD-MM-YYYY")
          : "";
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => {
        const formattedDate = endDate
          ? moment(endDate).format("DD-MM-YYYY")
          : "";
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Shop Group Name",
      dataIndex: "shopId",
      key: "shopId",
      render: (shopId) => shopId?.name,
    },
    {
      title: "Salesman Name",
      dataIndex: "salesmanId",
      key: "salesmanId",
      render: (salesmanId) => salesmanId?.name,
    },
    {
      title: "Offer",
      dataIndex: "offer",
      key: "offer",
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
              <Tooltip title="Edit">
                <Button
                  className="d-flex justify-content-center align-items-center"
                  onClick={() => {
                    navigate("/scheme/edit-scheme", {
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
    };
    try {
      axios
        .post("admin/scheme/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            console.log("res ++++++++++++", response);
            dispatch(setScheme(response?.data?.data?.scheme_data));
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
          `${BASE_URL}admin/scheme/delete/${recordToDelete._id}`
        );
        if (response.status === 200) {
          toast.success("Scheme Successfully Deleted");
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
    setIsDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  // const filterData = (data) => {
  //   if (!data) {
  //     return [];
  //   }
  //   return data.filter((item) =>
  //     item.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // };

  // function handleDownloadExcel() {
  //   const columns = [
  //     "Sr. No.",
  //     "Owner Name",
  //     "Shop Name",
  //     "Agency Name",
  //     "Salesman Name",
  //     "Mobile Number",
  //     "Date of Birth",
  //     "Shop Address",
  //   ];

  //   const filteredData = filterData(data);
  //   const rows = filteredData.map((item, index) => [
  //     index + 1,
  //     item.ownerName,
  //     item.name,
  //     item.agencyId?.agencyName,
  //     item.salesmanId?.name,
  //     item.contact.mobile,
  //     item.dob,
  //     item.address?.address,

  //   ]);
  //   const dataSet = [
  //     columns,
  //     rows
  //     // Add more data here
  //   ];
  //   const ws = XLSX.utils.aoa_to_sheet(dataSet);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   XLSX.writeFile(wb, 'example.xlsx');
  //   // const wb = XLSX.utils.book_new();
  //   // const parsingData = data;
  //   // const ws = XLSX.utils.json_to_sheet(parsingData);
  //   // XLSX.utils.book_append_sheet(wb, ws, "Results");
  //   // XLSX.writeFile(wb, 'out.xlsx', { type: 'file' });
  //   // const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   // const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  //   // saveAs(blob, "shop_data.xlsx");
  // }

  // const handleDownloadPDF = () => {
  //   const doc = new jsPDF()
  //   const columns = [
  //     "Sr. No.",
  //     "Owner Name",
  //     "Shop Name",
  //     "Agency Name",
  //     "Salesman Name",
  //     "Mobile Number",
  //     "Date of Birth",
  //     "Shop Address",
  //   ];

  //   const filteredData = filterData(data);
  //   const rows = filteredData.map((item, index) => [
  //     index + 1,
  //     item.ownerName,
  //     item.name,
  //     item.agencyId?.agencyName,
  //     item.salesmanId?.name,
  //     item.contact.mobile,
  //     item.dob,
  //     item.address?.address,

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
  //       0: { cellWidth: 10 },
  //       1: { cellWidth: 20 },
  //       2: { cellWidth: 20 },
  //       3: { cellWidth: 20 },
  //       4: { cellWidth: 20 },
  //       5: { cellWidth: 40 },
  //       6: { cellWidth: 30 },
  //       7: { cellWidth: 40 },
  //     },
  //   });
  //   doc.save("shop_data.pdf");
  // };
  // const menu = (
  //   <Menu>
  //     <Menu.Item key="excel" onClick={() => handleDownloadExcel()}>
  //       <FileExcelOutlined /> Download Excel
  //     </Menu.Item>
  //     <Menu.Item key="pdf" onClick={() => handleDownloadPDF()}>
  //       <FilePdfFilled /> Download PDF
  //     </Menu.Item>
  //   </Menu>
  // );

  useEffect(() => {
    fetchData();
    setDataSelect(data);
  }, []);
  return (
    <>
      <Card
        className="m-2"
        title={
          <div className="d-flex py-3">
            <div className="col-md-6 fs-3 fw-bold">Scheme List</div>

            <div className="col-md-6" style={{ textAlign: "right" }}>
              <Tooltip title="Add Shop" placement="bottom">
                <Button
                  onClick={() => {
                    navigate("/scheme/add-scheme");
                  }}
                  size={"large"}
                  type="primary"
                >
                  Add Scheme
                </Button>
              </Tooltip>
            </div>
          </div>
        }
      >
        <div style={{ display: "flex", justifyContent: "end" }}>
          <div style={{ margin: "0 25px 0 0" }}>
            {/* <Dropdown overlay={menu}>
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
              </Dropdown> */}
          </div>
          {/* <Input.Search
            value={searchQuery}
            placeholder="Search Shop"
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: 16, width: "25%" }}
          /> */}
        </div>
        <div className="table-responsive align-items-center">
          <DefaultTable
            //   data={filterData(data)}
            data={data}
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
        <p>Are you sure you want to delete this Scheme?</p>
      </Modal>
      <DetailsModal
        visible={visible}
        onClose={() => {
          setVisible(false);
          setIsModalOpen(false);
        }}
        data={selectedData}
        title="Scheme Details"
        from="scheme"
      />
    </>
  );
};

export default Scheme;
