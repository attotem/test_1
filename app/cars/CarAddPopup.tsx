"use client";

import React, { useEffect, useState } from "react";
import { addCar, getAllClients } from "../../components/http";
import {
  Modal,
  Box,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { useTranslation } from "react-i18next";

type NewCar = {
  manufacturer: string;
  model: string;
  reg_number: string;
  vin_number: string | null;
  client_id: string;
  year: number | null;
  note: string | null;
  mileage: number | null;
  custom_params: any;
  created_at: string;
};

type Client = {
  id: string;
  fullname: string;
};

type CarAddPopupProps = {
  open: boolean;
  onClose: () => void;
  onCarAdded: () => void;
};

const CarAddPopup: React.FC<CarAddPopupProps> = ({ open, onClose, onCarAdded }) => {
  const { t } = useTranslation("common");
  const [car, setCar] = useState<NewCar>({
    manufacturer: "",
    model: "",
    reg_number: "",
    vin_number: "",
    client_id: "",
    year: null,
    note: "",
    mileage: null,
    custom_params: {},
    created_at: new Date().toISOString(),
  });

  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const fetchedClients: Client[] = await getAllClients();
        setClients(fetchedClients);
      } catch (error) {
        console.error(t("car.Add.errorLoadingClients"), error);
      }
    };

    fetchClients();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setCar({ ...car, [name]: value });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setCar({ ...car, client_id: event.target.value });
  };

  const handleSave = async () => {
    try {
      await addCar(car);
      alert(t("car.Add.successMessage"));
      onCarAdded();
      onClose();
    } catch (error) {
      console.error(t("car.Add.errorAddingCar"), error);
      alert(t("car.Add.errorSavingCar"));
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-car-modal">
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
          {t("car.Add.title")}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label={t("car.Add.manufacturer")}
            name="manufacturer"
            value={car.manufacturer}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label={t("car.Add.model")}
            name="model"
            value={car.model}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label={t("car.Add.registrationNumber")}
            name="reg_number"
            value={car.reg_number}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label={t("car.Add.vinNumber")}
            name="vin_number"
            value={car.vin_number || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="client-select-label">{t("car.Add.client")}</InputLabel>
            <Select
              labelId="client-select-label"
              name="client_id"
              value={car.client_id}
              onChange={handleSelectChange}
              label={t("car.Add.client")}
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.fullname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={t("car.Add.year")}
            name="year"
            value={car.year?.toString() || ""}
            onChange={handleInputChange}
            fullWidth
            type="number"
          />
          <TextField
            label={t("car.Add.mileage")}
            name="mileage"
            value={car.mileage?.toString() || ""}
            onChange={handleInputChange}
            fullWidth
            type="number"
          />
          <TextField
            label={t("car.Add.note")}
            name="note"
            value={car.note || ""}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
          />
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={handleSave}>
              {t("car.Add.save")}
            </Button>
            <Button variant="outlined" onClick={onClose}>
              {t("car.Add.cancel")}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CarAddPopup;
