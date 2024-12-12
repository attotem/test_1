"use client"

import React, { useState, useEffect } from "react";
import { getUserClients, deleteClient, applyTags, removeTags, getAllTags } from "../../components/http";
import { FaTrash, FaExternalLinkAlt } from "react-icons/fa"; // Добавляем иконку для перехода
import TableTemplate from "../../components/TableTemplate/TableTemplate";
import ClientAddPopup from "./ClientAddPopup";
import Header from "../../components/header/header";
import TagSelector from "./TagSelector";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
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

type Tag = {
  id: string;
  name: string;
  colour: string;
};

const ClientsPage: React.FC = () => {
  const { t } = useTranslation("common");
  const [clients, setClients] = useState<Client[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const fetchClients = async () => {
    try {
      const fetchedClients: Record<string, Client> = await getUserClients();
      setClients(Object.values(fetchedClients));
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const fetchedTags = await getAllTags();
      setTags(fetchedTags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchTags();
  }, []);

  const handleDeleteClient = async (id: string) => {
    const confirmation = confirm("Are you sure you want to delete this client?");
    if (!confirmation) return;

    try {
      await deleteClient(id);
      setClients((prevClients) => prevClients.filter((client) => client.id !== id));
      alert("Client successfully deleted!");
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleApplyTags = async (clientId: string, tagsToAdd: string[], tagsToRemove: string[]) => {
    try {
      if (tagsToAdd.length > 0) {
        await applyTags([{ client_id: clientId, tags_ids: tagsToAdd }]);
      }
      if (tagsToRemove.length > 0) {
        await removeTags([{ client_id: clientId, tags_ids: tagsToRemove }]);
      }
      fetchClients();
    } catch (error) {
      console.error("Error applying tags:", error);
    }
  };

  const headers = [
    t("client.List.client"),
    t("client.List.phoneNumber"),
    t("client.List.passportNumber"),
    t("client.List.source"),
    t("client.List.cars"),
  ];

  const renderRow = (client: Client) => {
    const [isEditingTags, setIsEditingTags] = useState(false);
    const clientTags = client.tags || [];

    return (
      <tr key={client.id} style={{ position: "relative" }}>
        <td>
          {client.fullname || "Not specified"}
          <TagSelector
            clientId={client.id}
            availableTags={tags}
            selectedTags={client.tags || []}
            onApplyTags={(tagsToAdd, tagsToRemove) => {
              handleApplyTags(client.id, tagsToAdd, tagsToRemove);
            }}
            onClose={() => setIsEditingTags(false)}
            editable={isEditingTags}
            setEditable={setIsEditingTags}
          />
        </td>

        <td>{client.phone_number || "Not specified"}</td>
        <td>{client.passport_number || "Not specified"}</td>
        <td>{client.source?.join(", ") || "Not specified"}</td>
        <td>
          {client.cars?.length
            ? client.cars.map((car) => `${car.manufacturer} ${car.model}`).join(", ")
            : "No cars"}
        </td>
        <td>
          <Box display="flex" gap="10px" alignItems="center">
            <FaTrash
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => handleDeleteClient(client.id)}
            />
            <FaExternalLinkAlt
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => window.location.href = `/clients/client/${client.id}`} 
            />
          </Box>
        </td>
      </tr>
    );
  };

  return (
    <>
      <Header title="Clients List" onAddClick={() => setIsPopupOpen(true)} />
      <TableTemplate
        headers={headers}
        data={clients}
        renderRow={renderRow}
        title={t("client.List.title")}
        addPath="#"
      />
      <ClientAddPopup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} onClientAdded={fetchClients} />
    </>
  );
};

export default ClientsPage;
