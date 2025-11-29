import Link from 'next/link';
import { Button } from 'antd';

export default function HomePage() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Chào mừng đến Ly Since Coffee & Tea</h1>
      <p>Quản lý sản phẩm, đơn hàng và khách hàng.</p>
      {/* Chuyển hướng tới trang login trước khi vào dashboard */}
      <Link href="/auth/login">
        <Button type="primary">Vào quản lý</Button>
      </Link>
    </div>
  );
}
