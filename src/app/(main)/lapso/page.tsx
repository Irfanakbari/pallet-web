"use client";
import React, { useEffect, useState } from "react";
import { BiRefresh } from "react-icons/bi";
import { Table } from "antd";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import useTabStore, { TabStore } from "@/app/context/Tab/TabStore";
import useStore from "@/app/context/Tab/useStore";
import dayjs from "dayjs";

export default function LapSo() {
  const [data, setData] = useState<{dataStockOpname: any[]}>({
    dataStockOpname: [],
  })
  const tabStore : TabStore| any = useStore(useTabStore, (state) => state)
  const [selectedRow, setSelectedRow] = useState<any>({})
  const [loading1, setLoading] = useState<boolean>(true)
  const axiosInstance = useAxiosAuth()


  useEffect(() => {
    setLoading(false)
    tabStore?.addTab({
      label: 'Laporan SO',
      path: '/lapso',
      id: 'Laporan SO'
    })
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/pallet/laporan/opname',{
        // id: 'lap-so',
        cache: false
      })
      setData({
        ...data,
        dataStockOpname: response.data,
      })
    } catch (error) {
      // showErrorToast('Data Gagal Diambil');
    } finally {
      setLoading(false)
    }
  };




  const expandedRowRender = (record: any) => {
    const columns = [
      {
        title: 'Part Name',
        dataIndex: 'part',
        key: 'part',
      },
      {
        title: 'Terdata Di Sistem',
        dataIndex: 'stok_sistem_part',
        key: 'stok_sistem_part',
      },
      {
        title: 'Jumlah Aktual',
        dataIndex: 'stok_aktual_part',
        key: 'stok_aktual_part'
      },
      {
        title: 'Selisih Total',
        dataIndex: 'selisih_part',
        key: 'selisih_part',
        render: (selisih: any) => {
          const backgroundColor = selisih > 0 ? 'bg-orange-500 text-white' : selisih < 0 ? 'bg-red-500 text-white' : '';

          return (
            <div className={`rounded px-2 py-1 ${backgroundColor}`}>{selisih}</div>
          );
        },
      }
    ];
    return <Table bordered={true}
                  columns={columns} dataSource={record.data} pagination={false}/>;
  };
  const expandedRowRender2 = (record: any) => {
    const columns = [
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
      },
      {
        title: 'Terdata Di Sistem',
        dataIndex: 'stok_sistem_department',
        key: 'stok_sistem_department',
      },
      {
        title: 'Jumlah Aktual',
        dataIndex: 'stok_aktual_department',
        key: 'stok_aktual_department',
      },
      {
        title: 'Selisih Total',
        dataIndex: 'selisih_department',
        key: 'selisih_department',
        render: (selisih: any) => {
          const backgroundColor = selisih > 0 ? 'bg-orange-500 text-white' : selisih < 0 ? 'bg-red-500 text-white' : '';

          return (
            <div className={`rounded px-2 py-1 ${backgroundColor}`}>{selisih}</div>
          );
        },
      }
    ];
    return <Table
      bordered={true}
      columns={columns} rowKey={'department'} dataSource={record.data} pagination={false} expandable={{
      expandedRowRender: (record) => expandedRowRender(record),
    }}/>;
  };

  const columns = [
    {
      title: 'Kode SO',
      dataIndex: 'id_so',
      key: 'id_so',
    },
    {
      title: 'Keterangan',
      dataIndex: 'catatan',
      key: 'catatan',
    },
    {
      title: 'Tanggal Mulai',
      dataIndex: 'tanggal_mulai',
      key: 'tanggal_mulai',
      render: (_: any, record: any) => {
        return record['tanggal_mulai']
          ? dayjs(record['tanggal_mulai']).locale('id').format('DD MMMM YYYY HH:mm')
          : '-'
      }
    },
    {
      title: 'Tanggal Tutup',
      dataIndex: 'tanggal_akhir',
      key: 'tanggal_akhir',
      render: (_: any, record: any) => {
        return record['tanggal_akhir']
          ? dayjs(record['tanggal_akhir']).locale('id').format('DD MMMM YYYY HH:mm')
          : '-'
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Sudah Di Hitung',
      dataIndex: 'sudah_dihitung',
      key: 'sudah_dihitung',
    },
    {
      title: 'Belum Di Hitung',
      dataIndex: 'belum_dihitung',
      key: 'belum_dihitung',
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      let allParts: any = [];

      selectedRows[0].data.forEach((departmentData: any) => {
        departmentData.data.forEach((partData: any) => {
          allParts.push({
            name: partData.part,
            stok_aktual_part: partData.stok_aktual_part,
            stok_sistem_part: partData.stok_sistem_part,
            selisih_part: partData.selisih_part
          });
        });
      });
      setSelectedRow({
        so_id: selectedRows[0]['id_so'],
        data: allParts
      })
    },
  };

  return (
    <>
      <div className={`bg-white h-full flex flex-col`}>
        <div className="w-full bg-base py-0.5 px-1 text-white flex flex-row">
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
              rowSelection={{
                type: 'radio',
                ...rowSelection,
              }}
              bordered
              // components={{
              //   body: {
              //     cell: EditableCell,
              //   },
              // }}
              scroll={{
                y: "66vh"
              }}
              rowKey={'id_so'} columns={columns} dataSource={data.dataStockOpname} size={'small'}
              // rowClassName="editable-row"
              expandable={{
                expandedRowRender: (record) => expandedRowRender2(record),
              }}
              pagination={{
                hideOnSinglePage: true
              }}
            />
        </div>
      </div>
    </>
  );
}


