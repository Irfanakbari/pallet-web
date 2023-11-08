"use client";
import React, { useState } from "react";
import { BarConfig, Column } from "@ant-design/plots";
import { Spin } from "antd";

const GroupBar = ({data} : {data: any}) => {
  const [loading, setLoading] = useState(true)
  const config: BarConfig = {
    data,
    animation: false,
    loading: loading,
    loadingTemplate: <Spin/>,
    // isGroup: true,
    isStack: true,
    xField: 'label',
    yField: 'value',
    xAxis:{
      label: {
        autoEllipsis:true,
        autoHide: true,
        style: {
          fontSize: 10,
        },
        autoRotate: true
      },
      position: 'bottom'
    },
    marginRatio: 0,
    autoFit: true,
    /** 自定义颜色 */
    color: ['#FF6961', '#77DD77', '#6495ED'],
    seriesField: 'type',


  };
  return (
    <Column {...config} onReady={()=>setLoading(false)} />)
};

export default GroupBar