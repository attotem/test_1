"use client";

import React, { useState, useEffect } from "react";
import { getUserClients, deleteClient } from "../../components/http";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { Chip } from "@mui/material";
import TableTemplate from "../../components/TableTemplate/TableTemplate";
import ClientAddPopup from "./ClientAddPopup";
import Header from "../../components/header/header";
import { useTranslation } from "react-i18next";

type Client = {
  id: string;
  fullname: string;
  passport_number: string | null;
  phone_number: string | null;
  email: string | null;
  source: string[] | null;
  cars?: {
    id: string;
    manufacturer: string;
    model: string;
    reg_number: string;
  }[];
  tags?: {
    id: string;
    name: string;
    colour: string;
  }[];
};

const ClientsPage: React.FC = () => {
  const { t } = useTranslation("common");
  const [clients, setClients] = useState<Client[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

  const fetchClients = async () => {
    try {
      const fetchedClients: Record<string, Client> = await getUserClients();
      if (fetchedClients) {
        setClients(Object.values(fetchedClients));
      } else {
        console.error(t("client.List.noData"));
      }
    } catch (error) {
      console.error(t("client.List.errorFetchingClients"), error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDeleteClient = async (id: string) => {
    const confirmation = confirm(t("client.List.confirmDelete"));
    if (!confirmation) return;

    try {
      await deleteClient(id);
      setClients((prevClients) => prevClients.filter((client) => client.id !== id));
      alert(t("client.List.successfullyDeleted"));
    } catch (error) {
      console.error(t("client.List.errorDeletingClient"), error);
      alert(t("client.List.deleteError"));
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    fetchClients();
  };

  const headers = [
    t("client.List.client"),
    t("client.List.phoneNumber"),
    t("client.List.passportNumber"),
    t("client.List.source"),
    t("client.List.cars"),
  ];

  const renderRow = (client: Client) => (
    <tr key={client.id} style={{ cursor: "pointer" }} onClick={() => router.push(`/clients/client/${client.id}`)}>
      <td>
        {client.fullname || t("client.List.notSpecified")}
        <div>
          {client.tags &&
            client.tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                sx={{
                  backgroundColor: tag.colour,
                  color: "#fff",
                  marginRight: "5px",
                  marginTop: "5px",
                  fontWeight: "bold",
                }}
                size="small"
              />
            ))}
        </div>
      </td>
      <td>{client.phone_number || t("client.List.notSpecified")}</td>
      <td>{client.passport_number || t("client.List.notSpecified")}</td>
      <td>{client.source ? client.source.join(", ") : t("client.List.notSpecified")}</td>
      <td>
        {client.cars && client.cars.length > 0
          ? client.cars.map((car) => `${car.manufacturer} ${car.model} (${car.reg_number})`).join(", ")
          : t("client.List.noCars")}
      </td>
      <td>
        <FaTrash
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClient(client.id);
          }}
          style={{ color: "red", cursor: "pointer" }}
          title={t("client.List.delete")}
        />
      </td>
    </tr>
  );

  return (
    <>
      <Header title={t("client.List.title")} onAddClick={() => setIsPopupOpen(true)} />
      <TableTemplate
        headers={headers}
        data={clients}
        renderRow={renderRow}
        title={t("client.List.title")}
        addPath="#"
      />
      <ClientAddPopup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} onClientAdded={handlePopupClose} />
    </>
  );
};

export default ClientsPage;
