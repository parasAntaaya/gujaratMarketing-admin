import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Upload,
  DatePicker,
  Typography,
} from "antd";
import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useShopData,
  useAgencyData,
  useSalesmanData,
} from "./targetAPICalling/useTargetAPIData";
import { useLocation, useNavigate } from "react-router-dom";
import { Option } from "antd/es/mentions";
import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";
const { RangePicker } = DatePicker;
// -----------------------------------------------------------------------------------------------------------------------------
const AddOrEditAgencyTarget = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const shopDataRes = useShopData();
  const agencyDataRes = useAgencyData();
  const salesmanDataRes = useSalesmanData();

  const [selectedAssignedType, setSelectedAssignedType] = useState(null);
  const [selectedTargetType, setSelectedTargetType] = useState();
  const [selectedRewardType, setSelectedRewardType] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [targetLabel, setTargetLabel] = useState();
  const [selectedRewardCash, setSelectedRewardCash] = useState(null);
  const [selectedRewardPoint, setSelectedRewardPoint] = useState(null);
  const [shopData, setShopData] = useState();
  const [agencyData, setAgencyData] = useState();
  const [salesmanData, setSalesmanData] = useState();
  const [productData, setProductData] = useState();
  const [assignToId, setAssignToId] = useState();
  const [selectedDates, setSelectedDates] = useState([]);
  const [selctedProductQty, setSelectedProductQty] = useState();
  const [selctedProductAmt, setSelectedProductAmt] = useState();
  const [selctedProductPer, setSelectedProductPer] = useState();
  const [selectedProductArrays, setSelectedProductArrays] = useState([{}]);
  const [rewardItems, setRewardItems] = useState({
    name: "",
    image: "",
    value: "",
  });
  const updateData = {
    startDate: moment(startDate).format("YYYY-MM-DD"),
    endDate: moment(endDate).format("YYYY-MM-DD"),
    assignedTo: assignToId,
    targets: selectedProductArrays,
    totalAmountTarget: selctedProductAmt,
    totalPercentageTarget: selctedProductPer,
    totalQtyTarget: selctedProductQty,
    assignedType: selectedAssignedType,
    targetType: selectedTargetType,
    rewardType: selectedRewardType,
    reward:
      selectedRewardType === "points"
        ? selectedRewardPoint
        : selectedRewardCash,
    rewardItem: rewardItems,
  };
  const handleSubmit = async (values) => {
    form.validateFields().then(async () => {
      try {
        const uploadImage = async (file) => {
          try {
            const formData = new FormData();
            formData.append("image", file[0].originFileObj);
            const response = await axios.post("/upload/document", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            if (response?.data?.data?.image) {
              return (rewardItems.image = response?.data?.data?.image);
            }
          } catch (error) {
            console.log("uploadImage error=====", error);
            throw error;
          }
        };
        if (rewardItems.image) {
          await uploadImage(rewardItems?.image);
        }
        if (location.pathname === "/agencytarget/add-Agency-Target") {
          console.log("updateData====", updateData);
          axios
            .post("/admin/target/add", updateData)
            .then((response) => {
              if (response.status === 200) {
                toast.success("Target Sucessfully Add");
                navigate("/agencytarget");
              }
            })
            .catch((error) => {
              console.log("error-->>>>>", error?.message);
            });
        }
      } catch (error) {
        console.log("error=====", error);
        return;
      }
    });
  };
  const handleChange = (e, type) => {
    if (type === "agency") {
      const selectedAgency = agencyData.find((agency) => agency._id === e);
      const productsOfAgency = selectedAgency?.products?.map(
        (pr) => pr?.productId
      );
      setProductData(productsOfAgency);
    }
    const selectedValue = e;
    setAssignToId(selectedValue);
  };
  const addProductDropdown = () => {
    setSelectedProductArrays([
      ...selectedProductArrays,
      {
        productId: "",
        targetQty: null,
        targetPercentage: null,
        targetAmount: null,
      },
    ]);
  };
  const handleMultiProductsChange = (values) => {
    setSelectedProductArrays(
      values.map((productId) => ({
        productId,
      }))
    );
  };

  const deleteProduct = (productIndex) => {
    const updatedProductArrays = [...selectedProductArrays];
    updatedProductArrays.splice(productIndex, 1);
    setSelectedProductArrays(updatedProductArrays);
  };
  const handleProductsChange = (value, index) => {
    if (selectedTargetType === "product_cartoon") {
      for (let i = 0; i < selectedProductArrays.length; i++) {
        if (i === index) {
          selectedProductArrays[i].productId = value;
          selectedProductArrays[i].targetPercentage = null;
          selectedProductArrays[i].targetAmount = null;
          break;
        }
      }
    } else if (selectedTargetType === "product_percentage") {
      for (let i = 0; i < selectedProductArrays.length; i++) {
        if (i === index) {
          selectedProductArrays[i].productId = value;
          selectedProductArrays[i].targetQty = null;
          selectedProductArrays[i].targetAmount = null;
          break;
        }
      }
    } else if (selectedTargetType === "percent_amount") {
      for (let i = 0; i < selectedProductArrays.length; i++) {
        if (i === index) {
          selectedProductArrays[i].productId = value;
          selectedProductArrays[i].targetPercentage = null;
          selectedProductArrays[i].targetQty = null;
          break;
        }
      }
    } else if (selectedTargetType === "products_cartoon_target") {
      for (let i = 0; i < selectedProductArrays.length; i++) {
        if (i === index) {
          selectedProductArrays[i].productId = value;
          break;
        }
      }
    } else if (selectedTargetType === "products_percentage_target") {
      for (let i = 0; i < selectedProductArrays.length; i++) {
        if (i === index) {
          selectedProductArrays[i].productId = value;
          break;
        }
      }
    } else if (selectedTargetType === "products_amount_target") {
      for (let i = 0; i < selectedProductArrays.length; i++) {
        if (i === index) {
          selectedProductArrays[i].productId = value;
          break;
        }
      }
    }
  };
  const handleQuantityChange = (e, index) => {
    if (selectedTargetType === "product_cartoon") {
      for (let i = 0; i < selectedProductArrays.length; i++) {
        if (i === index) {
          selectedProductArrays[i].targetQty = e.target.value;
          selectedProductArrays[i].targetPercentage = null;
          selectedProductArrays[i].targetAmount = null;
          console.log(selectedTargetType, "changed :", selectedProductArrays);
          break;
        }
      }
    } else if (selectedTargetType === "product_percentage") {
      for (let i = 0; i < selectedProductArrays.length; i++) {
        if (i === index) {
          selectedProductArrays[i].targetQty = null;
          selectedProductArrays[i].targetPercentage = e.target.value;
          selectedProductArrays[i].targetAmount = null;
          break;
        }
      }
    } else if (selectedTargetType === "percent_amount") {
      for (let i = 0; i < selectedProductArrays.length; i++) {
        if (i === index) {
          selectedProductArrays[i].targetQty = null;
          selectedProductArrays[i].targetPercentage = null;
          selectedProductArrays[i].targetAmount = e.target.value;
          break;
        }
      }
    } else if (selectedTargetType === "products_cartoon_target") {
      setSelectedProductQty(
        (updateData.totalQtyTarget = parseInt(e.target.value))
      );
    } else if (selectedTargetType === "products_percentage_target") {
      setSelectedProductPer(
        (updateData.totalPercentageTarget = parseInt(e.target.value))
      );
    } else if (selectedTargetType === "products_amount_target") {
      setSelectedProductAmt(
        (updateData.totalAmountTarget = parseInt(e.target.value))
      );
    }
  };
  let optionsComment = [];
  if (productData) {
    for (let i = 0; i <= productData?.length; i++) {
      optionsComment.push({
        value: productData[i]?._id,
        label: (
          <div>
            <img
              src={productData[i]?.productImage}
              alt={productData[i]?.name}
              style={{
                height: "22px",
                marginRight: "8px",
              }}
            />
            {productData[i]?.name}
          </div>
        ),
      });
    }
  }
  useEffect(() => {
    setShopData(shopDataRes?.data?.shop_data);
    setAgencyData(agencyDataRes?.data?.agency_data);
    setSalesmanData(salesmanDataRes?.data?.user_data);
  }, [shopDataRes, agencyDataRes, salesmanDataRes]);
  const rangePickerValue = selectedDates.length === 0 ? null : selectedDates;
  const handleDateChange = (dates) => {
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[1]);
    if (startDate && endDate) {
      setStartDate(startDate);
      setEndDate(endDate);
    }
  };
  return (
    <>
      <Card
        className="m-2"
        title={
          <div className="d-flex">
            <Button
              className="back-button mx-2 btn btn-outline-primary"
              type="default"
              onClick={() => navigate("/agencytarget")}
              icon={<LeftOutlined className="back-icon " />}
            ></Button>
            <div>
              <h4 className="fw-bold fs-4">Target</h4>
            </div>
          </div>
        }
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          style={{
            marginLeft: "100px",
          }}
          wrapperCol={{
            span: 18,
          }}
          layout="horizontal"
        >
          <Row>
            <Col span={24}>
              <h6>Dates :</h6>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="date"
                label="Select Date"
                rules={[
                  { required: true, message: "Please select a date range" },
                ]}
              >
                <RangePicker
                  format={"DD-MM-YYYY"}
                  value={rangePickerValue}
                  onChange={handleDateChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <h6>Types :</h6>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item
                name="assignedType"
                label="Assigned Type"
                rules={[
                  { required: true, message: "Please select an assigned type" },
                ]}
              >
                <Select
                  placeholder="Assigned Type"
                  style={{
                    width: "80%",
                  }}
                  onChange={(value) => setSelectedAssignedType(value)}
                >
                  <Option value="agency">Agency</Option>
                  <Option value="salesman">Salesman</Option>
                  <Option value="shop">Shop</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {(selectedAssignedType === "agency" ||
              selectedAssignedType === "shop" ||
              selectedAssignedType === "salesman") && (
              <Col span={8}>
                <Form.Item
                  name="agency"
                  label="Agency"
                  rules={[
                    { required: true, message: "Please select an agency" },
                  ]}
                >
                  <Select
                    placeholder="Agency"
                    style={{
                      width: "80%",
                    }}
                    // onChange={handleAgencyChange}
                    showSearch={true}
                    filterOption={(input, option) =>
                      option.label.includes(input) ||
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={agencyData?.map((data) => ({
                      label: data?.agencyName,
                      value: data?._id,
                    }))}
                    onChange={(e) => handleChange(e, "agency")}
                  />
                </Form.Item>
              </Col>
            )}
            {(selectedAssignedType === "salesman" ||
              selectedAssignedType === "shop") && (
              <Col span={8}>
                <Form.Item
                  name="salesman"
                  label="Salesman"
                  rules={[
                    { required: true, message: "Please select an salesman" },
                  ]}
                >
                  <Select
                    placeholder="Salesman"
                    style={{
                      width: "80%",
                    }}
                    showSearch={true}
                    filterOption={(input, option) =>
                      option.label.includes(input) ||
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={salesmanData?.map((data) => ({
                      label: data?.name,
                      value: data?._id,
                    }))}
                    onChange={(e) => handleChange(e, "salesman")}
                  />
                </Form.Item>
              </Col>
            )}
            {selectedAssignedType === "shop" && (
              <Col span={8}>
                <Form.Item
                  name="shop"
                  label="Shop"
                  rules={[{ required: true, message: "Please select an shop" }]}
                >
                  <Select
                    placeholder="Shop"
                    style={{
                      width: "80%",
                    }}
                    showSearch={true}
                    filterOption={(input, option) =>
                      option.label.includes(input) ||
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={shopData?.map((data) => ({
                      label: data?.name,
                      value: data?._id,
                    }))}
                    onChange={(e) => handleChange(e, "shop")}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
          {/* --------------------------------------------------------- */}
          <Row>
            <Col span={24}>
              <Typography.Title level={5}>Targets :</Typography.Title>
            </Col>
          </Row>
          <Row>
            <div
              style={{
                width: "100%",
                display: "flex",
              }}
            >
              <Col span={8}>
                <Form.Item
                  name="targetType"
                  label="Target Type"
                  value={selectedTargetType}
                  rules={[
                    { required: true, message: "Please select an target type" },
                  ]}
                >
                  <Select
                    placeholder="Target Type"
                    style={{
                      width: "100%",
                    }}
                    onChange={(value, label) => {
                      setSelectedTargetType(value);
                      setTargetLabel(label);
                    }}
                    options={[
                      {
                        value: "product_cartoon",
                        label: "Cartoon Wise",
                      },
                      {
                        value: "product_percentage",
                        label: "Percentage Wise Target",
                      },
                      {
                        value: "percent_amount",
                        label: "Amount wise Target",
                      },
                      {
                        value: "products_cartoon_target",
                        label: "Products Wise Cartoon Target",
                      },
                      {
                        value: "products_percentage_target",
                        label: "Products Wise Percentage Target",
                      },
                      {
                        value: "products_amount_target",
                        label: "Products Wise Amount Target",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </div>
          </Row>
          {selectedTargetType === "product_cartoon" ||
          selectedTargetType === "percent_amount" ||
          selectedTargetType === "product_percentage" ? (
            <Row>
              {selectedProductArrays.map((selectedProducts, index) => (
                  <div
                    key={index}
                    style={{
                      width: "100%",
                      display: "flex",
                    }}
                  >
                    <Col span={7}>
                      <Form.Item
                        name={index.toString() + 1}
                        label="Product"
                        rules={[
                          {
                            required: true,
                            message: "Please select product",
                          },
                        ]}
                        style={{
                          marginBottom: "10px",
                        }}
                      >
                        <Select
                          name={selectedTargetType}
                          placeholder="Select Product"
                          showSearch={true}
                          filterOption={(input, option) =>
                            option.label.includes(input) ||
                            option.label
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={productData?.map((data, index) => ({
                            label: data.name,
                            value: data?._id,
                          }))}
                          onChange={(value) =>
                            handleProductsChange(value, index)
                          }
                        />
                      </Form.Item>
                    </Col>
                    {selectedTargetType === "product_cartoon" ||
                    selectedTargetType === "percent_amount" ||
                    selectedTargetType === "product_percentage" ? (
                      <>
                        <Col span={7}>
                          <Form.Item
                            name={index.toString()}
                            label={targetLabel?.label.split(" ")[0]}
                            rules={[
                              {
                                required: true,
                                message: "Please input field",
                              },
                            ]}
                            style={{
                              marginLeft: "18px",
                            }}
                          >
                            <Input
                              name={selectedTargetType}
                              placeholder={selectedTargetType}
                              maxLength={6}
                              onChange={(e) => handleQuantityChange(e, index)}
                              onKeyPress={(e) => {
                                const keyCode = e.which || e.keyCode;
                                if (keyCode < 48 || keyCode > 57) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                        {index === selectedProductArrays.length - 1 && (
                          <Col style={{ margin: "0 0 25px 0" }}>
                            <Button
                              style={{
                                backgroundColor: "#1677ff",
                                color: "white",
                              }}
                              onClick={addProductDropdown}
                              disabled={selectedTargetType === undefined}
                            >
                              +
                            </Button>
                          </Col>
                        )}
                        <Col>
                          <Button
                            style={{
                              backgroundColor: "#1677ff",
                              color: "white",
                              marginLeft: "10px",
                            }}
                            disabled={selectedProductArrays.length === 1}
                            onClick={() => deleteProduct(index)}
                          >
                            -
                          </Button>
                        </Col>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
              ))}
            </Row>
          ) : (
            ""
          )}

          {/* -------------------------------------------------------------------------------------------------- */}
          {selectedTargetType === "products_cartoon_target" ||
          selectedTargetType === "products_amount_target" ||
          selectedTargetType === "products_percentage_target" ? (
            <Row>
              <Col span={8}>
                <Form.Item
                  label="Product"
                  rules={[
                    {
                      required: true,
                      message: "Please select Products",
                    },
                  ]}
                >
                  <Select
                    name={selectedTargetType}
                    placeholder="Select Product"
                    mode="multiple"
                    showSearch={true}
                    filterOption={(input, option) =>
                      option.label.includes(input) ||
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={productData?.map((data, index) => ({
                      label: data.name,
                      value: data?._id,
                    }))}
                    onChange={(value) => handleMultiProductsChange(value)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={selectedTargetType}
                  label={
                    targetLabel?.label.split(" ").slice(0, 3).join(" ") +
                    "Total"
                  }
                  rules={[{ required: true, message: "Please input field" }]}
                  style={{
                    marginLeft: "18px",
                  }}
                >
                  <Input
                    placeholder={targetLabel?.label.split(" ")[0]}
                    maxLength={6}
                    onChange={(e) => handleQuantityChange(e)}
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : (
            ""
          )}

          {/* -------------------------------------------------------------------------------------------------------------------------------- */}
          <Row>
            <Col span={24}>
              <h6>Reward :</h6>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <Form.Item
                name="rewardType"
                label="Reward Type"
                rules={[
                  { required: true, message: "Please select an reward type" },
                ]}
              >
                <Select
                  placeholder="Reward Type"
                  style={{
                    width: "80%",
                  }}
                  onChange={(value) => {
                    setSelectedRewardType(value);
                  }}
                >
                  <Option value="cash">Cash</Option>
                  <Option value="item">Item</Option>
                  <Option value="points">Points</Option>
                </Select>
              </Form.Item>
            </Col>
            {selectedRewardType === "cash" && (
              <Col span={8}>
                <Form.Item
                  name="reward"
                  label="Cash"
                  rules={[{ required: true, message: "Please set Cash" }]}
                >
                  <Input
                    style={{
                      width: "80%",
                    }}
                    onChange={(e) => {
                      setSelectedRewardCash(parseInt(e.target.value));
                      setSelectedRewardPoint(null);
                      setRewardItems({
                        name: "",
                        image: "",
                        value: "",
                      });
                    }}
                    placeholder="Enter Cash Amount"
                    maxLength={6}
                    onKeyPress={(e) => {
                      const keyCode = e.which || e.keyCode;
                      if (keyCode < 48 || keyCode > 57) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            )}
            {selectedRewardType === "points" && (
              <Col span={8}>
                <Form.Item
                  name="reward"
                  label="Points"
                  rules={[{ required: true, message: "Please type an reward" }]}
                >
                  <Input
                    style={{
                      width: "80%",
                    }}
                    onChange={(e) => {
                      setSelectedRewardPoint(parseInt(e.target.value));
                      setSelectedRewardCash(null);
                      setRewardItems({
                        name: "",
                        image: "",
                        value: "",
                      });
                    }}
                    placeholder="Enter Point"
                    maxLength={6}
                    onKeyPress={(e) => {
                      const keyCode = e.which || e.keyCode;
                      if (keyCode < 48 || keyCode > 57) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
          {selectedRewardType === "item" && (
            <Row>
              <Col span={8}>
                <Form.Item
                  name="image"
                  label="Image"
                  getValueFromEvent={(e) => e?.fileList}
                  rules={[
                    {
                      required: true,
                      message: "Please input Image!",
                    },
                  ]}
                >
                  <Upload
                    maxCount={1}
                    action="/upload.do"
                    listType="picture-card"
                    onChange={({ fileList }) => {
                      setRewardItems({
                        ...rewardItems,
                        image: fileList,
                      });
                      // selectedReward = {
                      //   cash: "",
                      //   point: "",
                      // };
                      setSelectedRewardPoint(null);
                      setSelectedRewardCash(null);
                    }}
                  >
                    <div>
                      <PlusOutlined />
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="name"
                  label="Item name"
                  rules={[
                    {
                      required: true,
                      message: "Please type an item name",
                    },
                  ]}
                >
                  <Input
                    style={{ width: "150px" }}
                    placeholder="Item name"
                    maxLength={18}
                    onChange={(value) =>
                      setRewardItems({
                        ...rewardItems,
                        name: value.target.value,
                      })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="value"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: "Please type an Description",
                    },
                  ]}
                >
                  <Input
                    style={{ width: "150px" }}
                    placeholder="Description"
                    maxLength={35}
                    onChange={(value) =>
                      setRewardItems({
                        ...rewardItems,
                        value: value.target.value,
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
          <br />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Set Target
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};
export default AddOrEditAgencyTarget;
