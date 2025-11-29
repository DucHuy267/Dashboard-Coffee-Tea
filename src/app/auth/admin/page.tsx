'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useRouter } from 'next/navigation';

export default function CreateAdminPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { username: string; password: string; masterPassword: string }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.ok) {
        message.success(data.message);
        // Chuyển về trang login sau 1s
        setTimeout(() => router.push('/auth/login'), 1000);
      } else {
        message.error(data.message);
      }
    } catch {
      message.error('Đã xảy ra lỗi server');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 16 }}>
      <Card style={{ width: '100%', maxWidth: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 8 }}>
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Tạo Admin
        </Typography.Title>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Tên admin" name="username" rules={[{ required: true, message: 'Vui lòng nhập tên admin' }]}>
            <Input placeholder="Tên admin" />
          </Form.Item>
          <Form.Item label="Mật khẩu admin" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
            <Input.Password placeholder="Mật khẩu admin" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu bảo vệ"
            name="masterPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu bảo vệ' }]}
          >
            <Input.Password placeholder="Mật khẩu bảo vệ" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Tạo Admin
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
