import React from "react";
import { Table, Space } from "antd";
import moment from "moment";


const YourTableComponent = ({ data , salesman}) => {
  const columns = [
    {
      title: "Sr no.",
      dataIndex: "srNo",
      key: "srNo",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Bill No",
      dataIndex: "billNo",
      key: "billNo",
    },
    {
      title: "Quantity",
      dataIndex: "products",
      key: "products",
      render: (products) => products?.map((qunt) => qunt.quantity).join(", "),
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
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Salesman",
      dataIndex: "salesman",
      key: "salesman",
      render: () => salesman?.name,
    },
  ];

  return (
    <Table
      dataSource={[data]}
      columns={columns}
      rowKey={(record) => record.id}
    />
  );
};

export default YourTableComponent;
