import React from "react";
import { Card, CardContent, TextField, Typography } from "@mui/material";
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

type CarInfoProps = {
  car: Car;
  isEditing: boolean;
  onCarChange: (car: Car) => void;
};

const CarInfo: React.FC<CarInfoProps> = ({ car, isEditing, onCarChange }) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    const updatedValue = name === "year" || name === "mileage" ? Number(value) || null : value;
    
    onCarChange({ ...car, [name]: updatedValue });
    };

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginBottom: 4,
      }}
    >
      <CardContent>
        {isEditing ? (
          <>
            <TextField
              label="Manufacturer"
              name="manufacturer"
              value={car.manufacturer || ""}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 3 }}
            />
            <TextField
              label="Model"
              name="model"
              value={car.model || ""}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 3 }}
            />
            <TextField
              label="Registration Number"
              name="reg_number"
              value={car.reg_number || ""}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 3 }}
            />
            <TextField
              label="VIN Number"
              name="vin_number"
              value={car.vin_number || ""}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 3 }}
            />
          </>
        ) : (
          <>
            <Typography variant="h6">Manufacturer: {car.manufacturer || "Not specified"}</Typography>
            <Typography variant="h6">Model: {car.model || "Not specified"}</Typography>
            <Typography variant="h6">Registration Number: {car.reg_number || "Not specified"}</Typography>
            <Typography variant="h6">VIN Number: {car.vin_number || "Not specified"}</Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CarInfo;
