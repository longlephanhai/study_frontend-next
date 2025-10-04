"use client"

import { Layout, Space } from "antd"
import {
  FacebookFilled,
  YoutubeFilled,
  GithubFilled,
  LinkedinFilled,
} from "@ant-design/icons"

const { Footer: AntFooter } = Layout

export default function Footer() {
  return (
    <AntFooter
      style={{
        backgroundColor: "#f0f2f5", // nền sáng
        textAlign: "center",
        padding: "40px 20px",
      }}
    >
      {/* Thông tin & liên kết */}
      <div style={{ marginBottom: 16, fontSize: 14, color: "#000" }}>
        <strong>Edu Study ©2025</strong> |{" "}
        <a href="#" style={{ color: "#1890ff", margin: "0 8px" }}>
          Giới thiệu
        </a>
        |
        <a href="#" style={{ color: "#1890ff", margin: "0 8px" }}>
          Điều khoản
        </a>
        |
        <a href="#" style={{ color: "#1890ff", margin: "0 8px" }}>
          Chính sách
        </a>
        |
        <a href="#" style={{ color: "#1890ff", margin: "0 8px" }}>
          Liên hệ
        </a>
      </div>

      {/* Social icons */}
      <Space size="large">
        <a href="#" style={{ color: "#1890ff", fontSize: 20 }}>
          <FacebookFilled />
        </a>
        <a href="#" style={{ color: "#1890ff", fontSize: 20 }}>
          <YoutubeFilled />
        </a>
        <a href="#" style={{ color: "#1890ff", fontSize: 20 }}>
          <GithubFilled />
        </a>
        <a href="#" style={{ color: "#1890ff", fontSize: 20 }}>
          <LinkedinFilled />
        </a>
      </Space>

      <div style={{ marginTop: 16, fontSize: 12, color: "#555" }}>
        Thiết kế và phát triển bởi Edu Team
      </div>
    </AntFooter>
  )
}
