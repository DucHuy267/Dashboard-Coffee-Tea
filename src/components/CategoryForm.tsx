'use client';
import { Form, Input, Button, Row, Col } from "antd";
import axios from "axios";
import { ICategory } from "@/types/Category";
import { useEffect } from "react";

interface Props {
  initial?: ICategory;
  onSaved: () => void;
}

export default function CategoryForm({ initial, onSaved }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initial) {
      form.setFieldsValue(initial);
    } else {
      form.resetFields();
    }
  }, [initial, form]);

  const onFinish = async (values: ICategory) => {
    try {
      const payload = { ...values, idCate: String(values.idCate) };

      if (initial?._id) {
        await axios.put(`/api/categories/${initial._id}`, payload);
      } else {
        await axios.post("/api/categories", payload);
      }

      form.resetFields(); // Xóa form sau khi lưu
      onSaved();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Lưu thất bại");
      } else {
        alert("Lưu thất bại");
      }
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Mã danh mục (idCate)"
              name="idCate"
              rules={[
                { required: true, message: "Vui lòng nhập mã danh mục" },
                { pattern: /^[0-9]+$/, message: "idCate chỉ được nhập số" },
              ]}
            >
              <Input placeholder="Nhập mã danh mục" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Tên danh mục"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
            >
              <Input placeholder="Nhập tên danh mục" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
