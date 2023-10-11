import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const Chart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 10, left: 20, right: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name"></XAxis>
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="name" fill="#a62239"></Bar>
        <Bar dataKey="price" fill="#a62239"></Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
