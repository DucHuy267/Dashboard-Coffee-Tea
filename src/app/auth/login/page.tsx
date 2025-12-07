'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, message, Card, Typography } from 'antd';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        message.success('Đăng nhập thành công!');
        router.push('/dashboard');
      } else {
        message.error(data.message);
      }
    } catch {
      message.error('Đã xảy ra lỗi');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        background: "linear-gradient(120deg, #fff0d9, #ffd9b3, #ffcc99)",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 420,
          textAlign: "center",
          borderRadius: 22,
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.75)",
          boxShadow: "0 12px 35px rgba(120,60,20,0.25)",
          border: "1px solid rgba(255,255,255,0.5)",
          transition: "0.3s",
        }}
        hoverable
      >
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 48 }}>☕</span>
        </div>

        <Typography.Title
          level={2}
          style={{
            color: "#6B3A19",
            fontWeight: 800,
            fontSize: 30,
            marginBottom: 10,
          }}
        >
          Chào mừng trở lại
        </Typography.Title>

        <p style={{ color: "#A06A3A", fontSize: 16, marginBottom: 30 }}>
          Ly Since Coffee & Tea Management ☕
        </p>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label={<span style={{ color: "#6B3A19", fontWeight: 600 }}>Tên đăng nhập</span>}
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input
              placeholder="Nhập tên đăng nhập"
              style={{
                borderRadius: 10,
                height: 45,
                borderColor: "#C48A5A",
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#6B3A19", fontWeight: 600 }}>Mật khẩu</span>}
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password
              placeholder="••••••••"
              style={{
                borderRadius: 10,
                height: 45,
                borderColor: "#C48A5A",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 50,
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 18,
                background: "linear-gradient(135deg, #d2691e, #8B4513)",
                border: "none",
                boxShadow: "0 6px 18px rgba(140,80,30,0.45)",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.transform = "scale(1.04)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = "scale(1)";
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <p style={{ marginTop: 15, fontSize: 14, color: "#996849" }}>
          © 2025 Ly Since Coffee & Tea
        </p>
      </Card>
    </div>
  );
}
