"use client";
import { Supply, SupplyItem } from "@/types/Supply";
import { Form, Input, InputNumber, Button, Space, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect } from "react";

interface Props {
  onSaved: () => void;
  editing?: Supply | null;
}

export default function SupplyForm({ onSaved, editing }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editing) {
      form.setFieldsValue(editing);
    } else {
      form.setFieldsValue({ items: [{ quantity: 0, price: 0 }] });
    }
  }, [editing, form]);

  const handleSubmit = async (values: Supply) => {
    // map items để tính total cho mỗi item
    const itemsWithTotal: SupplyItem[] = (values.items || []).map((i) => ({
      ...i,
      total: (i.quantity || 0) * (i.price || 0),
    }));

    const grandTotal: number = itemsWithTotal.reduce((sum, i) => sum + i.total, 0);

    try {
      if (editing?._id) {
        await axios.put(`/api/supplies/${editing._id}`, {
          ...values,
          items: itemsWithTotal,
          grandTotal,
        });
        message.success("Cập nhật thành công!");
      } else {
        await axios.post("/api/supplies", {
          ...values,
          items: itemsWithTotal,
          grandTotal,
        });
        message.success("Thêm thành công!");
      }

      form.resetFields();
      onSaved();
    } catch (err: unknown) {
      console.error("POST /api/supplies error:", err);
      message.error("Lỗi khi lưu dữ liệu, kiểm tra console!");
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name }) => (
              <Space key={key} style={{ display: "flex" }} align="start">
                <Form.Item
                  name={[name, "name"]}
                  rules={[{ required: true, message: "Nhập tên" }]}
                >
                  <Input placeholder="Tên nguyên liệu" style={{ width: 140 }} />
                </Form.Item>

                <Form.Item
                  name={[name, "quantity"]}
                  rules={[{ required: true, message: "SL?" }]}
                >
                  <InputNumber placeholder="SL" style={{ width: 70 }} />
                </Form.Item>

                <Form.Item
                  name={[name, "price"]}
                  rules={[{ required: true, message: "Giá?" }]}
                >
                  <InputNumber placeholder="Giá" style={{ width: 80 }} />
                </Form.Item>

                <Form.Item shouldUpdate>
                  {() => {
                    const items: SupplyItem[] = form.getFieldValue("items") || [];
                    return (
                      <InputNumber
                        disabled
                        value={(items[name]?.quantity || 0) * (items[name]?.price || 0)}
                        style={{ width: 90 }}
                      />
                    );
                  }}
                </Form.Item>

                {fields.length > 1 && (
                  <Button danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                )}
              </Space>
            ))}

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => add({ quantity: 0, price: 0 })}
              block
            >
              Thêm nguyên liệu
            </Button>
          </>
        )}
      </Form.List>

      <Form.Item shouldUpdate style={{ marginTop: 15 }}>
        {() => {
          const items: SupplyItem[] = form.getFieldValue("items") || [];
          const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
          return <h3>Tổng cộng: {total.toLocaleString()} đ</h3>;
        }}
      </Form.Item>

      <Space style={{ width: "100%", marginTop: 15 }}>
        <Button type="primary" htmlType="submit" style={{ width: "70%" }}>
          Lưu
        </Button>

        <Button
          danger
          style={{ width: "30%" }}
          onClick={() => form.resetFields()}
        >
          Reset
        </Button>
      </Space>
    </Form>
  );
}
