import { Card, Dropdown, Image, Input, Menu, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import {
  DownOutlined,
  FileExcelOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import DefaultTable from "../../Components/DefaultTable";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import * as XLSX from "xlsx/xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
const { setAttandance } = require("../../redux/reduxsauce/attendanceRedux");

const Attandance = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.attandanceData?.attandance);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const columns = [
    {
      title: "Sr. No.",
      key: "serialNumber",
      align: "center",
      render: (text) => (
        <div>{data.findIndex((a)=> a?._id === text._id) + 1}</div>
      ),
    },
    {
      title: " Check In Location Photo",
      dataIndex: "checkInImage",
      key: "checkInImage",
      render: (theImageURL) => (
        <Image src={theImageURL} height={100} preview={false} />
      ),
      align: "center",
    },

    {
      title: "Name",
      dataIndex: "salesOfficerId",
      key: "salesOfficerId",
      render: (record) => {
        return record?.name;
      },
    },
    {
      title: "Check In Time",
      dataIndex: "checkInTime",
      key: "checkInTime",
      render: (checkInTime) => {
        const formattedcheckInTime = checkInTime
          ? moment(checkInTime).format(" h  :  m  :  s A")
          : "";
        return <span>{formattedcheckInTime}</span>;
      },
    },
    {
      title: "Check Out Time",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      render: (checkOutTime) => {
        const formattedcheckOutTime = checkOutTime
          ? moment(checkOutTime).format("h  :  m  :  s A")
          : "";
        return <span>{formattedcheckOutTime}</span>;
      },
    },
    {
      title: "Check Out Location Photo",
      dataIndex: "checkOutImage",
      key: "checkOutImage",
      render: (theImageURL) => (
        <Image src={theImageURL} height={100} preview={false} />
      ),
      align: "center",
    },
    {
      title: "Total Hours",
      dataIndex: "totalHours",
      key: "totalHours",
      render: (text, record) => {
        const checkInTime = moment(record.checkInTime);
        const checkOutTime = moment(record.checkOutTime);
        const duration = moment.duration(checkOutTime.diff(checkInTime));
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        return <span>{`${hours}h ${minutes}m ${seconds}s`}</span>;
      },
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   dataIndex: "action",
    //   align: "center",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <div>
    //         <div style={actionButtonContainerStyle}>
    //           {visible && selectedData === record ? (
    //             <Button
    //               className="d-flex justify-content-center align-items-center"
    //               style={{ width: "20px" }}
    //               onClick={() => {
    //                 setSelectedData(record);
    //                 setIsModalOpen(false);
    //                 setVisible(false);
    //               }}
    //             >
    //               <EyeOutlined />
    //             </Button>
    //           ) : (
    //             <Tooltip title="Detail">
    //               <Button
    //                 className="d-flex justify-content-center align-items-center"
    //                 style={{ width: "20px" }}
    //                 onClick={() => {
    //                   setSelectedData(record);
    //                   setIsModalOpen(true);
    //                   setVisible(true);
    //                 }}
    //               >
    //                 <EyeInvisibleOutlined />
    //               </Button>
    //             </Tooltip>
    //           )}
    //         </div>
    //       </div>
    //     </Space>
    //   ),
    // },
  ];
  const fetchData = () => {
    setIsLoading(true);
    const params = {
      page: 1,
      limit: 100,
    };
    try {
      axios
        .post("admin/attendance/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            console.log("response----", response);
            dispatch(setAttandance(response?.data?.data?.attendance_data));
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
  useEffect(() => {
    fetchData();
  }, []);

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
    console.log("data///", data);
    if (!data) {
      return [];
    }
    return data.filter((item) =>
      item.salesOfficerId?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  };
  function handleDownloadExcel() {
    const jsonData = filterData(data);

    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "attandanceData");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "attandance_data.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "Sr. No.",
      "Name",
      "Check In Time",
      "Check Out Time",
      "Total Hours",
    ];

    const filteredData = filterData(data);
    console.log("filteredData:", filteredData);

    const rows = filteredData.map((item, index) => [
      index + 1,
      item.salesOfficerId?.name,
      item.checkInTime,
      item.checkOutTime,
      item.totalHours,
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
        0: { cellWidth: 20 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
        4: { cellWidth: 35 },
      },
    });

    doc.save("attandance_data.pdf");
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
            <div className="col-md-6 fs-3 fw-bold">Attandance</div>
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
            placeholder="Search Attandance"
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: 16, width: "25%" }}
          />
        </div>
        <div className="table-responsive align-items-center">
          <DefaultTable
            loading={isLoading}
            data={filterData(data)}
            columns={columns}
          />
        </div>
      </Card>
      {/* <DetailsModal
        visible={visible}
        onClose={() => {
          setVisible(false);
          setIsModalOpen(false);
        }}
        data={selectedData}
        title="Attendence Details"
        from="attendence"
      /> */}
    </>
  );
};

export default Attandance;
