"use client";
import React, { useEffect, useState } from "react";
import { BiRefresh } from "react-icons/bi";
import { Button, DatePicker, Form, Input, Space, Table } from "antd";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import useTabStore, { TabStore } from "@/app/context/Tab/TabStore";
import useStore from "@/app/context/Tab/useStore";
import { Vehicle } from "@/app/components/Pages/Master/Vehicle/EditCell";
import { CalendarOutlined, SearchOutlined } from "@ant-design/icons";
import { Part } from "@/app/components/Pages/Master/Part/EditCell";
import { Customer } from "@/app/components/Pages/Master/Customer/EditCell";
import { Department } from "@/app/components/Pages/Master/Department/EditCell";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";


export default function History() {
  const {data:session} = useSession()
  const [data, setData] = useState<{ dataDepartment: Department[], dataPart: Part[], dataCustomer: Customer[],dataVehicle: Vehicle[], dataHistory: any}>({
    dataPart: [],
    dataCustomer: [],
    dataVehicle: [],
    dataDepartment: [],
    dataHistory: {}
  })
  const {RangePicker} = DatePicker;
  const tabStore : TabStore| any = useStore(useTabStore, (state) => state)
  const [form] = Form.useForm();
  const [loading1, setLoading] = useState<boolean>(true)
  const [filterParams, setFilterParams] = useState({
    search: '',
    customer: '',
    vehicle: '',
    part: '',
    formattedKeluarStart: '',
    formattedKeluarEnd: '',
    formattedMasukStart: '',
    formattedMasukEnd: '',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 30,
  });
  const axiosInstance = useAxiosAuth()


  useEffect(() => {
    setLoading(false)
    tabStore?.addTab({
      label: 'Riwayat Orders',
      path: '/history',
      id: 'Riwayat Orders'
    })
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/pallet/histories?page=1',{
        cache: false
      })
      const response1 = await axiosInstance.get('/pallet/customers',{
        id: 'list-customer',
        // cache: false
      })
      const response2 = await axiosInstance.get('/pallet/vehicles',{
        id: 'list-vehicle',
        // cache: false
      })
      const response3 = await axiosInstance.get('/pallet/parts',{
        id: 'list-part',
        // cache: false
      });
      const response4 = await axiosInstance.get('/pallet/departments',{
        id: 'list-department',
        // cache: false
      });
      setData({
        ...data,
        dataCustomer: response1.data,
        dataVehicle: response2.data,
        dataHistory: response.data,
        dataPart: response3.data,
        dataDepartment: response4.data
      })
    } catch (error) {
      // showErrorToast('Data Gagal Diambil');
    } finally {
      setLoading(false)
    }
  };

  

  const onChange = (pagination: any, filters: any) => {
    setLoading(true)
    const searchParam = (filters['id_pallet'] && filters['id_pallet'][0]) || '';
    const keluarStart = (filters?.keluar && filters?.keluar[0][0]) || '';
    const keluarEnd = (filters?.keluar && filters?.keluar[0][1]) || '';
    const masukStart = (filters['masuk'] && filters['masuk'][0][0]) || '';
    const masukEnd = (filters['masuk'] && filters['masuk'][0][1]) || '';
    const customerParam = (filters?.customer && filters?.customer[0]) || '';
    const vehicleParam = (filters?.vehicle && filters?.vehicle[0]) || '';
    const partParam = (filters?.part && filters?.part[0]) || '';
    // Parse the original date strings
    // Parse the original date strings
    const parsedKeluarStart = dayjs(keluarStart);
    const parsedKeluarEnd = dayjs(keluarEnd);
    const parsedMasukStart = dayjs(masukStart);
    const parsedMasukEnd = dayjs(masukEnd);

    const formattedKeluarStart = parsedKeluarStart.isValid() ? parsedKeluarStart.format('YYYY-MM-DD') : '';
    const formattedKeluarEnd = parsedKeluarEnd.isValid() ? parsedKeluarEnd.format('YYYY-MM-DD') : '';
    const formattedMasukStart = parsedMasukStart.isValid() ? parsedMasukStart.format('YYYY-MM-DD') : '';
    const formattedMasukEnd = parsedMasukEnd.isValid() ? parsedMasukEnd.format('YYYY-MM-DD') : '';
    setPagination(pagination)
    setFilterParams({
      customer: customerParam,
      vehicle: vehicleParam,
      part: partParam,
      search: searchParam  ,
      formattedKeluarStart,
      formattedKeluarEnd  ,
      formattedMasukStart    ,
      formattedMasukEnd
    })
    const url = `/pallet/histories?search=${searchParam}&customer=${customerParam || ''}&vehicle=${vehicleParam || ''}&part=${partParam || ''}&keluarStart=${formattedKeluarStart || ''}&keluarEnd=${formattedKeluarEnd || ''}&masukStart=${formattedMasukStart || ''}&masukEnd=${formattedMasukEnd || ''}&page=${pagination.current}&limit=${pagination.pageSize}`;
    axiosInstance.get(url,{
      cache: false
    })
      .then(response => {
        setData({
          ...data,
          dataHistory: response.data
        });
      })
      .catch(() => {
        // showErrorToast("Gagal Fetch Data");
      })
      .finally(() => {
        setLoading(false);
      });

  };
  
  

  const columns: any = [
    {
      title: '#',
      dataIndex: 'index',
      width: 100,
      fixed: 'left',
      render: (_: any, __: any, index: any) => (data.dataHistory.currentPage - 1) * data.dataHistory.limit + index + 1
    },
    {
      title: 'Kode Orders',
      dataIndex: 'id_pallet',
      fixed: 'left',
      width: 200,
      filterDropdown: ({setSelectedKeys, selectedKeys, confirm, close}:  {setSelectedKeys: any, selectedKeys: any, confirm: any, clearFilters: any, close:any}) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            placeholder={`Search Kode`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Space>
            <Button
              type={'primary'}
              size="small"
              style={{
                width: 90,
              }}
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
              }}>
              Search
            </Button>
            <Button
              style={{
                width: 90,
              }}
              size="small"
              onClick={() => {
                close();
              }}
            >
              Close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: any) => (
        <SearchOutlined
          style={{
            color: filtered ? '#1890ff' : undefined,
          }}
        />
      ),
      onFilter: (value: any, record: any) =>
        record['id_pallet'].toString().toLowerCase().includes(value.toLowerCase()),
      sorter: (a: any, b: any) => a['id_pallet'].localeCompare(b['id_pallet']),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      sorter: (a: any, b: any) => {
        const customerA = a['palletEntity']['partEntity']['vehicleEntity']?.customer || '';
        const customerB = b['palletEntity']['partEntity']['vehicleEntity']?.customer || '';
        return customerA.localeCompare(customerB);
      },
      filters: data.dataCustomer.map(e => ({
        text: e.name,
        value: e.kode
      })),
      width: 250,
      filterMultiple: false,
      onFilter: (value: any, record: any) => (record['palletEntity']['partEntity']['vehicleEntity'].customer || '').indexOf(value) === 0,
      render: (_: any, record: any) => {
        const customer = record['palletEntity']['partEntity']['vehicleEntity']['customerEntity'];
        return customer ? customer['kode'] + ' - ' + customer['name'] : '-';
      }
    },
    {
      title: 'Vehicle',
      dataIndex: 'vehicle',
      sorter: (a: any, b: any) => {
        const vehicleA = a['palletEntity']['partEntity'].vehicle || '';
        const vehicleB = b['palletEntity']['partEntity'].vehicle || '';
        return vehicleA.localeCompare(vehicleB);
      },
      filterMultiple: false,
      filters: data.dataVehicle.map(e => ({
        text: e.name,
        value: e.kode
      })),
      width: 300,
      onFilter: (value: any, record: any) => (record['palletEntity']['partEntity']?.vehicle || '').indexOf(value) === 0,
      render: (_: any, record: any) => {
        const vehicle = record['palletEntity']['partEntity']['vehicleEntity'];
        return vehicle ? vehicle['kode'] + ' - ' + vehicle['name'] : '-';
      }
    },
    {
      title: 'Part',
      dataIndex: 'part',
      sorter: (a: any, b: any) => {
        const partA = a['palletEntity']['partEntity'].kode || '';
        const partB = b['palletEntity']['partEntity'].kode || '';
        return partA.localeCompare(partB);
      },
      filterMultiple: false,
      width: 320,
      filters: data.dataPart.map(e => ({
        text: e.name,
        value: e.kode
      })),
      onFilter: (value: any, record: any) => (record['palletEntity']['partEntity'].kode || '').indexOf(value) === 0,
      render: (_: any, record: any) => {
        const part = record['palletEntity']['partEntity'];
        return part ? part['kode'] + ' - ' + part['name'] : '-';
      }
    },
    {
      title: 'Destinasi',
      dataIndex: 'destination',
      width: 160,
      sorter: (a: any, b: any) => {
        const destinationA = a.destination || '';
        const destinationB = b.destination || '';
        return destinationA.localeCompare(destinationB);
      },
      render: (_: any, record: any) => record.destination ?? '-'
    },
    {
      title: 'Keluar',
      dataIndex: 'keluar',
      width: 300,
      sorter: (a: any, b: any) => {
        // Convert the 'keluar' values to Date objects for comparison
        const dateA = a['keluar'] ? new Date(a['keluar']) : null;
        const dateB = b['keluar'] ? new Date(b['keluar']) : null;
        // Handle cases when one of the dates is null
        if (!dateA && dateB) return -1;
        if (dateA && !dateB) return 1;
        if (!dateA && !dateB) return 0;
        // Compare the dates
        return dateA!.getTime() - dateB!.getTime();
      },
      filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}: {setSelectedKeys: any, selectedKeys: any, confirm: any, clearFilters: any, close:any}) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <RangePicker
            style={{
              marginBottom: 8,
              width: "100%",
            }}
            value={selectedKeys[0]}
            onChange={newDateRange => {
              setSelectedKeys(newDateRange ? [newDateRange] : [])
            }}
          />
          <Space>
            <Button
              type="primary"
              size="small"
              style={{
                width: 90,
              }}
              onClick={() => {
                confirm({
                  closeDropdown: true,
                });
              }}
            >
              Filter
            </Button>
            <Button
              onClick={() => clearFilters}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: any) => (
        <CalendarOutlined
          style={{
            color: filtered ? '#1890ff' : undefined,
          }}
        />
      ),
      render: (_: any, record: any) => {
        return record['keluar']
          ? dayjs(record['keluar']).locale('id').format('DD MMMM YYYY HH:mm')
          : '-'
      }
    },
    {
      title: 'Operator Out',
      dataIndex: 'user_out',
      width: 150,
      sorter: (a: any, b: any) => a['user_out']?.localeCompare(b['user_out']),
      render: (_: any, record: any) => record['user_out'] ?? '-'
    },
    {
      title: 'Masuk',
      dataIndex: 'masuk',
      width: 300,
      sorter: (a: any, b: any) => {
        // Convert the 'keluar' values to Date objects for comparison
        const dateA = a['masuk'] ? new Date(a['masuk']) : null;
        const dateB = b['masuk'] ? new Date(b['masuk']) : null;
        // Handle cases when one of the dates is null
        if (!dateA && dateB) return -1;
        if (dateA && !dateB) return 1;
        if (!dateA && !dateB) return 0;
        // Compare the dates
        return dateA?.getTime()! - dateB?.getTime()!;
      },
      filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}: {setSelectedKeys: any, selectedKeys: any, confirm: any, clearFilters: any, close:any}) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <RangePicker
            style={{
              marginBottom: 8,
              width: "100%",
            }}
            value={selectedKeys[0]}
            onChange={(newDateRange: any) => {
              setSelectedKeys(newDateRange ? [newDateRange] : [])
            }}
          />
          <Space>
            <Button
              type="primary"
              size="small"
              style={{
                width: 90,
              }}
              onClick={() => {
                confirm({
                  closeDropdown: true,
                });
              }}
            >
              Filter
            </Button>
            <Button
              onClick={() => clearFilters}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: any) => (
        <CalendarOutlined
          style={{
            color: filtered ? '#1890ff' : undefined,
          }}
        />
      ),
      render: (_: any, record: any) => {
        return record['masuk']
          ? dayjs(record['masuk']).locale('id').format('DD MMMM YYYY HH:mm')
          : '-'
      }
    },
    {
      title: 'Operator In',
      dataIndex: 'user_in',
      width: 150,
      sorter: (a: any, b: any) => {
        const userInA = a['user_in'] || '';
        const userInB = b['user_in'] || '';
        return userInA.localeCompare(userInB);
      },
      render: (_: any, record: any) => record['user_in'] ?? '-'
    }
  ];

  

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
              bordered
              // rowSelection={{
              //   // checkStrictly:true,
              //   selectedRowKeys,
              //   onChange: handleRowSelection,
              //   preserveSelectedRowKeys: true
              // }}
              scroll={{
                y: "66vh"
              }}
              rowKey={'id'}
              onChange={onChange}
              columns={columns}
              dataSource={data.dataHistory.data}
              size={'small'}
              rowClassName="editable-row"
              pagination={{
                total: data.dataHistory.totalData,
                defaultPageSize: 30,
                pageSizeOptions: [30, 50, 100],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
              }}/>        
        </div>
      </div>
    </>
  );
}


