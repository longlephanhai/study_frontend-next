"use client"

import Footer from '@/components/footer/footer';
import Header from '@/components/header/header';
import React from 'react';
import { Layout } from 'antd';
import AIHelper from '@/components/aihelper/AIHelper';

const { Content } = Layout;

const RootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content
        style={{
          padding: '24px 48px',
          backgroundColor: '#ffffff',
          flex: 1,
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {children}
          <AIHelper />
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default RootLayout;
