"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getCarById,
  updateCar,
  getAllClients,
  getCarWorkOrders,
} from "../../../components/http";
import {
  Box,
  Stack,
  IconButton,
  Button,
  Grid,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import CarInfo from "./CarInfo";
import ClientInfo from "./ClientInfo";

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
  } | null;
};

type Client = {
  id: string;
  fullname: string;
};

const CarDetail: React.FC = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { car_id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [initialCar, setInitialCar] = useState<Car | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const normalizedCarId = Array.isArray(car_id) ? car_id[0] : car_id;
        if (!normalizedCarId) {
          console.error("Invalid car ID");
          return;
        }

        const fetchedCar: Car = await getCarById(normalizedCarId);
        setCar(fetchedCar);
        setInitialCar(fetchedCar);
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

    const fetchWorkOrders = async () => {
      try {
        const fetchedOrders = await getCarWorkOrders(car_id);
        setWorkOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching work orders:", error);
      }
    };

    fetchCar();
    fetchClients();
    fetchWorkOrders();
  }, [car_id]);

  const handleEditClick = () => setIsEditing(!isEditing);

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
          alert(t("noChangesToSave"));
          return;
        }

        await updateCar({ car_id: car.id, values: changedFields });
        setIsEditing(false);
        alert(t("dataUpdatedSuccessfully"));
      } catch (error) {
        console.error("Error updating car:", error);
        alert(t("errorWhileSavingData"));
      }
    }
  };

  if (!car) {
    return <div>{t("loadingCarInfo")}</div>;
  }

  return (
    <Box
      sx={{
        margin: "0 auto",
        padding: 4,
        borderRadius: 4,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 3 }}>
        <IconButton onClick={() => router.push("/cars")} sx={{ color: "#663399" }}>
          <FaArrowLeft />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
          {t("car.Info.details")}
        </Typography>
        <IconButton onClick={handleEditClick} sx={{ color: "#663399" }}>
          <FaEdit />
        </IconButton>
      </Stack>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ marginBottom: 3 }}
      >
        <Tab value="details" label={t("car.Info.details")} />
        <Tab value="history" label={t("workOrderHistory")} />
      </Tabs>

      {activeTab === "details" && (
        <>
          <Grid container spacing={4}>
            <Grid item xs={12} md={9} sx={{ borderRadius: 2, padding: 3 }}>
              <CarInfo car={car} isEditing={isEditing} onCarChange={setCar} />
            </Grid>

            <Grid item xs={12} md={3} sx={{ borderRadius: 2, padding: 3 }}>
              <ClientInfo
                car={car}
                isEditing={isEditing}
                onClientChange={(clientId) =>
                  setCar((prev) => {
                    if (!prev) return null;
                    const selectedClient = clients.find((client) => client.id === clientId) || null;
                    return { ...prev, client: selectedClient };
                  })
                }
                clients={clients}
              />
            </Grid>
          </Grid>

          {isEditing && (
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                marginTop: 4,
                width: "100%",
                backgroundColor: "#663399",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#562080",
                },
              }}
            >
              {t("car.Info.saveChanges")}
            </Button>
          )}
        </>
      )}

      {activeTab === "history" && (
        <Box>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            {t("workOrderHistory")}
          </Typography>
          <List>
            {workOrders.map((order) => (
              <ListItem key={order.id} sx={{ borderBottom: "1px solid #ccc" }}>
                <ListItemText
                  primary={`${t("issuedOn")}: ${order.issued_on}, ${t("status")}: ${order.status}`}
                  secondary={`${t("comment")}: ${order.comment}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default CarDetail;
