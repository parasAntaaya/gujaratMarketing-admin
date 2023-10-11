import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  SearchOutlined,
  BellOutlined,
  DownOutlined,
  ShopOutlined,
  InboxOutlined,
  BookOutlined,
  DashboardOutlined,
  PartitionOutlined,
  LaptopOutlined,
  CarOutlined,
  ShoppingCartOutlined,
  StockOutlined,
  NotificationOutlined,
  HddOutlined,
  CameraOutlined,
  TabletOutlined,
  BarsOutlined,
  MenuOutlined,
  ExclamationOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Image,
  Input,
  Dropdown,
  Space,
  Breadcrumb,
} from "antd";
import { useState } from "react";
import Logo from "../../Images/logotext.png";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
const { setUser } = require("../../redux/reduxsauce/authRedux");

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const userRole = useSelector((state) => state.auth?.user?.role);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleProfileClick = (key) => {
    switch (key) {
      case "profile":
        navigate("/profile");
        break;
      case "logout":
        dispatch(setUser(null));
        toast.success("Logout Sucessfully");
        navigate("login");
        break;
      default:
        break;
    }
  };
  const menu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => handleProfileClick("profile")}>
        Profile
      </Menu.Item>
      <Menu.Item
        style={{ color: "red" }}
        key="logout"
        onClick={() => handleProfileClick("logout")}
      >
        Log Out
      </Menu.Item>
    </Menu>
  );
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  const items = [
    getItem(" Agency", "sub1", <PartitionOutlined />, [
      getItem("Agency List"),
      getItem("Agency Targets"),
    ]),
  ];
  return (
    <>
      <div className="d-flex justify-content-between align-items-center p-3">
        <div className="d-flex align-items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              color: "black",
            }}
          />
          <Image width={30} src={Logo} preview={false} />
        </div>
        <div className="d-flex align-items-center">
          <Input placeholder="Search here" suffix={<SearchOutlined />} />
          <BellOutlined className="mx-3" style={{ fontSize: 20 }} />
          <Dropdown overlay={menu}>
            <Link
              onClick={(e) => {
                e.preventDefault();
              }}
              style={{ minWidth: "90px" }}
            >
              <Space style={{ color: "black" }}>
                {userRole === "admin" ? "Admin" : "Agency"}
                <DownOutlined style={{ marginBottom: "5px" }} />
              </Space>
            </Link>
          </Dropdown>
        </div>
      </div>
      <Layout style={{ height: "100vh" }}>
        <Sider width={"220px"} trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              <Link className="text-decoration-none" to="/dashboard">
                Dashboard
              </Link>
            </Menu.Item>
            {/* ----------------------------------------------------------------------------------------------------------------------- */}
            {userRole === "admin" && (
              <>
                <Menu.Item key="catalog" icon={<BookOutlined />}>
                  <Link className="text-decoration-none" to="/catalog">
                    Catalog
                  </Link>
                </Menu.Item>
                <Menu.Item key="category" icon={<BookOutlined />}>
                  <Link className="text-decoration-none" to="/category">
                    Category
                  </Link>
                </Menu.Item>
                <Menu.SubMenu
                  key="product"
                  title="Product"
                  icon={<InboxOutlined />}
                >
                  <Menu.Item>
                    <Link className="text-decoration-none" to="/product">
                      Product
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="assign-product">
                    <Link className="text-decoration-none" to="/assign-product">
                      Assign Product
                    </Link>
                  </Menu.Item>
                </Menu.SubMenu>

                <Menu.Item key="salesofficer" icon={<InboxOutlined />}>
                  <Link className="text-decoration-none" to="/salesofficer">
                    Sales Officer
                  </Link>
                </Menu.Item>
                <Menu.SubMenu
                  key="submenu"
                  title="Agency"
                  icon={<PartitionOutlined />}
                >
                  <Menu.Item>
                    <Link className="text-decoration-none" to="/agency">
                      Agency
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link className="text-decoration-none" to="/agencytarget">
                      Target
                    </Link>
                  </Menu.Item>
                </Menu.SubMenu>
                <Menu.SubMenu
                  key="submenu3"
                  title="Shop"
                  icon={<ShopOutlined />}
                >
                  <Menu.Item>
                    <Link className="text-decoration-none" to="/shop">
                      Shop
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link className="text-decoration-none" to="/shopGroup">
                      Shop Group
                    </Link>
                  </Menu.Item>
                </Menu.SubMenu>
              </>
            )}
            {userRole === "agency" && (
              <Menu.Item icon={<InboxOutlined />}>
                <Link className="text-decoration-none" to="/product">
                  Product
                </Link>
              </Menu.Item>
            )}
            {/* ----------------------------------------------------------------------------------------------------------------------- */}

            {userRole === "agency" && (
              <Menu.Item icon={<PartitionOutlined />}>
                <Link className="text-decoration-none" to="/agencytarget">
                  Target
                </Link>
              </Menu.Item>
            )}

            {/* ----------------------------------------------------------------------------------------------------------------------- */}
            <Menu.Item key="salesman" icon={<TeamOutlined />}>
              <Link className="text-decoration-none" to="/salesman">
                Sales Person
              </Link>
            </Menu.Item>
            {/* ----------------------------------------------------------------------------------------------------------------------- */}
            <Menu.Item key="deliveryman" icon={<CarOutlined />}>
              <Link className="text-decoration-none" to="/deliveryman">
                Delivery Person
              </Link>
            </Menu.Item>
            <Menu.Item key="dailyroute" icon={<BookOutlined />}>
              <Link className="text-decoration-none" to="/dailyroute">
                Route
              </Link>
            </Menu.Item>

            {userRole === "agency" && (
              <Menu.Item icon={<ShopOutlined />}>
                <Link className="text-decoration-none" to="/shop">
                  Shop
                </Link>
              </Menu.Item>
            )}

            <Menu.SubMenu key="submenu2" title="Stock" icon={<StockOutlined />}>
              <Menu.Item>
                <Link className="text-decoration-none" to="/stock">
                  Stock
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link className="text-decoration-none" to="/purchase-bill">
                  Purchase Bill
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link className="text-decoration-none" to="/stockhistory">
                  Stock History
                </Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.Item key="order" icon={<ShoppingCartOutlined />}>
              <Link className="text-decoration-none" to="/order">
                Order
              </Link>
            </Menu.Item>

            {userRole === "admin" && (
              <Menu.SubMenu
                key="submenu1"
                title="Refrigerator"
                icon={<HddOutlined />}
              >
                <Menu.Item>
                  <Link className="text-decoration-none" to="/freeze">
                    Refrigerator
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link className="text-decoration-none" to="/freeze-booking">
                    Refrigerator Booking
                  </Link>
                </Menu.Item>
              </Menu.SubMenu>
            )}

            {userRole === "agency" && (
              <>
                <Menu.Item icon={<CameraOutlined />}>
                  <Link className="text-decoration-none" to="/photogallery">
                    Gallery
                  </Link>
                </Menu.Item>
              </>
            )}
            {userRole === "admin" && (
              <Menu.Item icon={<ExclamationOutlined />}>
                <Link className="text-decoration-none" to="/reason">
                  Reason
                </Link>
              </Menu.Item>
            )}
            <Menu.SubMenu key="submenu4" title="Report" icon={<ShopOutlined />}>
              <Menu.Item>
                <Link className="text-decoration-none" to="/report">
                  SalesMan Report
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link
                  className="text-decoration-none"
                  to="/dailypurchasereport"
                >
                  Daily Purchase Report
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link className="text-decoration-none" to="/godownstock">
                  Godown Stock
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link
                  className="text-decoration-none"
                  to="/perdaysalebillreport"
                >
                  Per Day Sale Bill Report
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link
                  className="text-decoration-none"
                  to="/routewisesalereport"
                >
                  Route Wise Sale Report
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link className="text-decoration-none" to="/itemwisesalereport">
                  Item Wise Sale Report
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link className="text-decoration-none" to="/zerobillingreport">
                  Zero Billing Report
                </Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.Item key="attandance" icon={<LaptopOutlined />}>
              <Link className="text-decoration-none" to="/attandance">
                Attandence
              </Link>
            </Menu.Item>

            {userRole === "admin" && (
              <>
                <Menu.SubMenu
                  key="photoGallery"
                  title="Gallery"
                  icon={<CameraOutlined />}
                >
                  <Menu.Item>
                    <Link className="text-decoration-none" to="/events">
                      Event
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link className="text-decoration-none" to="/photogallery">
                      Gallery
                    </Link>
                  </Menu.Item>
                </Menu.SubMenu>
              </>
            )}

            <Menu.Item key="scheme" icon={<LaptopOutlined />}>
              <Link className="text-decoration-none" to="/scheme">
                Scheme
              </Link>
            </Menu.Item>

            {userRole === "admin" && (
              <>
                <Menu.Item key="notification" icon={<NotificationOutlined />}>
                  <Link className="text-decoration-none" to="/notification">
                    Notification
                  </Link>
                </Menu.Item>
              </>
            )}

            <Menu.Item key="complain" icon={<LaptopOutlined />}>
              <Link className="text-decoration-none" to="/complain">
                Complain
              </Link>
            </Menu.Item>
            <Menu.Item key="survey" icon={<LaptopOutlined />}>
              <Link className="text-decoration-none" to="/survey">
                Survey
              </Link>
            </Menu.Item>

            {userRole === "admin" && (
              <>
                <Menu.Item key="menumaster" icon={<LaptopOutlined />}>
                  <Link className="text-decoration-none" to="/menumaster">
                    Menu Master
                  </Link>
                </Menu.Item>
              </>
            )}
          </Menu>
        </Sider>
        <Content
          style={{
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </>
  );
};
export default AdminLayout;
