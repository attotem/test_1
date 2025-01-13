"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { addComplexService, getAllServices, attachServicesToComplex } from "../../../components/http";
import { SelectChangeEvent } from "@mui/material";

type Service = {
  id: string;
  name: string;
};

type ComplexServiceAddPopupProps = {
  open: boolean;
  onClose: () => void;
  onComplexServiceAdded: () => void;
};

const ComplexServiceAddPopup: React.FC<ComplexServiceAddPopupProps> = ({
  open,
  onClose,
  onComplexServiceAdded,
}) => {
  const { t } = useTranslation("common");
  const [complexService, setComplexService] = useState({
    name: "",
    comment: "",
    price: 0,
  });
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const fetchedServices: Service[] = await getAllServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setComplexService({ ...complexService, [name]: name === "price" ? parseFloat(value) : value });
  };

  const handleServiceSelection = (event: SelectChangeEvent<string[]>) => {
    setSelectedServices(event.target.value as string[]);
  };

  const handleSave = async () => {
    try {
      const newComplexService = await addComplexService(complexService);

      if (selectedServices.length > 0 && newComplexService.complex_service_id) {
        await attachServicesToComplex({
          complex_service_id: newComplexService.complex_service_id,
          services: selectedServices,
        });
      }

      alert(t("complexService.Add.successMessage"));
      onComplexServiceAdded();
      onClose();
    } catch (error) {
      console.error("Error adding complex service:", error);
      alert(t("complexService.Add.errorMessage"));
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-complex-service-modal">
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
          {t("complexService.Add.title")}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label={t("complexService.Add.name")}
            name="name"
            value={complexService.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label={t("complexService.Add.comment")}
            name="comment"
            value={complexService.comment}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label={t("complexService.Add.price")}
            name="price"
            type="number"
            value={complexService.price}
            onChange={handleInputChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="services-select-label">{t("complexService.Add.services")}</InputLabel>
            <Select
                labelId="services-select-label"
                multiple
                value={selectedServices}
                onChange={handleServiceSelection}
                renderValue={(selected) =>
                (selected as string[])
                    .map((id) => services.find((service) => service.id === id)?.name)
                    .join(", ")
                }
            >
                {services.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                    <Checkbox checked={selectedServices.indexOf(service.id) > -1} />
                    <ListItemText primary={service.name} />
                </MenuItem>
                ))}
            </Select>
            </FormControl>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={handleSave}>
              {t("complexService.Add.save")}
            </Button>
            <Button variant="outlined" onClick={onClose}>
              {t("complexService.Add.cancel")}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ComplexServiceAddPopup;
