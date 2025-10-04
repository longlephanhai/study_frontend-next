"use client"

import React from "react";
import { Form, Input, Button, Typography, Card, Divider, Space } from "antd";
import { LockOutlined, MailOutlined, GithubOutlined, GoogleOutlined } from "@ant-design/icons";

const { Title, Text, Link } = Typography;

export default function Login() {
  const onFinish = (values: any) => {
    console.log("Login values:", values);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
        padding: "15px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Đăng nhập
        </Title>

        <Form name="login" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item style={{ textAlign: "right" }}>
            <Link href="#" style={{ fontSize: 14 }}>
              Quên mật khẩu?
            </Link>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        {/* Hoặc đăng nhập bằng */}
        <Divider>Hoặc đăng nhập bằng</Divider>

        <Space style={{ width: "100%", justifyContent: "center" }} size="large">
          <Button
            icon={<GoogleOutlined />}
            onClick={() => handleSocialLogin("Google")}
          >
            Google
          </Button>
          <Button
            icon={<GithubOutlined />}
            onClick={() => handleSocialLogin("GitHub")}
          >
            GitHub
          </Button>
        </Space>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 14 }}>
          Chưa có tài khoản? <Link href="/auth/register">Đăng ký ngay</Link>
        </div>
      </Card>
    </div>
  );
}
