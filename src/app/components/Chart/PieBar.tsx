"use client";
import { Pie, PieConfig } from "@ant-design/plots";
import React, { useState } from "react";
import { Spin } from "antd";

const BarPie = ({data}:{data: any}) => {
  const [loading, setLoading] = useState(true)

  const config: PieConfig = {
    appendPadding: 10,
    data,
    loading: loading,
    animation: false,
    autoFit: true,
    loadingTemplate: <Spin/>,
    angleField: 'Total',
    colorField: 'department',
    radius: 0.7,
    color: ['#ADD8E6','#FFC0CB','#98FB98'],
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} onReady={()=>setLoading(false)}  />;
};

export default BarPie