"use client";

import React, { useEffect, useState } from "react";
import { getTenantPosts, addTenantEmployee, addPost } from "../../components/http";
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
  Divider,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { useTranslation } from "react-i18next";

type Post = {
  id: string;
  name: string;
};

type NewEmployee = {
  fullname: string;
  post_id: string;
};

type EmployeeAddPopupProps = {
  open: boolean;
  onClose: () => void;
  onEmployeeAdded: () => void;
};

const EmployeeAddPopup: React.FC<EmployeeAddPopupProps> = ({ open, onClose, onEmployeeAdded }) => {
  const { t } = useTranslation("common");
  const [employee, setEmployee] = useState<NewEmployee>({
    fullname: "",
    post_id: "",
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostName, setNewPostName] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts: Post[] = await getTenantPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error(t("employee.Add.errorLoadingPosts"), error);
      }
    };

    fetchPosts();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setEmployee({ ...employee, post_id: event.target.value });
  };

  const handleAddPost = async () => {
    if (!newPostName.trim()) {
      alert(t("employee.Add.emptyPostName"));
      return;
    }

    try {
      const newPost = await addPost({ name: newPostName });
      setPosts((prevPosts) => [...prevPosts, newPost]); 
      setNewPostName(""); 
      alert(t("employee.Add.postAddedSuccessfully"));
    } catch (error) {
      console.error(t("employee.Add.errorAddingPost"), error);
      alert(t("employee.Add.errorSavingPost"));
    }
  };

  const handleSave = async () => {
    try {
      await addTenantEmployee(employee);
      alert(t("employee.Add.successMessage"));
      onEmployeeAdded();
      onClose();
    } catch (error) {
      console.error(t("employee.Add.errorAddingEmployee"), error);
      alert(t("employee.Add.errorSavingEmployee"));
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-employee-modal">
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
          {t("employee.Add.title")}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label={t("employee.Add.fullname")}
            name="fullname"
            value={employee.fullname}
            onChange={handleInputChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="post-select-label">{t("employee.Add.post")}</InputLabel>
            <Select
              labelId="post-select-label"
              name="post_id"
              value={employee.post_id}
              onChange={handleSelectChange}
              label={t("employee.Add.post")}
            >
              {posts.map((post) => (
                <MenuItem key={post.id} value={post.id}>
                  {post.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider />
          <Typography variant="h6">{t("employee.Add.addPostTitle")}</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label={t("employee.Add.newPostName")}
              value={newPostName}
              onChange={(e) => setNewPostName(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={handleAddPost}>
              {t("employee.Add.addPostButton")}
            </Button>
          </Stack>
          <Divider />
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={handleSave}>
              {t("employee.Add.save")}
            </Button>
            <Button variant="outlined" onClick={onClose}>
              {t("employee.Add.cancel")}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EmployeeAddPopup;
