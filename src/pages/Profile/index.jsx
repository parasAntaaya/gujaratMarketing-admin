import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row, Typography, Image } from "antd";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const userRole = useSelector((state) => state.auth.user?.role);
  const data = useSelector((state) => state.auth.user);
  console.log("data------------------", data);
  return (
    <div className="container">
      <div>
        <div className="d-flex row py-3">
          <div className="col-md-6 fs-3 fw-bold">Profile</div>
          <div className="col-md-6" style={{ textAlign: "right" }}></div>
        </div>
        <Card>
          <Row>
            <Col span={4} name="image" valuePropName="fileList">
              <Image
                preview={false}
                className="w-75"
                src={data?.image || "No Image"}
              />
            </Col>
            <Col span={20} className="mt-4">
              <h4>{data?.ownerName || data?.name}</h4>
              <h5>{userRole}</h5>
              <p>{data?.email}</p>
            </Col>
          </Row>
        </Card>
        <Card>
          <div className="container">
            <h4 className="fw-bold">Personal Information</h4>
            {/* Role-specific details */}
            {userRole === "admin" && (
              <>
                <Row className="mt-4">
                  <Col span={8}>
                    <Typography.Title level={4}>Name :</Typography.Title>
                  </Col>
                  <Col span={16} className="h5">
                    <Typography.Title level={4}>Phone :</Typography.Title>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} style={{ fontWeight: "600" }}>
                    <Typography.Text>{data?.name} </Typography.Text>
                  </Col>
                  <Col span={16} style={{ fontWeight: "600" }}>
                    <Typography.Text>{data?.phoneNumber}</Typography.Text>
                  </Col>
                </Row>

                {/* <Row className="mt-4">
                  <Col span={8} className="h5">
                    <Typography.Title level={4}>Email:</Typography.Title>
                  </Col>
                  <Col span={16} className="h5">
                    <Typography.Title level={4}>Address :</Typography.Title>
                  </Col>
                </Row> */}
                <Row>
                  <Col span={8} style={{ fontWeight: "600" }}>
                    <Typography.Text>{data?.email}</Typography.Text>
                  </Col>
                  <Col span={16} style={{ fontWeight: "600" }}>
                    <Typography.Text>{data?.address?.address}</Typography.Text>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col span={8} className="h5">
                    <Typography.Title level={4}>Role:</Typography.Title>
                  </Col>
                </Row>
                <Row>
                  <Col span={16} style={{ fontWeight: "600" }}>
                    <Typography.Text>{userRole}</Typography.Text>
                  </Col>
                </Row>
              </>
            )}
            {userRole === "agency" && (
              <>
                <Row className="mt-4">
                  <Col span={8}>
                    <Typography.Title level={4}>Name:</Typography.Title>
                  </Col>
                  <Col span={16} className="h5">
                    <Typography.Title level={4}>Phone :</Typography.Title>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} style={{ fontWeight: "600" }}>
                    <Typography.Text>{data?.ownerName}</Typography.Text>
                  </Col>
                  <Col span={16} style={{ fontWeight: "600" }}>
                    <Typography.Text>{data?.contact?.mobile}</Typography.Text>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col span={8} className="h5">
                    <Typography.Title level={4}>Email:</Typography.Title>
                  </Col>
                  <Col span={16} className="h5">
                    <Typography.Title level={4}>Address :</Typography.Title>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} style={{ fontWeight: "600" }}>
                    <Typography.Text>{data?.email}</Typography.Text>
                  </Col>
                  <Col span={16} style={{ fontWeight: "600" }}>
                    <Typography.Text>
                      {data?.godownAddress?.address}
                    </Typography.Text>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col span={8} className="h5">
                    <Typography.Title level={4}>Role:</Typography.Title>
                  </Col>
                </Row>
                <Row>
                  <Col span={16} style={{ fontWeight: "600" }}>
                    <Typography.Text>{userRole}</Typography.Text>
                  </Col>
                </Row>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
