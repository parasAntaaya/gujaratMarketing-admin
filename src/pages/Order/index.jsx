import {
  Card,
  Col,
  Row,
  Tag,
  Space,
  Select,
  Input,
  Form,
  Menu,
  Dropdown,
} from "antd";
import DefaultTable from "../../Components/DefaultTable";
import {
  DownOutlined,
  FileExcelOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx/xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
const { setOrder } = require("../../redux/reduxsauce/OrderRedux");

const Order = (props) => {
  const dispatch = useDispatch();

  const data = useSelector((state) => state.orderData?.Order);

  const [isLoading, setIsLoading] = useState(false);
  const [resData, setResData] = useState();
  const [salesManResData, setSalesManResData] = useState([]);
  const [deliveryResData, setDeliveryResData] = useState([]);
  const [rowNumbers, setRowNumbers] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  // const [salesmanFilter, setSalesmanFilter] = useState("");
  // const [deliverymanFilter, setDeliverymanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDisabled, setSearchDisabled] = useState(true);
  const [filterDatas, setFilterDatas] = useState([]);
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [selectedDeliveryman, setSelectedDeliveryMan] = useState("");
  const [filterWise, setFilterWise] = useState("");
  const [billNumberFilter, setBillNumberFilter] = useState("");
  const statusColors = {
    pending: "orange",
    complete: "green",
    delivered: "blue",
    canceled: "red",
    default: "grey",
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "_id",
      key: "rowNumbers",
      render: (text) => (
        <div>{data?.findIndex((a) => a?._id === text) + 1}</div>
      ),
    },
    {
      title: "Bill Number",
      dataIndex: "billNo",
      key: "billNo",
    },

    {
      title: "GST",
      dataIndex: "gst",
      key: "gst",
    },

    {
      title: "Payment Mode",
      dataIndex: "paymentMode",
      key: "paymentMode",
    },
    {
      title: "Agency Name",
      dataIndex: "agencyId",
      key: "agencyId",
      render: (agencyId) => agencyId?.agencyName,
    },
    {
      title: "Assigned Salesman",
      dataIndex: "salesmanId",
      key: "salesmanId",
      render: (salesmanId) => {
        const salesMan = salesManResData.find(
          (salesMan) => salesMan._id === selectedSalesman
        );
        return <span>{salesmanId && salesmanId?.name}</span>;
      },
    },
    {
      title: "Assigned Deliveryman",
      dataIndex: "deliverymanId",
      key: "deliverymanId",
      render: (deliverymanId) => {
        const deliveryman = deliveryResData.find(
          (deliveryman) => deliveryman._id === selectedDeliveryman
        );
        return <span>{deliverymanId && deliverymanId?.name}</span>;
      },
    },
    {
      title: "Selling Shop",
      dataIndex: "shopId",
      key: "shopId",
      render: (shopId) => {
        return <span>{shopId && shopId?.name}</span>;
      },
    },

    {
      title: "Order Type",
      dataIndex: "orderType",
      key: "orderType",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      align: "center",
      render: (status) => {
        const color =
          statusColors[status.toLowerCase()] || statusColors.default;
        return (
          <Tag style={{ color, padding: "3px 5px" }}>
            {status ? status.toUpperCase() : "No value"}
          </Tag>
        );
      },
    },
  ];

  const handleFilterWiseChange = (value) => {
    setFilterWise(value);
    setSelectedSalesman(value);
    setSelectedDeliveryMan(value);
  };

  // -----------------------------------------------------------------------------------------------

  const diliveryManData = () => {
    setIsLoading(true);
    const params = {
      page: 1,
      limit: 1000000,
      roleFilter: "deliveryman",
    };
    try {
      axios
        .post("admin/user/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            const resData = response?.data?.data?.user_data;
            setDeliveryResData(resData);
            setResData(resData);
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

  // -----------------------------------------------------------------------------------------------

  const salesManData = () => {
    setIsLoading(true);
    const params = {
      page: 1,
      limit: 1000000,
      roleFilter: "salesman",
    };
    try {
      axios
        .post("admin/user/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            const resData = response?.data?.data?.user_data;
            setSalesManResData(resData);
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
    salesManData();
    diliveryManData();
  }, []);

  // --------------------------------------------------------------------------------------------------------
  const fetchData = async () => {
    setIsLoading(true);
    const params = {
      page: 1,
      limit: 1000000,
    };
    try {
      const response = await axios.post("admin/order/get/all", params);
      if (response.status === 200) {
        dispatch(setOrder(response?.data?.data?.order_data));
        const resData = response?.data?.data?.order_data;
        const numbers = Array.from(
          { length: resData.length },
          (_, index) => index + 1
        );
        setRowNumbers(numbers);
        setFilterDatas(resData);
      }
    } catch (error) {
      console.log("error-->>>>>", error?.message);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  // const filterData = (data) => {
  //   if (!data || !Array.isArray(data)) {
  //     return [];
  //   }
  //   return data.filter((item) => {
  //     const salesmanMatch =
  //       selectedSalesman === "" || item.salesmanId?._id === selectedSalesman;
  //     const deliverymanMatch =
  //       selectedDeliveryman === "" ||
  //       item.deliverymanId?._id === selectedDeliveryman;
  //     const statusMatch =
  //       statusFilter === "" || item.status.toLowerCase() === statusFilter;
  //     const billNumberMatch =
  //       billNumberFilter === "" || item.billNo === Number(billNumberFilter);
  //     return (
  //       salesmanMatch &&
  //       deliverymanMatch &&
  //       statusMatch &&
  //       billNumberMatch &&
  //       (item.salesmanId?.name
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase()) ||
  //         item.shopId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         item.orderType.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         item.paymentMode.toLowerCase().includes(searchQuery.toLowerCase()))
  //     );
  //   });
  // };

  const filterData = (data) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.filter((item) => {
      const salesmanMatch =
        selectedSalesman === "" || item.salesmanId?._id === selectedSalesman;
      const deliverymanMatch =
        selectedDeliveryman === "" ||
        item.deliverymanId?._id === selectedDeliveryman;
      const statusMatch =
        statusFilter === "" || item.status.toLowerCase() === statusFilter;
      const billNumberMatch =
        billNumberFilter === "" || item.billNo === Number(billNumberFilter);

      return (
        (salesmanMatch || deliverymanMatch) &&
        statusMatch &&
        billNumberMatch &&
        (item.salesmanId?.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          item.shopId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.orderType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.paymentMode.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  };

  function handleDownloadExcel() {
    const jsonData = filterData(data);
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "orderData");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "order_data.xlsx");
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "Sr. No.",
      "Total",
      "GST",
      "Payment Mode",
      "Assigned Salesman",
      "Selling Shop",
    ];
    const filteredData = filterData(data);
    const rows = filteredData.map((item, index) => [
      index + 1,
      item.total,
      item.gst,
      item.paymentMode,
      item.salesmanId,
      item.shopId,
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
        0: { cellWidth: 20 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
      },
    });
    doc.save("order_data.pdf");
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
            <div className="col-md-6 fs-3 fw-bold">Order</div>
          </div>
        }
      >
        <Card title={<div className="col-md-6 fs-5 fw-bold">Filter</div>}>
          <Row gutter={[24, 24]}>
            <Col span={3}>
              <Form.Item label="Bill Number filter" name="searchFilter">
                <Input
                  style={{ width: "100%" }}
                  placeholder="Bill Number Filter"
                  value={billNumberFilter}
                  onChange={(e) => {
                    if (billNumberFilter !== e.target.value) {
                      setBillNumberFilter(e.target.value);
                    }
                  }}
                  // maxLength={10}
                  onKeyPress={(e) => {
                    const keyCode = e.which || e.keyCode;
                    if (keyCode < 48 || keyCode > 57) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Filter Wise" name="filterWise">
                <Select
                  placeholder="Filter Wise"
                  value={filterWise}
                  onChange={handleFilterWiseChange}
                  style={{ width: "100%" }}
                >
                  <Select.Option value="salesman">Salesman Wise</Select.Option>
                  <Select.Option value="deliveryman">
                    Deliveryman Wise
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {/* ------------------------------------------------------------------------------------------------------------------------------------------- */}
            {filterWise === "salesman" ? (
              <Col span={4}>
                <Form.Item label="Salesman filter" name="salesmanFilter">
                  <Select
                    placeholder="Salesman Filter"
                    value={selectedSalesman}
                    onChange={(salesmanId) => {
                      setSelectedSalesman(salesmanId);
                    }}
                    style={{ width: "100%" }}
                    options={salesManResData?.map((data) => ({
                      label: data?.name,
                      value: data?._id,
                    }))}
                  />
                </Form.Item>
              </Col>
            ) : null}

            {/* ------------------------------------------------------------------------------------------------------------------------------------------- */}
            {filterWise === "deliveryman" ? (
              <Col span={4}>
                <Form.Item label="Deliveryman filter" name="deliverymanFilter">
                  <Select
                    placeholder="Deliveryman Filter"
                    value={selectedDeliveryman}
                    onChange={(deliverymanId) => {
                      setSelectedDeliveryMan(deliverymanId);
                    }}
                    style={{ width: "100%" }}
                    options={deliveryResData?.map((data) => ({
                      label: data?.name,
                      value: data?._id,
                    }))}
                  />
                </Form.Item>
              </Col>
            ) : null}

            {/* ------------------------------------------------------------------------------------------------------------------------------------------- */}
            <Col span={3}>
              <Form.Item label="Status Filter" name="statusFilter">
                <Select
                  placeholder="Status"
                  value={statusFilter}
                  onChange={(value) => {
                    if (statusFilter !== value) {
                      setStatusFilter(value);
                    }
                  }}
                  style={{ width: "100%" }}
                >
                  <Select.Option value="complete">Complete</Select.Option>
                  <Select.Option value="pending">Pending</Select.Option>
                  <Select.Option value="delivered">Deliverd</Select.Option>
                  <Select.Option value="canceled">Cancelled</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item>
                <Dropdown overlay={menu}>
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Space style={{ color: "black", marginTop: "30px" }}>
                      {"Download"}
                      <DownOutlined />
                    </Space>
                  </Link>
                </Dropdown>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <div className="table-responsive align-items-center">
          <div className="table-responsive align-items-center">
            <DefaultTable
              data={filterData(filterDatas)}
              columns={columns}
              loading={isLoading}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default Order;
