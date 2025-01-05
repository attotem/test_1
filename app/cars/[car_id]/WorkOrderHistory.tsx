import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";

const WorkOrderHistory = ({ workOrders, onAddClick }: { workOrders: any[], onAddClick: () => void; }) => {
  const { t } = useTranslation("common");

  return (
    <Box>
      <div onClick={()=>onAddClick()}>Add</div>
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
  );
};

export default WorkOrderHistory;
