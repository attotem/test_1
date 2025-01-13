export const runtime = "edge";

"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getClientById,
  updateClient,
  applyTags,
  removeTags,
  getAllSources,
  getAllTags,
} from "../../../../components/http";
import {
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  TextField,
  IconButton,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Modal,
  Link,
} from "@mui/material";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import CreatableSelect from "react-select/creatable";
import { useTranslation } from "react-i18next";

type Tag = {
  id: string;
  name: string;
  description: string | null;
  colour: string;
};

type Car = {
  id: string;
  manufacturer: string;
  model: string;
  year: number;
  reg_number: string;
};

type Client = {
  id: string;
  fullname: string;
  passport_number: string;
  phone_number: string;
  email: string;
  source: string[];
  tags: Tag[];
  cars: Car[];
};

const EditClient: React.FC = () => {
  const router = useRouter();
  const { client_id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [initialClient, setInitialClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [sources, setSources] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const { t } = useTranslation("common");

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const normalizedClientId = Array.isArray(client_id) ? client_id[0] : client_id;

        if (!normalizedClientId) {
          console.error("Invalid client ID");
          return;
        }

        const fetchedClient: Client = await getClientById(normalizedClientId);
        if (fetchedClient) {
          setClient(fetchedClient);
          setInitialClient(fetchedClient);
        } else {
          console.error("No client data received.");
        }
      } catch (error) {
        console.error("Ошибка при загрузке клиента:", error);
      }
    };

    const fetchAdditionalData = async () => {
      try {
        const sourcesData = await getAllSources();
        setSources(sourcesData.sources || []);
        const tagsData = await getAllTags();
        setTags(tagsData);
      } catch (error) {
        console.error("Ошибка при загрузке источников и тегов:", error);
      }
    };

    fetchClient();
    fetchAdditionalData();
  }, [client_id]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (client) {
      const { name, value } = event.target;
      setClient({ ...client, [name]: value });
    }
  };

  const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (client) {
      setClient({ ...client, source: [event.target.value] });
    }
  };

  const handleTagChange = (newTags: any) => {
    if (client) {
      setClient({
        ...client,
        tags: newTags.map((tag: any) => ({
          id: tag.value,
          name: tag.label,
          colour: tag.colour || "#6b6b6b",
        })),
      });
    }
  };

  const handleSave = async () => {
    if (client && initialClient) {
      try {
        const changedFields: Partial<Client> = {};
        Object.keys(client).forEach((key) => {
          if (key !== "tags" && (client as any)[key] !== (initialClient as any)[key]) {
            changedFields[key as keyof Client] = (client as any)[key];
          }
        });

        if (Object.keys(changedFields).length > 0) {
          const updateData = {
            client_id: client.id,
            values: changedFields,
          };

          await updateClient(updateData);
        }

        const newTags = client.tags.map((tag: Tag) => tag.id);
        const oldTags = initialClient.tags.map((tag: Tag) => tag.id);

        const tagsToAdd = newTags.filter((tag) => !oldTags.includes(tag));
        const tagsToRemove = oldTags.filter((tag) => !newTags.includes(tag));

        if (tagsToAdd.length > 0) {
          const tagsDataToAdd = [
            {
              client_id: client.id,
              tags_ids: tagsToAdd,
            },
          ];
          await applyTags(tagsDataToAdd);
        }

        if (tagsToRemove.length > 0) {
          const tagsDataToRemove = [
            {
              client_id: client.id,
              tags_ids: tagsToRemove,
            },
          ];
          await removeTags(tagsDataToRemove);
        }

        setIsEditing(false);
        alert("Данные успешно обновлены!");
      } catch (error) {
        console.error("Ошибка при обновлении клиента:", error);
        alert("Произошла ошибка при сохранении данных.");
      }
    }
  };

  if (!client) {
    return <div>{t("client.Info.loadingClientInfo")}</div>;
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 3 }}>
        <IconButton onClick={() => router.push("/clients")} sx={{ color: "#663399" }}>
          <FaArrowLeft />
        </IconButton>
        <IconButton onClick={handleEditClick} sx={{ color: "#663399" }}>
          <FaEdit />
        </IconButton>
      </Stack>

      <Paper
        sx={{
          padding: 4,
          backgroundColor: "white",
          borderRadius: 5,
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h3" align="center" sx={{ marginBottom: 4, fontWeight: 600, color: "#663399" }}>
          {t("client.Info.title")}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Card
              variant="outlined"
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: 5,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                {!isEditing ? (
                  <>
                    <Typography variant="h6" component="div" sx={{ color: "#333", fontWeight: 500 }}>
                      {t("client.Info.fullName")}:
                    </Typography>
                    <Typography variant="body1" component="div" sx={{ marginBottom: 3 }}>
                      {client.fullname || t("client.Info.notSpecified")}
                    </Typography>

                    <Typography variant="h6" component="div" sx={{ color: "#333", fontWeight: 500 }}>
                      {t("client.Info.passportNumber")}:
                    </Typography>
                    <Typography variant="body1" component="div" sx={{ marginBottom: 3 }}>
                      {client.passport_number || t("client.Info.notSpecified")}
                    </Typography>

                    <Typography variant="h6" component="div" sx={{ color: "#333", fontWeight: 500 }}>
                      {t("client.Info.phoneNumber")}:
                    </Typography>
                    <Typography variant="body1" component="div" sx={{ marginBottom: 3 }}>
                      {client.phone_number || t("client.Info.notSpecified")}
                    </Typography>

                    <Typography variant="h6" component="div" sx={{ color: "#333", fontWeight: 500 }}>
                      {t("client.Info.email")}:
                    </Typography>
                    <Typography variant="body1" component="div" sx={{ marginBottom: 3 }}>
                      {client.email || t("client.Info.notSpecified")}
                    </Typography>
                  </>
                ) : (
                  <>
                    <TextField
                      label={t("client.Info.fullName")}
                      name="fullname"
                      value={client.fullname || ""}
                      onChange={handleInputChange}
                      fullWidth
                      sx={{ marginBottom: 3 }}
                    />
                    <TextField
                      label={t("client.Info.passportNumber")}
                      name="passport_number"
                      value={client.passport_number || ""}
                      onChange={handleInputChange}
                      fullWidth
                      sx={{ marginBottom: 3 }}
                    />
                    <TextField
                      label={t("client.Info.phoneNumber")}
                      name="phone_number"
                      value={client.phone_number || ""}
                      onChange={handleInputChange}
                      fullWidth
                      sx={{ marginBottom: 3 }}
                    />
                    <TextField
                      label={t("client.Info.email")}
                      name="email"
                      value={client.email || ""}
                      onChange={handleInputChange}
                      fullWidth
                      sx={{ marginBottom: 3 }}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card
              variant="outlined"
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: 5,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                {!isEditing ? (
                  <>
                    <Typography variant="h6" sx={{ color: "#333", fontWeight: 500 }}>
                      {t("client.Info.source")}:
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 3 }}>
                      {client.source?.length > 0 ? client.source[0] : t("client.Info.notSpecified")}
                    </Typography>

                    <Typography variant="h6" sx={{ color: "#333", fontWeight: 500 }}>
                      {t("client.Info.tags")}:
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 3 }}>
                      {client.tags.length > 0 ? client.tags.map((tag) => tag.name).join(", ") : t("client.Info.noTags")}
                    </Typography>

                    <Typography variant="h6" sx={{ color: "#333", fontWeight: 500 }}>
                      {t("client.Info.clientCars")}:
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 3 }}>
                      {client.cars.length > 0 ? (
                        client.cars.map((car) => (
                          <div key={car.id}>
                            <Link href={`/cars/${car.id}`} sx={{ color: "#663399" }}>
                              {`${car.manufacturer} ${car.model} (${car.year}) - ${car.reg_number}`}
                            </Link>
                          </div>
                        ))
                      ) : (
                        t("client.Info.noRegisteredCars")
                      )}
                    </Typography>
                  </>
                ) : (
                  <>
                    <TextField
                      select
                      label={t("client.Info.source")}
                      value={client.source.length > 0 ? client.source[0] : ""}
                      onChange={handleSourceChange}
                      fullWidth
                      sx={{ marginBottom: 3 }}
                    >
                      {sources.map((source) => (
                        <MenuItem key={source} value={source}>
                          {source}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                      {t("client.Info.tags")}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CreatableSelect
                        isMulti
                        value={client.tags.map((tag) => ({
                          value: tag.id,
                          label: tag.name,
                          colour: tag.colour,
                        }))}
                        onChange={handleTagChange}
                        options={tags.map((tag) => ({
                          value: tag.id,
                          label: tag.name,
                          colour: tag.colour,
                        }))}
                        formatOptionLabel={(option: any) => (
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                backgroundColor: option.colour,
                                marginRight: 8,
                              }}
                            />
                            {option.label}
                          </div>
                        )}
                        placeholder={t("client.Info.addTag")}
                        styles={{
                          container: (base) => ({
                            ...base,
                            flex: 1,
                          }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.body}
                      />
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {isEditing && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{
              marginTop: 4,
              backgroundColor: "#663399",
              color: "white",
              "&:hover": {
                backgroundColor: "#562080",
              },
            }}
          >
            {t("client.Info.saveChanges")}
          </Button>
        )}
      </Paper>
    </Box>

  );
};

export default EditClient;
