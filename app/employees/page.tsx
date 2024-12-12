"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTenantEmployees, deleteTenantEmployee } from "../../components/http"; 
import { FaTrash } from "react-icons/fa";
import TableTemplate from "../../components/TableTemplate/TableTemplate";
import Header from "../../components/header/header";
import EmployeeAddPopup from "./EmployeeAddPopup"; 
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
  const router = useRouter();

  const fetchEmployees = async () => {
    try {
      const fetchedEmployees: Employee[] = await getTenantEmployees();
      setEmployees(fetchedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDeleteEmployee = async (id: string) => {
    const confirmation = confirm(t("employee.List.delete"));
    if (!confirmation) return;

    try {
      await deleteTenantEmployee(id); 
      setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== id));
      alert(t("employee.List.deletedSuccessfully"));
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert(t("employee.List.deleteError"));
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    fetchEmployees();
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
        addPath="employees/add"
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
