import { Card, Col, Row } from "antd";
import React from "react";
import DefaultTable from "../../Components/DefaultTable";

const StockTransferHistory = () => {
  const column = [
    {
      title: "Sr no.",
      dataIndex: "sr_no",
      key: "sr_no",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
    },
    {
      title: "Item Name",
      dataIndex: "item_name",
      key: "item_name",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      align: "center",
    },
    {
      title: "SubCategory",
      key: "sub_category",
      dataIndex: "sub_category",
      align: "center",
    },
    {
      title: "Qty",
      key: "qty",
      dataIndex: "qty",
      align: "center",
    },
  ];
  return (
    <>
      <Card
        className="m-2"
        title={
          <div className="d-flex py-3">
            <div className="col-md-6 fs-3 fw-bold">
              Transfer Stocks to salesmans History
            </div>
          </div>
        }
      >
        <Card className="m-2" title={<div className="col-md-6 fs-5">Info</div>}>
          <Row
            gutter={{
              xs: 8,
              sm: 16,
              md: 24,
              lg: 32,
            }}
          >
            <Col span={2} className="gutter-row">
              <div>Remark sales Date</div>
            </Col>
            <Col span={2} offset={2} className="gutter-row">
              <div className="mt-3">05-02-2000</div>
            </Col>
          </Row>
        </Card>
        <Card
          className="m-2"
          title={<div className="col-md-6 fs-5"> Salesman Info</div>}
        >
          <Row
            gutter={{
              xs: 8,
              sm: 16,
              md: 24,
              lg: 32,
            }}
            className="mb-2"
          >
            <Col span={2} className="gutter-row">
              <div>Name</div>
            </Col>
            <Col span={2} offset={2} className="gutter-row">
              <div>Ajay vala</div>
            </Col>
          </Row>
          <Row
            gutter={{
              xs: 8,
              sm: 16,
              md: 24,
              lg: 32,
            }}
            className="mb-2"
          >
            <Col span={2} className="gutter-row">
              <div>Mobile</div>
            </Col>
            <Col span={2} offset={2} className="gutter-row">
              <div>9879834567</div>
            </Col>
          </Row>
          <Row
            gutter={{
              xs: 8,
              sm: 16,
              md: 24,
              lg: 32,
            }}
          >
            <Col span={2} className="gutter-row">
              <div>Address</div>
            </Col>
            <Col span={4} offset={2} className="gutter-row">
              <div>MotaVaracha, Surat</div>
            </Col>
          </Row>
        </Card>
        <Card
          className="m-2"
          title={<div className="col-md-6 fs-5">Items</div>}
        >
          <DefaultTable columns={column} />
        </Card>
      </Card>
    </>
  );
};
export default StockTransferHistory;
