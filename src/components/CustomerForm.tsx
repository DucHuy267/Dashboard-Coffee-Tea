'use client';
import { Form, Input, Button, Row, Col } from "antd";
import { ICustomer } from "@/types/Customer";
import axios from "axios";
import { useEffect } from "react";

interface Props {
  initial?: ICustomer;
  onSaved: () => void;
}

export default function CustomerForm({ initial, onSaved }: Props) {
  const [form] = Form.useForm<ICustomer>();

  // ✅ Reset form mỗi khi initial thay đổi
  useEffect(() => {
    if (initial) {
      form.setFieldsValue(initial); // điền dữ liệu cũ khi sửa
    } else {
      form.resetFields(); // reset trống khi thêm mới
    }
  }, [initial, form]);

  const onFinish = async (values: ICustomer) => {
    try {
      const payload = { ...values };
      if (initial?._id) {
        await axios.put(`/api/customers/${initial._id}`, payload);
      } else {
        await axios.post("/api/customers", payload);
        form.resetFields();
      }
      onSaved();
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initial}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Tên khách hàng"
              name="name"
              rules={[{ required: true, message: "Nhập tên khách hàng" }]}
            >
              <Input placeholder="Nhập tên khách hàng" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Địa chỉ" name="address">
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
