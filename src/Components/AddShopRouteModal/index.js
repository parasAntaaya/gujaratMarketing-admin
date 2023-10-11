import { Card, Col, Input, Modal, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import DefaultTable from "../../Components/DefaultTable";
import { SearchOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const AddShopRouteModal = (props) => {
  const { visible, onClose } = props;
  const navigate = useNavigate();

  const column = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
    },
    {
      title: " Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
    },
    {
      title: "Address",
      key: "address",
      dataIndex: "address",
      align: "center",
      style: { backgroundColor: "#FF0000" },
    },
    {
      title: "Unique ID",
      key: "unique_id",
      dataIndex: "unique_id",
      align: "center",
      style: { backgroundColor: "#FF0000" },
    },
    {
      title: "Ststus",
      key: "status",
      dataIndex: "status",
      align: "center",
      style: { backgroundColor: "#FF0000" },
    },
    {
      title: "Add",
      key: "add",
      dataIndex: "add",
      align: "center",
      style: { backgroundColor: "#FF0000" },
    },
  ];
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
    },
    {
      title: " Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
    },
    {
      title: "Address",
      key: "address",
      dataIndex: "address",
      align: "center",
      style: { backgroundColor: "#FF0000" },
    },
    {
      title: "Unique ID",
      key: "unique_id",
      dataIndex: "unique_id",
      align: "center",
      style: { backgroundColor: "#FF0000" },
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      align: "center",
      style: { backgroundColor: "#FF0000" },
    },
    {
      title: "Remove",
      key: "remove",
      dataIndex: "remove",
      align: "center",
      style: { backgroundColor: "#FF0000" },
    },
  ];
  return (
    <>
      <Modal
        open={visible}
        onCancel={onClose}
        onOk={onClose}
        footer={null}
        width={1500}
        style={{ maxHeight: "50vh", overflow: "auto" }}

        // style={{ overflow: "scroll" }}
      >
        <Card
          className="m-2"
          title={<div className="col-md-6 fs-5">Shops</div>}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} span={12}>
              <Card
                style={{
                  maxHeight: "70%",
                  overflow: "hidden",
                  overflowY: "auto",
                }}
              >
                <Title level={4}>Shops</Title>
                <Row>
                  <Col span={8} offset={16}>
                    <Input
                      placeholder="Search here"
                      suffix={<SearchOutlined />}
                    />
                  </Col>
                </Row>
                <DefaultTable columns={column} />
              </Card>
            </Col>
            <Col xs={24} md={12} span={12}>
              <Card
                style={{
                  maxHeight: "70%",
                  overflow: "hidden",
                  overflowY: "auto",
                }}
              >
                <Title level={4}>Updated Shops</Title>
                <Row>
                  <Col span={8} offset={16}>
                    <Input
                      placeholder="Search here"w
                      suffix={<SearchOutlined />}
                    />
                  </Col>
                </Row>
                <DefaultTable columns={columns} />
              </Card>
            </Col>
          </Row>
        </Card>
      </Modal>
    </>
  );
};

export default AddShopRouteModal;
