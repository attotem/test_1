export const runtime = "edge";

"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import { ChromePicker } from "react-color";
import { getAllTags, addTag } from "../../components/http";

type Tag = {
  id: string;
  name: string;
  description: string | null;
  colour: string;
};

const SettingsPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagDescription, setNewTagDescription] = useState("");
  const [newTagColor, setNewTagColor] = useState("#6b6b6b");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await getAllTags();
        setTags(tagsData || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      alert("Tag name cannot be empty!");
      return;
    }

    const newTag = {
      name: newTagName,
      description: newTagDescription,
      colour: newTagColor,
    };

    try {
      const response = await addTag([newTag]);

      if (response?.status === "Success") {
        const addedTag = response.data[0];
        setTags((prev) => [...prev, addedTag]);
        alert("Tag successfully added!");
        setNewTagName("");
        setNewTagDescription("");
        setNewTagColor("#6b6b6b");
      } else {
        alert("Error adding tag to the server.");
      }
    } catch (error) {
      console.error("Error adding tag:", error);
      alert("An error occurred while adding the tag.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Settings
      </Typography>
      <Typography variant="h6" gutterBottom>
        Add New Tag
      </Typography>
      <Paper
        sx={{
          padding: 3,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Tag Name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Tag Description"
            value={newTagDescription}
            onChange={(e) => setNewTagDescription(e.target.value)}
          />
          <Typography variant="subtitle1">Select Color:</Typography>
          <ChromePicker
            color={newTagColor}
            onChange={(color) => setNewTagColor(color.hex)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreateTag}
          >
            Add Tag
          </Button>
        </Stack>
      </Paper>
      <Typography variant="h6" sx={{ mt: 4 }}>
        Existing Tags
      </Typography>
      <Stack spacing={1}>
        {tags.map((tag) => (
          <Box
            key={tag.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 1,
              border: "1px solid #ddd",
              borderRadius: 2,
              backgroundColor: tag.colour,
              color: "#fff",
            }}
          >
            <Typography>{tag.name}</Typography>
            <Typography variant="body2">{tag.description || "No description"}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default SettingsPage;
