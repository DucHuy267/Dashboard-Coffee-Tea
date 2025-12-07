import Link from 'next/link';
import { Button, Card } from 'antd';

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #fff5e6 0%, #ffd9b3 100%)",
      }}
    >
      <Card
        style={{
          width: 480,
          textAlign: "center",
          borderRadius: 20,
          padding: 30,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(10px)",
        }}
      >
         <span style={{ fontSize: 48 }}>☕</span>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 10,
            color: "#6B3A19",
          }}
        >
          Ly Since Coffee & Tea
        </h1>

        <p style={{ fontSize: 16, color: "#8c5a2b", marginBottom: 25 }}>
          Nền tảng quản lý bán hàng & thống kê doanh thu chuyên nghiệp
        </p>

        <Link href="/auth/login">
          <Button
            type="primary"
            size="large"
            style={{
              width: "100%",
              height: 48,
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 18,
              background: "linear-gradient(135deg, #d2691e, #8B4513)",
              border: "none",
              boxShadow: "0 6px 15px rgba(140,80,30,0.5)",
            }}
          >
            🚀 Vào quản lý
          </Button>
        </Link>
      </Card>
    </div>
  );
}
