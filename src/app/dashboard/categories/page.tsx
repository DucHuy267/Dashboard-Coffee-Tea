'use client';
import dynamic from "next/dynamic";
import AdminLayout from "@/components/AdminLayout";
import { Button, Modal, message } from "antd";
import React from "react";
import useSWR from "swr";
import axios from "axios";
import { ICategory } from "@/types/Category";

const CategoryTable = dynamic(() => import("@/components/CategoryTable"), { ssr: false });
const CategoryForm = dynamic(() => import("@/components/CategoryForm"), { ssr: false });

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function CategoriesPage() {
  const [visible, setVisible] = React.useState(false);
  const [editing, setEditing] = React.useState<ICategory | undefined>(undefined);

  const { data: categories, mutate } = useSWR<ICategory[]>("/api/categories", fetcher);

  const handleSaved = () => {
    mutate();
    setVisible(false);
    message.success("Lưu thành công!");
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
        <h2>Quản lý danh mục</h2>
        <Button type="primary" onClick={() => { setEditing(undefined); setVisible(true); }}
          style={{ background:'#a9744f'}}>
          Thêm danh mục
        </Button>
      </div>

      {categories && <CategoryTable data={categories} mutate={mutate} onEdit={(c) => { setEditing(c); setVisible(true); }} />}

      <Modal
        title={editing ? "Sửa danh mục" : "Thêm danh mục"}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <CategoryForm initial={editing} onSaved={handleSaved} />
      </Modal>
    </AdminLayout>
  );
}
