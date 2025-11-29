'use client';
import { Table, Button, Popconfirm } from "antd";
import { ICategory } from "@/types/Category";
import axios from "axios";
import "./CategoryTable.css";

interface Props {
  data: ICategory[];
  onEdit: (c: ICategory) => void;
  mutate: () => void;
}

export default function CategoryTable({ data, onEdit, mutate }: Props) {
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      mutate();
    } catch {
      alert("Xóa thất bại!");
    }
  };

  const columns = [
    { title: "Mã (idCate)", dataIndex: "idCate", key: "idCate", width: 120 },
    { title: "Tên", dataIndex: "name", key: "name" },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: ICategory) => (
        <div className="action-buttons">
          <Button className="edit-btn" onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Popconfirm title="Xóa danh mục?" onConfirm={() => handleDelete(record._id!)}>
            <Button danger className="delete-btn">Xóa</Button>
          </Popconfirm>
        </div>
      ),
      fixed: 'right' as const,
      width: 140,
    },
  ];

  return (
    <div className="category-table-wrapper">
      <Table
        dataSource={data}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
        bordered
      />
    </div>
  );
}
