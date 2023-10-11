import { Button, Col, Input, Modal, Row } from "antd";
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
  const [shopsCount, setShopsCount] = useState();

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
    if (location.pathname === "/dailyroute/edit-dailyroute") {
      const updatedList1 = list1.map((item1) => {
        const matchingItem2 = state.data.shopsIds.find(
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
    if (location.pathname === "/dailyroute/edit-dailyroute") {
      setShopsCount(selectedItems.length);
    }
    props.setShopsData(selectedItems);
  };
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
      title: "Name",
      width: "100px",
      dataIndex: "name",
    },
    {
      title: "Mobile",
      width: "100px",
      dataIndex: "mobile",
      render: (_, record) => record.contact.mobile,
    },
    {
      title: "Address",
      width: "100px",
      dataIndex: "address",
      render: (_, record) => record.address.address,
    },
    {
      title: "Unique Id",
      width: "100px",
      dataIndex: "uniqueId",
      render: (_, record) => record.uniqueId,
    },
    {
      title: "Status",
      width: "100px",
      dataIndex: "isOpen",
      render: (_, record) => (record.isOpen ? "Open" : "Close"),
    },
    {
      title: "Select",
      dataIndex: "_id",
      width: "20px",
      render: (_, record) => (
        <Checkbox
          // key={record._id}
          checked={record.checked}
          // checked={selectedItems.some((item) => item._id === record._id)}
          onChange={(e) => handleCheckboxChange(record._id)}
        />
      ),
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const shopsParams = {
          page: 1,
          limit: 100000,
        };
        const response = await axios.post("admin/shop/get/all", shopsParams);
        if (response.status === 200) {
          setIsLoading(false);
          setList1(response?.data?.data?.shop_data);
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
    if (location.pathname === "/dailyroute/edit-dailyroute") {
      setShopsCount(state.data.shopsIds.length);
    }
  }, [list1]);

  return (
    <>
      <Button type="primary" onClick={showModal}>
        {location.pathname === "/dailyroute/edit-dailyroute"
          ? "Edit Shops"
          : "Add Shops"}
      </Button>

      <Title level={5} style={{ margin: "0 0 18px 22px" }}>
        Selected Shops:{" "}
        <strong>
          {location.pathname === "/dailyroute/edit-dailyroute"
            ? shopsCount
            : selectedItems.length}
          {/* {selectedItems.length} */}
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
                  <Title level={5}>All Shops ({list1?.length}) </Title>
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
