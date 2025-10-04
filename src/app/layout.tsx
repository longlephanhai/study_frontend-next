import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { SessionProvider } from 'next-auth/react';

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en">
    <body>
      <AntdRegistry>
        <SessionProvider>
          {children}
        </SessionProvider>
      </AntdRegistry>
    </body>
  </html>
);

export default RootLayout;