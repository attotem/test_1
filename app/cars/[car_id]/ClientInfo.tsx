import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import ClientSearchSelect from "@/components/Search/ClientSearchSelect";

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

type ClientInfoProps = {
  car: Car;
  isEditing: boolean;
  onClientChange: (clientId: string) => void;
};

const ClientInfo: React.FC<ClientInfoProps> = ({ car, isEditing, onClientChange }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: 5,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        padding: 2,
        marginBottom: 4,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Avatar
        sx={{
          width: 60,
          height: 60,
          marginRight: 2,
          backgroundColor: "#663399",
          fontSize: "1.5rem",
        }}
      >
        {car.client?.fullname ? car.client.fullname.charAt(0) : "?"}
      </Avatar>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {isEditing ? (
          <ClientSearchSelect
            placeholder="Search for a client" 
            onClientSelect={(clientId) => onClientChange(clientId)} 
          />
        ) : (
          <>
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
              {car.client?.fullname || "No Owner"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
              {car.client?.phone_number || "No Phone"}
            </Typography>
          </>
        )}
      </Box>

      {car.client?.id && (
        <Link href={`/clients/client/${car.client.id}`} passHref>
          <IconButton
            sx={{
              color: "#663399",
              "&:hover": {
                backgroundColor: "#f4f0ff",
                color: "#562080",
              },
            }}
          >
            <FaArrowRight size={24} />
          </IconButton>
        </Link>
      )}
    </Card>
  );
};

export default ClientInfo;
