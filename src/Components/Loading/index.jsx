import React from "react";
import { Spin } from "antd";
const Loading = () => (
  <div className="example" style={{ display: "flex", justifyContent: "center",alignItems:'center',height:'70vh' }}>
    <Spin />
  </div>
);
export default Loading;
