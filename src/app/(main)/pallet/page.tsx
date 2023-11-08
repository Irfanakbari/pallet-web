"use client";
import React, { useEffect, useState } from "react";
import { BiEdit, BiPlusMedical, BiQr, BiRefresh, BiSave, BiTrash, BiX } from "react-icons/bi";
import { Button, Form, Input, Popconfirm, Popover, QRCode, Space, Table } from "antd";
import { useForm } from "react-hook-form";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import useTabStore, { TabStore } from "@/app/context/Tab/TabStore";
import useStore from "@/app/context/Tab/useStore";
import EditableCell, { DataPallet, Pallet } from "@/app/components/Pages/Master/Pallet/EditCell";
import { Vehicle } from "@/app/components/Pages/Master/Vehicle/EditCell";
import AddModalLayout from "@/app/components/Pages/Master/Pallet/AddModal";
import { SearchOutlined } from "@ant-design/icons";
import { Part } from "@/app/components/Pages/Master/Part/EditCell";
import { Customer } from "@/app/components/Pages/Master/Customer/EditCell";
import { Department } from "@/app/components/Pages/Master/Department/EditCell";
import { useSession } from "next-auth/react";
import { isAdmin, isSuper } from "@/lib/role";
import DeleteModal2 from "@/app/components/Pages/Master/Pallet/DeleteModal2";
import PrintAll from "@/app/components/Pages/Master/Pallet/Print/PrintAll";


export default function Pallet() {
  const {data:session} = useSession()
  const [data, setData] = useState<{dataPallet: Pallet, dataDepartment: Department[], dataPart: Part[], dataCustomer: Customer[],dataVehicle: Vehicle[]}>({
    dataPallet: {},
    dataPart: [],
    dataCustomer: [],
    dataVehicle: [],
    dataDepartment: [],
  })
  const [modal, setModal] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const tabStore : TabStore| any = useStore(useTabStore, (state) => state)
  const [selected, setSelected] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading1, setLoading] = useState<boolean>(true)
  const [filterParams, setFilterParams] = useState({
    search: '',
    customer: '',
    vehicle: '',
    part: '',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 30,
  });
  const isEditing = (record: any) => record.kode === editingKey;
  const {
    register,
    handleSubmit,
    reset
  } = useForm()
  const axiosInstance = useAxiosAuth()


  useEffect(() => {
    setLoading(false)
    tabStore?.addTab({
      label: 'Master Pallet',
      path: '/pallet',
      id: 'Master Pallet'
    })
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/pallet/pallets',{
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
        dataPallet: response.data,
        dataPart: response3.data,
        dataDepartment: response4.data
      })
    } catch (error) {
      // showErrorToast('Data Gagal Diambil');
    } finally {
      setLoading(false)
    }
  };


  const submitData = async (data: any) => {
    try {
      await axiosInstance.post('/pallet/pallets', {
        kode: data.kode,
        name: data.name,
        part: data.part,
        jenis: data.jenis,
        total: data.total
      },{
          cache: false
        }
      );
      // showSuccessToast('Data Berhasil Disimpan');

    } catch (error) {
      // showErrorToast('Data Gagal Disimpan');

    } finally {
      setModal(false)
      await fetchData();
    }
  };

  const deleteData = async (e: string) => {
    setConfirmLoading(true)
    try {
      await axiosInstance.delete(`/pallet/pallets/${e}`,{
        cache: false
      });
      // showSuccessToast('Data Berhasil Dihapus');
    } catch (error) {
      // showErrorToast('Data Gagal Dihapus');
    } finally {
      setConfirmLoading(false);
      await fetchData();
    }
  };

  const edit = (record: Partial<DataPallet> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', ...record });
    setEditingKey(record.kode!);
  };

  const onChange = (pagination: any, filters: any) => {
    setLoading(true)
    const searchParam = (filters?.kode && filters?.kode[0]) || '';
    const customerParam = (filters?.customer && filters?.customer[0]) || '';
    const vehicleParam = (filters?.vehicle && filters?.vehicle[0]) || '';
    const partParam = (filters?.part && filters?.part[0]) || '';
    setPagination(pagination)
    setFilterParams({
      customer: customerParam,
      vehicle: vehicleParam,
      part: partParam,
      search: searchParam
    })
    const url = `/pallet/pallets?search=${searchParam}&customer=${customerParam || ''}&vehicle=${vehicleParam || ''}&part=${partParam || ''}&page=${pagination.current}&limit=${pagination.pageSize}`;
    axiosInstance.get(url,{
      cache: false
    })
      .then(response => {
        setData({
          ...data,
          dataPallet: response.data
        });
      })
      .catch(() => {
        // showErrorToast("Gagal Fetch Data");
      })
      .finally(() => {
        setLoading(false);
      });

  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: any) => {
    try {
      const row = await form.validateFields();
      const newData: any = [...data.dataPallet?.data!];
      const index = newData.findIndex((item: any) => key === item.kode);
      if (index > -1) {
        const item: any = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        await axiosInstance.patch(`/pallet/pallets/${item.kode}`, row,{
          cache: false
        } );
        await fetchData();
        // showSuccessToast('Data Berhasil Diupdate');
      } else {
        newData.push(row);
        setData({
          ...data,
          dataPallet: newData
        });
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    } finally {
      setEditingKey('');
    }
  };

  const getColumnSearchProps = (dataIndex:string) => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, close}: {setSelectedKeys: any, selectedKeys: any, confirm: any, close: any}) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          placeholder={`Search ${dataIndex}`}
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
            onClick={() => confirm({
              closeDropdown: false,
            })}
          >
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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });
  const handleRowSelection = (selectedRowKeys: any, selectedRows: any) => {
    setSelected(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      width: 80,
      fixed: 'left',
      render: (_: any, __: any, index: any) => (data.dataPallet?.currentPage! - 1) * data.dataPallet?.limit! + index + 1
    },
    {
      title: 'Kode Pallet',
      dataIndex: 'kode',
      sorter: (a: any, b: any) => a.kode.localeCompare(b.kode),
      width: 150,
      fixed: 'left',
      ...getColumnSearchProps('kode'),

    },
    {
      title: 'Nama Pallet',
      dataIndex: 'name',
      width: 320,
      editable: true,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      width: 280,
      sorter: (a: DataPallet, b: DataPallet) => a.partEntity.vehicleEntity.customerEntity.kode.localeCompare(b.partEntity.vehicleEntity.customerEntity.kode),
      filters: data.dataCustomer.map((e: Customer )=> (
        {
          text: e.name,
          value: e.kode
        }
      )),
      filterMultiple: false,
      onFilter: (value: any, record: DataPallet) => record.partEntity.vehicleEntity.customerEntity.kode.indexOf(value) === 0,
      render: (_: any, record: DataPallet) => record.partEntity.vehicleEntity.customerEntity.kode + " - " + record.partEntity.vehicleEntity.customerEntity.name
    },
    {
      title: 'Vehicle',
      dataIndex: 'vehicle',
      width: 250,
      sorter: (a: DataPallet, b: DataPallet) => a.partEntity.vehicleEntity.kode.localeCompare(b.partEntity.vehicleEntity.kode),
      filterMultiple: false,
      filters: data.dataVehicle.map((e: Vehicle) => (
        {
          text: e.name,
          value: e.kode
        }
      )),
      onFilter: (value: any, record: DataPallet) => record.partEntity.vehicleEntity.kode.indexOf(value) === 0,
      render: (_: any, record: DataPallet) => record.partEntity.vehicleEntity.kode + " - " + record.partEntity.vehicleEntity.name
    },
    {
      title: 'Part',
      dataIndex: 'part',
      width: 300,
      sorter: (a: DataPallet, b: DataPallet) => a.partEntity.kode.localeCompare(b.partEntity.kode),
      filterMultiple: false,
      filters: data.dataPart.map((e: Part) => (
        {
          text: e.name,
          value: e.kode
        }
      )),
      onFilter: (value: any, record: DataPallet) => record.partEntity.kode.indexOf(value) === 0,
      render: (_: any, record: DataPallet) => record.partEntity.kode + " - " + record.partEntity.name
    },
    {
      title: 'Department',
      dataIndex: 'department',
      width: 300,
      filterMultiple: false,
      sorter: (a: DataPallet, b: DataPallet) => a.partEntity.vehicleEntity.department.localeCompare(b.partEntity.vehicleEntity.department),
      // filters: data.dataDepartment.map((e: Department) => (
      //   {
      //     text: e.name,
      //     value: e.kode
      //   }
      // )),
      onFilter: (value: any, record: DataPallet) => record.partEntity.vehicleEntity.departmentEntity.kode.indexOf(value) === 0,
      render: (_: any, record: DataPallet) => record.partEntity.vehicleEntity.departmentEntity.kode + " - " +record.partEntity.vehicleEntity.departmentEntity.name
    },
    {
      title: 'Aksi',
      dataIndex: 'operation',
      width: 400,
      render: (_: any, record: any) => {
        const editable = isEditing(record);

        return (
          <span>
                {editable ? (
                  <span>
                        <button onClick={() => save(record.kode)} style={{marginRight: 8}}>
                            <BiSave size={22} color="green"/>
                        </button>
                        <button onClick={cancel} style={{marginRight: 8}}>
                            <BiX size={22} color="red"/>
                        </button>
                    </span>
                ) : (
                  <span className="flex">
                        <Popover
                          content={() => (
                            <center>
                              <QRCode size={200} value={record.kode} bordered={false}/>
                              <span>{record.kode}</span>
                            </center>
                          )}
                        >
                            <span style={{marginRight: 8}}>
                                <BiQr size={22} color="green"/>
                            </span>
                        </Popover>
                    {
                      (isAdmin(session) || isSuper(session)) && <div>
                        <Popconfirm
                          title={`Apakah Anda yakin ingin menghapus ${record.kode}?`}
                          onConfirm={() => deleteData(record.kode)}
                          okType="primary"
                          okButtonProps={{loading: confirmLoading}}
                        >
                          <button>
                            <BiTrash size={22} color="red"/>
                          </button>
                        </Popconfirm>
                        <button
                          disabled={editingKey !== ''}
                          onClick={() => edit(record)}
                          style={{marginRight: 8}}
                        >
                          <BiEdit size={22} color="orange"/>
                        </button>
                      </div>
                    }
                    </span>
                )}
            </span>
        );
      }
    }
  ];


  const mergedColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleMultiDelete = async () => {
    setLoading(true)
    try {
      const palletsToDelete = selected.map((item: any) => item.kode); // Array of pallet codes to delete

      const response = await axiosInstance.post('/pallet/pallets/batch-delete', {
        palletsToDelete
      },{
        cache: false
      });

      if (response.data.success) {
        // showSuccessToast('Sukses Hapus Data');
      } else {
        // showErrorToast('Gagal Hapus Data');
      }
    } catch (error) {
      // showErrorToast('Gagal Hapus Data, Server Error');
    } finally {
      setSelected([]); // Clear selected items
      setSelectedRowKeys([])
      fetchData(); // Refresh or update the data after successful deletion
      setModalDelete(false)
    }
  };


  return (
    <>
      <div className={`bg-white h-full flex flex-col`}>
        {modal && (
          <AddModalLayout close={() => setModal(false)} onSubmit={handleSubmit(submitData)}
                          register={register} parts={data.dataPart}/>)}
        {modalDelete && (
          <DeleteModal2 data={selected} setCloseModal={setModalDelete} action={handleMultiDelete}/>)}
        <div className="w-full bg-base py-0.5 px-1 text-white flex flex-row">
          <div
            onClick={() => setModal(true)}
            className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer"
          >
            <BiPlusMedical size={12}/>
            <p className="text-white font-bold text-sm">Baru</p>
          </div>

          <div
            onClick={fetchData}
            className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer"
          >
            <BiRefresh size={12}/>
            <p className="text-white font-bold text-sm">Refresh</p>
          </div>
          {isSuper(session) && isAdmin(session) ? null : (selected.length > 0) && (
            <div
              onClick={() => setModalDelete(true)}
              className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer`}>
              <BiTrash size={12}/>
              <p className={`text-white font-bold text-sm`}>Hapus</p>
            </div>
          )}
          {
            selected.length > 0 && <PrintAll data={selected ?? []}/>
          }
        </div>
        <div className="w-full bg-white p-2 flex-grow overflow-hidden">
          <Form form={form} component={false}>
            <Table
              loading={loading1}
              bordered
              rowSelection={{
                // checkStrictly:true,
                selectedRowKeys,
                onChange: handleRowSelection,
                preserveSelectedRowKeys: true
              }}
              components={{

                body: {
                  cell: EditableCell,
                },
              }}
              scroll={{
                y: "66vh"
              }}
              rowKey={'kode'}
              onChange={onChange}
              columns={mergedColumns}
              dataSource={data.dataPallet.data}
              size={'small'}
              rowClassName="editable-row"
              pagination={{
                total: data.dataPallet.totalData,
                defaultPageSize: 30,
                pageSizeOptions: [30, 50, 100],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
              }}/>          </Form>
        </div>
      </div>
    </>
  );
}


