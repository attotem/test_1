"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addClient, getAllTags, applyTags } from "../../../components/http";
import ClientForm from "../../../components/ClientForm";

type Tag = {
  id: string;
  name: string;
  description: string | null;
  colour: string;
};

const AddClient: React.FC = () => {
  const router = useRouter();
 
  const handleAddClient = async (data: any) => {
    try {
      const { tags, ...clientData } = data;

      const formattedData = {
        ...clientData,
        source: [clientData.source],
        custom_params: {},
      };

      const response = await addClient(formattedData);

      if (response?.client_id) {
        const clientId = response.client_id;

        if (clientId && tags.length > 0) {
          const tagsData = [
            {
              client_id: clientId,
              tags_ids: tags.map((tag: Tag) => tag.id),
            },
          ];

          await applyTags(tagsData);
        }

        alert("Клиент успешно добавлен!");
        router.push("/clients");
      } else {
        alert("Ошибка при добавлении клиента");
      }
    } catch (error) {
      console.error("Ошибка при добавлении клиента:", error);
      alert("Произошла ошибка при отправке данных.");
    }
  };

  return (
    <ClientForm
      initialValues={{
        fullname: "",
        passport_number: "",
        phone_number: "",
        email: "",
        source: "",
        tags: [],
      }}
      onSubmit={handleAddClient}
      title="Добавить клиента"
    />
  );
};

export default AddClient;