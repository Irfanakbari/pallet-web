"use client";
import React, { useEffect, useState } from "react";
import { BiRefresh } from "react-icons/bi";
import { Table } from "antd";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import useTabStore, { TabStore } from "@/app/context/Tab/TabStore";
import useStore from "@/app/context/Tab/useStore";
import PrintMaintenance from "@/app/components/Pages/Laporan/Maintenance/PrintLayout";
import {Part} from "@/app/components/Pages/Master/Part/EditCell";
import {Vehicle} from "@/app/components/Pages/Master/Vehicle/EditCell";
import {Customer} from "@/app/components/Pages/Master/Customer/EditCell";

export default function Maintenance() {
  const [data, setData] = useState<{dataMaintenance: any, dataPart: Part[]| [], dataCustomer: Customer[]| [], dataVehicle: Vehicle[]|[]}>({
    dataMaintenance: [],
    dataPart: [],
    dataVehicle: []   ,
    dataCustomer: []
  })
  const tabStore : TabStore| any = useStore(useTabStore, (state) => state)
  const [loading1, setLoading] = useState<boolean>(true)
  const axiosInstance = useAxiosAuth()


  useEffect(() => {
    setLoading(false)
    tabStore?.addTab({
      label: 'Laporan Maintenance',
      path: '/maintenance',
      id: 'Laporan Maintenance'
    })
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/pallet/laporan/maintenance',{
        // id: 'list-stok',
        cache: false
      })
      const response2 = await axiosInstance.get('/pallet/vehicles',{
        id: 'list-vehicle',
        // cache: false
      })
      const response3 = await axiosInstance.get('/pallet/parts',{
        id: 'list-part',
        // cache: false
      });
      const response4 = await axiosInstance.get('/pallet/customers',{
        id: 'list-customer',
        // cache: false
      });
      setData({
        ...data,
        dataMaintenance: response.data,
        dataPart: response3.data,
        dataVehicle: response2.data     ,
        dataCustomer: response4.data
      })
    } catch (error) {
      // showErrorToast('Data Gagal Diambil');
    } finally {
      setLoading(false)
    }
  };



  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      width: '5%',
      render: (_: any, __: any, index: any) => index + 1
    },
    {
      title: 'Kode Pallet',
      dataIndex: 'kode',
      sorter: (a:any, b:any) => a.kode.localeCompare(b.kode),
      width: '30%'
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      sorter: (a:any, b:any) => a.customer.localeCompare(b.customer),
      filters: data.dataCustomer.map((e:Customer) => (
          {
            text: e.name,
            value: e.kode
          }
      )),
      filterMultiple: false,
      onFilter: (value:any, record:any) => record.customer.indexOf(value) === 0,
      render: (_: any, record: any) => record.customer + " - " + record['customerEntity'].name
    },
    {
      title: 'Vehicle',
      dataIndex: 'vehicle',
      sorter: (a:any, b:any) => a.vehicle.localeCompare(b.vehicle),
      filterMultiple: false,
      filters: data.dataVehicle.map(e => (
          {
            text: e.name,
            value: e.kode
          }
      )),
      onFilter: (value:any, record:any) => record.vehicle.indexOf(value) === 0,
      render: (_: any, record: any) => record.vehicle + " - " + record['vehicleEntity'].name
    },
    {
      title: 'Part',
      dataIndex: 'part',
      sorter: (a:any, b:any) => a.part.localeCompare(b.part),
      filterMultiple: false,
      filters: data.dataPart.map((e: Part) => (
          {
            text: e.name,
            value: e.kode
          }
      )),
      onFilter: (value:any, record:any) => record.part.indexOf(value) === 0,
      render: (_: any, record: any) => record.part + " - " + record['partEntity'].name
    },
  ];

  return (
    <>
      <div className={`bg-white h-full flex flex-col`}>
        <div className="w-full bg-base py-0.5 px-1 text-white flex flex-row">
          <PrintMaintenance data={data.dataMaintenance} />
          <div
            onClick={fetchData}
            className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer"
          >
            <BiRefresh size={12}/>
            <p className="text-white font-bold text-sm">Refresh</p>
          </div>
        </div>
        <div className="w-full bg-white p-2 flex-grow overflow-hidden">
            <Table
              loading={loading1}
              bordered
              scroll={{
                y: "66vh"
              }}
              rowKey={'kode'} columns={columns} dataSource={data.dataMaintenance} size={'small'}
              rowClassName="editable-row"
              pagination={{
                defaultPageSize: 50,
                defaultCurrent: 1,
                hideOnSinglePage: true
              }}/>
        </div>
      </div>
    </>
  );
}


