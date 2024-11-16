// components/Sidebar.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaHome, FaTachometerAlt, FaTools } from "react-icons/fa";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
  onCollapse: (isCollapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    onCollapse(isCollapsed);
  }, [isCollapsed, onCollapse]);

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      <button className={styles.toggleButton} onClick={toggleSidebar}>
        <FaBars />
      </button>
      <nav className={styles.menu}>
        <ul>
          <li>
            <Link href="/">
              <div className={styles.menuItem}>
                <FaHome /> <span className={styles.menuText}>Dashboard</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/clients">
              <div className={styles.menuItem}>
                <FaTachometerAlt /> <span className={styles.menuText}>Clients</span>
              </div>
            </Link>
          </li>
          {/* <li>
            <div className={styles.menuItem}>
              <FaTools /> <span className={styles.menuText}>Settings</span>
            </div>
            <ul className={styles.submenu}>
              <li>
                <Link href="/settings/profile">
                  <div className={styles.submenuItem}>Profile</div>
                </Link>
              </li>
              <li>
                <Link href="/settings/preferences">
                  <div className={styles.submenuItem}>Preferences</div>
                </Link>
              </li>
            </ul>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
