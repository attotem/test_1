export const runtime = "edge";

"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";
import Header from "../../../components/header/header";
import TableTemplate from "../../../components/TableTemplate/TableTemplate";
import ComplexServiceAddPopup from "./ComplexServiceAddPopup";
import Pagination from "@/components/Pagination/pagination";
import { getAllComplexServices, deleteComplexService } from "../../../components/http";

type ComplexService = {
  id: string;
  name: string;
  description: string;
};

const ComplexServices: React.FC = () => {
  const { t } = useTranslation("common");
  const [complexServices, setComplexServices] = useState<ComplexService[]>([]);
  const [isComplexServicePopupOpen, setIsComplexServicePopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalRecords, setTotalRecords] = useState(10); 
  const limit = 1; 

  useEffect(() => {
    fetchComplexServices(currentPage);
  }, [currentPage]);

  const fetchComplexServices = async (page: number) => {
    try {
      const offset = (page - 1) * limit;
      const response = await getAllComplexServices(limit, offset); 
      setComplexServices(response);
      // setTotalRecords(response.total);
    } catch (error) {
      console.error("Error fetching complex services:", error);
    }
  };

  const handleDeleteComplexService = async (id: string) => {
    const confirmation = confirm(t("complexService.List.delete"));
    if (!confirmation) return;

    try {
      await deleteComplexService(id);
      fetchComplexServices(currentPage);
      alert(t("complexService.List.deletedSuccessfully"));
    } catch (error) {
      console.error("Error deleting complex service:", error);
      alert(t("complexService.List.deleteError"));
    }
  };

  const renderComplexServiceRow = (complexService: ComplexService) => (
    <tr key={complexService.id}>
      <td>{complexService.name || t("complexService.List.notSpecified")}</td>
      <td>{complexService.description || t("complexService.List.notSpecified")}</td>
      <td>
        <FaTrash
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteComplexService(complexService.id);
          }}
          style={{ color: "red", cursor: "pointer" }}
          title={t("complexService.List.delete")}
        />
      </td>
    </tr>
  );

  return (
    <>
      <Header
        title={t("complexService.List.title")}
        onAddClick={() => setIsComplexServicePopupOpen(true)}
      />
      <TableTemplate
        headers={[
          t("complexService.List.name"),
          t("complexService.List.description"),
        ]}
        data={complexServices}
        renderRow={renderComplexServiceRow}
        title={t("complexService.List.title")}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalRecords / limit)}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <ComplexServiceAddPopup
        open={isComplexServicePopupOpen}
        onClose={() => setIsComplexServicePopupOpen(false)}
        onComplexServiceAdded={() => fetchComplexServices(currentPage)}
      />
    </>
  );
};

export default ComplexServices;
