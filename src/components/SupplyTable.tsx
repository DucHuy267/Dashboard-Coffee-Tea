"use client";
import { Table, Button, Popconfirm, Space, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { Supply } from "@/types/Supply";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface Props {
  data: Supply[];
  onEdit: (record: Supply) => void;
  onDelete: (id: string) => void;
}

export default function SupplyTable({ data, onEdit, onDelete }: Props) {
  const columns: ColumnsType<Supply> = [
    {
      title: "Ngày nhập",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: string) => (
        <Tag
          color="gold"
          style={{
            fontSize: 12,
            padding: "3px 8px",
            borderRadius: 6,
            whiteSpace: "nowrap",
          }}
        >
          {new Date(d).toLocaleString()}
        </Tag>
      ),
      responsive: ["sm"],
    },
    {
      title: "Tổng tiền",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (t: number) => (
        <b style={{ color: "#8b5e3c", fontSize: 14 }}>
          {t.toLocaleString()} đ
        </b>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: unknown, record: Supply) => (
        <Space size="small" wrap>
          <Button
            icon={<EditOutlined />}
            size="small"
            type="primary"
            onClick={() => onEdit(record)}
            style={{
              background: "linear-gradient(45deg, #b88a65, #a9744f)",
              border: "none",
              borderRadius: 6,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          />
          <Popconfirm
            title="Xoá lần nhập này?"
            okText="Xoá"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record._id!)}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              style={{
                borderRadius: 6,
              }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      <Table
        rowKey="_id"
        dataSource={data}
        columns={columns}
        scroll={{ x: "max-content" }}  // 👈 quan trọng cho mobile
        expandable={{
          expandedRowRender: (record) => (
            <Table
              rowKey="_id"
              dataSource={record.items}
              pagination={false}
              scroll={{ x: "max-content" }}
              columns={[
                { title: "Tên", dataIndex: "name" },
                { title: "SL", dataIndex: "quantity", width: 60 },
                {
                  title: "Giá",
                  dataIndex: "price",
                  render: (p: number) => (
                    <span style={{ color: "#8b5e3c", fontSize: 13 }}>
                      {p.toLocaleString()} đ
                    </span>
                  ),
                },
                {
                  title: "Tổng",
                  dataIndex: "total",
                  render: (t: number) => (
                    <b style={{ color: "#a9744f", fontSize: 13 }}>
                      {t.toLocaleString()} đ
                    </b>
                  ),
                },
              ]}
              size="small"
              style={{
                borderRadius: 12,
                marginTop: 4,
              }}
            />
          ),
          rowExpandable: (record) => record.items.length > 0,
        }}
        style={{
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 3px 14px rgba(0,0,0,0.08)",
        }}
        pagination={{
          pageSize: 8,
          responsive: true,
          size: "small",
        }}
        size="middle"
      />
    </div>
  );
}
