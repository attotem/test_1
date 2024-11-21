"use client";

import React, { useState, useEffect } from "react";
import styles from "./ClientPage.module.scss";
import { getUserClients, deleteClient } from "../../components/http";
import { useRouter } from "next/navigation";
import { FaTrash, FaPlus, FaFileExport, FaFileImport, FaEdit } from "react-icons/fa";
import { Chip } from "@mui/material"; // Импортируем компонент Chip для отображения тегов

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
    vin_number: string | null;
    year: number | null;
    note: string | null;
    mileage: number | null;
    custom_params: any;
    created_at: string;
  }[];
  custom_params?: any;
  tags?: {
    id: string;
    name: string;
    description: string | null;
    colour: string;
  }[];
  created_at: string;
  last_update: string;
};

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const fetchedClients: Record<string, Client> = await getUserClients();
        if (fetchedClients) {
          const clientsArray = Object.values(fetchedClients);
          setClients(clientsArray);
        } else {
          console.error("No clients data received.");
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const handleEditClient = (id: string) => {
    router.push(`/clients/client/${id}`);
  };

  const handleDeleteClient = async (id: string) => {
    const confirmation = confirm("Вы уверены, что хотите удалить этого клиента?");
    if (!confirmation) return;

    try {
      await deleteClient(id);
      setClients((prevClients) => prevClients.filter((client) => client.id !== id));
      alert("Клиент успешно удален!");
    } catch (error) {
      console.error("Ошибка при удалении клиента:", error);
      alert("Произошла ошибка при удалении клиента.");
    }
  };

  return (
    <div className={styles.clientPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>База контрагентов</h1>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={() => router.push("clients/add")}>
            <FaPlus className={styles.icon} />
          </button>
          <button className={styles.button}>
            <FaFileImport className={styles.icon} />
          </button>
          <button className={styles.button}>
            <FaFileExport className={styles.icon} />
          </button>
        </div>
      </div>
      <table className={styles.clientTable}>
        <thead>
          <tr>
            <th>Клиент</th>
            <th>Мобильный номер</th>
            <th>Гос.Номер</th>
            <th>Источник</th>
            <th>Машины</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <tr key={client.id} className={styles.clientRow}>
                <td style={{ cursor: "pointer" }}>
                  <div>
                    {client.fullname || "Не указано"}
                    <div className={styles.tagsContainer}>
                      {client.tags && client.tags.length > 0 ? (
                        client.tags.map((tag) => (
                          <Chip
                            key={tag.id}
                            label={tag.name}
                            sx={{
                              backgroundColor: tag.colour || "#9e9e9e",
                              color: "#fff",
                              marginRight: "5px",
                              marginTop: "5px",
                              fontWeight: "bold",
                            }}
                            size="small"
                          />
                        ))
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </td>
                <td>{client.phone_number || "Не указано"}</td>
                <td>{client.passport_number || "Не указано"}</td>
                <td>
                  {client.source
                    ? Array.isArray(client.source)
                      ? client.source.join(", ")
                      : client.source
                    : "Не указано"}
                </td>
                <td>
                  {client.cars && client.cars.length > 0
                    ? client.cars.map((car) => `${car.manufacturer} ${car.model} (${car.reg_number})`).join(", ")
                    : "Нет машин"}
                </td>
                <td className={styles.actionButtons}>
                  <FaEdit
                    onClick={() => handleEditClient(client.id)}
                    className={styles.editIcon}
                    style={{ color: "blue", cursor: "pointer", marginRight: "10px" }}
                    title="Редактировать клиента"
                  />
                  <FaTrash
                    onClick={() => handleDeleteClient(client.id)}
                    className={styles.deleteIcon}
                    style={{ color: "red", cursor: "pointer" }}
                    title="Удалить клиента"
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                Нет данных
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsPage;
