'use client';
import { Form, Button, Select, Table, InputNumber, Row, Col } from "antd";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { IOrder, IOrderItem } from "@/types/Order";
import { IProduct } from "@/types/Product";
import { ICustomer } from "@/types/Customer";

interface Props {
  initial?: IOrder;
  onSaved: () => void;
}

export default function OrderForm({ initial, onSaved }: Props) {
  const [form] = Form.useForm<IOrder>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [items, setItems] = useState<IOrderItem[]>([]);

   // ✅ Reset form mỗi khi initial thay đổi
  useEffect(() => {
    if (initial) {
      form.setFieldsValue(initial); // điền dữ liệu cũ khi sửa
    } else {
      form.resetFields(); // reset trống khi thêm mới
    }
  }, [initial, form]);

  // Load toàn bộ sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data);

        // Nếu đang sửa đơn hàng → convert productId thành string
        if (initial?.items) {
          const mappedItems: IOrderItem[] = initial.items
            .map(i => ({
              productId:
                typeof i.productId === "string"
                  ? i.productId
                  : i.productId?._id, // fix: chuyển object -> _id
              quantity: i.quantity
            }))
            .filter(i => i.productId !== undefined) as IOrderItem[];
          setItems(mappedItems);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, [initial]);

  // Load khách hàng
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("/api/customers");
        setCustomers(res.data);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    };
    fetchCustomers();
  }, []);

  // Tính tổng tiền
  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      const product = products.find(p => p._id === item.productId);
      return acc + (product?.price ?? 0) * item.quantity;
    }, 0);
  }, [items, products]);

  // Add/update/remove
  const addProduct = (productId: string) => {
    if (!productId || items.find(i => i.productId === productId)) return;
    setItems([...items, { productId, quantity: 1 }]);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(items.map(i => i.productId === productId ? { ...i, quantity } : i));
  };

  const removeItem = (productId: string) => {
    setItems(items.filter(i => i.productId !== productId));
  };

  // Submit
  const onFinish = async (values: IOrder) => {
    if (!values.customerName || items.length === 0) {
      alert("Vui lòng chọn khách hàng và thêm sản phẩm");
      return;
    }

    const customer = customers.find(c => c._id === values.customerName);

    const payload: IOrder = {
      customerName: customer?.name ?? values.customerName,
      items,
      total,
      status: initial?._id ? initial.status : "pending",
    };

    try {
      if (initial?._id) {
        await axios.put(`/api/orders/${initial._id}`, payload);
      } else {
        await axios.post("/api/orders", payload);
      }
      form.resetFields();
      onSaved();
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại");
    }
  };

  // Columns
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productId",
      render: (productId: string) =>
        products.find(p => p._id === productId)?.name ?? "—",
    },
    {
      title: "Giá",
      dataIndex: "productId",
      render: (productId: string) => {
        const product = products.find(p => p._id === productId);
        return product
          ? new Intl.NumberFormat("vi-VN").format(product.price) + "Đ"
          : "—";
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (_: number, record: IOrderItem) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value: number | null) =>
            value && updateQuantity(record.productId as string, value)
          }
        />
      ),
    },
    {
      title: "Subtotal",
      dataIndex: "productId",
      render: (productId: string, record: IOrderItem) => {
        const product = products.find(p => p._id === productId);
        return product
          ? new Intl.NumberFormat("vi-VN").format(product.price * record.quantity) + "Đ"
          : "—";
      },
    },
    {
      title: "Thao tác",
      dataIndex: "productId",
      render: (productId: string) => (
        <Button danger onClick={() => removeItem(productId)}>Xóa</Button>
      ),
    },
  ];

  return (
    <Form form={form} initialValues={initial} onFinish={onFinish} layout="vertical">
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Khách hàng" name="customerName" rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="Chọn khách hàng"
              onSearch={v => axios.get(`/api/customers?search=${v}`).then(res => setCustomers(res.data))}
              options={customers.map(c => ({ label: c.name, value: c._id }))}
              filterOption={false}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Thêm sản phẩm">
            <Select
              showSearch
              placeholder="Chọn sản phẩm"
              onSearch={v => axios.get(`/api/products?search=${v}`).then(res => setProducts(res.data))}
              onSelect={addProduct}
              options={products.map(p => ({ label: p.name, value: p._id }))}
              filterOption={false}
            />
          </Form.Item>
        </Col>
      </Row>

      <Table dataSource={items} columns={columns} rowKey="productId" pagination={false} style={{ marginBottom: 16 }} />

      <div style={{ marginBottom: 16, fontWeight: "bold" }}>
        Tổng tiền: {new Intl.NumberFormat('vi-VN').format(total)}Đ
      </div>

      <Button type="primary" htmlType="submit">Lưu</Button>
    </Form>
  );
}
