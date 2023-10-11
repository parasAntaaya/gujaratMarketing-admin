import React from "react";
import { Card, Col, Row, Space, Switch, Table, message } from "antd";

const TabMaster = () => {
  const tableData = [
    {
      key: "1",
      tab: "Product",
      total_applicants: 2000,
      applicants: 200,
      rejected_applicants: 2,
    },
    {
      key: "2",
      tab: "Agency",
      total_applicants: 90,
      applicants: 13,
      rejected_applicants: 2,
    },
    {
      key: "3",
      tab: "Sales Person",
      total_applicants: 600,
      applicants: 180,
      rejected_applicants: 5,
    },
    {
      key: "4",
      tab: "Delivery Person",
      total_applicants: 1800,
      applicants: 1250,
      rejected_applicants: 20,
    },
    {
      key: "5",
      tab: "Shop",
      total_applicants: 20000,
      applicants: 18000,
      rejected_applicants: 60,
    },
  ];

  const columns = [
    {
      title: "Tab Name",
      dataIndex: "tab",
      key: "tab",
      render(text, record) {
        return {
          props: {
            style: { fontWeight: 600 },
          },
          children: <div>{text}</div>,
        };
      },
    },
    {
      title: "Total Applicants",
      dataIndex: "total_applicants",
      key: "total_applicants",
      align: "center",
    },
    {
      title: "Applicants",
      dataIndex: "applicants",
      key: "applicants",
      align: "center",
    },
    {
      title: "Rejected Applicants",
      dataIndex: "rejected_applicants",
      key: "rejected_applicants",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Switch onChange={(checked) => showAlert(checked)} />
        </Space>
      ),
    },
  ];

  const onChange = (checkedValues) => {
    console.log("checked =", checkedValues);
  };

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

  return (
    <>
      <Row className="m-2">
        <Col md={24} lg={24}>
          <Card title={<div className="fs-3 fw-bold">Tab Master</div>}>
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TabMaster;
