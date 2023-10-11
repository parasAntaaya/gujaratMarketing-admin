import React from "react";
import { Card, Col, Form, Input, Row, Select, Table } from "antd";
import Loading from "../Loading";

const DefaultTable = (props) => {
  const { data, columns, loading, cardTable, onChange, onSearch } = props;

  if (!cardTable) {
    return (
      <>
        {loading ? (
          <Loading />
        ) : (
          <Table dataSource={data} tableLayout="auto" columns={columns}></Table>
        )}
      </>
    );
  }

  return (
    <>
      {/* {!loading ? <DefaultTable data={data} columns={columns} /> : <Loading />} */}
      {loading ? (
        <Loading />
      ) : (
        <Card
          title={
            <Row className="justify-content-between pt-4">
              <Col span={8}>
                <Form layout="horizontal" name="control-hooks">
                  <Form.Item
                    name="selectedId"
                    label="Select Role"
                    rules={[
                      {
                        required: true,
                        message: "Please select an agency!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select Role"
                      optionFilterProp="children"
                      onChange={onChange}
                      options={[
                        {
                          value: "agency",
                          label: "Agency",
                        },
                        {
                          value: "salesman",
                          label: "Sales Person",
                        },
                        {
                          value: "deliveryman",
                          label: "Delivery Person",
                        },
                      ]}
                    />
                  </Form.Item>
                </Form>
              </Col>
              <Col span={12}>
                <Input.Search
                  // value={searchQuery}
                  placeholder="Search Name"
                  onChange={(e) => onSearch(e.target.value)}
                  // style={{ marginBottom: 16, width: "25%" }}
                />
              </Col>
            </Row>
          }
        >
          <Table dataSource={data} tableLayout="auto" columns={columns}></Table>
        </Card>
      )}
    </>
  );
};

export default DefaultTable;
