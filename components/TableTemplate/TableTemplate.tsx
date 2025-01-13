"use client";

import React from "react";
import styles from "./TableTemplate.module.scss";

type TableTemplateProps = {
  headers: string[];
  data: any[];
  renderRow: (item: any) => JSX.Element;
  title: string;
};

const TableTemplate: React.FC<TableTemplateProps> = ({ headers, data, renderRow, title }) => {
  return (
    <div className={styles.tablePage}>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className={styles.headerCell}>
                  {header}
                </th>
              ))}
              <th className={styles.headerCell}></th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => renderRow(item))
            ) : (
              <tr>
                <td colSpan={headers.length + 1} className={styles.noDataCell}>
                  -
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableTemplate;
