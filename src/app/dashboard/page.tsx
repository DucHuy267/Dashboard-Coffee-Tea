'use client';

import React, { useMemo, useState } from 'react';
import AdminLayout from "@/components/AdminLayout";
import { Card, Row, Col, Spin, Table } from 'antd';
import useSWR from 'swr';
import { IOrder, IOrderItem } from '@/types/Order';
import { IProduct } from '@/types/Product';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer
} from 'recharts';

const fetcher = <T,>(url: string): Promise<T> => fetch(url).then(res => res.json());

export default function DashboardHomePage() {
  const { data: ordersData, isLoading: loadingOrders } = useSWR<IOrder[]>("/api/orders", fetcher);
  const { data: productsData } = useSWR<IProduct[]>("/api/products", fetcher);

  const orders: IOrder[] = Array.isArray(ordersData) ? ordersData : [];
  const products: IProduct[] = Array.isArray(productsData) ? productsData : [];

  // ================================
  // Stats tổng quan
  // ================================
  const stats = useMemo(() => {
    const today = new Date();
    let todayCount = 0, monthCount = 0;
    let revenueToday = 0, revenueMonth = 0;
    let profitToday = 0, profitMonth = 0;
    let productsToday = 0, productsMonth = 0;

    orders.forEach(o => {
      const d = new Date(o.createdAt ?? '');
      const total = o.total ?? 0;
      const profit = o.profit ?? 0;

      const isThisMonth = d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      const isToday = isThisMonth && d.getDate() === today.getDate();

      if (isThisMonth) {
        monthCount += 1;
        revenueMonth += total;
        profitMonth += profit;

        // tổng số lượng sản phẩm tháng
        o.items?.forEach((item: IOrderItem) => {
          productsMonth += item.quantity;
        });
      }

      if (isToday) {
        todayCount += 1;
        revenueToday += total;
        profitToday += profit;

        // tổng số lượng sản phẩm hôm nay
        o.items?.forEach((item: IOrderItem) => {
          productsToday += item.quantity;
        });
      }
    });

    return { 
      today: todayCount, 
      month: monthCount, 
      revenueToday, 
      revenueMonth, 
      profitToday, 
      profitMonth,
      productsToday,
      productsMonth
    };
  }, [orders]);


  // ================================
  // Doanh thu theo ngày
  // ================================
  const revenueByDay = useMemo(() => {
    if (!orders.length) return [];
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const arr = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, revenue: 0 }));

    orders.forEach(o => {
      const d = new Date(o.createdAt ?? '');
      if (d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
        arr[d.getDate() - 1].revenue += o.total ?? 0;
      }
    });

    return arr;
  }, [orders]);

  // ================================
  // Số lượng đơn theo tháng
  // ================================
  const ordersByMonth = useMemo(() => {
    if (!orders.length) return [];
    const today = new Date();
    const arr = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));

    orders.forEach(o => {
      const d = new Date(o.createdAt ?? '');
      if (d.getFullYear() === today.getFullYear()) arr[d.getMonth()].count += 1;
    });

    return arr;
  }, [orders]);

  // ================================
  // Tổng sản phẩm bán theo loại
  // ================================
  const soldByCategory = useMemo(() => {
  if (!orders.length) return [];

  const map = new Map<string, number>(); // category → sold

  orders.forEach(order => {
    order.items?.forEach((item: IOrderItem) => {
      const product = item.productId as unknown as IProduct; // do populate trả về object

      if (!product || !product.category) return;

      const categoryName = product.category.name ?? "Khác";
      console.log("productId item:", orders[0]?.items[0]?.productId);


      map.set(categoryName, (map.get(categoryName) ?? 0) + item.quantity);
    });
  });

  return Array.from(map, ([category, sold]) => ({ category, sold }));
}, [orders]);



  // ================================
  // Top sản phẩm bán chạy
  // ================================
  const topProducts = useMemo(() => {
    if (!orders.length) return [];

    const map = new Map<string, { name: string; sold: number }>();

    orders.forEach(o => {
      o.items?.forEach(item => {
        const product = item.productId as IProduct;
        if (!product || !product._id) return;

        const stat = map.get(product._id) ?? { name: product.name, sold: 0 };
        stat.sold += item.quantity;
        map.set(product._id, stat);
      });
    });

    return Array.from(map.values())
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);
  }, [orders]);


  const formatCurrency = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  // ================================
  // Bảng đơn hàng mới
  // ================================
  const columns = [
    { title: "Khách hàng", dataIndex: "customerName" },
    { title: "Tổng tiền", dataIndex: "total", render: (v: number) => formatCurrency(v) },
    { title: "Tiền lời", dataIndex: "profit", render: (v: number) => formatCurrency(v ?? 0) },
    { title: "Ngày", dataIndex: "createdAt", render: (v: string) => new Date(v).toLocaleString('vi-VN') },
  ];

  const cardStyle = { borderRadius: 12, boxShadow: "0 6px 15px rgba(0,0,0,0.1)", fontWeight: 500, fontSize: 16,};
  const [viewType, setViewType] = useState<"day" | "month">("day");

  return (
    <AdminLayout>
      <h2 style={{ marginBottom: 20, color:'#3e2c1c' }}>📊 Dashboard tổng quan</h2>

      <Row gutter={[16, 16]} className="mb-4" >
        <Col xs={24} sm={12} md={8}>
          <Card title="Đơn hàng hôm nay" style={cardStyle}>
            {loadingOrders ? <Spin /> : `${stats.today} đơn  •  ${stats.productsToday} ly 🥤`}
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card title="Đơn hàng tháng này" style={cardStyle}>
            {loadingOrders ? <Spin /> : `${stats.month} đơn  •  ${stats.productsMonth} ly 🥤`}
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} style={{marginBottom:5}}>
          <Card title="Doanh thu" style={cardStyle}  >
            <div><b>Hôm nay:</b> {formatCurrency(stats.revenueToday)} (Lời: {formatCurrency(stats.profitToday)})</div>
            <div><b>Tháng này:</b> {formatCurrency(stats.revenueMonth)}</div>
          </Card>
        </Col>

      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>📊 Doanh thu</span>
                <div>
                  <button
                    onClick={() => setViewType("day")}
                    style={{
                      padding: "4px 10px",
                      marginRight: 6,
                      borderRadius: 26,
                      border: "0px solid #a9744f",
                      background: viewType === "day" ? "#a9744f" : "transparent",
                      color: viewType === "day" ? "#fff" : "#a9744f",
                      fontWeight: 400,
                      cursor: "pointer"
                    }}
                  >
                    Daily
                  </button>

                  <button
                    onClick={() => setViewType("month")}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 26,
                      border: "0px solid #a9744f",
                      background: viewType === "month" ? "#a9744f" : "transparent",
                      color: viewType === "month" ? "#fff" : "#a9744f",
                      fontWeight: 400,
                      cursor: "pointer"
                    }}
                  >
                    Weekly
                  </button>
                </div>
              </div>
            }
            style={cardStyle}
          >
            <ResponsiveContainer width="100%" height={300}>
              {viewType === "day" ? (
                <LineChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#4caf50" strokeWidth={3} name="Doanh thu" />
                </LineChart>
              ) : (
                <BarChart data={ordersByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#4caf50" radius={[4, 4, 0, 0]} name="Số đơn" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Số lượng đơn theo tháng" style={cardStyle} bodyStyle={{ padding: 5 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#2196f3" radius={[4, 4, 0, 0]} name="Số đơn" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={12}>
          <Card title="📦 Tổng sản phẩm bán theo từng loại" style={cardStyle} >
            <Table
              dataSource={soldByCategory}
              columns={[{ title: "Loại sản phẩm", dataIndex: "category" }, { title: "Đã bán", dataIndex: "sold" }]}
              rowKey="category"
              pagination={false}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="🔥 Top sản phẩm bán chạy" style={cardStyle} >
            <Table
              dataSource={topProducts}
              columns={[{ title: "Sản phẩm", dataIndex: "name" }, { title: "Đã bán", dataIndex: "sold" }]}
              rowKey="name"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Các đơn hàng gần đây" style={cardStyle}>
            <Table dataSource={orders} columns={columns} rowKey="_id" pagination={{ pageSize: 5 }} />
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
}
