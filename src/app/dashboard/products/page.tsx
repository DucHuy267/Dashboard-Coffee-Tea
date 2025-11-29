'use client';
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import dynamic from "next/dynamic";
import { Button, Modal, message } from "antd";
import useSWR from "swr";
import { IProduct } from "@/types/Product";

const ProductTable = dynamic(() => import("@/components/ProductTable"), { ssr: false });
const ProductForm = dynamic(() => import("@/components/ProductForm"), { ssr: false });

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProductsPage() {
  const [visible, setVisible] = React.useState(false);
  const [editing, setEditing] = React.useState<IProduct | undefined>(undefined);

  // 🔥 Lấy danh sách sản phẩm
  const { data: products, mutate } = useSWR<IProduct[]>("/api/products", fetcher);

  const openCreate = () => {
    setEditing(undefined);
    setVisible(true);
  };

  const onEdit = (product: IProduct) => {
    setEditing(product);
    setVisible(true);
  };

  const handleSaved = () => {
    mutate();           // cập nhật lại danh sách không reload trang
    setVisible(false);  // đóng modal
    message.success("Lưu thành công!");
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <h2>Quản lý sản phẩm</h2>
        <Button type="primary" onClick={openCreate}>
          Thêm sản phẩm
        </Button>
      </div>

      {/* Bảng sản phẩm */}
      <ProductTable
        onEdit={onEdit}
        data={products ?? []}
        mutate={mutate}
      />

      {/* Modal thêm/sửa sản phẩm */}
      <Modal
        title={editing ? "Sửa sản phẩm" : "Tạo sản phẩm"}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <ProductForm initial={editing} onSaved={handleSaved} />
      </Modal>
    </AdminLayout>
  );
}
