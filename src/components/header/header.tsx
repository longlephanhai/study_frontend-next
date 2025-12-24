"use client"

import React, { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Input,
  Dropdown,
  Badge,
  Avatar,
  Drawer,
  Space,
  message,
} from "antd";
import {
  HomeOutlined,
  ReadOutlined,
  BellOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  SettingOutlined,
  FormOutlined,
  HistoryOutlined,
  NotificationOutlined,
  BugOutlined,
  FileWordOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useRouter } from 'next/navigation';
import { signIn, useSession, signOut } from "next-auth/react";
import { sendRequest } from "@/utils/api";

const { Header: AntHeader } = Layout;
const { Search } = Input;

export default function Header() {
  const { data: session, status } = useSession();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();

  const menuItems = [
    { key: "home", label: "Trang chủ", icon: <HomeOutlined />, onClick: () => router.push('/') },
    { key: "test", label: "Đề thi", icon: <FormOutlined />, onClick: () => router.push('/test') },
    { key: "writing", label: "Luyện viết", icon: <ReadOutlined />, onClick: () => router.push('/writing') },
    { key: "speaking", label: "Luyện nói", icon: <NotificationOutlined />, onClick: () => router.push('/speaking') },
    { key: "mistake", label: "Ôn tập lỗi sai", icon: <BugOutlined />, onClick: () => router.push('/mistake') },
    { key: "vocabularies", label: "Từ vựng", icon: <ReadOutlined />, onClick: () => router.push('/vocabularies') },
    { key: "grammar", label: "Ngữ pháp", icon: <FileWordOutlined />, onClick: () => router.push('/grammar') },
  ];

  const userMenu = (
    <Menu
      style={{ borderRadius: '4px', border: '1px solid #f0f0f0', boxShadow: 'none' }}
      items={[
        { key: "profile", label: "Hồ sơ cá nhân", icon: <UserOutlined /> },
        { key: "writing-history", label: "Lịch sử bài viết", icon: <HistoryOutlined />, onClick: () => router.push('/writing/history') },
        { key: "test-history", label: "Lịch sử luyện đề", icon: <HistoryOutlined />, onClick: () => router.push('/test/history') },
        { key: "flash-card", label: "Flashcard", icon: <IdcardOutlined />, onClick: () => router.push('/flashcard') },
        { key: "settings", label: "Cài đặt", icon: <SettingOutlined /> },
        { type: "divider" },
        {
          key: "logout",
          label: "Đăng xuất",
          icon: <LogoutOutlined />,
          onClick: () => { handleLogout(); signOut(); }
        },
      ]}
    />
  );

  const langMenu = (
    <Menu
      style={{ borderRadius: '4px', border: '1px solid #f0f0f0' }}
      items={[
        { key: "vi", label: "Tiếng Việt" },
        { key: "en", label: "English" },
      ]}
    />
  );

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    background: "#ffffff",
    borderBottom: "1px solid #f0f0f0",
    height: 64,
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  };

  const logoStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 700,
    fontSize: 20,
    cursor: 'pointer',
    marginRight: 16
  };

  const handleLogout = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
    if (res && res.data) {
      message.success("Đăng xuất thành công");
    }
  }

  return (
    <AntHeader style={headerStyle}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={logoStyle} onClick={() => router.push('/')}>
          <span className="logo-text" style={{ color: '#262626' }}>Study 4</span>
        </div>

        <div className="desktop-menu">
          <Menu
            mode="horizontal"
            selectable={false}
            items={menuItems}
            disabledOverflow={true} 
            style={{
              borderBottom: 'none',
              minWidth: 0,
              display: 'flex', 
              height: 62
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Dropdown overlay={langMenu} trigger={['click']}>
          <Button type="text" style={{ color: '#595959' }}>VN</Button>
        </Dropdown>

        <Badge count={3} size="small" color="#ff4d4f">
          <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: 18, color: '#595959' }} />} />
        </Badge>

        <div style={{ width: '1px', height: '24px', background: '#f0f0f0', margin: '0 4px' }} className="divider-desktop" />

        {status === "loading" ? null : session ? (
          <Space size={12}>
            <Dropdown overlay={userMenu} trigger={['click']}>
              <Avatar
                style={{ cursor: "pointer", backgroundColor: '#f5f5f5', color: '#1890ff', border: '1px solid #f0f0f0' }}
                icon={<UserOutlined />}
                src={session?.user?.avatar}
              />
            </Dropdown>
            <Button
              type="text"
              danger
              onClick={() => {
                handleLogout();
                signOut();
              }}
            >
              Đăng xuất
            </Button>
          </Space>
        ) : (
          <Button
            type="primary"
            style={{ borderRadius: '4px', boxShadow: 'none' }}
            onClick={() => router.push('/auth/login')}
          >
            Đăng nhập
          </Button>
        )}

        <Button
          className="mobile-toggle"
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
        />
      </div>

      <Drawer
        title="Study 4"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={260}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Search placeholder="Tìm kiếm..." onSearch={(v) => console.log(v)} />
          <Menu mode="inline" selectable={false} items={menuItems} style={{ border: 'none' }} />
        </Space>
      </Drawer>

      <style jsx global>{`
        /* Reset antd shadow */
        .ant-btn { box-shadow: none !important; }
        .ant-input-search-button { box-shadow: none !important; }
        
        .ant-menu-horizontal {
          border-bottom: none !important;
        }
        .ant-menu-item:hover {
          color: #1890ff !important;
        }
        
        @media (max-width: 1200px) {
          .logo-text { display: none; }
        }

        @media (max-width: 992px) {
          .desktop-menu, .search-container, .divider-desktop {
            display: none !important;
          }
        }
        
        @media (min-width: 993px) {
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </AntHeader>
  );
}