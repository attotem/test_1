import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { searchServices } from "../http"; // Функция для поиска сервисов

type Service = {
  id: string;
  name: string;
  is_complex: boolean;
};

type MultiServiceSelectProps = {
  onServicesChange: (services: Service[]) => void; // Колбэк для передачи выбранных сервисов
  placeholder: string;
};

const MultiServiceSelect: React.FC<MultiServiceSelectProps> = ({
  onServicesChange,
  placeholder,
}) => {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  const loadServices = async (inputValue: string) => {
    if (!inputValue.trim()) return [];
    try {
      const fetchedServices: Service[] = await searchServices(inputValue);
      return fetchedServices.map((service) => ({
        value: service.id,
        label: service.name + (service.is_complex ? " (Complex)" : ""),
        is_complex: service.is_complex,
      }));
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  };

  const handleChange = (selectedOptions: any) => {
    const selected = selectedOptions.map((option: any) => ({
      id: option.value,
      name: option.label,
      is_complex: option.is_complex,
    }));
    setSelectedServices(selected);
    onServicesChange(selected);
  };

  return (
    <AsyncSelect
      isMulti
      cacheOptions
      defaultOptions
      loadOptions={loadServices}
      onChange={handleChange}
      placeholder={placeholder}
      value={selectedServices.map((service) => ({
        value: service.id,
        label: service.name + (service.is_complex ? " (Complex)" : ""),
      }))}
      styles={{
        control: (base) => ({
          ...base,
          backgroundColor: "white",
          borderColor: "#ced4da",
          boxShadow: "none",
          "&:hover": {
            borderColor: "#80bdff",
          },
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: "#f1f4f8",
          color: "#495057",
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: "#495057",
        }),
        multiValueRemove: (base) => ({
          ...base,
          color: "#d9534f",
          ":hover": {
            backgroundColor: "#f5c6cb",
            color: "#a94442",
          },
        }),
      }}
    />
  );
};

export default MultiServiceSelect;
