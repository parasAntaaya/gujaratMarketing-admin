import React from "react";
import { Card, Col, Image, Modal, Row, Typography } from "antd";

const DetailsModal = (props) => {
  const { visible, onClose, data, title, from } = props;
  return (
    <Modal
      title={<h4 style={{ fontWeight: "bold" }}>{title}</h4>}
      open={visible}
      onCancel={onClose}
      onOk={onClose}
      footer={null}
      width={800}
      style={{ maxHeight: "80vh", overflow: "auto" }}

      // style={{ overflow: "scroll" }}
    >
      <Card style={{ backgroundColor: " rgb(237 237 237)" }}>
        <div className="container modal-container">
          {from === "agency" ||
          from === "salesPerson" ||
          from === "salesOfficer" ||
          from === "deliveryPerson" ||
          from === "shop" ||
          from === "refrigeratorBookng" ||
          from === "attendence" ||
          from === "complain" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ||
                  from === "shop" ||
                  from === "refrigeratorBookng"
                    ? "OwnerName :"
                    : "Name :"}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "salesPerson" && data?.name}
                  {from === "agency" && data?.ownerName}
                  {from === "salesOfficer" && data?.name}
                  {from === "deliveryPerson" && data?.name}
                  {from === "shop" && data?.name}
                  {from === "refrigeratorBookng" && data?.name}
                  {from === "attendence" && data?.salesOfficerId?.name}
                  {from === "complain" && data?.ownerId?.ownerName}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "shop" || from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "shop" || from === "refrigeratorBookng"
                    ? "Shop Name:"
                    : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "shop" && data?.shopGroupId?.name}
                  {from === "refrigeratorBookng" && data?.shopName}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "agency" ||
          from === "salesPerson" ||
          from === "deliveryPerson" ||
          from === "route" ||
          from === "shop" ||
          from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ||
                  from === "salesPerson" ||
                  from === "deliveryPerson" ||
                  from === "route" ||
                  from === "shop" ||
                  from === "refrigeratorBookng"
                    ? "Agency Name :"
                    : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "agency" && data?.agencyName}
                  {from === "salesPerson" && data?.agencyId.agencyName}
                  {from === "deliveryPerson" && data?.agencyId.agencyName}
                  {from === "route" && data?.agencyId.agencyName}
                  {from === "shop" && data?.agencyId.agencyName}
                  {from === "refrigeratorBookng" && data?.agencyId.agencyName}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}

          {from === "route" || from === "shop" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "route" || from === "shop" ? "SalesMan Name :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "route" && data?.salesmanId.name}
                  {from === "shop" && data?.salesmanId.name}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "refrigeratorBookng" ? "Fridge Name :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "refrigeratorBookng" && data?.fridgeId.company}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}

          {/* -------------------------------------------------------------------------- */}

          {from === "agency" ||
          from === "salesPerson" ||
          from === "salesOfficer" ||
          from === "deliveryPerson" ||
          from === "shop" ||
          from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ||
                  from === "salesPerson" ||
                  from === "salesOfficer" ||
                  from === "deliveryPerson" ||
                  from === "shop" ||
                  from === "refrigeratorBookng"
                    ? "Mobile Number :"
                    : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "salesPerson" && data?.contact?.mobile}
                  {from === "agency" && data?.contact?.mobile}
                  {from === "salesOfficer" && data?.contact?.mobile}
                  {from === "deliveryPerson" && data?.contact?.mobile}
                  {from === "shop" && data?.contact?.mobile}
                  {from === "refrigeratorBookng" && data?.contact?.mobile}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "agency" ||
          from === "salesPerson" ||
          from === "salesOfficer" ||
          from === "deliveryPerson" ||
          from === "shop" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ||
                  from === "salesPerson" ||
                  from === "salesOfficer" ||
                  from === "deliveryPerson" ||
                  from === "shop"
                    ? "DOB :"
                    : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "salesPerson" && data?.dob}
                  {from === "agency" && data?.dob}
                  {from === "salesOfficer" && data?.dob}
                  {from === "deliveryPerson" && data?.dob}
                  {from === "shop" && data?.dob}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "agency" ||
          from === "salesPerson" ||
          from === "complain" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" || from === "salesPerson"
                    ? "Joining Date :"
                    : "Date"}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "salesPerson" && data?.joiningDate}
                  {from === "agency" && data?.joiningDate}
                  {from === "complain" && data?.createdAt}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "agency" || from === "salesOfficer" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" || from === "salesOfficer"
                    ? "Email :"
                    : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "agency" && data?.email}
                  {from === "salesOfficer" && data?.uniqueId}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "salesOfficer" ||
          from === "agency" ||
          from === "salesPerson" ||
          from === "deliveryPerson" ||
          from === "route" ||
          from === "shop" ||
          from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "salesOfficer" ||
                  from === "agency" ||
                  from === "salesPerson" ||
                  from === "deliveryPerson" ||
                  from === "route" ||
                  from === "shop" ||
                  from === "refrigeratorBookng"
                    ? "Address :"
                    : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "salesOfficer" && data?.address?.address}
                  {from === "agency" && data?.area}
                  {from === "salesPerson" && data?.address?.address}
                  {from === "deliveryPerson" && data?.address?.address}
                  {from === "route" && data?.address?.address}
                  {from === "shop" && data?.address?.address}
                  {from === "refrigeratorBookng" && data?.address?.address}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "refrigeratorBookng" ? "GST:" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "refrigeratorBookng" && data?.gst}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "refrigeratorBookng" ? "Serial No." : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "refrigeratorBookng" && data?.serialNumber}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "refrigeratorBookng" ? "Owner." : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "refrigeratorBookng" && data?.owner}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "shop" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "shop" ? "Village:" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "shop" && data?.village}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "shop" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "shop" ? "Taluka:" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "shop" && data?.taluko}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "shop" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "shop" ? "District:" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "shop" && data?.district}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "shop" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "shop" ? "Shop Status:" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "shop" && data?.isOpen ? "Open" : "Close"}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "shop" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "shop" ? "Shop Group Name:" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "shop" && data?.shopGroupId.name}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "salesPerson" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "salesPerson" ? "Gender :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "salesPerson" && data?.gender}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "agency" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ? "Official Email :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "agency" && data?.officialEmail}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "agency" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ? "Godown Address :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "agency" && data?.godownAddress?.address}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "agency" ||
          from === "salesPerson" ||
          from === "deliveryPerson" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ||
                  from === "salesPerson" ||
                  from === "deliveryPerson"
                    ? "Pan No. :"
                    : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "agency" && data?.panCardNumber}
                  {from === "salesPerson" && data?.panCardNumber}
                  {from === "deliveryPerson" && data?.panCardNumber}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "agency" ||
          from === "salesPerson" ||
          from === "deliveryPerson" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ||
                  from === "salesPerson" ||
                  from === "deliveryPerson"
                    ? "Bank Name :"
                    : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "agency" && data?.bankName}
                  {from === "salesPerson" && data?.bankName}
                  {from === "deliveryPerson" && data?.bankName}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "agency" ||
          from === "salesPerson" ||
          from === "deliveryPerson" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ||
                  from === "salesPerson" ||
                  from === "deliveryPerson"
                    ? "Account No. :"
                    : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "agency" && data?.accountNumber}
                  {from === "salesPerson" && data?.accountNumber}
                  {from === "deliveryPerson" && data?.accountNumber}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "agency" ||
          from === "salesPerson" ||
          from === "deliveryPerson" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ||
                  from === "salesPerson" ||
                  from === "deliveryPerson"
                    ? "IFSC code:"
                    : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "agency" && data?.ifscCode}
                  {from === "salesPerson" && data?.ifscCode}
                  {from === "deliveryPerson" && data?.ifscCode}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "agency" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ? "Credit Limit :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "agency" && data?.creditLimit}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "agency" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ? "Credit Days :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "agency" && data?.creditDays}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "agency" ||
          from === "salesOfficer" ||
          from === "salesPerson" ||
          from === "deliveryPerson" ||
          from === "shop" ||
          from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ||
                  from === "salesOfficer" ||
                  from === "salesPerson" ||
                  from === "deliveryPerson" ||
                  from === "shop" ||
                  from === "refrigeratorBookng"
                    ? "Image :"
                    : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "agency" && <Image width={100} src={data?.image} />}
                  {from === "salesOfficer" && (
                    <Image width={100} src={data?.image} />
                  )}
                  {from === "salesPerson" && (
                    <Image width={100} src={data?.image} />
                  )}
                  {from === "deliveryPerson" && (
                    <Image width={100} src={data?.image} />
                  )}
                  {from === "shop" && (
                    <Image width={100} src={data?.shopImage} />
                  )}
                  {from === "refrigeratorBookng" && (
                    <Image width={100} src={data?.image} />
                  )}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "agency" ||
          from === "salesOfficer" ||
          from === "salesPerson" ||
          from === "deliveryPerson" ||
          from === "refrigeratorBookng" ? (
            <>
              <Row className="mt-2">
                <Col span={10}>
                  <Typography.Title level={4} className="fw-700">
                    {from === "agency" ||
                    from === "salesOfficer" ||
                    from === "salesPerson" ||
                    from === "deliveryPerson" ||
                    from === "refrigeratorBookng"
                      ? "AadharCard Image :"
                      : ""}
                  </Typography.Title>
                </Col>
              </Row>
              <Row>
                <Col span={12} style={{ fontWeight: "400" }}>
                  <Typography.Text className="fs-4">
                    {from === "agency" && (
                      <Image width={100} src={data?.aadharCardImage[0]} />
                    )}
                    {from === "salesOfficer" && (
                      <Image width={100} src={data?.aadharCardImage[0]} />
                    )}
                    {from === "salesPerson" && (
                      <Image width={100} src={data?.aadharCardImage[0]} />
                    )}
                    {from === "deliveryPerson" && (
                      <Image width={100} src={data?.aadharCardImage[0]} />
                    )}
                    {from === "refrigeratorBookng" && (
                      <Image width={100} src={data?.aadharCardImage[0]} />
                    )}
                  </Typography.Text>
                </Col>
                <Col span={12} style={{ fontWeight: "400" }}>
                  <Typography.Text className="fs-4">
                    {from === "agency" && (
                      <Image width={100} src={data?.aadharCardImage[1]} />
                    )}
                    {from === "salesOfficer" && (
                      <Image width={100} src={data?.aadharCardImage[1]} />
                    )}
                    {from === "salesPerson" && (
                      <Image width={100} src={data?.aadharCardImage[1]} />
                    )}
                    {from === "deliveryPerson" && (
                      <Image width={100} src={data?.aadharCardImage[1]} />
                    )}
                    {from === "refrigeratorBookng" && (
                      <Image width={100} src={data?.aadharCardImage[1]} />
                    )}
                  </Typography.Text>
                </Col>
              </Row>
            </>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "agency" ||
          from === "salesPerson" ||
          from === "deliveryPerson" ||
          from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ||
                  from === "salesPerson" ||
                  from === "deliveryPerson" ||
                  from === "refrigeratorBookng"
                    ? "PanCard Image :"
                    : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "agency" && (
                    <Image width={100} src={data?.panCardImage} />
                  )}
                  {from === "salesPerson" && (
                    <Image width={100} src={data?.panCardImage} />
                  )}
                  {from === "deliveryPerson" && (
                    <Image width={100} src={data?.panCardImage} />
                  )}
                  {from === "refrigeratorBookng" && (
                    <Image width={100} src={data?.panCardImage} />
                  )}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "agency" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ? "Gst Image :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "agency" && (
                    <Image width={100} src={data?.gstImage} />
                  )}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "agency" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ? "FoodLicence Image :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "agency" && (
                    <Image width={100} src={data?.foodLicenceImage} />
                  )}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "agency" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "agency" ? "Gumasta Licence :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "agency" && (
                    <Image width={100} src={data?.gumastadharaImage} />
                  )}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "salesPerson" || from === "deliveryPerson" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "salesPerson" || from === "deliveryPerson"
                    ? "Driving Licence Image :"
                    : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "salesPerson" && (
                    <Image width={100} src={data?.drivingLicenceImage} />
                  )}
                  {from === "deliveryPerson" && (
                    <Image width={100} src={data?.drivingLicenceImage} />
                  )}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "route" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "route" ? "Vehicle No. :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "route" && data?.vehicleNumber}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "route" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "route" ? "Vehicle Name :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "route" && data?.vehicleName}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "route" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "route" ? "Driver Name :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "route" && data?.driverName}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "route" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "route" ? "Route Days :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "route" && data?.day}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "route" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "route" ? "Route Name :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "route" && data?.routeName}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "route" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "route" ? "Vehicle Image :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "route" && (
                    <Image width={100} src={data?.vehicleImage} />
                  )}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "refrigeratorBookng" ? "Signature Image :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "refrigeratorBookng" && (
                    <Image width={100} src={data?.signatureImage} />
                  )}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "refrigeratorBookng" ? "Shop Image :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "refrigeratorBookng" && (
                    <Image width={100} src={data?.shopImage} />
                  )}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}

          {from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "refrigeratorBookng" ? "ShopKeeper Image :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "refrigeratorBookng" && (
                    <Image width={100} src={data?.shopKeeperImage} />
                  )}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "refrigeratorBookng"
                    ? "ShopKeeper with Shop Image :"
                    : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "refrigeratorBookng" && (
                    <Image width={100} src={data?.shopkeeperImageWithShop} />
                  )}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "refrigeratorBookng" ? "Delivery Status :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "refrigeratorBookng" && data?.status}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* -------------------------------------------------------------------------- */}
          {from === "refrigeratorBookng" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "refrigeratorBookng"
                    ? "Delivery proof Image :"
                    : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "refrigeratorBookng" && (
                    <Image width={100} src={data?.deliveryProofImage} />
                  )}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {from === "attendence" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "attendence" ? "Check In Location Photo :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "attendence" && (
                    <Image width={100} src={data?.checkInImage} />
                  )}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {from === "attendence" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "attendence" ? "Check In Time :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "attendence" && data?.checkInTime}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {from === "attendence" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "attendence" ? "Check Out Time :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "attendence" && data?.checkOutTime}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {from === "attendence" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "attendence" ? "Check Out Location Photo :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "attendence" && (
                    <Image width={100} src={data?.checkOutImage} />
                  )}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {from === "attendence" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "attendence" ? "Total Hours :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "attendence" && data?.totalHours}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {from === "scheme" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "scheme" ? "Start Date :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "scheme" && data?.startDate}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {from === "scheme" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "scheme" ? "End Date :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "scheme" && data?.endDate}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {from === "scheme" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "scheme" ? "Shop Group Name :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "scheme" && data?.shopId?.name}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {from === "scheme" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "scheme" ? "Salesman Name :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "scheme" && data?.salesmanId?.name}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {from === "scheme" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "scheme" ? "Offer :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "scheme" && data?.offer}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {from === "scheme" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "scheme" ? "Remark :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "scheme" && data?.remark}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {from === "complain" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "complain" ? "Role :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "complain" && data?.ownerId?.role}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
          {from === "complain" ? (
            <Row className="mt-2">
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "complain" ? "Complain :" : ""}
                </Typography.Title>
              </Col>
              <Col span={14} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">
                  {from === "complain" && data?.attachments}
                </Typography.Text>
              </Col>
            </Row>
          ) : (
            ""
          )}
        </div>
      </Card>
    </Modal>
  );
};
export default DetailsModal;
