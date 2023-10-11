import {
    Card,
    Col,
    Row,
    Table,
} from "antd";
import axios from "axios";
const   ZeroBillingReport = () => { 

    const tableData = [
        {
          key: "1",
          role: "Product",
          total_applicants: 2000,
          applicants: 200,
          rejected_applicants: 2,
        },
        {
          key: "2",
          role: "Agency",
          total_applicants: 90,
          applicants: 13,
          rejected_applicants: 2,
        },
        {
          key: "3",
          role: "Distributor Person",
          total_applicants: 600,
          applicants: 180,
          rejected_applicants: 5,
        },
        {
          key: "4",
          role: "Shop",
          total_applicants: 1800,
          applicants: 1250,
          rejected_applicants: 20,
        },
        {
          key: "4",
          role: "Salesman Person",
          total_applicants: 20000,
          applicants: 18000,
          rejected_applicants: 60,
        },
      ];
    
      const columns = [
        {
          title: "Role",
          dataIndex: "role",
          key: "role",
          render(text, record) {
            return {
              props: {
                style: { fontWeight: 600 },
              },
              children: <div>{text}</div>,
            };
          },
        },
        {
          title: "Total Applicants",
          dataIndex: "total_applicants",
          key: "total_applicants",
          align: "center",
        },
        {
          title: "Applicants",
          dataIndex: "applicants",
          key: "applicants",
          align: "center",
        },
        {
          title: "Rejected Applicants",
          dataIndex: "rejected_applicants",
          key: "rejected_applicants",
          align: "center",
        },
      ];
    return (
        <>
            <Card
                className="m-2"
                title={
                    <div className="d-flex py-3">
                        <div className="col-md-6 fs-3 fw-bold">  Zero Billing Report</div>
                    </div>
                }
            >
           <Row className="mt-5" gutter={[16, 8]}>
        <Col md={24} lg={24}>        
          <Table columns={columns} dataSource={tableData} pagination={false} />
        </Col>
      </Row>
            </Card>
        </>
    );
};

export default ZeroBillingReport;
