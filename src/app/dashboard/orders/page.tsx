'use client';
import { useState, useEffect } from "react";
import { Button, Modal, Spin } from "antd";
import axios from "axios";
import { IOrder } from "@/types/Order";
import OrderTable from "@/components/OrderTable";
import OrderForm from "@/components/OrderForm";
import AdminLayout from "@/components/AdminLayout";

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load dữ liệu
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEdit = (order: IOrder) => {
    setEditing(order);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    setIsModalOpen(false);
    fetchOrders();
  };

  return (
    <AdminLayout>
    <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
      <h2 >Quản lý đơn hàng</h2>
      <Button type="primary" onClick={handleAdd} >
        Thêm đơn hàng
      </Button>
    </div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <OrderTable data={orders} onEdit={handleEdit} mutate={fetchOrders} />
      )}

      <Modal
        title={editing ? "Sửa đơn hàng" : "Thêm đơn hàng"}
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <OrderForm initial={editing || undefined} onSaved={handleSaved} />
      </Modal>
   
    </AdminLayout>
  );
}
