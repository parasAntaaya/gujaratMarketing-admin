import { Card, Checkbox } from "antd";
import React, { useState } from "react";
import DefaultTable from "../../Components/DefaultTable";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const MenuMaster = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const onChange = async (value) => {
    setSelectedValue(value);
    setIsLoading(true);
    let params = {
      page: 1,
      limit: 100000,
    };
    if (value === "agency") {
      try {
        await axios
          .post("admin/agency/get/all", params)
          .then((response) => {
            if (response.status === 200) {
              console.log("ageny api data----", response);
              setData(response?.data?.data?.agency_data);
              setIsLoading(false);
            }
          })
          .catch((error) => {
            setIsLoading(false);
            console.log("error-->>>>>", error?.message);
          });
      } catch (error) {
        setIsLoading(false);
        console.log("error -=====>>", error);
      }
    } else if (value === "salesman") {
      await axios
        .post("admin/user/get/all", {
          params: { ...params, roleFilter: "salesman" },
        })
        .then((response) => {
          if (response.status === 200) {
            console.log("salesman api data----", response);
            setData(response?.data?.data?.user_data);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.log("error-->>>>>", error?.message);
        });
    } else {
      setIsLoading(true);
      try {
        await axios
          .post("admin/user/get/all", { params, roleFilter: "deliveryman" })
          .then((response) => {
            if (response.status === 200) {
              console.log("delivery api data----", response);
              setData(response?.data?.data?.user_data);
              setIsLoading(false);
            }
          })
          .catch((error) => {
            setIsLoading(false);
            console.log("error-->>>>>", error?.message);
          });
      } catch (error) {
        setIsLoading(false);
        console.log("error -=====>>", error);
      }
    }
  };

  const onSearch = (value) => {
    setSearchQuery(value);
  };

  const filterData = (data) => {
    if (!data) {
      return [];
    }
    return data?.filter((item) =>
      item?.role === "agency"
        ? item?.agencyName?.toLowerCase().includes(searchQuery?.toLowerCase())
        : item?.name?.toLowerCase().includes(searchQuery?.toLowerCase())
    );
  };

  const handleCheckboxChange = async (record, accessName, isChecked) => {
    if (selectedValue === "agency") {
      const updatedData = data?.map(async (item) => {
        setIsLoading(true);
        if (item._id === record._id) {
          await axios
            .post("admin/agency/edit", {
              [accessName]: isChecked,
              _id: record?._id,
            })
            .then((response) => {
              console.log("response------", response);
              setIsLoading(false);
              toast.success("Agency Sucessfully Update");
            })
            .catch((error) => {
              setIsLoading(false);
              toast.error("Agency Couldn't Updated");
              console.log("error------", error);
            });
          return { ...item, [accessName]: isChecked };
        }
        return item;
      });
      setData(updatedData);
    } else if (selectedValue === "salesman") {
      const updatedData = data?.map(async (item) => {
        setIsLoading(true);
        if (item._id === record._id) {
          await axios
            .post("admin/user/edit", {
              [accessName]: isChecked,
              _id: record?._id,
            })
            .then((response) => {
              console.log("response------", response);
              setIsLoading(false);
              toast.success("Sales Person Sucessfully Update");
            })
            .catch((error) => {
              setIsLoading(false);
              toast.error("Sales Person Couldn't Updated");
              console.log("error------", error);
            });
          return { ...item, [accessName]: isChecked };
        }
        return item;
      });
      setData(updatedData);
    } else {
      const updatedData = data?.map(async (item) => {
        setIsLoading(true);
        if (item._id === record._id) {
          await axios
            .post("admin/user/edit", {
              [accessName]: isChecked,
              _id: record?._id,
            })
            .then((response) => {
              console.log("response------", response);
              setIsLoading(false);
              toast.success("Delivery Sucessfully Update");
            })
            .catch((error) => {
              setIsLoading(false);
              toast.error("Delivery Couldn't Updated");
              console.log("error------", error);
            });
          return { ...item, [accessName]: isChecked };
        }
        return item;
      });
      setData(updatedData);
    }
  };

  const columns = [
    {
      title: "Sr. No.",
      key: "serialNumber",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex:
        selectedValue === "agency"
          ? "agencyName"
          : selectedValue === "salesman" || selectedValue === "deliveryman"
          ? "name"
          : "",
      key: "agencyName",
    },
    {
      title: "Add Permission",
      key: "addAccess",
      dataIndex: "addAccess",
      align: "center",
      render: (text, record) => (
        <Checkbox
          checked={record?.addAccess}
          onChange={(e) =>
            handleCheckboxChange(record, "addAccess", e.target.checked)
          }
        />
      ),
    },
    {
      title: "Edit Permission",
      key: "editAccess",
      dataIndex: "editAccess",
      align: "center",
      render: (text, record) => (
        <Checkbox
          checked={record?.editAccess}
          onChange={(e) =>
            handleCheckboxChange(record, "editAccess", e.target.checked)
          }
        />
      ),
    },
    {
      title: "Delete Permission",
      key: "deleteAccess",
      dataIndex: "deleteAccess",
      align: "center",
      render: (text, record) => (
        <Checkbox
          checked={record?.deleteAccess}
          onChange={(e) =>
            handleCheckboxChange(record, "deleteAccess", e.target.checked)
          }
        />
      ),
    },
    {
      title: "Status Permission",
      key: "statusAccess",
      dataIndex: "statusAccess",
      align: "center",
      render: (text, record) => (
        <Checkbox
          checked={record?.statusAccess}
          onChange={(e) =>
            handleCheckboxChange(record, "statusAccess", e.target.checked)
          }
        />
      ),
    },
  ];

  return (
    <>
      <Card
        className="m-2"
        title={
          <div className="d-flex py-3">
            <div className="col-md-6 fs-3 fw-bold">Permission Table</div>
          </div>
        }
      >
        <DefaultTable
          cardTable
          loading={isLoading}
          onChange={onChange}
          onSearch={onSearch}
          columns={columns}
          data={filterData(data)}
        />
      </Card>
    </>
  );
};

export default MenuMaster;
