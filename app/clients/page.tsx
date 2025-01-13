"use client";

import React, { useState, useEffect } from "react";
import { getUserClients, deleteClient, applyTags, removeTags, getAllTags } from "../../components/http";
import { FaTrash, FaExternalLinkAlt } from "react-icons/fa";
import TableTemplate from "../../components/TableTemplate/TableTemplate";
import ClientAddPopup from "./ClientAddPopup";
import Header from "../../components/header/header";
import TagSelector from "./TagSelector";
import Pagination from "@/components/Pagination/pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(10);
  const limit = 3; 

  const fetchClients = async (page: number) => {
    try {
      const offset = (page - 1) * limit;
      const response = await getUserClients(limit, offset);
      setClients(Object.values(response)); 
      // setTotalRecords(response.total); 
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
    fetchClients(currentPage);
    fetchTags();
  }, [currentPage]);

  const handleDeleteClient = async (id: string) => {
    const confirmation = confirm("Are you sure you want to delete this client?");
    if (!confirmation) return;

    try {
      await deleteClient(id);
      fetchClients(currentPage);
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
      fetchClients(currentPage);
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
        <td style={{ width: "20%" }}>
          {client.fullname || "-"}
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

        <td style={{ width: "20%" }}>{client.phone_number || "-"}</td>
        <td style={{ width: "20%" }}>{client.passport_number || "-"}</td>
        <td style={{ width: "10%" }}>{client.source?.join(", ") || "-"}</td>
        <td style={{ width: "20%" }}>
          {client.cars?.length
            ? client.cars.map((car) => `${car.manufacturer} ${car.model}`).join(", ")
            : "-"}
        </td>
        <td style={{ width: "10%" }}>
          <Box display="flex" gap="10px" alignItems="center">
            <FaTrash
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => handleDeleteClient(client.id)}
            />
            <FaExternalLinkAlt
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => (window.location.href = `/clients/client/${client.id}`)}
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
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalRecords / limit)}
        onPageChange={setCurrentPage}
      />
      <ClientAddPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onClientAdded={() => fetchClients(currentPage)}
      />
    </>
  );
};

export default ClientsPage;
