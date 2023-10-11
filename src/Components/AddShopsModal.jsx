import { Button, Col, Input, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Table, Checkbox, Typography } from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";
// import AllShopsData from "../Components/APICalling/AllShopsData";
// import { Title } from "chart.js";
const { Title } = Typography;

const App = (props) => {
  const location = useLocation();
  const { state } = location;
  // console.log("State shop :", );
  const [selectedItems, setSelectedItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSearchQuery, setSelectedSearchQuery] = useState("");

  const [list1, setList1] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = (itemId) => {
    const updatedList = list1.map((item) => {
      return item._id === itemId ? { ...item, checked: !item.checked } : item;
    });
    setList1(updatedList);
  };

  const updateSelectedItems = () => {
    const selected = list1.filter((item) => item.checked);
    setSelectedItems([...selected]);
  };

  const showModal = () => {
    setOpen(true);
    setSelectedItems(list1.filter((item) => item.checked));
  };
  const handleOk = () => {
    setConfirmLoading(true);
    setConfirmLoading(false);
    setOpen(false);
    props.setShopsData(selectedItems);
    // setTimeout(() => {
    //   setOpen(false);
    // }, 2000);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  const columns = [
    {
      title: "Select",
      dataIndex: "_id",
      render: (_, record) => (
        <Checkbox
          // key={record._id}
          checked={record.checked}
          // checked={selectedItems.some((item) => item._id === record._id)}
          onChange={(e) => handleCheckboxChange(record._id)}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      render: (_, record) => record.address.address,
    },
  ];

  function filterData(data) {
    return data?.filter((item) =>
      item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );
  }
  function filterSelectedData(data) {
    return data?.filter((item) =>
      item?.name?.toLowerCase()?.includes(selectedSearchQuery?.toLowerCase())
    );
  }

  const fetchShopsData = async () => {
    setIsLoading(true);
    const shopsParams = {
      page: 1,
      limit: 100000,
    };

    try {
      await axios
        .post("admin/shop/get/all", shopsParams)
        .then((response) => {
          if (response.status === 200) {
            setIsLoading(false);
            setList1(
              response?.data?.data?.shop_data ||
                response.filter((item) => item.checked)
            );
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

  useEffect(() => {
    updateSelectedItems();
  }, [list1]);

  useEffect(() => {
    location.pathname === "/dailyroute/edit-dailyroute"
      ? setList1(state.data.shopsIds)
      : fetchShopsData();
    // fetchShopsData();
  }, []);

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Shops
      </Button>
      <Title level={5}>
        Selected Shops: <strong>{list1.length}</strong>{" "}
      </Title>

      <Modal
        // title="Add Shops"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={1000}
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
                  <Title level={5}>
                    All Shops (
                    {location.pathname === "/dailyroute/edit-dailyroute"
                      ? list1?.length
                      : selectedItems.length}
                    ){" "}
                  </Title>
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
                    Selected Shops ({selectedItems?.length}){" "}
                  </Title>
                  <Input.Search
                    name="selectedSearchQuery"
                    value={selectedSearchQuery}
                    placeholder="Search selected shops"
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
