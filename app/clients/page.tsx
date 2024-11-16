"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./ClientPage.module.scss";
import { getUserClients } from "../../components/http";
import { useRouter } from "next/navigation";

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
  tags?: any[];
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

  return (
    <div className={styles.clientPage}>
      <h1 className={styles.title}>База контрагентов</h1>
      <h2 className={styles.subtitle}>Клиенты, поставщики</h2>
      <input
        type="text"
        placeholder="Введите государственный номер, VIN, полное имя, название организации, номер телефона, номер регистрации компании/налоговый номер"
        className={styles.searchBar}
      />
      <table className={styles.clientTable}>
        <thead>
          <tr>
            <th>Клиент</th>
            <th>Мобильный номер</th>
            <th>Гос.Номер</th>
            <th>Источник</th>
            <th>Машины</th>
          </tr>
        </thead>
        <tbody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <tr key={client.id}>
                <td>{client.fullname || "Не указано"}</td>
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
                    ? client.cars
                        .map(
                          (car) =>
                            `${car.manufacturer} ${car.model} (${car.reg_number})`
                        )
                        .join(", ")
                    : "Нет машин"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                Нет данных
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={()=>router.push("clients/add")}>Добавить контрагента</button>
        <button className={styles.button}>Импортировать</button>
        <button className={styles.button}>Экспорт</button>
      </div>
    </div>
  );
};

export default ClientsPage;

