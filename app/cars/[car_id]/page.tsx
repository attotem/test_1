"use client"

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getCarById, updateCar, getAllClients } from "../../../components/http";  
import { Paper, Typography, Box, Button, Stack, TextField, IconButton, Grid, Card, CardContent, MenuItem, Select, InputLabel, FormControl, Avatar } from "@mui/material";
import { FaArrowLeft, FaEdit, FaPlusCircle, FaPen, FaTrashAlt } from "react-icons/fa";
import { SelectChangeEvent } from "@mui/material";
import { useTranslation } from 'react-i18next';  

type Car = {
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
  client?: {
    id: string;
    fullname: string;
    phone_number?: string | null;
    passport_number?: string | null;
    email?: string | null;
  };
};

type Client = {
  id: string;
  fullname: string;
};

const CarDetail: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { car_id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [initialCar, setInitialCar] = useState<Car | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const normalizedCarId = Array.isArray(car_id) ? car_id[0] : car_id;

        if (!normalizedCarId) {
          console.error("Invalid car ID");
          return;
        }

        const fetchedCar: Car = await getCarById(normalizedCarId);
        if (fetchedCar) {
          setCar(fetchedCar);
          setInitialCar(fetchedCar);
        } else {
          console.error("No car data received.");
        }
      } catch (error) {
        console.error("Error fetching car:", error);
      }
    };

    const fetchClients = async () => {
      try {
        const fetchedClients: Client[] = await getAllClients();
        setClients(fetchedClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchCar();
    fetchClients();
  }, [car_id]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (car) {
      const { name, value } = event.target;
      setCar({ ...car, [name]: value });
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    if (car) {
      setCar({ 
        ...car, 
        client: { 
          id: event.target.value as string, 
          fullname: clients.find(client => client.id === event.target.value)?.fullname || "", 
        } 
      });
    }
  };

  const handleSave = async () => {
    if (car && initialCar) {
      try {
        const changedFields: Partial<Car> = {};
        Object.keys(car).forEach((key) => {
          if ((car as any)[key] !== (initialCar as any)[key]) {
            changedFields[key as keyof Car] = (car as any)[key];
          }
        });

        if (Object.keys(changedFields).length === 0) {
          alert(t('noChangesToSave'));
          return;
        }

        const updateData = {
          car_id: car.id,
          values: changedFields,
        };

        await updateCar(updateData);
        setIsEditing(false);
        alert(t('dataUpdatedSuccessfully'));
      } catch (error) {
        console.error("Ошибка при обновлении машины:", error);
        alert(t('errorWhileSavingData'));
      }
    }
  };

  if (!car) {
    return <div>{t('loadingCarInfo')}</div>;
  }

  return (
    <Box sx={{ margin: "0 auto", padding: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 3 }}>
        <IconButton onClick={() => router.push("/cars")} sx={{ color: "#663399" }}>
          <FaArrowLeft />
        </IconButton>
        <IconButton onClick={handleEditClick} sx={{ color: "#663399" }}>
          <FaEdit />
        </IconButton>
      </Stack>

      <Box
        sx={{
          padding: 4,
          borderRadius: 5,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
          <Button>{t('car.Info.carInformation')}</Button>
          <Button>{t('car.Info.history')}</Button>
        </Box>

        <Grid container spacing={4} sx={{ marginTop: 4 }}>
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
                      {t('car.Info.manufacturer')}:
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 3 }}>
                      {car.manufacturer || t('car.Info.notSpecified')}
                    </Typography>

                    <Typography variant="h6" sx={{ color: "#333", fontWeight: 500 }}>
                      {t('car.Info.model')}:
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 3 }}>
                      {car.model || t('car.Info.notSpecified')}
                    </Typography>

                    <Typography variant="h6" sx={{ color: "#333", fontWeight: 500 }}>
                      {t('car.Info.registrationNumber')}:
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 3 }}>
                      {car.reg_number || t('car.Info.notSpecified')}
                    </Typography>

                    <Typography variant="h6" sx={{ color: "#333", fontWeight: 500 }}>
                      {t('car.Info.vinNumber')}:
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 3 }}>
                      {car.vin_number || t('car.Info.notSpecified')}
                    </Typography>
                  </>
                ) : (
                  <>
                    <TextField
                      label={t('car.Info.manufacturer')}
                      name="manufacturer"
                      value={car.manufacturer || ""}
                      onChange={handleInputChange}
                      fullWidth
                      sx={{ marginBottom: 3 }}
                    />
                    <TextField
                      label={t('car.Info.model')}
                      name="model"
                      value={car.model || ""}
                      onChange={handleInputChange}
                      fullWidth
                      sx={{ marginBottom: 3 }}
                    />
                    <TextField
                      label={t('car.Info.registrationNumber')}
                      name="reg_number"
                      value={car.reg_number || ""}
                      onChange={handleInputChange}
                      fullWidth
                      sx={{ marginBottom: 3 }}
                    />
                    <TextField
                      label={t('car.Info.vinNumber')}
                      name="vin_number"
                      value={car.vin_number || ""}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                      <Avatar sx={{ marginRight: 2 }}>{car.client?.fullname.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {car.client?.fullname} <span style={{ fontSize: "0.875em", color: "#666" }}>{t('car.Info.owner')}</span>
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#333" }}>
                          {car.client?.phone_number || t('car.Info.notSpecified')}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <>
                    <FormControl fullWidth sx={{ marginBottom: 3 }}>
                      <InputLabel id="client-select-label">{t('car.Info.client')}</InputLabel>
                      <Select
                        labelId="client-select-label"
                        value={car.client?.id || ""}
                        onChange={handleSelectChange}
                        label={t('car.Info.client')}
                      >
                        {clients.map((client) => (
                          <MenuItem key={client.id} value={client.id}>
                            {client.fullname}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
            {t('car.Info.saveChanges')}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CarDetail;
