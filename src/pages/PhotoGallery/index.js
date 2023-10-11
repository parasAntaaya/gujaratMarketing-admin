import { Button, Card, Image, Modal, Space, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import DefaultTable from "../../Components/DefaultTable";
import BASE_URL from "../../utils/baseURL";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
const { setImage } = require("../../redux/reduxsauce/imageRedux");

const Gallery = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userRole = useSelector((state) => state.auth?.user?.role);
  const user = useSelector((state) => state.auth?.user);
  const data = useSelector((state) => state.imageData?.image);

  const [isLoading, setIsLoading] = useState(false);
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
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (theImageURL) => (
        <div style={{ width: "100px" }}>
          {" "}
          <Image src={theImageURL[0]} height={100} />
        </div>
      ),
    },
    {
      title: "Descripation",
      dataIndex: "description",
      key: "description",
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
              {(userRole === "admin" ||
                (userRole === "agency" && user.editAccess)) && (
                <Tooltip title="Edit" overlayClassName="custom-tooltip">
                  <Button
                    className="d-flex justify-content-center align-items-center"
                    onClick={() => {
                      navigate("edit-photo", {
                        state: { data: record },
                      });
                    }}
                    icon={<EditOutlined />}
                    style={{ marginLeft: buttonSpacing }}
                  />
                </Tooltip>
              )}
              {(userRole === "admin" ||
                (userRole === "agency" && user.deleteAccess)) && (
                <Tooltip title="Delete">
                  <Button
                    className="d-flex justify-content-center align-items-center"
                    onClick={() => handleDelete(record)}
                    icon={<DeleteOutlined />}
                    style={{ marginLeft: buttonSpacing, color: "red" }}
                  />
                </Tooltip>
              )}
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
        .post("admin/gallery/get/all", params)
        .then((response) => {
          console.log("gallary-get-all-response----", response);
          dispatch(setImage(response?.data?.data?.gallery_data));
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
          `${BASE_URL}admin/gallery/delete/${recordToDelete._id}`
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
            <div className="col-md-6 fw-bold h3">Photo Gallary</div>
            <div className="col-md-6 " style={{ textAlign: "right" }}>
              {(userRole === "admin" ||
                (userRole === "agency" && user.addAccess)) && (
                <Tooltip
                  title="Add Photo"
                  overlayClassName="custom-tooltip"
                  placement="bottom"
                >
                  <Button
                    onClick={() => {
                      navigate("add-photo");
                    }}
                    size={"large"}
                    type="primary"
                  >
                    Add Image
                  </Button>
                </Tooltip>
              )}
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
        <p>Are you sure you want to delete this Image?</p>
      </Modal>
    </>
  );
};

export default Gallery;
