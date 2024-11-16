"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./sideBar";
import { useState } from "react";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return (
    <div style={{ display: "flex" }}>
      {!isAuthPage && <Sidebar onCollapse={handleCollapse} />}
      <main
        style={{
          marginLeft: !isAuthPage ? (isCollapsed ? "3.5rem" : "250px") : "0",
          flex: 1,
          transition: "margin-left 0.3s ease", 
        }}
      >
        {children}
      </main>
    </div>
  );
}
