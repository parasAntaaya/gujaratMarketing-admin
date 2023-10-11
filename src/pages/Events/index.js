import { Button, Card, Image, Modal, Space, Tooltip, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import DefaultTable from "../../Components/DefaultTable";
import BASE_URL from "../../utils/baseURL";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
const Gallery = () => {
  const buttonSpacing = "10px";
  const actionButtonContainerStyle = {
    display: "flex",
    alignItems: "center",
  };
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const handleDelete = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalVisible(true);
  };
  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setRecordToDelete(null);
  };
  const columns = [
    {
      title: "Sr. No.",
      key: "serialNumber",
      align: "center",
      render: (text) => (
        <div>{eventData.findIndex((a) => a?._id === text._id) + 1}</div>
     ),
    },

    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (theImageURL) => <Image src={theImageURL} height={100} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <div>
            <div style={actionButtonContainerStyle}>
              <Tooltip title="Edit" overlayClassName="custom-tooltip">
                <Button
                  className="d-flex justify-content-center align-items-center"
                  onClick={() => {
                    navigate("edit-event", {
                      state: { data: record },
                    });
                  }}
                  icon={<EditOutlined />}
                  style={{ marginLeft: buttonSpacing }}
                />
              </Tooltip>
              <Tooltip title="Delete">
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
    setIsLoading(true);
    const params = {
      page: 1,
      limit: 10000,
    };
    try {
      axios
        .post("admin/event/get/all", params)
        .then((response) => {
          console.log("response----", response);
          //   dispatch(setImage(response?.data?.data?.gallery_data));
          setEventData(response.data?.data?.event_data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("error-->>>>>", error?.message);
          setIsLoading(false);
        });
    } catch (error) {
      console.log("error -=====>>", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (recordToDelete && recordToDelete._id) {
      try {
        const response = await axios.delete(
          `admin/event/delete/${recordToDelete._id}`
        );
        if (response.status === 200) {
          toast.success("photo Successfully Deleted");
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting Freeze:", error);
      }
    }
    setIsDeleteModalVisible(false);
    setRecordToDelete(null);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Card
        className="m-2"
        title={
          <div className="d-flex row py-3">
            <div className="col-md-6 fw-bold h3">Events</div>
            <div className="col-md-6 " style={{ textAlign: "right" }}>
              <Tooltip
                title="Add Photo"
                overlayClassName="custom-tooltip"
                placement="bottom"
              >
                <Button
                  onClick={() => {
                    navigate("add-event");
                  }}
                  size={"large"}
                  type="primary"
                >
                  Add Event
                </Button>
              </Tooltip>
            </div>
          </div>
        }
      >
        <div className="table-responsive align-items-center">
          <DefaultTable
            data={eventData || null}
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
        <Typography.Text>
          Are you sure want to delete this Image?
        </Typography.Text>
      </Modal>
    </>
  );
};

export default Gallery;
