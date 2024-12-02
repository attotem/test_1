"use client";

import React from "react";
import { FaPlus, FaFileImport, FaFileExport } from "react-icons/fa";
import styles from "./Header.module.scss";

interface HeaderProps {
  title: string;
  onAddClick?: () => void; 
  showImportExport?: boolean;
  onImportClick?: () => void; 
  onExportClick?: () => void; 
}

const Header: React.FC<HeaderProps> = ({
  title,
  onAddClick,
  showImportExport = false,
  onImportClick,
  onExportClick,
}) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={onAddClick}>
          <FaPlus className={styles.icon} />
        </button>
        {showImportExport && (
          <>
            <button className={styles.button} onClick={onImportClick}>
              <FaFileImport className={styles.icon} />
            </button>
            <button className={styles.button} onClick={onExportClick}>
              <FaFileExport className={styles.icon} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
