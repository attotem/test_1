"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllServices, deleteService } from "../../components/http"; 
import { FaTrash } from "react-icons/fa";
import TableTemplate from "../../components/TableTemplate/TableTemplate";
import Header from "../../components/header/header";
import ServiceAddPopup from "./ServiceAddPopup";
import { useTranslation } from "react-i18next";

type Service = {
  id: string;
  name: string;
  price: string;
  duration: string;
};

const TenantServicesPage: React.FC = () => {
  const { t } = useTranslation("common");
  const [services, setServices] = useState<Service[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

  const fetchServices = async () => {
    try {
      const fetchedServices: Service[] = await getAllServices();
      setServices(fetchedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  function formatISO8601Duration(duration: string | null | undefined) {
    if (!duration) {
      return 'Invalid duration';
    }
  
    const regex = /P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
  
    const [, days, hours, minutes, seconds] = duration.match(regex) || [];
  
    const daysNum = days ? parseInt(days, 10) : 0;
    const hoursNum = hours ? parseInt(hours, 10) : 0;
    const minutesNum = minutes ? parseInt(minutes, 10) : 0;
    const secondsNum = seconds ? parseInt(seconds, 10) : 0;
  
    const parts: string[] = [];
    if (daysNum) parts.push(`${daysNum} day${daysNum > 1 ? 's' : ''}`);
    if (hoursNum) parts.push(`${hoursNum} hour${hoursNum > 1 ? 's' : ''}`);
    if (minutesNum) parts.push(`${minutesNum} minute${minutesNum > 1 ? 's' : ''}`);
    if (secondsNum) parts.push(`${secondsNum} second${secondsNum > 1 ? 's' : ''}`);
  
    return parts.length > 0 ? parts.join(', ') : 'Invalid duration';
  }
  
  
  
  useEffect(() => {
    fetchServices();
  }, []);

  const handleDeleteService = async (id: string) => {
    const confirmation = confirm(t("service.List.delete"));
    if (!confirmation) return;

    try {
      await deleteService(id); 
      setServices((prevServices) => prevServices.filter((service) => service.id !== id));
      alert(t("service.List.deletedSuccessfully"));
    } catch (error) {
      console.error("Error deleting service:", error);
      alert(t("service.List.deleteError"));
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    fetchServices();
  };

  const renderRow = (service: Service) => (
    <tr
      key={service.id}
      style={{ cursor: "pointer" }}
    >
      <td>{service.name || t("service.List.notSpecified")}</td>
      <td>{service.price || t("service.List.notSpecified")}</td>
      <td>{formatISO8601Duration(service.duration) || t("service.List.notSpecified")}</td>
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
        onAddClick={() => setIsPopupOpen(true)}
      />
      <TableTemplate
        headers={[
          t("service.List.name"),
          t("service.List.price"),
          t("service.List.duration"),
        ]}
        data={services}
        renderRow={renderRow}
        title={t("service.List.title")}
        addPath="services/add"
      />
      <ServiceAddPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onServiceAdded={handlePopupClose}
      />
    </>
  );
};

export default TenantServicesPage;
