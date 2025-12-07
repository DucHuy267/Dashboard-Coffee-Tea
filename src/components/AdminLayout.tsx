'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Grid, message } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const screens = useBreakpoint();

  const [collapsed, setCollapsed] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  /** Xác định menu đang chọn */
  const selectedKey = (() => {
    if (pathname.startsWith('/dashboard/products')) return '1';
    if (pathname.startsWith('/dashboard/categories')) return '2';
    if (pathname.startsWith('/dashboard/orders')) return '3';
    if (pathname.startsWith('/dashboard/customers')) return '4';
    return '0';
  })();

  /** Tự collapse khi màn hình nhỏ */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCollapsed(!screens.lg);
  }, [screens.lg]);

  /** Kiểm tra token login */
  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('username');

    if (!token) {
      router.replace('/auth/login'); // ⭐ SỬA LẠI ĐÚNG ROUTE LOGIN
      return;
    }

    try {
      const decoded: TokenPayload = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        message.warning('Phiên đăng nhập đã hết hạn.');
        router.replace('/auth/login');
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUsername(name);
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      router.replace('/auth/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.replace('/auth/login');
  };

  const menuItems = [
    { key: '0', label: <Link href="/dashboard">📊 Tổng quan</Link> },
    { key: '1', label: <Link href="/dashboard/products">📦 Sản phẩm</Link> },
    { key: '2', label: <Link href="/dashboard/categories">🗂️ Danh mục</Link> },
    { key: '3', label: <Link href="/dashboard/orders">🧾 Đơn hàng</Link> },
    { key: '4', label: <Link href="/dashboard/customers">👥 Khách hàng</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh'}}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={230}
        breakpoint="lg"
        collapsedWidth={screens.lg ? 80 : 0}
        style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 , background: '#f8f6f2'}}
      >
        <div
          style={{
            height: 50,
            margin: 16,
            color: '#64472d',
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 'bold',
            letterSpacing: 1,
            borderBottom: '2px solid #eee',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          LY SINCE
          <h6> Coffe & Tea</h6>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          className="custom-menu"
          style={{ background: "#f8f6f2" }}
        />

      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? (screens.lg ? 80 : 0) : 230,
          transition: 'all 0.2s',
        }}
      >
        <Header
          style={{
            background: '#f8f6f2',
            padding: '0 20px',
            fontSize: 16,
            fontWeight: 500,
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <span>Admin </span>
          <div>
            {/* {!screens.lg && (
              <Button type="text" onClick={() => setCollapsed(!collapsed)} style={{ marginRight: 10 }}>
                ☰
              </Button>
            )} */}
            {username && <span style={{ marginRight: 15 }}>Xin chào, <b>{username}</b></span>}
            <Button type="primary" onClick={handleLogout}
                    style={{background: '#64472d'}}>
              Đăng xuất
            </Button>
          </div>
        </Header>

        <Content
          style={{
            padding: 20,
            background: '#f8f6f2',
            borderRadius: 8,
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
