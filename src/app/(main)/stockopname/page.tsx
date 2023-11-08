"use client";
import React, { useEffect, useState } from "react";
import { BiEdit, BiPlusMedical, BiRefresh, BiSave, BiTrash, BiX } from "react-icons/bi";
import { Form, Popconfirm, Table } from "antd";
import { useForm } from "react-hook-form";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import useTabStore, { TabStore } from "@/app/context/Tab/TabStore";
import useStore from "@/app/context/Tab/useStore";
import EditableCell, { StockOpname } from "@/app/components/Pages/Master/StockOpname/EditCell";
import AddModalLayout from "@/app/components/Pages/Master/StockOpname/AddModal";
import dayjs from "dayjs";

export default function StockOpname() {
  const [data, setData] = useState<{dataStockOpname: StockOpname[]}>({
    dataStockOpname: [],
  })
  const [modal, setModal] = useState(false)
  const tabStore : TabStore| any = useStore(useTabStore, (state) => state)

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading1, setLoading] = useState<boolean>(true)
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
      label: 'Master Part',
      path: '/part',
      id: 'Master Part'
    })
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/pallet/stockopname',{
        id: 'list-stockopname',
        // cache: false
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


  const submitData = async (data: any) => {
    try {
      await axiosInstance.post('/pallet/stockopname', {
        catatan: data.catatan
      },{
        cache: {
          update: {
            'list-stockopname': 'delete'
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
      await axiosInstance.delete(`/pallet/stockopname/${e}`,{
        cache: {
          update: {
            'list-stockopname': 'delete'
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
    setEditingKey(record.kode!);
  };


  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: any) => {
    try {
      const row = await form.validateFields();
      const newData: any = [...data.dataStockOpname];
      const index = newData.findIndex((item: any) => key === item.kode);
      if (index > -1) {
        const item: any = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        await axiosInstance.patch(`/pallet/stockopname/${item.kode}`, {
          status: parseInt(row.status)
        },{
          cache: {
            update: {
              'list-stockopname': 'delete'
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
      dataIndex: 'id',
      width: '5%',
      render: (_: any, __: any, index: any) => index + 1
    },
    {
      title: 'Kode SO',
      dataIndex: 'kode',
      sorter: (a: any, b: any) => a.kode.localeCompare(b.kode),
      width: '10%'
    },
    {
      title: 'Tanggal Mulai SO',
      dataIndex: 'tanggal_so',
      // width: '40%',
      // sorter: (a, b) => a.name.localeCompare(b.name),
      // onFilter: (value, record) => record.name.startsWith(value),
      render: (_: any, record: StockOpname) => {
        return record.tanggal_so
          ? dayjs(record.tanggal_so).locale('id').format('DD MMMM YYYY HH:mm')
          : '-'
      }
    },
    {
      title: 'Tanggal Tutup SO',
      dataIndex: 'tanggal_so_closed',
      // width: '40%',
      // sorter: (a, b) => a.department.localeCompare(b.department),
      // onFilter: (value, record) => record.department.indexOf(value) === 0,
      // render: (_, record) => "Produksi " + record.department
      render: (_: any, record: StockOpname) => {
        return record['tanggal_so_closed']
          ? dayjs(record['tanggal_so_closed']).locale('id').format('DD MMMM YYYY HH:mm')
          : '-'
      }
    },
    {
      title: 'Dibuat Oleh',
      dataIndex: 'created_by',
      // width: '40%',
      // sorter: (a, b) => a.department.localeCompare(b.department),
      // onFilter: (value, record) => record.department.indexOf(value) === 0,
      // editable: true
      // render: (_, record) => "Produksi " + record.department

    },
    {
      title: 'Status',
      dataIndex: 'status',
      // width: '40%',
      // sorter: (a, b) => a.department.localeCompare(b.department),
      // onFilter: (value, record) => record.department.indexOf(value) === 0,
      editable: true,
      inputType: 'select', // Kolom ini menggunakan select
      options: [
        {value: 1, label: 'Dibuka'},
        {value: 0, label: 'Ditutup'}
      ],
      render: (_: any, record: StockOpname) => (record.status === 1) ? 'Dibuka' : 'Ditutup'

    },
    {
      title: 'Catatan',
      dataIndex: 'catatan',
      // width: '40%',
      // sorter: (a, b) => a.department.localeCompare(b.department),
      // onFilter: (value, record) => record.department.indexOf(value) === 0,
      inputType: 'text', // Kolom ini menggunakan input teks
      editable: true
      // render: (_, record) => (record.status ===1 ) ? 'Dibuka' : 'Ditutup'

    },
    {
      title: 'Aksi',
      width: '10%',
      dataIndex: 'operation',
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
                        <button
                          disabled={editingKey !== ''}
                          onClick={() => edit(record)}
                          style={{marginRight: 8}}
                        >
                            <BiEdit size={22} color="orange"/>
                        </button>
                        <Popconfirm
                          title="Apakah Anda yakin ingin menghapus?"
                          onConfirm={() => deleteData(record.kode)}
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
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: StockOpname) => ({
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
          <AddModalLayout close={() => setModal(false)} onSubmit={handleSubmit(submitData)} 
                          register={register}/>)}

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
              rowKey={'kode'} columns={mergedColumns} dataSource={data.dataStockOpname} size={'small'}
              rowClassName="editable-row"
              pagination={false}/>
          </Form>
        </div>
      </div>
    </>
  );
}


