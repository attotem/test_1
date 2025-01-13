export const runtime = "edge";

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTenantEmployees, deleteTenantEmployee } from "../../components/http";
import { FaTrash } from "react-icons/fa";
import TableTemplate from "../../components/TableTemplate/TableTemplate";
import Header from "../../components/header/header";
import EmployeeAddPopup from "./EmployeeAddPopup";
import Pagination from "@/components/Pagination/pagination";
import { useTranslation } from "react-i18next";

type Employee = {
  id: string;
  fullname: string;
  post: {
    id: string;
    name: string;
  };
};

const TenantEmployeesPage: React.FC = () => {
  const { t } = useTranslation("common");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(100);
  const limit = 10; // Number of records per page
  const router = useRouter();

  const fetchEmployees = async (page: number) => {
    try {
      const offset = (page - 1) * limit;
      const response = await getTenantEmployees(limit, offset );
      setEmployees(response); 
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage]);

  const handleDeleteEmployee = async (id: string) => {
    const confirmation = confirm(t("employee.List.delete"));
    if (!confirmation) return;

    try {
      await deleteTenantEmployee(id);
      fetchEmployees(currentPage); 
      alert(t("employee.List.deletedSuccessfully"));
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert(t("employee.List.deleteError"));
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    fetchEmployees(currentPage); 
  };

  const renderRow = (employee: Employee) => (
    <tr
      key={employee.id}
      onClick={() => router.push(`/employees/${employee.id}`)}
      style={{ cursor: "pointer" }}
    >
      <td>{employee.fullname || t("employee.List.notSpecified")}</td>
      <td>{employee.post?.name || t("employee.List.notSpecified")}</td>
      <td>
        <FaTrash
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteEmployee(employee.id);
          }}
          style={{ color: "red", cursor: "pointer" }}
          title={t("employee.List.delete")}
        />
      </td>
    </tr>
  );

  return (
    <>
      <Header
        title={t("employee.List.title")}
        onAddClick={() => setIsPopupOpen(true)}
      />
      <TableTemplate
        headers={[
          t("employee.List.fullname"),
          t("employee.List.post"),
        ]}
        data={employees}
        renderRow={renderRow}
        title={t("employee.List.title")}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalRecords / limit)}
        onPageChange={setCurrentPage}
      />
      <EmployeeAddPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onEmployeeAdded={handlePopupClose}
      />
    </>
  );
};

export default TenantEmployeesPage;
