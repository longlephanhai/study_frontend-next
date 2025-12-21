"use client"

import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, Upload, Divider, Space, message } from "antd";
import { UploadOutlined, MailOutlined, LockOutlined, UserOutlined, PhoneOutlined, HomeOutlined, GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const { Title, Link } = Typography;

export default async function Register() {

  const session = await auth();
  if(session){
    redirect('/')
  }

  const [avatarFile, setAvatarFile] = useState<any>(null);

  const onFinish = (values: any) => {
    console.log("Register values:", { ...values, avatar: avatarFile });
  };

  const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ chấp nhận file ảnh!");
    } else {
      setAvatarFile(file);
    }
    return false;
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`Signup with ${provider}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Đăng ký
        </Title>

        <Form name="register" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            label="Tuổi"
            name="age"
            rules={[{ required: true, message: "Vui lòng nhập tuổi!" }]}
          >
            <Input type="number" placeholder="Age" />
          </Form.Item>

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
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Phone" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input prefix={<HomeOutlined />} placeholder="Address" />
          </Form.Item>

          <Form.Item label="Avatar">
            <Upload beforeUpload={beforeUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {avatarFile && <span style={{ marginLeft: 8 }}>{avatarFile.name}</span>}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <Divider>Hoặc đăng ký bằng</Divider>

        <Space style={{ width: "100%", justifyContent: "center" }} size="large">
          <Button
            icon={<GoogleOutlined />}
            onClick={() => handleSocialSignup("Google")}
          >
            Google
          </Button>
          <Button
            icon={<GithubOutlined />}
            onClick={() => handleSocialSignup("GitHub")}
          >
            GitHub
          </Button>
        </Space>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 14 }}>
          Đã có tài khoản? <Link href="/auth/login">Đăng nhập ngay</Link>
        </div>
      </Card>
    </div>
  );
}
