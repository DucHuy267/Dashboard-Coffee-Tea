"use client";
import dynamic from "next/dynamic";
import AdminLayout from "@/components/AdminLayout";
import { Button, Modal } from "antd";
import useSWR from "swr";
import axios from "axios";
import { useState } from "react";
import SupplyTable from "@/components/SupplyTable";
import { Supply } from "@/types/Supply";

const SupplyForm = dynamic(() => import("@/components/SupplyForm"), { ssr: false });

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function SupplyPage() {
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<Supply | null>(null);

  const { data, mutate } = useSWR<Supply[]>("/api/supplies", fetcher);

  const handleSaved = () => {
    mutate();
    setVisible(false);
    setEditing(null);
  };

  const handleEdit = (record: Supply) => {
    setEditing(record);
    setVisible(true);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/supplies/${id}`);
    mutate();
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
        <h2>📦 Nhập nguyên liệu</h2>
        <Button type="primary" onClick={() => { setEditing(null); setVisible(true); }}  style={{ background:'#a9744f'}}>
          Thêm phiếu nhập
        </Button>
      </div>

      {data && <SupplyTable data={data} onEdit={handleEdit} onDelete={handleDelete} />}

      <Modal
        title={editing ? "Sửa phiếu nhập" : "Thêm phiếu nhập"}
        open={visible}
        onCancel={() => { setVisible(false); setEditing(null); }}
        footer={null}
      >
        <SupplyForm onSaved={handleSaved} editing={editing} />
      </Modal>
    </AdminLayout>
  );
}
