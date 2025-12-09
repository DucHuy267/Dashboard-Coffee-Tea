'use client';
import { Table, Button, Popconfirm, Space } from "antd";
import { ICategory } from "@/types/Category";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

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
        <Space>
          <Button className="edit-btn" onClick={() => onEdit(record)} icon={<EditOutlined />} 
                  style={{backgroundColor:'#a9744f', color:'#fff',  }}>
          </Button>
          <Popconfirm title="Xóa danh mục?" onConfirm={() => handleDelete(record._id!)}>
            <Button danger className="delete-btn" icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Space>
      ),
      fixed: 'right' as const,
      width: 140,
    },
  ];

  return (
    <div className="category-table-wrapper">
      <Table
       style={{borderRadius: 12,boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}
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
