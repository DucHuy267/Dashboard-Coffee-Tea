'use client';
import { Form, Input, Button, Select, Card, Divider } from "antd";
import useSWR from "swr";
import { IProduct } from "@/types/Product";
import { ICategory } from "@/types/Category";
import { useEffect, useMemo, useState } from "react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Props {
  initial?: IProduct;
  onSaved: () => void;
}

export default function ProductForm({ initial, onSaved }: Props) {
  const [form] = Form.useForm();
  const { data: categories } = useSWR<ICategory[]>("/api/categories", fetcher);

  // State trung gian dạng string để hiển thị giá
  const [price, setPrice] = useState<string>("");
  const [originalPrice, setOriginalPrice] = useState<string>("");

 const formattedValues = useMemo(() => {
  if (!initial) return { price: "", originalPrice: "" };
  return {
    price: initial.price?.toLocaleString() || "",
    originalPrice: initial.originalPrice?.toLocaleString() || ""
  };
  }, [initial]);

  useEffect(() => {
    if (initial) {
      form.setFieldsValue(initial);
    } else {
      form.resetFields();
    }
  }, [initial, form]);

  useEffect(() => {
    setPrice(formattedValues.price);
    setOriginalPrice(formattedValues.originalPrice);
  }, [formattedValues]);


  const formatNumber = (value: string) => {
    if (!value) return "";
    return Number(value.replace(/,/g, "")).toLocaleString();
  };

  const onFinish = async (values: IProduct) => {
    const formattedValues = {
      ...values,
      price: Number(price.replace(/,/g, "")),
      originalPrice: Number(originalPrice.replace(/,/g, "")),
    };

    const response = initial?._id
      ? await fetch(`/api/products/${initial._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedValues),
        })
      : await fetch(`/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedValues),
        });

    if (!response.ok) {
      alert("Lỗi server khi lưu sản phẩm");
      return;
    }

    onSaved();
    form.resetFields();
    setPrice("");
    setOriginalPrice("");
  };

  return (
    <Card className="max-w-md mx-auto mt-8 shadow-lg rounded-2xl">
      <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input placeholder="Nhập tên sản phẩm..." />
        </Form.Item>

        {/* Giá bán */}
        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          <Input
            type="tel" // ⚠️ bắt buộc: tránh scientific format
            inputMode="numeric"
            value={price}
            onChange={(e) => {
              const val = e.target.value.replace(/[^\d]/g, ""); 
              setPrice(val);
            }}
            onBlur={() => setPrice(formatNumber(price))}
            placeholder="Nhập giá bán..."
          />
        </Form.Item>

        {/* Giá gốc */}
        <Form.Item
          label="Giá gốc"
          name="originalPrice"
          rules={[{ required: true, message: "Vui lòng nhập giá gốc" }]}
        >
          <Input
            type="tel"
            inputMode="numeric"
            value={originalPrice}
            onChange={(e) => {
              const val = e.target.value.replace(/[^\d]/g, "");
              setOriginalPrice(val);
            }}
            onBlur={() => setOriginalPrice(formatNumber(originalPrice))}
            placeholder="Nhập giá gốc..."
          />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="category"
          rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
        >
          <Select placeholder="Chọn danh mục">
            {categories?.map((cat) => (
              <Select.Option key={cat._id} value={cat._id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Divider />

        <div className="flex justify-center">
          <Button type="primary" htmlType="submit" className="w-32">
            Lưu
          </Button>
        </div>
      </Form>
    </Card>
  );
}
