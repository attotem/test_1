"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, MenuItem, Button, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { addClient } from "../../../components/http";

const AddClient: React.FC = () => {
  const router = useRouter();

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      fullname: "",
      passport_number: "",
      phone_number: "",
      email: "",
      source: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
        const formattedData = {
        ...data,
        source: [data.source], 
        custom_params: {}, 
        
        };
      const response = await addClient(formattedData); 

      if (response?.success) {
        alert("Клиент успешно добавлен!");
        reset(); 
        router.push("/clients"); 
      } else {
        alert("Ошибка при добавлении клиента: " + (response?.message || "Неизвестная ошибка"));
      }
    } catch (error) {
      console.error("Ошибка при добавлении клиента:", error);
      alert("Произошла ошибка при отправке данных.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 3,
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Добавить клиента
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="fullname"
          control={control}
          rules={{ required: "Полное имя обязательно" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Полное имя"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="passport_number"
          control={control}
          rules={{ required: "Паспортный номер обязателен" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Паспортный номер"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="phone_number"
          control={control}
          rules={{ required: "Номер телефона обязателен" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Номер телефона"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email обязателен",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Введите корректный email",
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="source"
          control={control}
          rules={{ required: "Выберите источник" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              select
              label="Источник"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            >
              <MenuItem value="social_media">Социальные сети</MenuItem>
              <MenuItem value="referral">Рекомендация</MenuItem>
              <MenuItem value="online_form">Онлайн форма</MenuItem>
              <MenuItem value="other">Другое</MenuItem>
            </TextField>
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Добавить клиента
        </Button>
      </form>
    </Box>
  );
};

export default AddClient;
