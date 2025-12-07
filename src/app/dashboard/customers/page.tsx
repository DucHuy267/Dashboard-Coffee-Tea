'use client';
import React from "react";
import dynamic from "next/dynamic";
import AdminLayout from "@/components/AdminLayout";
import { Button, Modal, message } from "antd";
import useSWR from "swr";
import { ICustomer } from "@/types/Customer";

const CustomerTable = dynamic(() => import("@/components/CustomerTable"), { ssr: false });
const CustomerForm = dynamic(() => import("@/components/CustomerForm"), { ssr: false });

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CustomersPage() {
  const [visible, setVisible] = React.useState(false);
  const [editing, setEditing] = React.useState<ICustomer | undefined>(undefined);

  const { data: customers, mutate } = useSWR<ICustomer[]>("/api/customers", fetcher);

  const handleSaved = () => {
    mutate();
    setVisible(false);
    message.success("Lưu thành công!");
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <h2>Quản lý khách hàng</h2>
        <Button type="primary" onClick={() => { setEditing(undefined); setVisible(true); }}
          style={{ background:'#a9744f'}}>
          Thêm khách hàng
        </Button>
      </div>

      {customers && (
        <CustomerTable
          data={customers}
          onEdit={(c) => { setEditing(c); setVisible(true); }}
          mutate={mutate}
        />
      )}

      <Modal
        title={editing ? "Sửa khách hàng" : "Thêm khách hàng"}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <CustomerForm initial={editing} onSaved={handleSaved} />
      </Modal>
    </AdminLayout>
  );
}
