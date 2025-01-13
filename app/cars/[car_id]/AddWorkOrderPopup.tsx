import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Button, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import { addWorkOrder, getAllClients } from "../../../components/http";

type Client = {
  id: string;
  fullname: string;
};

type AddWorkOrderPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
};

const AddWorkOrderPopup: React.FC<AddWorkOrderPopupProps> = ({ isOpen, onClose, onSaveSuccess }) => {
  const { t } = useTranslation("common");
  const { car_id } = useParams();
  const [formData, setFormData] = useState({
    car_id: "",
    client_id: "",
    comment: "",
    status: "upcoming",
    tax: 0,
    documents: [],
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (car_id) {
        setFormData((prev) => ({ ...prev, car_id: car_id as string })); 
      }
    }
  }, [isOpen, car_id]);

  

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await addWorkOrder(formData);
      alert(t("workOrderAddedSuccessfully"));
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding work order:", error);
      alert(t("errorWhileAddingWorkOrder"));
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          width: "400px",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 3 }}>
          {t("addWorkOrder")}
        </Typography>
        <TextField
          fullWidth
          label={t("carId")}
          value={formData.car_id}
          onChange={(e) => handleInputChange("car_id", e.target.value)}
          sx={{ marginBottom: 2 }}
          disabled 
        />
        {/* <TextField
          select
          fullWidth
          label={t("client")}
          value={formData.client_id}
          onChange={(e) => handleInputChange("client_id", e.target.value)}
          sx={{ marginBottom: 2 }}
        >
          {loading ? (
            <MenuItem value="" disabled>
              {t("loadingClients")}
            </MenuItem>
          ) : (
            clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.fullname}
              </MenuItem>
            ))
          )}
        </TextField> */}
        <TextField
          fullWidth
          label={t("comment")}
          value={formData.comment}
          onChange={(e) => handleInputChange("comment", e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            width: "100%",
            backgroundColor: "#663399",
            color: "white",
            "&:hover": {
              backgroundColor: "#562080",
            },
          }}
        >
          {t("save")}
        </Button>
      </Box>
    </Modal>
  );
};

export default AddWorkOrderPopup;
