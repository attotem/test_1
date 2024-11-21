"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClientById, updateClient, getAllTags, applyTags, removeTags } from "../../../../components/http";
import ClientForm from "../../../../components/ClientForm";

type Tag = {
  id: string;
  name: string;
  description: string | null;
  colour: string;
};
type Client = {
  id: string;
  fullname: string;
  passport_number: string;
  phone_number: string;
  email: string;
  source: string[];
  tags: Tag[];
};

type FormValues = {
  fullname: string;
  passport_number: string;
  phone_number: string;
  email: string;
  source: string;
  tags: Tag[];
};

const EditClient: React.FC = () => {
  const router = useRouter();
  const { client_id } = useParams();
  const [initialValues, setInitialValues] = useState<FormValues | null>(null);
  const [originalData, setOriginalData] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const normalizedClientId = Array.isArray(client_id) ? client_id[0] : client_id;
    
        if (!normalizedClientId) {
          console.error("Invalid client ID");
          return;
        }
        
        const client: Client = await getClientById(normalizedClientId);
        if (client) {
          setOriginalData(client);
          setInitialValues({
            fullname: client.fullname || "",
            passport_number: client.passport_number || "",
            phone_number: client.phone_number || "",
            email: client.email || "",
            source: client.source ? client.source[0] : "",
            tags: client.tags || [],
          });
        }
      } catch (error) {
        console.error("Ошибка при загрузке клиента:", error);
      } 
    };

    

    fetchClient();
  }, [client_id]);

  const handleEditClient = async (data: FormValues) => {
    try {
      const normalizedClientId = Array.isArray(client_id) ? client_id[0] : client_id;

      if (!normalizedClientId) {
        console.error("Invalid client ID");
        return;
      }

      if (!originalData) {
        console.error("Original data is not loaded");
        return;
      }

      const changedValues = Object.entries(data).reduce((acc: Record<string, any>, [key, value]) => {
        if (key === "tags") {
          return acc; 
        }
        if (originalData[key as keyof Client] !== value) {
          acc[key] = key === "source" ? [value] : value; 
        }
        return acc;
      }, {} as Record<string, any>);

      if (Object.keys(changedValues).length === 0 && JSON.stringify(data.tags) === JSON.stringify(originalData.tags)) {
        alert("Нет изменений для сохранения.");
        return;
      }

      const formattedData = {
        client_id: normalizedClientId,
        values: {
          ...changedValues,
          custom_params: {},
        },
      };

      if (Object.keys(changedValues).length > 0) {
        const response = await updateClient(formattedData);

        if (response?.status !== "Success") {
          alert("Ошибка при обновлении клиента: " + (response?.message || "Неизвестная ошибка"));
          return;
        }
      }

      const newTags = data.tags.map((tag: Tag) => tag.id);
      const oldTags = originalData.tags.map((tag: Tag) => tag.id);

      const tagsToAdd = newTags.filter((tag) => !oldTags.includes(tag));
      const tagsToRemove = oldTags.filter((tag) => !newTags.includes(tag));

      if (tagsToAdd.length > 0) {
        const tagsDataToAdd = [
          {
            client_id: normalizedClientId,
            tags_ids: tagsToAdd,
          },
        ];
        await applyTags(tagsDataToAdd);
      }

      if (tagsToRemove.length > 0) {
        const tagsDataToRemove = [
          {
            client_id: normalizedClientId,
            tags_ids: tagsToRemove,
          },
        ];
        await removeTags(tagsDataToRemove);
      }

      alert("Клиент успешно обновлен!");
      router.push("/clients");
    } catch (error) {
      console.error("Ошибка при обновлении клиента:", error);
      alert("Произошла ошибка при отправке данных.");
    }
  };

  if (!initialValues) {
    return <div>Загрузка данных клиента...</div>;
  }

  return (
    <ClientForm
      initialValues={initialValues}
      onSubmit={handleEditClient}
      title="Редактировать клиента"
    />
  );
};

export default EditClient;
