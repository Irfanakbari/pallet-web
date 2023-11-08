"use client";
import React, { useEffect, useState } from "react";
import { BiDetail, BiEdit, BiPlusMedical, BiRefresh, BiSave, BiTrash, BiX } from "react-icons/bi";
import { Form, Popconfirm, Table } from "antd";
import { useForm } from "react-hook-form";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import useTabStore, { TabStore } from "@/app/context/Tab/TabStore";
import useStore from "@/app/context/Tab/useStore";
import dayjs from "dayjs";
import AddModalLayout from "@/app/components/Pages/Delivery/Delivery/AddModal";
import EditableCell, { Delivery } from "@/app/components/Pages/Delivery/Delivery/EditCell";
import { Destination } from "@/app/components/Pages/Master/Destination/EditCell";
import { Part } from "@/app/components/Pages/Master/Part/EditCell";
import DetailDelivery from "@/app/components/Pages/Delivery/Delivery/DetailDelivery";

export default function Delivery() {
  const [data, setData] = useState<{dataDelivery: any, dataDestination: Destination[], dataPart: Part[]}>({
    dataDelivery: [],
    dataDestination: [],
    dataPart: [],
  })
  const [selectedDelivery, setSelectedDelivery] = useState<string>('');
  const [modalDetail,setModalDetail] = useState(false)
  const [modal, setModal] = useState(false)
  const tabStore : TabStore| any = useStore(useTabStore, (state) => state)

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading1, setLoading] = useState<boolean>(true)
  const isEditing = (record: any) => record.id === editingKey;
  const {
    register,
    handleSubmit,
    reset    ,
    watch
  } = useForm()
  const axiosInstance = useAxiosAuth()


  useEffect(() => {
    setLoading(false)
    tabStore?.addTab({
      label: 'Data Delivery',
      path: '/delivery',
      id: 'Data Delivery'
    })
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/pallet/deliveries',{
        id: 'list-deliveries',
        // cache: false
      })
      const response2 = await axiosInstance.get('/pallet/destinations',{
        id: 'list-destinations',
        // cache: false
      })
      const response3 = await axiosInstance.get('/pallet/parts',{
        id: 'list-part',
      });
      setData({
        ...data,
        dataDelivery: response.data,
        dataPart: response3.data,
        dataDestination: response2.data
      })
    } catch (error) {
      // showErrorToast('Data Gagal Diambil');
    } finally {
      setLoading(false)
    }
  };


  const submitData = async (data: any) => {
    try {
      await axiosInstance.post('/pallet/deliveries', {
        ...data,
        total_pallet: parseInt(data.total_pallet)
      },{
        cache: {
          update: {
            'list-deliveries': 'delete'
          }
        }
      });
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
      await axiosInstance.delete(`/pallet/deliveries/${e}`,{
        cache: {
          update: {
            'list-deliveries': 'delete'
          }
        }
      });
      // showSuccessToast('Data Berhasil Dihapus');
    } catch (error) {
      // showErrorToast('Data Gagal Dihapus');
    } finally {
      setConfirmLoading(false);
      await fetchData();
    }
  };

  const edit = (record: Partial<any> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', ...record });
    setEditingKey(record.id!);
  };


  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: any) => {
    try {
      const row = await form.validateFields();
      const newData: any = [...data.dataDelivery];
      const index = newData.findIndex((item: any) => key === item.id);
      if (index > -1) {
        const item: any = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        await axiosInstance.patch(`/pallet/deliveries/${item.id}`, row, {
          cache: {
            update: {
              'list-deliveries': 'delete'
            }
          }
        });
        await fetchData();
        // showSuccessToast('Data Berhasil Diupdate');
      } else {
        newData.push(row);
        setData(newData);
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    } finally {
      setEditingKey('');
    }
  };


  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      width: '5%',
      fixed: 'left',
      render: (_: any, __: any, index: any) => index + 1
    },
    {
      title: 'Kode',
      dataIndex: 'id',
      fixed: 'left',
      width: 150,
      sorter: (a: any, b: any) => a.id.localeCompare(b.id),
      // width: '30%'
    },
    {
      title: 'Kode Delivery',
      dataIndex: 'kode_delivery',
      editable: true,
      width: 280,
      fixed: 'left',
      sorter: (a: any, b: any) => a.kode_delivery.localeCompare(b.kode_delivery),
      // width: '30%'
    },
    {
      title: 'Part',
      fixed: 'left',
      dataIndex: 'part',
      width: 280,
      sorter: (a: any, b: any) => a.part.localeCompare(b.part),
      // width: '30%'
      render: (_: any,record: Delivery)=> record.part +' - ' + record.partEntity.name
    },
    {
      title: 'Department',
      dataIndex: 'department',
      width: 200,

      sorter: (a: Delivery, b: Delivery) => a.partEntity.vehicleEntity.department.localeCompare(b.partEntity.vehicleEntity.department),
      // width: '30%'
      render: (_:any,record: Delivery)=> record.partEntity.vehicleEntity.department
    },
    {
      title: 'Total Orders',
      width: 200,
      dataIndex: 'total_pallet',
      sorter: (a: any, b: any) => a.total_pallet.localeCompare(b.total_pallet),
      // width: '30%'
    },
    {
      title: 'Tujuan',
      dataIndex: 'tujuan',
      width: 200,
      editable: false,
      sorter: (a: any, b: any) => a.tujuan.localeCompare(b.tujuan),
      // width: '30%'
    },
    {
      title: 'Sopir',
      dataIndex: 'sopir',
      width: 200,
      editable: true,
      sorter: (a: any, b: any) => a.sopir.localeCompare(b.sopir),
      // width: '30%'
    },
    {
      title: 'No. Polisi Mobil',
      dataIndex: 'no_pol',
      width: 200,
      editable: true,
      sorter: (a: any, b: any) => a.no_pol.localeCompare(b.no_pol),
      // width: '30%'
    },
    {
      title: 'Tanggal Delivery',
      dataIndex: 'tanggal_delivery',
      width: 300,
      // width: '40%',
      // sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      // onFilter: (value, record) => record.name.startsWith(value),
      render: (_: any, record: any) => {
        return record['tanggal_delivery']
          ? dayjs(record['tanggal_delivery']).locale('id').format('DD MMMM YYYY')
          : '-'
      }
    },
    {
      title: 'Status',
      width: 200,
      dataIndex: 'status',
      // width: '40%',
      // sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      // onFilter: (value, record) => record.name.startsWith(value),
      render: (_: any, record: any) => {
        return record['status'] ? 'Success' : 'Pending';
      }
    },
    {
      title: 'Aksi',
      width: 200,
      dataIndex: 'operation',
      render: (_: any, record: any) => {
        const editable = isEditing(record);

        return (
          <span>
                {editable ? (
                  <span>
                        <button onClick={() => save(record.id)} style={{marginRight: 8}}>
                            <BiSave size={22} color="green"/>
                        </button>
                        <button onClick={cancel} style={{marginRight: 8}}>
                            <BiX size={22} color="red"/>
                        </button>
                    </span>
                ) : (
                  <span className="flex">
                        <button
                          disabled={editingKey !== ''}
                          onClick={() => edit(record)}
                          style={{marginRight: 8}}
                        >
                            <BiEdit size={22} color="orange"/>
                        </button>
                     <button
                       onClick={() => {
                         setSelectedDelivery(record['id'])
                         setModalDetail(true)
                       }}
                       style={{marginRight: 8}}
                     >
                              <BiDetail size={22} color="blue"/>
                          </button>
                        <Popconfirm
                          title="Apakah Anda yakin ingin menghapus?"
                          onConfirm={() => deleteData(record.id)}
                          okText="Yes"
                          okType={'danger'}
                          okButtonProps={{loading: confirmLoading}}
                        >
                            <button>
                                <BiTrash size={22} color="red"/>
                            </button>
                        </Popconfirm>
                    </span>
                )}
            </span>
        );
      }
    }
  ];
  const mergedColumns = columns.map((col:any) => {
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

  return (
    <>
      <div className={`bg-white h-full flex flex-col`}>
        {modal && (
          <AddModalLayout close={() => setModal(false)} onSubmit={handleSubmit(submitData)} reset={reset}
                          register={register} parts={data.dataPart} destinations={data.dataDestination} watch={watch} />)}
        {modalDetail && (
          <DetailDelivery close={() => setModalDetail(false)}  selected={selectedDelivery}/>)}
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
        </div>
        <div className="w-full bg-white p-2 flex-grow overflow-hidden">
          <Form form={form} component={false}>
            <Table
              loading={loading1}
              bordered
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              scroll={{
                y: "66vh"
              }}
              rowKey={'kode'} columns={mergedColumns} dataSource={data.dataDelivery} size={'small'}
              rowClassName="editable-row"
              pagination={false}/>
          </Form>
        </div>
      </div>
    </>
  );
}


