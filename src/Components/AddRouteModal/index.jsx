import { Button, Col, Image, Input, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Table, Checkbox, Typography } from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";
const { Title } = Typography;

const App = (props) => {
  const location = useLocation();
  const { state } = location;
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSearchQuery, setSelectedSearchQuery] = useState("");
  const [routesCount, setRoutesCount] = useState();
  const [list1, setList1] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = (itemId) => {
    const updatedList = list1.map((item) => {
      return item._id === itemId ? { ...item, checked: !item.checked } : item;
    });
    setList1(updatedList);
  };

  const updateSelectedItems = () => {
    const selected = list1.filter((item) => item.checked);
    setSelectedItems(selected);
  };

  const showModal = () => {
    setOpen(true);
    if (location.pathname === "/shop/edit-shop") {
      const updatedList1 = list1.map((item1) => {
        console.log("item1",item1);
        const matchingItem2 = state?.data?.routeId.find(
          (item2) => item2._id === item1._id
        );
        if (matchingItem2) {   
          return { ...item1, checked: true };
        }
        return item1;
      });
      setList1(updatedList1);
    }
  };

  const handleOk = () => {
    setOpen(false);
    setConfirmLoading(true);
    setConfirmLoading(false);
    // updateSelectedItems();
    if (location.pathname === "/shop/edit-shop") {
      setRoutesCount(selectedItems.length);
    }
    props.setRoutesData(selectedItems);
  };
console.log("");
  const handleCancel = () => {
    setOpen(false);
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "srNumber",
      width: "20px",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Vehicle Photo",
      dataIndex: "vehicleImage",
      key: "vehicleImage",
      render: (theImageURL) => (
        <Image src={theImageURL} height={100} preview={false} />
      ),
      align: "center",
    },
    {
      title: "Route Name",
      dataIndex: "routeName",
      key: "routeName",
    },
    {
      title: "Driver Name",
      dataIndex: "driverName",
      key: "driverName",
    },
    {
      title: "Day",
      dataIndex: "day",
      key: "day",
    },
    {
      title: "Select",
      dataIndex: "_id",
      render: (_, record) => (
        <Checkbox
          checked={record.checked}
          onChange={(e) => handleCheckboxChange(record._id)}
        />
      ),
    },
  ];

  function filterData(data) {
    console.log("data",data);
    return data?.filter((item) =>
    // console.log("item",item)
      item?.routeName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );
  }
  function filterSelectedData(data) {
    return data?.filter((item) =>
      item?.routeName?.toLowerCase()?.includes(selectedSearchQuery?.toLowerCase())
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const routesParams = {
          page: 1,
          limit: 100000,
        };
        const response = await axios.post("admin/route/get/all", routesParams);
        if (response.status === 200) {
          console.log("routesresponse",response);
          setIsLoading(false);
          setList1(response?.data?.data?.route_data);
        }
      } catch (error) {
        setIsLoading(false);
        console.log("error-->>>>>", error?.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    updateSelectedItems();
    if (location.pathname === "/shop/edit-shop") {
      setRoutesCount(state?.data?.routeId.length);
    }
  }, [list1]);

  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        {location.pathname === "/shop/edit-shop"
          ? "Edit Route"
          : "Add Route"}
      </Button> */}

      <Title level={5} style={{ margin: "0 0 18px 22px" }}>
        Selected Route:{" "}
        <strong>
          {location.pathname === "/shop/edit-shop"
            ? routesCount
            : selectedItems.length}
        </strong>{" "}
      </Title>

      <Modal
        // title="Add Shops"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={1300}
        height={1300}
      >
        <Row gutter={16} style={{ margin: "32px 0 0 0" }}>
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              <Col span={12}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Title level={5}>All Routes ({list1?.length}) </Title>
                  <Input.Search
                    name="searchQuery"
                    value={searchQuery}
                    placeholder="Search shops"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginBottom: 16, width: "50%" }}
                  />
                </div>
                <Table
                  columns={columns}
                  dataSource={filterData(list1)}
                  pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    onChange: handlePageChange,
                  }}
                />
              </Col>
              <Col span={12}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Title level={5}>
                    Selected Routes ({selectedItems?.length}){" "}
                  </Title>
                  <Input.Search
                    name="selectedSearchQuery"
                    value={selectedSearchQuery}
                    placeholder="Search selected route"
                    onChange={(e) => setSelectedSearchQuery(e.target.value)}
                    style={{ marginBottom: 16, width: "50%" }}
                  />
                </div>
                <Table
                  columns={columns}
                  dataSource={filterSelectedData(selectedItems)}
                  pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    onChange: handlePageChange,
                  }}
                />
              </Col>
            </>
          )}
        </Row>
      </Modal>
    </>
  );
};
export default App;
