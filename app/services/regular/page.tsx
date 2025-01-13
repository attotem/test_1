"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";
import Header from "@/components/header/header";
import TableTemplate from "@/components/TableTemplate/TableTemplate";
import ServiceAddPopup from "./ServiceAddPopup";
import Pagination from "@/components/Pagination/pagination";
import { getAllServices, deleteService } from "../../../components/http";

type Service = {
  id: string;
  name: string;
  price: string;
  duration: string;
};

const RegularServices: React.FC = () => {
  const { t } = useTranslation("common");
  const [services, setServices] = useState<Service[]>([]);
  const [isServicePopupOpen, setIsServicePopupOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); 
  const [totalRecords, setTotalRecords] = useState(10); 
  const limit = 10; 

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage]);

  const fetchServices = async (page: number) => {
    try {
      const offset = (page - 1) * limit;
      const response = await getAllServices(limit, offset); 
      setServices(response); 
      // setTotalRecords(response.total); 
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleDeleteService = async (id: string) => {
    const confirmation = confirm(t("service.List.delete"));
    if (!confirmation) return;

    try {
      await deleteService(id);
      fetchServices(currentPage); 
      alert(t("service.List.deletedSuccessfully"));
    } catch (error) {
      console.error("Error deleting service:", error);
      alert(t("service.List.deleteError"));
    }
  };

  const renderServiceRow = (service: Service) => (
    <tr key={service.id}>
      <td>{service.name || t("service.List.notSpecified")}</td>
      <td>{service.price || t("service.List.notSpecified")}</td>
      <td>{service.duration || t("service.List.notSpecified")}</td>
      <td>
        <FaTrash
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteService(service.id);
          }}
          style={{ color: "red", cursor: "pointer" }}
          title={t("service.List.delete")}
        />
      </td>
    </tr>
  );

  return (
    <>
      <Header
        title={t("service.List.title")}
        onAddClick={() => setIsServicePopupOpen(true)}
      />
      <TableTemplate
        headers={[
          t("service.List.name"),
          t("service.List.price"),
          t("service.List.duration"),
        ]}
        data={services}
        renderRow={renderServiceRow}
        title={t("service.List.title")}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalRecords / limit)} 
        onPageChange={(page) => setCurrentPage(page)} 
      />
      <ServiceAddPopup
        open={isServicePopupOpen}
        onClose={() => setIsServicePopupOpen(false)}
        onServiceAdded={() => fetchServices(currentPage)} 
      />
    </>
  );
};

export default RegularServices;
