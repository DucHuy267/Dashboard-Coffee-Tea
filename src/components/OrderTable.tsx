'use client';
import { Table, Button, Popconfirm, Space } from "antd";
import { IOrder } from "@/types/Order";
import axios from "axios";
interface Props {
  data: IOrder[];
  onEdit: (o: IOrder) => void;
  mutate: () => void;
}

export default function OrderTable({ data, onEdit, mutate }: Props) {
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/orders/${id}`);
      mutate();
    } catch {
      alert("Xóa thất bại!");
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      render: (_: unknown, record: IOrder, index: number) => index + 1,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      ellipsis: true,
    },
    {
      title: "Tên sản phẩm",
      key: "products",
      render: (_: unknown, record: IOrder) => (
        <div>
          {record.items.map((item, idx) => {
            const product = item.productId as unknown as {
              name: string;
            };
            return (
              <div key={idx}>
                {product?.name ?? "Sản phẩm đã xóa"} x {item.quantity}
              </div>
            );
          })}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (t: number) => new Intl.NumberFormat('vi-VN').format(t) + " Đ",
    },
    {
      title: "Ngày giờ",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string | Date) => {
        if (!date) return "—";
        const d = typeof date === "string" ? new Date(date) : date;
        return d.toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_: unknown, record: IOrder) => (
        <Space>
          <Button style={{backgroundColor:'#a9744f', color:'#fff',  }} type="default" onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Popconfirm title="Xóa đơn hàng?" onConfirm={() => handleDelete(record._id!)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
     style={{borderRadius: 12,boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}
      dataSource={data ?? []}
      columns={columns}
      rowKey="_id"
      pagination={{ pageSize: 10 }}
      scroll={{ x: 700 }} // scroll ngang khi màn hình nhỏ
    />
  );
}
