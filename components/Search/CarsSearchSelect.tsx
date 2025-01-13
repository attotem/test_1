"use client";

import React from "react";
import AsyncSelect from "react-select/async";
import { searchCars } from "../http"; // Функция для поиска машин с бэкенда

type Car = {
  id: string;
  reg_number: string;
  manufacturer: string;
  model: string;
};

type CarSearchSelectProps = {
  onCarSelect: (carId: string, carLabel: string) => void; // Обработчик выбора машины
  placeholder: string;
  currentCar: { id: string; label: string } | null; // Текущая выбранная машина
};

const CarSearchSelect: React.FC<CarSearchSelectProps> = ({
  onCarSelect,
  placeholder,
  currentCar,
}) => {
  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: "white",
      borderColor: "#ced4da",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#80bdff",
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "white",
      zIndex: 5,
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#6c757d",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#495057",
    }),
  };

  const loadCars = async (inputValue: string) => {
    try {
      const fetchedCars: Car[] = await searchCars(inputValue); // Загружаем данные с сервера
      return fetchedCars.map((car) => ({
        value: car.id,
        label: `${car.manufacturer} ${car.model} (${car.reg_number})`,
      }));
    } catch (error) {
      console.error("Error fetching cars:", error);
      return [];
    }
  };

  const handleChange = (selectedOption: any) => {
    if (selectedOption) {
      onCarSelect(selectedOption.value, selectedOption.label); // Передаём ID и метку машины
    }
  };

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={loadCars}
      onChange={handleChange}
      placeholder={placeholder}
      styles={customStyles}
      value={currentCar ? { value: currentCar.id, label: currentCar.label } : null}
    />
  );
};

export default CarSearchSelect;
