import {
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DefaultTable from "../../Components/DefaultTable";
import { toast } from "react-toastify";
const { Title } = Typography;

const ProductAssign = () => {
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [agencyProductData, setAgencyProductData] = useState(null);
  const [agencyData, setAgencyData] = useState(null);
  const [selectedAgencyData, setSelectedAgencyData] = useState(null);
  const [agencyValue, setAgencyValue] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchAssignedQuery, setSearchAssignedQuery] = useState("");
  const [matchData, setMatchData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleToggleChange = (record) => {
    if (!selectedAgencyData) {
      // Handle the case where no agency is selected
      return;
    }

    // Check if the product is already in the selected agency's products array
    // Find the product index within the selected agency's products array
    const productIndex = selectedAgencyData.products.findIndex(
      (product) => product.productId._id === record._id
    );

    if (productIndex !== -1) {
      // If the product exists, update its isActive property
      selectedAgencyData.products.splice(productIndex, 1);
    } else {
      // If the product doesn't exist, add it to the selected agency's products array
      selectedAgencyData.products.push({
        productId: record,
        // quantity: 10, // You can set the quantity as needed
        isActive: true, // Set the initial isActive status when adding a new product
      });
    }

    // Update the state with the modified selectedAgencyData
    setSelectedAgencyData({ ...selectedAgencyData });

    // Optionally, you can also update productData with the new isActive status
    const updatedProductData = productData.map((product) => {
      if (product._id === record._id) {
        product.isActive = !product.isActive;
      }
      return product;
    });

    if (selectedAgencyData) {
      setRefresh(true);
      axios
        .post("admin/agency/edit", { ...selectedAgencyData, _id: agencyValue })
        .then((response) => {
          toast.success("Product Assign Sucessfully Updated");
          setRefresh(false);
        })
        .catch((error) => {
          setRefresh(false);
          console.log("error------", error);
        });
    }
    setProductData(updatedProductData);
  };

  const UpdatedColumns = [
    {
      title: "Sr no.",
      dataIndex: "_id", // Update this to the correct data index
      key: "name",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
      render: (text) => (
        <div style={{ textAlign: "right" }}>
          {productData.findIndex((a) => a._id === text) + 1}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name", // Update this to the correct data index
      key: "name",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
    },
    {
      title: "Category",
      dataIndex: "variantId",
      key: "variantId",
      align: "center",
      render: (record) => {
        return record?.unit;
      },
    },
    {
      title: "Action",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (isActive, record) => {
        return (
          <Switch
            checked={isActive}
            disabled={agencyValue === undefined}
            onChange={() => handleToggleChange(record)}
          />
        );
      },
    },
  ];

  const columns = [
    {
      title: "Sr no.",
      dataIndex: "_id", // Update this to the correct data index
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
      render: (text) => (
        <div>
          {selectedAgencyData?.products?.findIndex((a) => a?._id === text) + 1}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name", // Update this to the correct data index
      key: "name",
      align: "center",
      style: { backgroundColor: "#e6f7ff" },
      render: (text, record) => record?.productId?.name,
    },
    {
      title: "Category",
      dataIndex: "variantId",
      key: "variantId",
      align: "center",
      render: (text, record) => record?.productId?.variantId?.unit,
    },
  ];

  const fetchProductData = () => {
    setLoading(true);
    const params = {
      page: 1,
      limit: 100,
    };
    try {
      axios
        .post("admin/product/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            setProductData(response?.data?.data?.product_data);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log("error-->>>>>", error?.message);
        });
    } catch (error) {
      setLoading(false);
      console.log("error -=====>>", error);
    }
  };

  const fetchAgencyData = () => {
    setLoading(true);
    const params = {
      page: 1,
      limit: 100,
    };
    try {
      axios
        .post("/admin/agency/get/all", params)
        .then((response) => {
          if (response.status === 200) {
            const agencyDataRes = response?.data?.data?.agency_data;
            setAgencyData(agencyDataRes);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log("error-->>>>>", error?.message);
        });
    } catch (error) {
      setLoading(false);
      console.log("error -=====>>", error);
    }
  };

  const fetchAgencyProductData = () => {
    try {
      axios
        .get(`/admin/agency/${agencyValue}`)
        .then((response) => {
          if (response.status === 200) {
            const agencyData = response?.data?.data;
            setSelectedAgencyData(agencyData);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log("error-->>>>>", error?.message);
        });
    } catch (error) {
      setLoading(false);
      console.log("error -=====>>", error);
    }
  };

  function handleChangeAgency(value) {
    setAgencyValue(value);
    const agnFilter = agencyData?.filter((agency) => agency?._id === value);
    const agencyProducts = agnFilter?.map((agen) => agen?.products);
    const agencyProductsId = agencyProducts[0]?.map((agen) => agen?.productId);
    setAgencyProductData(agencyProductsId);
    const allProductId = productData.map((a, index) => a?._id);
    let matchData = agencyProductsId.filter((product) =>
      allProductId.includes(product._id)
    );
    setMatchData(matchData);
  }

  useEffect(() => {
    // Update isActive property for each product in productData
    const updatedProductData = productData?.map((product) => ({
      ...product,
      isActive: matchData?.some(
        (matchedProduct) => matchedProduct._id === product._id
      ),
    }));

    setProductData(updatedProductData);
    setLoading(false);
  }, [matchData]);

  const filterData = (data) => {
    return data?.filter(
      (item) =>
        item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        item?.variantId?.unit
          ?.toLowerCase()
          ?.includes(searchQuery?.toLowerCase())
    );
  };

  const filterAssignedData = (data) => {
    return data?.filter(
      (item) =>
        item?.productId?.name
          ?.toLowerCase()
          ?.includes(searchAssignedQuery?.toLowerCase()) ||
        item?.productId?.variantId?.unit
          ?.toLowerCase()
          ?.includes(searchAssignedQuery?.toLowerCase())
    );
  };

  useEffect(() => {
    fetchProductData();
    fetchAgencyData();
  }, []);

  useEffect(() => {
    if (agencyValue !== undefined) {
      fetchAgencyProductData();
    }
  }, [refresh, agencyValue]);

  return (
    <>
      <Card
        className="m-2"
        title={
          <div className="d-flex py-3">
            <div className="col-md-6 fs-3 fw-bold">Agency Product</div>
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
              <Form.Item label="Agency" name="agency">
                <Select
                  placeholder="Agency"
                  value={agencyValue}
                  onChange={(value) => {
                    handleChangeAgency(value);
                    // setAgencyValue(value);
                  }}
                  style={{ width: "100%" }}
                  options={agencyData?.map((data) => ({
                    label: data?.agencyName,
                    value: data?._id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} span={12}>
              <Card
                style={{
                  height: "auto",
                  overflow: "hidden",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Title level={4}>
                    Agency Product (
                    {selectedAgencyData?.products
                      ? selectedAgencyData?.products?.length
                      : 0}
                    )
                  </Title>
                  <Input.Search
                    value={searchAssignedQuery}
                    placeholder="Search products"
                    onChange={(e) => setSearchAssignedQuery(e.target.value)}
                    style={{ marginBottom: 16, width: "50%" }}
                  />
                </div>
                <DefaultTable
                  data={filterAssignedData(selectedAgencyData?.products)}
                  columns={columns}
                  loading={loading}
                />
              </Card>
            </Col>
            <Col xs={24} md={12} span={12}>
              <Card
                style={{
                  height: "auto",
                  overflow: "hidden",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Title level={4}>All Products ({productData?.length}) </Title>
                  <Input.Search
                    value={searchQuery}
                    placeholder="Search products"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginBottom: 16, width: "50%" }}
                  />
                </div>

                <DefaultTable
                  data={filterData(productData)}
                  columns={UpdatedColumns}
                  loading={loading}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      </Card>
    </>
  );
};

export default ProductAssign;
