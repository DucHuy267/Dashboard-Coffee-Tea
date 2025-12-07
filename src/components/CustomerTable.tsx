'use client';
import { Table, Button, Popconfirm } from "antd";
import { ColumnsType } from "antd/es/table";
import { ICustomer } from "@/types/Customer";

interface Props {
  data: ICustomer[];
  onEdit: (customer: ICustomer) => void;
  mutate: () => void;
}

export default function CustomerTable({ data, onEdit, mutate }: Props) {
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/customers/${id}`, { method: "DELETE" });
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  const columns: ColumnsType<ICustomer> = [
    {
      title: "STT",
      key: "stt",
      render: (_: unknown, record: ICustomer, index: number) => index + 1, // số thứ tự
    },
    { title: "Tên khách hàng", dataIndex: "name", key: "name" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: ICustomer) => (
        <>
          <Button style={{backgroundColor:'#a9744f', color:'#fff',  }}
                  onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Popconfirm title="Xóa khách hàng?" onConfirm={() => handleDelete(record._id!)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return <Table<ICustomer> 
  dataSource={data} columns={columns} rowKey="_id" 
   style={{borderRadius: 12,boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}
  />;
}
