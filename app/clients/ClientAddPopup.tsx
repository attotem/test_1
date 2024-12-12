"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Link,
} from "@mui/material";
import CreatableSelect from "react-select/creatable";
import { getAllTags, getAllSources, addClient, applyTags } from "../../components/http";
import { useTranslation } from "react-i18next";

type Tag = {
  id: string;
  name: string;
  description: string | null;
  colour: string;
};

type ClientAddPopupProps = {
  open: boolean;
  onClose: () => void;
  onClientAdded: () => void;
};

const ClientAddPopup: React.FC<ClientAddPopupProps> = ({ open, onClose, onClientAdded }) => {
  const { t } = useTranslation("common"); 
  const [clientData, setClientData] = useState({
    fullname: "",
    passport_number: "",
    phone_number: "",
    email: "",
    source: "",
    tags: [],
  });
  const [tags, setTags] = useState<Tag[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const tagsData = await getAllTags();
        const sourcesData = await getAllSources();
        setTags(tagsData || []);
        setSources(sourcesData?.sources || []);
      } catch (error) {
        console.error(t("client.Add.errorFetchingData"), error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [t]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setClientData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (newTags: any) => {
    setClientData((prev) => ({
      ...prev,
      tags: newTags.map((tag: any) => ({
        id: tag.value,
        name: tag.label,
        colour: tag.colour || "#6b6b6b",
      })),
    }));
  };

  const handleSave = async () => {
    try {
      const { tags: selectedTags, ...clientFields } = clientData;

      const response = await addClient({
        ...clientFields,
        source: [clientFields.source],
        custom_params: {},
      });
      
      //ПРИДУМАТЬ 
      
      
      if (response?.client_id) {   
        const clientId = response.client_id;

        if (selectedTags.length > 0) {
          await applyTags([
            {
              client_id: clientId,
              tags_ids: selectedTags.map((tag: Tag) => tag.id),
            },
          ]);
        }

        alert(t("client.Add.success"));
        onClientAdded();
        onClose();
      } else {
        alert(t("client.Add.errorAdding"));
      }
    } catch (error) {
      console.error(t("client.Add.errorSaving"), error);
      alert(t("client.Add.errorOccurred"));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="client-add-popup-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: 700,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 3,
          p: 4,
        }}
      >
        <Typography
          id="client-add-popup-title"
          variant="h6"
          align="center"
          gutterBottom
        >
          {t("client.Add.title")}
        </Typography>
        {loading ? (
          <Typography align="center">{t("client.Add.loading")}</Typography>
        ) : (
          <Stack spacing={2}>
            <TextField
              label={t("client.Add.fullName")}
              name="fullname"
              value={clientData.fullname}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label={t("client.Add.passportNumber")}
              name="passport_number"
              value={clientData.passport_number}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label={t("client.Add.phoneNumber")}
              name="phone_number"
              value={clientData.phone_number}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label={t("client.Add.email")}
              name="email"
              value={clientData.email}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              select
              label={t("client.Add.source")}
              name="source"
              value={clientData.source}
              onChange={handleInputChange}
              fullWidth
            >
              {sources.map((source) => (
                <MenuItem key={source} value={source}>
                  {source}
                </MenuItem>
              ))}
            </TextField>
            <Typography variant="h6">{t("client.Add.tags")}</Typography>
            <CreatableSelect
              isMulti
              value={clientData.tags.map((tag: Tag) => ({
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
              placeholder={t("client.Add.tagPlaceholder")}
            />
            <Link href="/settings" underline="hover" sx={{ mt: 1 }}>
              {t("client.Add.manageTags")}
            </Link>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleSave}>
                {t("client.Add.save")}
              </Button>
              <Button variant="outlined" onClick={onClose}>
                {t("client.Add.cancel")}
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

export default ClientAddPopup;
