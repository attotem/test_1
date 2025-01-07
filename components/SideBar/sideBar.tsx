"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaHome, FaUsers, FaUserTie, FaCarSide,FaWrench   } from "react-icons/fa";
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
                <FaHome className={styles.icon} />
                <span className={styles.menuText}>Dashboard</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/clients">
              <div className={styles.menuItem}>
                <FaUsers className={styles.icon} />
                <span className={styles.menuText}>Clients</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/cars">
              <div className={styles.menuItem}>
                <FaCarSide className={styles.icon} />
                <span className={styles.menuText}>Cars</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/employees">
              <div className={styles.menuItem}>
                <FaUserTie className={styles.icon} />
                <span className={styles.menuText}>Employees</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/services">
              <div className={styles.menuItem}>
                <FaWrench   className={styles.icon} />
                <span className={styles.menuText}>Services</span>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;