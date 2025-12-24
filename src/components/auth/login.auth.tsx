"use client"

import React from "react";
import { Form, Input, Button, Typography, Card, Divider, Space, message } from "antd";
import { LockOutlined, MailOutlined, GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const { Title, Link } = Typography;

export default function LoginAuth() {
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      message.error("Sai email hoặc mật khẩu");
      return;
    } else {
      message.success("Đăng nhập thành công");
      router.push("/");
      router.refresh();
    }
  };


  const handleSocialLogin = (provider: string) => {
    signIn(provider);
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
            onClick={() => signIn("github")}
          >
            GitHub
          </Button>
        </Space>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 14 }}>
          Chưa có tài khoản? <Link href="/auth/register">Đăng ký ngay</Link>
        </div>
      </Card>
    </div>
  )
}