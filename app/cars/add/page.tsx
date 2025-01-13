export const runtime = "edge";

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addCar, getAllClients } from "../../../components/http"; 
import { Paper, Typography, Box, Button, Stack, TextField, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent ,IconButton} from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
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

const AddCarPage: React.FC = () => {
  const router = useRouter();
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
        console.error("Ошибка при загрузке клиентов:", error);
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
      alert("Машина успешно добавлена!");
      router.push("/cars");
    } catch (error) {
      console.error("Ошибка при добавлении машины:", error);
      alert("Произошла ошибка при сохранении данных.");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 4 }}>
      <Stack direction="row" justifyContent="flex-start" alignItems="center" sx={{ marginBottom: 3 }}>
      <IconButton onClick={() => router.push("/cars")} sx={{ color: "#663399" }}>
          <FaArrowLeft />
        </IconButton>
      </Stack>

      <Paper
        sx={{
          padding: 6,
          backgroundColor: "#f5f5f5",
          borderRadius: 3,
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <Typography variant="h4" gutterBottom align="center" sx={{ marginBottom: 4 }}>
          Добавление новой машины
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Производитель"
            name="manufacturer"
            value={car.manufacturer}
            onChange={handleInputChange}
            fullWidth
          />

          <TextField
            label="Модель"
            name="model"
            value={car.model}
            onChange={handleInputChange}
            fullWidth
          />

          <TextField
            label="Гос. Номер"
            name="reg_number"
            value={car.reg_number}
            onChange={handleInputChange}
            fullWidth
            required
          />

          <TextField
            label="VIN Номер"
            name="vin_number"
            value={car.vin_number || ""}
            onChange={handleInputChange}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="client-select-label">Клиент</InputLabel>
            <Select
              labelId="client-select-label"
              name="client_id"
              value={car.client_id}
              onChange={handleSelectChange}
              label="Клиент"
              required
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.fullname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Год выпуска"
            name="year"
            value={car.year?.toString() || ""}
            onChange={handleInputChange}
            fullWidth
            type="number"
          />

          <TextField
            label="Пробег (км)"
            name="mileage"
            value={car.mileage?.toString() || ""}
            onChange={handleInputChange}
            fullWidth
            type="number"
          />

          <TextField
            label="Заметка"
            name="note"
            value={car.note || ""}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{
              marginTop: 4,
              backgroundColor: "#663399",
              "&:hover": {
                backgroundColor: "#562080",
              },
            }}
          >
            Сохранить машину
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AddCarPage;
