"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBars,
  FaHome,
  FaUsers,
  FaUserTie,
  FaCarSide,
  FaWrench,
  FaPlus,
  FaClipboardList,
} from "react-icons/fa";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
  onCollapse: (isCollapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (isCollapsed) {
      setIsServicesOpen(false); 
    }
  };

  const toggleServicesMenu = () => {
    if (!isCollapsed) {
      setIsServicesOpen(!isServicesOpen);
    }
  };

  useEffect(() => {
    onCollapse(isCollapsed);
    if (isCollapsed) {
      setIsServicesOpen(false); 
    }
  }, [isCollapsed, onCollapse]);

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      <button className={styles.toggleButton} onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className={styles.addWorkOrder}>
        <Link href="/workOrders/add">
          <button className={styles.addButton}>
            <FaPlus className={styles.addIcon} />
            {!isCollapsed && <span>Add Work Order</span>}
          </button>
        </Link>
      </div>

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
            <div
              className={`${styles.menuItem} ${styles.submenuToggle}`}
              onClick={toggleServicesMenu}
            >
              <FaWrench className={styles.icon} />
              {!isCollapsed && (
                <div className={styles.serviceContainer}>
                  <span className={styles.menuText}>Services</span>
                  <span className={styles.submenuArrow}>
                    {isServicesOpen ? "▲" : "▼"}
                  </span>
                </div>
              )}
            </div>
            {!isCollapsed && isServicesOpen && (
              <ul className={styles.submenu}>
                <li>
                  <Link href="/services/complex">
                    <div className={styles.submenuItem}>
                      <span>Complex Services</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/services/regular">
                    <div className={styles.submenuItem}>
                      <span>Regular Services</span>
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link href="/workOrders">
              <div className={styles.menuItem}>
                <FaClipboardList className={styles.icon} />
                <span className={styles.menuText}>All Work Orders</span>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
