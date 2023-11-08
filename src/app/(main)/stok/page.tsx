"use client";
import React, { useEffect, useState } from "react";
import { BiRefresh } from "react-icons/bi";
import { Form, Table } from "antd";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import useTabStore, { TabStore } from "@/app/context/Tab/TabStore";
import useStore from "@/app/context/Tab/useStore";
import PrintLayout from "@/app/components/Pages/Laporan/Stok/PrintLayout";

export default function Stok() {
  const [data, setData] = useState<{dataStok: any}>({
    dataStok: []
  })
  const tabStore : TabStore| any = useStore(useTabStore, (state) => state)

  const [loading1, setLoading] = useState<boolean>(true)
  const axiosInstance = useAxiosAuth()


  useEffect(() => {
    setLoading(false)
    tabStore?.addTab({
      label: 'Laporan Stok',
      path: '/stok',
      id: 'Laporan Stok'
    })
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/pallet/laporan/stok',{
        // id: 'list-stok',
        cache: false
      })
      setData({
        ...data,
        dataStok: response.data,
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
      dataIndex: 'id',
      width: '5%',
      render: (_: any, __: any, index: any) => index + 1
    },
    {
      title: 'Nama Part',
      dataIndex: 'part',
      sorter: (a: any, b: any) => a.part.localeCompare(b.part),
    },
    {
      title: 'Tersedia',
      dataIndex: 'tersedia',

    },
    {
      title: 'RiwayatScan',
      dataIndex: 'maintenance',
    },
    {
      title: 'Keluar',
      dataIndex: 'keluar',

    },
    {
      title: 'Total Stok',
      dataIndex: 'total',
    },
  ];

  return (
    <>
      <div className={`bg-white h-full flex flex-col`}>
        <div className="w-full bg-base py-0.5 px-1 text-white flex flex-row">
          <PrintLayout data={data.dataStok} />
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
              rowKey={'kode'} columns={columns} dataSource={data.dataStok} size={'small'}
              rowClassName="editable-row"
              summary={() => {
                let total = 0;
                let tersedia = 0;
                let keluar = 0;
                let maintenance = 0;


                data.dataStok.forEach((data: any) => {
                  total += data.total
                  tersedia += data.tersedia;
                  keluar += data.keluar;
                  maintenance += data.maintenance;
                });
                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>{tersedia}</Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>{maintenance}</Table.Summary.Cell>
                      <Table.Summary.Cell index={4}>{keluar}</Table.Summary.Cell>
                      <Table.Summary.Cell index={5}>{total}</Table.Summary.Cell>

                    </Table.Summary.Row>
                  </Table.Summary>
                )
              }}
              pagination={false}/>
        </div>
      </div>
    </>
  );
}


