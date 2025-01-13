import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { searchClients } from "../http";

type Client = {
  id: string;
  fullname: string;
};

type ClientSearchSelectProps = {
  onClientSelect: (clientId: string, clientFullname: string) => void;
  placeholder: string;
  currentClient: { id: string; fullname: string } | null; 
};

const ClientSearchSelect: React.FC<ClientSearchSelectProps> = ({
  onClientSelect,
  placeholder,
  currentClient,
}) => {
  const [selectedClient, setSelectedClient] = useState<{
    value: string;
    label: string;
  } | null>(
    currentClient
      ? {
          value: currentClient.id,
          label: currentClient.fullname,
        }
      : null
  );

  useEffect(() => {
    if (currentClient) {
      setSelectedClient({
        value: currentClient.id,
        label: currentClient.fullname,
      });
    } else {
      setSelectedClient(null);
    }
  }, [currentClient]);

  const loadClients = async (inputValue: string) => {
    if (!inputValue.trim()) return [];
    try {
      const fetchedClients: Client[] = await searchClients(inputValue);
      return fetchedClients.map((client) => ({
        value: client.id,
        label: client.fullname,
      }));
    } catch (error) {
      console.error("Error fetching clients:", error);
      return [];
    }
  };

  const handleChange = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedClient(selectedOption);
      onClientSelect(selectedOption.value, selectedOption.label); 
    }
  };

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={loadClients}
      onChange={handleChange}
      placeholder={placeholder}
      value={selectedClient}
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
        menu: (base) => ({
          ...base,
          backgroundColor: "white",
          zIndex: 5,
        }),
        placeholder: (base) => ({
          ...base,
          color: "#6c757d",
        }),
        singleValue: (base) => ({
          ...base,
          color: "#495057",
        }),
      }}
    />
  );
};

export default ClientSearchSelect;
