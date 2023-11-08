"use client";
import React, { useEffect, useState } from "react";
import { BiEdit, BiPlusMedical, BiRefresh, BiSave, BiTrash, BiX } from "react-icons/bi";
import { Form, Popconfirm, Table } from "antd";
import { useForm } from "react-hook-form";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import AddModalLayout from "@/app/components/Pages/Master/Department/AddModal";
import EditableCell from "@/app/components/Pages/Master/Department/EditCell";
import useTabStore, { TabStore } from "@/app/context/Tab/TabStore";
import useStore from "@/app/context/Tab/useStore";

export default function Department() {
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const tabStore : TabStore| any = useStore(useTabStore, (state) => state)

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading1, setLoading] = useState<boolean>(true)
  const isEditing = (record: Department) => record.kode === editingKey;
  const {
    register,
    handleSubmit,
    reset
  } = useForm()
  const axiosInstance = useAxiosAuth()


  useEffect(() => {
    setLoading(false)
    tabStore?.addTab({
      label: 'Master Department',
      path: '/department',
      id: 'Master Department'
    })
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/pallet/departments',{
        id: 'list-department'
      });
      setData(response.data)
    } catch (error) {
      // showErrorToast('Data Gagal Diambil');
    } finally {
      setLoading(false)
    }
  };


  const submitData = async (data: any) => {
    try {
      await axiosInstance.post('/pallet/departments', {
        name: data.name,
        kode: data.kode
      }, {
        cache: {
          update: {
            'list-department': 'delete'
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
      await axiosInstance.delete(`/pallet/departments/${e}`,{
        cache: {
          update: {
            'list-department': 'delete'
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

  const edit = (record: Partial<Department> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', ...record });
    setEditingKey(record.kode!);
  };


  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: any) => {
    try {
      const row = await form.validateFields();
      const newData: any = [...data];
      const index = newData.findIndex((item: any) => key === item.kode);
      if (index > -1) {
        const item: any = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        await axiosInstance.patch(`/pallet/departments/${item.kode}`, row,{
          cache: {
            update: {
              'list-department': 'delete'
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
      title: 'Kode Department',
      dataIndex: 'kode',
      sorter: (a: any, b: any) => a.kode.localeCompare(b.kode),
      width: '10%'
    },
    {
      title: 'Nama Department',
      dataIndex: 'name',
      width: '35%',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      editable: true,
      render: (_:any, record: Department) => record.name
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
      onCell: (record: Department) => ({
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
              rowKey={'kode'} columns={mergedColumns} dataSource={data} size={'small'}
              rowClassName="editable-row"
              pagination={false}/>
          </Form>
        </div>
      </div>
    </>
  );
}

type Department = {
  kode: string
  name: string
}

