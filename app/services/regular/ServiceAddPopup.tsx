"use client";

import React, { useState } from "react";
import { addService } from "../../../components/http";
import {
  Modal,
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";

type NewService = {
  name: string;
  price: number;
  duration: string; // In ISO 8601 format
};

type ServiceAddPopupProps = {
  open: boolean;
  onClose: () => void;
  onServiceAdded: () => void;
};

const ServiceAddPopup: React.FC<ServiceAddPopupProps> = ({
  open,
  onClose,
  onServiceAdded,
}) => {
  const { t } = useTranslation("common");
  const [service, setService] = useState<NewService>({
    name: "",
    price: 0,
    duration: "",
  });

  const [durationParts, setDurationParts] = useState({
    days: "",
    hours: "",
    minutes: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setService({ ...service, [name]: name === "price" ? parseFloat(value) : value });
  };

  const handleDurationPartChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    if (/^\d*$/.test(value)) {
      setDurationParts({ ...durationParts, [name]: value });
    }
  };

  const formatDurationToISO = () => {
    const { days, hours, minutes } = durationParts;
    const parts: string[] = [];
    if (parseInt(days, 10)) parts.push(`${days}D`);
    if (parseInt(hours, 10) || parseInt(minutes, 10)) {
      const timeParts: string[] = [];
      if (parseInt(hours, 10)) timeParts.push(`${hours}H`);
      if (parseInt(minutes, 10)) timeParts.push(`${minutes}M`);
      parts.push(`T${timeParts.join("")}`);
    }
    return `P${parts.join("")}`;
  };

  const handleSave = async () => {
    const formattedDuration = formatDurationToISO();
    if (!service.name || service.price <= 0 || !formattedDuration) {
      alert(t("service.Add.errorEmptyFields"));
      return;
    }

    try {
      await addService({ ...service, duration: formattedDuration });
      alert(t("service.Add.successMessage"));
      onServiceAdded();
      onClose();
    } catch (error) {
      console.error(t("service.Add.errorAddingService"), error);
      alert(t("service.Add.errorSavingService"));
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-service-modal">
      <Box
        sx={{
          maxWidth: 600,
          margin: "50px auto",
          padding: 4,
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          {t("service.Add.title")}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label={t("service.Add.name")}
            name="name"
            value={service.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label={t("service.Add.price")}
            name="price"
            type="number"
            value={service.price}
            onChange={handleInputChange}
            fullWidth
          />
          <Typography variant="subtitle1">{t("service.Add.duration")}</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              label={t("service.Add.days")}
              name="days"
              value={durationParts.days}
              onChange={handleDurationPartChange}
              fullWidth
            />
            <TextField
              label={t("service.Add.hours")}
              name="hours"
              value={durationParts.hours}
              onChange={handleDurationPartChange}
              fullWidth
            />
            <TextField
              label={t("service.Add.minutes")}
              name="minutes"
              value={durationParts.minutes}
              onChange={handleDurationPartChange}
              fullWidth
            />
          </Stack>
          <Divider />
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={handleSave}>
              {t("service.Add.save")}
            </Button>
            <Button variant="outlined" onClick={onClose}>
              {t("service.Add.cancel")}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ServiceAddPopup;
