
import { Button, Card, Checkbox, Col, Divider, Image, Modal, Row, Typography } from "antd";
import jsPDF from "jspdf";
import { useSelector } from "react-redux";
import { useState } from "react";
const PdfModal = (props) => {
    // const data = useSelector((state) => state.agencyData?.agency);
    const { visible, onClose, data, title, from, filteredData } = props;
    const [ownerNameChecked, setOwnerNameChecked] = useState({});
    const [agencyNameChecked, setAgencyNameChecked] = useState(false);
    console.log("ownerNameChecked", ownerNameChecked)

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const columns = [
            "Sr. No.",
            "Owner Name",
            "Agency Name",
            "Mobile Number",
            "Area",
            "Godown address",

        ];
        const rows = data?.map((item, index) => [
            index + 1,
            ownerNameChecked ? item.ownerName : "",
            //   item.agencyName,
            //   item.contact.mobile,
            //   item.area,
            //   item.godownAddress?.address,
        ]);
        const tableX = 10;
        const tableY = 20;
        const tableWidth = 180;
        const tableHeight = 10;
        doc.autoTable({
            head: [columns],
            body: rows,
            startY: tableY,
            // startY: tableY,
            styles: {
                fontSize: 12,
                cellPadding: 2,
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: "normal",
            },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 30 },
                2: { cellWidth: 30 },
                3: { cellWidth: 40 },
                4: { cellWidth: 40 },
                5: { cellWidth: 40 },
            },
        });
        doc.save("agency_data.pdf");
    };
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

                    {from === "agency" || from === "salesPerson" || from === "salesOfficer" || from === "deliveryPerson" || from === "shop" || from === "refrigeratorBookng" || from === "attendence" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                    checked={ownerNameChecked}
                                    onChange={(e) => console.log("e.target.checked", e.target.checked)}
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "agency" || from === "shop" || from === "refrigeratorBookng" ? "OwnerName :" : "Name :"}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}
                    {from === "shop" || from === "refrigeratorBookng" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "shop" || from === "refrigeratorBookng" ? "Shop Name:" : ""}
                                </Typography.Title>
                            </Col>

                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}

                    {from === "agency" || from === "salesPerson" || from === "deliveryPerson" || from === "route" || from === "shop" || from === "refrigeratorBookng" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={agencyNameChecked}
                                //   onChange={(e) => setAgencyNameChecked(e.target.checked)}
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "agency" || from === "salesPerson" || from === "deliveryPerson" || from === "route" || from === "shop" || from === "refrigeratorBookng" ? "Agency Name :" : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }

                    {from === "route" || from === "shop" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "route" || from === "shop" ? "SalesMan Name :" : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}

                    {from === "refrigeratorBookng" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "refrigeratorBookng" ? "Fridge Name :" : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}

                    {from === "agency" || from === "salesPerson" || from === "salesOfficer" || from === "deliveryPerson" || from === "shop" || from === "refrigeratorBookng" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "agency" || from === "salesPerson" || from === "salesOfficer" || from === "deliveryPerson" || from === "shop" || from === "refrigeratorBookng" ? "Mobile Number :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}
                    {from === "agency" || from === "salesPerson" || from === "salesOfficer" || from === "deliveryPerson" || from === "shop" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "agency" || from === "salesPerson" || from === "salesOfficer" || from === "deliveryPerson" || from === "shop" ? "DOB :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}
                    {from === "agency" || from === "salesPerson" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "agency" || from === "salesPerson" ? "Joining Date :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}

                    {from === "agency" || from === "salesOfficer" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "agency" || from === "salesOfficer" ? "Email :" : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}

                    {from === "salesOfficer" || from === "agency" || from === "salesPerson" || from === "deliveryPerson" || from === "route" || from === "shop" || from === "refrigeratorBookng" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "salesOfficer" || from === "agency" || from === "salesPerson" || from === "deliveryPerson" || from === "route" || from === "shop" || from === "refrigeratorBookng" ? "Address :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}
                    {from === "refrigeratorBookng" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "refrigeratorBookng" ? "GST:" : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}

                    {from === "refrigeratorBookng" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "refrigeratorBookng" ? "Serial No." : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}
                    {from === "refrigeratorBookng" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "refrigeratorBookng" ? "Owner." : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}

                    {from === "shop" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "shop" ? "Village:" : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}
                    {from === "shop" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "shop" ? "Taluka:" : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}
                    {from === "shop" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "shop" ? "District:" : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}
                    {from === "shop" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "shop" ? "Shop Status:" : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}
                    {from === "shop" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "shop" ? "Shop Group Name:" : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}
                    {from === "salesPerson" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "salesPerson" ? "Gender :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}



                    {from === "agency" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "agency" ? "Official Email :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}
                    {from === "agency" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "agency" ? "Godown Address :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}

                    {from === "agency" || from === "salesPerson" || from === "deliveryPerson" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "agency" || from === "salesPerson" || from === "deliveryPerson" ? "Pan No. :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}
                    {from === "agency" || from === "salesPerson" || from === "deliveryPerson" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "agency" || from === "salesPerson" || from === "deliveryPerson" ? "Bank Name :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}

                    {from === "agency" || from === "salesPerson" || from === "deliveryPerson" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "agency" || from === "salesPerson" || from === "deliveryPerson" ? "Account No. :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}
                    {from === "agency" || from === "salesPerson" || from === "deliveryPerson" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "agency" || from === "salesPerson" || from === "deliveryPerson" ? "IFSC code:" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}

                    {from === "agency" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "agency" ? "Credit Limit :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}


                    {from === "agency" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "agency" ? "Credit Days :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}

                    {from === "route" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "route" ? "Vehicle No. :" : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}
                    {from === "route" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "route" ? "Vehicle Name :" : ""}
                                </Typography.Title>
                            </Col>

                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}

                    {from === "route" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "route" ? "Driver Name :" : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}

                    {from === "route" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "route" ? "Route Days :" : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}

                    {from === "route" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "route" ? "Route Name :" : ""}
                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}

                    {/* { from === "route" ? (
            <Row className="mt-2">
                  <Col span={2}>
                <Checkbox
        //   checked={record?.addAccess}
        //   onChange={(e) =>
        //     handleCheckboxChange(record, "addAccess", e.target.checked)
        //   }
        />
         </Col>
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "route" ? "Vehicle Image :" : ""}
                </Typography.Title>
              </Col>
              <Col span={12} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">             
                {from === "route" && (<Image width={100} src={data?.vehicleImage} /> )}
                </Typography.Text>
              </Col>
            </Row>
          )
            : ""
          } */}
                    {/* -------------------------------------------------------------------------- */}
                    {/* { from === "refrigeratorBookng"  ? (
            <Row className="mt-2">
                  <Col span={2}>
                <Checkbox
        //   checked={record?.addAccess}
        //   onChange={(e) =>
        //     handleCheckboxChange(record, "addAccess", e.target.checked)
        //   }
        />
         </Col>
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "refrigeratorBookng"    ? "Signature Image :" : ""}

                </Typography.Title>
              </Col>
              <Col span={12} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">             
                {from === "refrigeratorBookng" && (<Image width={100} src={data?.signatureImage} /> )}
                </Typography.Text>
              </Col>
            </Row>
          )
            : ""
          } */}
                    {/* -------------------------------------------------------------------------- */}

                    {/* { from === "refrigeratorBookng"  ? (
            <Row className="mt-2">
                  <Col span={2}>
                <Checkbox
        //   checked={record?.addAccess}
        //   onChange={(e) =>
        //     handleCheckboxChange(record, "addAccess", e.target.checked)
        //   }
        />
         </Col>
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "refrigeratorBookng"    ? "Shop Image :" : ""}

                </Typography.Title>
              </Col>
              <Col span={12} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">             
                {from === "refrigeratorBookng" && (<Image width={100} src={data?.shopImage} /> )}
                </Typography.Text>
              </Col>
            </Row>
          )
            : ""
          } */}
                    {/* -------------------------------------------------------------------------- */}

                    {/* { from === "refrigeratorBookng"  ? (
            <Row className="mt-2">
                  <Col span={2}>
                <Checkbox
        //   checked={record?.addAccess}
        //   onChange={(e) =>
        //     handleCheckboxChange(record, "addAccess", e.target.checked)
        //   }
        />
         </Col>
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "refrigeratorBookng"    ? "ShopKeeper Image :" : ""}

                </Typography.Title>
              </Col>
              <Col span={12} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">             
                {from === "refrigeratorBookng" && (<Image width={100} src={data?.shopKeeperImage} /> )}
                </Typography.Text>
              </Col>
            </Row>
          )
            : ""
          } */}
                    {/* -------------------------------------------------------------------------- */}
                    {/* { from === "refrigeratorBookng"  ? (
            <Row className="mt-2">
                  <Col span={2}>
                <Checkbox
        //   checked={record?.addAccess}
        //   onChange={(e) =>
        //     handleCheckboxChange(record, "addAccess", e.target.checked)
        //   }
        />
         </Col>
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "refrigeratorBookng"    ? "ShopKeeper with Shop Image :" : ""}

                </Typography.Title>
              </Col>
              <Col span={12} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">             
                {from === "refrigeratorBookng" && (<Image width={100} src={data?.shopkeeperImageWithShop} /> )}
                </Typography.Text>
              </Col>
            </Row>
          )
            : ""
          } */}
                    {/* -------------------------------------------------------------------------- */}
                    {from === "refrigeratorBookng" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "refrigeratorBookng" ? "Delivery Status :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* -------------------------------------------------------------------------- */}
                    {/* { from === "refrigeratorBookng"  ? (
            <Row className="mt-2">
                  <Col span={2}>
                <Checkbox
        //   checked={record?.addAccess}
        //   onChange={(e) =>
        //     handleCheckboxChange(record, "addAccess", e.target.checked)
        //   }
        />
         </Col>
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "refrigeratorBookng"    ? "Delivery proof Image :" : ""}

                </Typography.Title>
              </Col>
              <Col span={12} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">             
                {from === "refrigeratorBookng" && (<Image width={100} src={data?.deliveryProofImage} /> )}
                </Typography.Text>
              </Col>
            </Row>
          )
            : ""
          } */}
                    {/* ============================================================================ */}
                    {/* { from === "attendence"  ? (
            <Row className="mt-2">
                  <Col span={2}>
                <Checkbox
        //   checked={record?.addAccess}
        //   onChange={(e) =>
        //     handleCheckboxChange(record, "addAccess", e.target.checked)
        //   }
        />
         </Col>
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "attendence"    ? "Check In Location Photo :" : ""}

                </Typography.Title>
              </Col>
              <Col span={12} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">             
                {from === "attendence" && (<Image width={100} src={data?.checkInImage} /> )}
                </Typography.Text>
              </Col>
            </Row>
          )
            : ""
          } */}
                    {from === "attendence" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "attendence" ? "Check In Time :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {from === "attendence" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "attendence" ? "Check Out Time :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {/* { from === "attendence"  ? (
            <Row className="mt-2">
                  <Col span={2}>
                <Checkbox
        //   checked={record?.addAccess}
        //   onChange={(e) =>
        //     handleCheckboxChange(record, "addAccess", e.target.checked)
        //   }
        />
         </Col>
              <Col span={10}>
                <Typography.Title level={4} className="fw-700">
                  {from === "attendence"    ? "Check Out Location Photo :" : ""}

                </Typography.Title>
              </Col>
              <Col span={12} style={{ fontWeight: "400" }}>
                <Typography.Text className="fs-4">             
                {from === "attendence" && (<Image width={100} src={data?.checkOutImage} /> )}
                </Typography.Text>
              </Col>
            </Row>
          )
            : ""
          } */}
                    {from === "attendence" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "attendence" ? "Total Hours :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {from === "scheme" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "scheme" ? "Start Date :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {from === "scheme" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "scheme" ? "End Date :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {from === "scheme" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "scheme" ? "Shop Group Name :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {from === "scheme" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "scheme" ? "Salesman Name :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {from === "scheme" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "scheme" ? "Offer :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                    {from === "scheme" ? (
                        <Row className="mt-2">
                            <Col span={2}>
                                <Checkbox
                                //   checked={record?.addAccess}
                                //   onChange={(e) =>
                                //     handleCheckboxChange(record, "addAccess", e.target.checked)
                                //   }
                                />
                            </Col>
                            <Col span={10}>
                                <Typography.Title level={4} className="fw-700">
                                    {from === "scheme" ? "Remark :" : ""}

                                </Typography.Title>
                            </Col>
                        </Row>
                    )
                        : ""
                    }
                </div>
                <div>
                    <Button
                        onClick={() => {
                            handleDownloadPDF({
                                ownerNameChecked,

                            });
                        }}
                        size={"large"}
                        type="primary"
                    >
                        Download
                    </Button>
                </div>



            </Card>
        </Modal>
    );
};
export default PdfModal;
