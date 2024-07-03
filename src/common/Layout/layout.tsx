import React, { ReactNode } from 'react';
import Nav from '../Header/header';
import Footer from '../Footer/footer';

type LayoutProps = {
  children: ReactNode;
  routes: { name: string, link: string }[]
};

export const Layout = ({ children, routes }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen w-full ">
      <Nav routes={routes} />
      <main className="relative flex-1 mt-28 pb-8">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
