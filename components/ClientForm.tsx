"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, MenuItem, Button, Typography, Box, Stack, Paper, Modal, IconButton } from "@mui/material";
import { Person, Email, Phone, AccountBalance, Add } from "@mui/icons-material";
import CreatableSelect from "react-select/creatable";
import { ChromePicker } from "react-color";
import { getAllTags, getAllSources, addTag } from "../components/http";

type Tag = {
  id: string;
  name: string;
  description: string | null;
  colour: string;
};

type FormValues = {
  fullname: string;
  passport_number: string;
  phone_number: string;
  email: string;
  source: string;
  tags: Tag[];
};

type ClientFormProps = {
  initialValues: FormValues;
  onSubmit: (data: FormValues) => void;
  title: string;
  loading?: boolean;
};

const ClientForm: React.FC<ClientFormProps> = ({ initialValues, onSubmit, title, loading }) => {
  const { handleSubmit, control, setValue, getValues } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const [tags, setTags] = useState<Tag[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [newTagName, setNewTagName] = useState("");
  const [newTagDescription, setNewTagDescription] = useState("");
  const [newTagColor, setNewTagColor] = useState("#6b6b6b");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const tagsData = await getAllTags();
        setTags(tagsData);
        const sourcesData = await getAllSources();
        if (sourcesData && sourcesData.sources) {
          setSources(sourcesData.sources);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных формы:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchFormData();
  }, []);

  if (loading || loadingData) {
    return <div>Загрузка данных...</div>;
  }

  const handleTagChange = (newTags: any) => {
    setValue(
      "tags",
      newTags.map((tag: any) => ({
        id: tag.value,
        name: tag.label,
        colour: tag.colour || "#6b6b6b",
      }))
    );
  };

  const handleCreateNewTag = async () => {
    if (newTagName) {
      const newTag = {
        name: newTagName,
        description: newTagDescription,
        colour: newTagColor,
      };
  
      try {
        const response = await addTag([newTag]);
  
        if (response && response.status === "Success") {
          const addedTag = response.data[0]; // Извлекаем добавленный тег из ответа
  
          // Обновляем список всех тегов
          setTags((prevTags) => [...prevTags, addedTag]);
  
          // Получаем текущее значение тегов и добавляем новый тег
          const currentTags = getValues("tags");
          setValue("tags", [...currentTags, addedTag]); // Добавляем новый тег в список выбранных тегов
  
          alert("Тег успешно добавлен!");
        } else {
          alert("Ошибка при добавлении тега на сервер.");
        }
      } catch (error) {
        console.error("Ошибка при добавлении тега:", error);
        alert("Произошла ошибка при добавлении тега.");
      }
  
      // Сброс данных модального окна
      setNewTagName("");
      setNewTagDescription("");
      setIsModalOpen(false);
    }
  };
  
  
  

  return (
    <Paper
      sx={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 4,
        backgroundColor: "#f5f5f5",
        borderRadius: 3,
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        {title}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            name="fullname"
            control={control}
            rules={{ required: "Полное имя обязательно" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Полное имя"
                fullWidth
                InputProps={{
                  startAdornment: <Person sx={{ color: "#9e9e9e", mr: 1 }} />,
                }}
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
                InputProps={{
                  startAdornment: <AccountBalance sx={{ color: "#9e9e9e", mr: 1 }} />,
                }}
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="phone_number"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Номер телефона"
                fullWidth
                InputProps={{
                  startAdornment: <Phone sx={{ color: "#9e9e9e", mr: 1 }} />,
                }}
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Email"
                fullWidth
                InputProps={{
                  startAdornment: <Email sx={{ color: "#9e9e9e", mr: 1 }} />,
                }}
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="source"
            control={control}
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
                {sources.map((source) => (
                  <MenuItem key={source} value={source}>
                    {source}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Теги
          </Typography>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CreatableSelect
                  isMulti
                  value={field.value.map((tag: Tag) => ({
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
                  placeholder="Выберите теги или создайте новый..."
                  styles={{
                    container: (base) => ({
                      ...base,
                      flex: 1,
                    }),
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={() => setIsModalOpen(true)}
                  sx={{ marginLeft: 2 }}
                >
                  <Add />
                </IconButton>
              </Box>
            )}
          />

          <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            aria-labelledby="create-tag-modal-title"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" id="create-tag-modal-title" gutterBottom>
                Создать новый тег
              </Typography>
              <TextField
                fullWidth
                label="Название тега"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Описание тега"
                value={newTagDescription}
                onChange={(e) => setNewTagDescription(e.target.value)}
                margin="normal"
              />
              <Typography variant="subtitle1" gutterBottom>
                Выберите цвет:
              </Typography>
              <ChromePicker
                color={newTagColor}
                onChange={(color) => setNewTagColor(color.hex)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleCreateNewTag}
              >
                Добавить тег
              </Button>
            </Box>
          </Modal>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
          >
            {title}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default ClientForm;
