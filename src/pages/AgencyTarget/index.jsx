import React, { useEffect, useState } from "react";
import { Button, Card, Image, Modal, Space, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import DefaultTable from "../../Components/DefaultTable";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../utils/baseURL";
import { useDispatch } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";
const { setAgencyTarget } = require("../../redux/reduxsauce/agencyTargetRedux");

const AgencyTarget = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [data, setData] = useState(null);
  const handleDelete = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalVisible(true);
  };
  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setRecordToDelete(null);
  };
  const buttonSpacing = "10px";
  const actionButtonContainerStyle = {
    display: "flex",
    alignItems: "center",
  };
  const columns = [
    {
      title: "Sr. No.",
      key: "serialNumber",
      align: "center",
      render: (text) => (
        <div>{data?.findIndex((a) => a?._id === text._id) + 1}</div>
      ),
    },
    {
      title: " Start Date",
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
      render: (startDate) => {
        const formattedStartDate = new Date(startDate[0])
          ? moment(startDate).format("DD-MM-YYYY")
          : "";
        return <span>{formattedStartDate}</span>;
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
      render: (endDate) => {
        const formattedEndDate = endDate
          ? moment(endDate).format("DD-MM-YYYY")
          : "";
        return <span>{formattedEndDate}</span>;
      },
    },
    {
      title: "Product Name",
      dataIndex: "targets",
      key: "targets",
      render: (targets) => targets.map((targets) => targets?.name).join(", "),
    },
    {
      title: " Assign Type",
      dataIndex: "assignedType",
      key: "assignedType",
      align: "center",
    },

    {
      title: "Assign To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      align: "center",
      render: (assignedTo, record) =>
        record?.assignedType === "agency"
          ? assignedTo?.agencyName
          : record?.assignedType === "salesman" ||
            record?.assignedType === "shop"
          ? assignedTo?.name
          : "",
    },
    {
      title: "Target Type",
      dataIndex: "targetType",
      key: "targetType",
      align: "center",
      render: (targetType, record) => {
        if (record.targets.length > 1) {
          if (targetType === "percent_amount") {
            return "Product Amount (Multiple)";
          } else if (targetType === "product_cartoon") {
            return "Product Cartoon (Multiple)";
          } else if (targetType === "product_percentage") {
            return "Product Percentage (Multiple)";
          } else if (targetType === "products_amount_target") {
            return "Product Total Amount (Multiple)";
          } else if (targetType === "products_cartoon_target") {
            return "Product Total Cartoon (Multiple)";
          } else if (targetType === "products_percentage_target") {
            return "Product Total Percentage (Multiple)";
          } else {
            return "";
          }
        } else {
          if (targetType === "percent_amount") {
            return "Product Amount (Single)";
          } else if (targetType === "product_cartoon") {
            return "Product Cartoon (Single)";
          } else if (targetType === "product_percentage") {
            return "Product Percentage (Single)";
          } else if (targetType === "products_amount_target") {
            return "Product Total Amount (Single)";
          } else if (targetType === "products_cartoon_target") {
            return "Product Total Cartoon (Single)";
          } else if (targetType === "products_percentage_target") {
            return "Product Total Percentage (Single)";
          } else {
            return "";
          }
        }
      },
    },
    {
      title: "Target Info",
      dataIndex: "targets",
      key: "targets",
      align: "center",
      render: (targets, record) => {
        return (
          <div>
            {targets.map((target, index) => (
              <div key={index}>
                {target.targetQty !== null && (
                  <p>
                    {target.name}, TarQty: {target.targetQty}
                  </p>
                )}
                {target.targetAmount !== null && (
                  <p>
                    {target.name}, TarAmount: {target.targetAmount}
                  </p>
                )}
                {target.targetPercentage !== null && (
                  <p>
                    {target.name},TarPercentage:
                    {target.targetPercentage}%
                  </p>
                )}
              </div>
            ))}
            {record.totalQtyTarget > 0 && (
              <p>Total Qty Target: {record.totalQtyTarget}</p>
            )}
            {record.totalAmountTarget > 0 && (
              <p>Total Amount Target: {record.totalAmountTarget}</p>
            )}
            {record.totalPercentageTarget > 0 && (
              <p>Total Percentage Target: {record.totalPercentageTarget}</p>
            )}
          </div>
        );
      },
    },
    {
      title: "Reward Type",
      dataIndex: "rewardType",
      key: "rewardType",
      align: "center",
      render: (rewardType) => {
        return (
          <span>
            {rewardType === "cash" && <span>Cash</span>}
            {rewardType === "points" && <span>Points</span>}
            {rewardType === "item" && <span>Item</span>}
          </span>
        );
      },
    },
    {
      title: "Reward",
      dataIndex: "reward",
      key: "reward",
      align: "center",
      render: (reward, record) => {
        const rewardItem = record.rewardItem;
        if (rewardItem && rewardItem.name) {
          return (
            <div>
              <p>Item Name: {rewardItem.name}</p>
              {rewardItem.image && (
                <Image width={20} src={rewardItem.image} alt="Reward Item" />
              )}
              <p>Item Value: {rewardItem.value}</p>
            </div>
          );
        } else {
          return <span>Reward: {reward}</span>;
        }
      },
    },

    // {
    //   title: "Is Point Transfered",
    //   key: "is_point_transfered",
    //   dataIndex: "is_point_transfered",
    //   align: "center",
    //   render: (status) => {
    //     let color = "";
    //     switch (status) {
    //       case "Pending":
    //         color = "orange";
    //         break;
    //       case "Confirm":
    //         color = "green";
    //         break;
    //       case "Cancelled":
    //         color = "red";
    //         break;
    //       default:
    //         color = "default";
    //         break;
    //     }
    //     return <Tag color={color}>{status}</Tag>;
    //   },
    // },
    //   // {
    //   //   title: "Is Target Completed",
    //   //   key: "is_target_completed",
    //   //   dataIndex: "is_target_completed",
    //   //   align: "center",
    //   //   render: (status) => {
    //   //     let color = "";
    //   //     switch (status) {
    //   //       case "Pending":
    //   //         color = "orange";
    //   //         break;
    //   //       case "Confirm":
    //   //         color = "green";
    //   //         break;
    //   //       case "Cancelled":
    //   //         color = "red";
    //   //         break;
    //   //       default:
    //   //         color = "default";
    //   //         break;
    //   //     }
    //   //     return <Tag color={color}>{status}</Tag>;
    //   //   },
    //   // },
    //   // {
    //   //   title: "Target Completed",
    //   //   key: "target_completed",
    //   //   dataIndex: "target_completed",
    //   //   align: "center",
    //   // },
    //   // {
    //   //   title: "Total Purchase",
    //   //   key: "total_purchase",
    //   //   dataIndex: "total_purchase",
    //   //   align: "center",
    //   // },
    //   // {
    //   //   title: "Total Transfer",
    //   //   key: "total_transfer",
    //   //   dataIndex: "total_transfer",
    //   //   align: "center",
    //   // },
    //   // {
    //   //   title: "Agency Name",
    //   //   key: "agency_name",
    //   //   dataIndex: "agency_name",
    //   //   align: "center",
    //   // },
    //   // {
    //   //   title: "Total Box",
    //   //   key: "total-box",
    //   //   dataIndex: "total-box",
    //   //   align: "center",
    //   // },
    // {
    //   title: "Reward",
    //   key: "reward",
    //   dataIndex: "reward",
    //   align: "center",
    // },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <div>
            <div style={actionButtonContainerStyle}>
              {/* <Tooltip title="Edit" overlayClassName="custom-tooltip">
                <Button
                  styles={{ width: "20px" }}
                  className="d-flex justify-content-center align-items-center"
                  onClick={() => {
                    navigate("edit-agency-target", { state: { data: record } });
                  }}
                  icon={<EditOutlined />}
                  style={{ marginLeft: buttonSpacing }}
                />
              </Tooltip> */}
              <Tooltip title="Delete" overlayClassName="custom-tooltip">
                <Button
                  className="d-flex justify-content-center align-items-center"
                  onClick={() => handleDelete(record)}
                  icon={<DeleteOutlined />}
                  style={{ marginLeft: buttonSpacing, color: "red" }}
                />
              </Tooltip>
            </div>
          </div>
        </Space>
      ),
    },
  ];
  const fetchData = () => {
    // setIsLoading(true);
    const params = {
      page: 1,
      limit: 100,
    };
    try {
      axios
        .post("/admin/target/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            console.log("agency-target=================", response);
            dispatch(setAgencyTarget(response?.data.data.target__data));
            setData(response?.data.data.target__data);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
        });
    } catch (error) {
      console.log("error -=====>>", error);
    }
  };
  const handleConfirmDelete = async () => {
    if (recordToDelete && recordToDelete._id) {
      try {
        const response = await axios.delete(
          `${BASE_URL}admin/target/delete/${recordToDelete._id}`
        );
        if (response.status === 200) {
          toast.success("Target Successfully Deleted");
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting Target:", error);
      }
    }
    setIsDeleteModalVisible(false);
    setRecordToDelete(null);
  };
  // const allTargetsRes = useAllTargetsData();
  // const [allTargets, setAllTargets] = useState();

  // useEffect(() => {
  //   fetchData();
  //   const allTargetsData = allTargetsRes?.data?.target_data;
  //   setAllTargets(allTargetsData);
  //   allTargetsData?.length > 0 ? setIsLoading(false) : setIsLoading(true);
  //   // console.log("allTargetsData :", allTargetsData.length > 0);
  // }, [allTargetsRes]);
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Card
        className="m-2"
        title={
          <div className="d-flex row py-3">
            <div className="col-md-6 fs-3 fw-bold">Agency Target</div>
            <div className="col-md-6 " style={{ textAlign: "right" }}>
              <Tooltip
                title="Add Agency"
                overlayClassName="custom-tooltip"
                placement="bottom"
              >
                <Button
                  onClick={() => {
                    navigate("add-Agency-Target");
                  }}
                  size={"large"}
                  type="primary"
                >
                  Add Agency Target
                </Button>
              </Tooltip>
            </div>
          </div>
        }
      >
        <div className="table-responsive align-items-center">
          <DefaultTable
            data={data || null}
            columns={columns}
            loading={isLoading}
          />
        </div>
      </Card>
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete this Target?</p>
      </Modal>
      {/* <Card
        className="m-2"
        title={
          <div className="d-flex py-3">
            <div className="col-md-6 fs-3 fw-bold">Agency Target</div>
          </div>
        }
      >
        <Card className="m-2">
          <Row
            gutter={{
              xs: 8,
              sm: 16,
              md: 24,
              lg: 32,
            }}
          >
            <Col span={6} className="gutter-row">
              <div className="fw-bold mb-2">Agency</div>
              <div>
                <Select
                  defaultValue="Select Agency"
                  style={{
                    width: "100%",
                  }}
                  options={[
                    {
                      label: "Gujarat Marketing",
                      value: "Gujarat Marketing",
                    },
                    {
                      value: "Gujarat Marketing",
                      label: "Gujarat Marketing",
                    },
                    {
                      value: "Gujarat Marketing",
                      label: "Gujarat Marketing",
                    },
                  ]}
                />
              </div>
            </Col>
            <Col span={6} className="gutter-row">
              <div className="fw-bold mb-2">Is Target Completed</div>
              <div>
                <Select
                  defaultValue="Select Status"
                  style={{
                    width: "100%",
                  }}
                  options={[
                    {
                      label: "Gujarat Marketing",
                      value: "Gujarat Marketing",
                    },
                    {
                      value: "Gujarat Marketing",
                      label: "Gujarat Marketing",
                    },
                    {
                      value: "Gujarat Marketing",
                      label: "Gujarat Marketing",
                    },
                  ]}
                />
              </div>
            </Col>
            <div className="col-md-6 " style={{ textAlign: "right" }}>
              <Tooltip
                title="Add"
                overlayClassName="custom-tooltip"
                placement="bottom"
              >
                <Button
                  onClick={() => {
                    navigate("add-agency-target");
                  }}
                  size={"large"}
                  type="primary"
                >
                  Set Agency Target
                </Button>
              </Tooltip>
            </div>
          </Row>
          <Divider />
          <Row gutter={[16, 16]}>
            <Col xs={24} md={24} span={24}>
              <Card
                style={{
                  maxHeight: "70%",
                  overflow: "hidden",
                  overflowY: "auto",
                }}
              >
                <Row>
                  <Col span={4} offset={20}>
                    <Input
                      placeholder="Search here"
                      suffix={<SearchOutlined />}
                    />
                  </Col>
                </Row>
                <DefaultTable columns={column} data={data} />
              </Card>
            </Col>
          </Row>
        </Card>
      </Card> */}
    </>
  );
};
export default AgencyTarget;
