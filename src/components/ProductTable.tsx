'use client';
import { Table, Button, Popconfirm, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IProduct } from "@/types/Product";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface Props {
  data: IProduct[];
  onEdit: (product: IProduct) => void;
  mutate: () => void;
}

export default function ProductTable({ data, onEdit, mutate }: Props) {

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      mutate();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const columns: ColumnsType<IProduct> = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      render: (_: unknown, record: IProduct, index: number) => index + 1,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => new Intl.NumberFormat('vi-VN').format(price) + "Đ",
      sorter: (a, b) => (a.price ?? 0) - (b.price ?? 0),
    },
    {
      title: "Giá gốc",
      dataIndex: "originalPrice",
      key: "originalPrice",
      render: (originalPrice: number) => new Intl.NumberFormat('vi-VN').format(originalPrice) + "Đ",
      sorter: (a, b) => (a.originalPrice ?? 0) - (b.originalPrice ?? 0),
    },
    {
      title: "Danh mục",
      key: "category",
      render: (_, record) => {
        if (typeof record.category === "object" && record.category !== null) {
          return record.category.name;
        }
        return "—";
      },
      sorter: (a, b) => {
        const nameA = typeof a.category === "object" && a.category ? a.category.name : "";
        const nameB = typeof b.category === "object" && b.category ? b.category.name : "";
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button className="edit-btn" onClick={() => onEdit(record)} icon={<EditOutlined />} 
                  style={{backgroundColor:'#a9744f', color:'#fff',  }}>
          </Button>
          <Popconfirm
            title="Xóa sản phẩm?"
            onConfirm={() => handleDelete(record._id!)}
          >
            <Button danger className="delete-btn" icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Space>
      ),
      width: 150,
    },
  ];

  return (
    <div className="product-table-wrapper">
      <Table<IProduct>
        style={{borderRadius: 12,boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}
        dataSource={data}
        columns={columns}
        rowKey={(record) => record._id!}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
        bordered
      />
    </div>
  );
}
