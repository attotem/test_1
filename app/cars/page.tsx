"use client";

import React, { useState, useEffect } from "react";
import { getCars, deleteCar } from "../../components/http";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import TableTemplate from "../../components/TableTemplate/TableTemplate";
import Header from "../../components/header/header";
import Pagination from "../../components/Pagination/Pagination"
import CarAddPopup from "./CarAddPopup";
import { useTranslation } from "react-i18next";

// sfasfas 
type Car = {
  id: string;
  manufacturer: string;
  model: string;
  reg_number: string;
  year: number | null;
  mileage: number | null;
  client?: {
    fullname: string;
  };
};

const CarsPage: React.FC = () => {
  const { t } = useTranslation("common");
  const [cars, setCars] = useState<Car[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(10);
  const limit = 3; 
  const router = useRouter();

  const fetchCars = async (page: number) => {
    try {
      const offset = (page - 1) * limit;
      const response = await getCars(limit, offset); 
      setCars(response); 
      // setTotalRecords(response.total);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    fetchCars(currentPage);
  }, [currentPage]);

  const handleDeleteCar = async (id: string) => {
    const confirmation = confirm(t("car.List.delete"));
    if (!confirmation) return;

    try {
      await deleteCar(id);
      fetchCars(currentPage); 
      alert(t("car.List.deletedSuccessfully"));
    } catch (error) {
      console.error("Error deleting car:", error);
      alert(t("car.List.deleteError"));
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    fetchCars(currentPage); 
  };

  const renderRow = (car: Car) => (
    <tr
      key={car.id}
      onClick={() => router.push(`/cars/${car.id}`)}
      style={{ cursor: "pointer" }}
    >
      <td>{car.manufacturer || t("car.List.notSpecified")}</td>
      <td>{car.model || t("car.List.notSpecified")}</td>
      <td>{car.reg_number || t("car.List.notSpecified")}</td>
      <td>{car.year || t("car.List.notSpecified")}</td>
      <td>{car.mileage ? `${car.mileage} км` : t("car.List.notSpecified")}</td>
      <td>{car.client?.fullname || t("car.List.withoutClient")}</td>
      <td>
        <FaTrash
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCar(car.id);
          }}
          style={{ color: "red", cursor: "pointer" }}
          title={t("car.List.delete")}
        />
      </td>
    </tr>
  );

  return (
    <>
      <Header
        title={t("car.List.title")}
        onAddClick={() => setIsPopupOpen(true)}
      />
      <TableTemplate
        headers={[
          t("car.List.manufacturer"),
          t("car.List.model"),
          t("car.List.regNumber"),
          t("car.List.year"),
          t("car.List.mileage"),
          t("car.List.client"),
        ]}
        data={cars}
        renderRow={renderRow}
        title={t("car.List.title")}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalRecords / limit)} 
        onPageChange={(page) => setCurrentPage(page)} 
      />
      <CarAddPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onCarAdded={handlePopupClose}
      />
    </>
  );
};

export default CarsPage;
