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
} from "antd";
import {
  HomeOutlined,
  ReadOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  MenuOutlined,
  GlobalOutlined,
  LogoutOutlined,
  SettingOutlined,
  FormOutlined,
  HistoryOutlined,
  NotificationOutlined,
  BugOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { useRouter } from 'next/navigation';
import { on } from "events";

const { Header: AntHeader } = Layout;
const { Search } = Input;

export default function Header() {
  ``
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();
  const menuItems = [
    { key: "home", label: "Trang chủ", icon: <HomeOutlined /> },
    { key: "test", label: "Đề thi", icon: <FormOutlined />, onClick: () => router.push('/test') },
    { key: "writing", label: "Luyện viết", icon: <ReadOutlined />, onClick: () => router.push('/writing') },
    { key: "speaking", label: "Luyện nói", icon: <NotificationOutlined />, onClick: () => router.push('/speaking') },
    { key: "mistake", label: "Ôn tập lỗi sai", icon: <BugOutlined />, onClick: () => router.push('/mistake') },
    { key: "vocabularies", label: "Từ vựng", icon: <ReadOutlined />, onClick: () => router.push('/vocabularies') },
    { key: "grammar", label: "Ngữ pháp", icon: <FileWordOutlined />, onClick: () => router.push('/grammar') },
  ];

  const userMenu = (
    <Menu
      items={[
        { key: "profile", label: "Hồ sơ", icon: <UserOutlined /> },
        { key: "writing-history", label: "Lịch sử bài viết", icon: <HistoryOutlined />, onClick: () => router.push('/writing/history') },
        { key: "test-history", label: "Lịch sử luyện đề", icon: <HistoryOutlined />, onClick: () => router.push('/test/history') },
        { key: "settings", label: "Cài đặt", icon: <SettingOutlined /> },
        { type: "divider" },
        { key: "logout", label: "Đăng xuất", icon: <LogoutOutlined /> },
      ]}
    />
  );

  const langMenu = (
    <Menu
      items={[
        { key: "vi", label: "Tiếng Việt" },
        { key: "en", label: "English" },
      ]}
    />
  );

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    background: "#ffffff",
    borderBottom: "1px solid #f0f0f0",
    height: 64,
  };

  const leftStyle = { display: "flex", alignItems: "center", gap: 20 };
  const logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 700,
    fontSize: 18,
  };

  const centerStyle = {
    flex: 1,
    marginLeft: 24,
    marginRight: 24,
    display: "flex",
    alignItems: "center",
  };
  const rightStyle = { display: "flex", alignItems: "center", gap: 12 };

  return (
    <AntHeader style={headerStyle}>
      <div style={leftStyle}>
        <div style={logoStyle}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg,#2f54eb,#69c0ff)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
            }}
          >
            S4
          </div>
          <span>Study 4</span>
        </div>

        {/* Desktop menu - hide on small screens via simple media query inline */}
        <div
          style={{
            marginLeft: 16,
            display: "flex",
            alignItems: "center",
          }}
          className="desktop-menu"
        >
          <Menu mode="horizontal" selectable={false} items={menuItems} />
        </div>
      </div>

      <div style={centerStyle}>
        <Search
          placeholder="Tìm khóa học, bài viết..."
          enterButton={<SearchOutlined />}
          onSearch={(v) => console.log("search", v)}
          style={{ width: "100%", maxWidth: 540 }}
        />
      </div>

      <div style={rightStyle}>
        <Dropdown overlay={langMenu} placement="bottomRight">
          <Button icon={<GlobalOutlined />}>VN</Button>
        </Dropdown>

        <Badge count={3} size="small">
          <Button shape="circle" icon={<BellOutlined />} />
        </Badge>

        <Dropdown overlay={userMenu} placement="bottomRight">
          <Avatar style={{ cursor: "pointer" }} icon={<UserOutlined />} />
        </Dropdown>

        <Button type="primary" onClick={() => console.log("start course")}>Bắt đầu</Button>

        {/* Mobile menu button */}
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          aria-label="menu"
        />
      </div>

      {/* Drawer for mobile */}
      <Drawer
        title="Study 4"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Search placeholder="Tìm kiếm" onSearch={(v) => console.log(v)} />

          <Menu mode="inline" selectable={false} items={menuItems} />

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <Button icon={<BellOutlined />}>Thông báo</Button>
            <Dropdown overlay={langMenu}>
              <Button icon={<GlobalOutlined />}>Ngôn ngữ</Button>
            </Dropdown>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Button block>Đăng nhập</Button>
            <Button block type="primary">
              Đăng ký
            </Button>
          </div>
        </Space>
      </Drawer>

      <style jsx>{`
        /* small helper to hide desktop menu on small screens */
        @media (max-width: 768px) {
          .desktop-menu {
            display: none;
          }
        }
      `}</style>
    </AntHeader>
  );
}