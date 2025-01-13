"use client";

import React, { useState } from "react";
import ClientSearchSelect from "@/components/Search/ClientSearchSelect";
import CarSearchSelect from "@/components/Search/CarsSearchSelect";
import { updateWorkOrder } from "../../../components/http"; 

type WorkOrderUpdateProps = {
    workOrderId: string;
    initialValues: {
      car_id: string;
      comment: string;
      status: string;
      documents: string[];
      tax: number;
      client_id: string;
      start_at: string;
      end_at: string;
      issued_on: string;
      car: {
        manufacturer: string;
        model: string;
        reg_number: string;
      };
      client: {
        id: string;
        fullname: string;
        passport_number: string;
      };
    };
    onUpdateSuccess: () => void;
    onCancel: () => void;
  };
  

const WorkOrderUpdate: React.FC<WorkOrderUpdateProps> = ({
  workOrderId,
  initialValues,
  onUpdateSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [changes, setChanges] = useState<Record<string, any>>({});

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setChanges((prev) => ({ ...prev, [field]: value }));
  };

  const handleCarSelect = (carId: string, carLabel: string) => {
    const [manufacturer, model, reg_number] = carLabel.split(" "); 
    handleFieldChange("car_id", carId); 
    setFormData((prev) => ({
      ...prev,
      car: {
        manufacturer: manufacturer || prev.car.manufacturer,
        model: model || prev.car.model,
        reg_number: reg_number || prev.car.reg_number,
      }, 
    }));
  };
  const handleClientSelect = (clientId: string, clientFullname: string) => {
    handleFieldChange("client_id", clientId);
    setFormData((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        id: clientId,
        fullname: clientFullname, // Обновляем имя клиента
      },
    }));
  };
  const handleUpdate = async () => {
    try {
      if (Object.keys(changes).length === 0) {
        alert("No changes to update.");
        return;
      }

      await updateWorkOrder({
        work_order_id: workOrderId,
        values: changes,
      });

      alert("Work order updated successfully!");
      onUpdateSuccess();
    } catch (error) {
      console.error("Error updating work order:", error);
      alert("Failed to update work order.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Update Work Order</h2>
      <div style={{ marginBottom: "15px" }}>
            <label>Client:</label>
            <ClientSearchSelect
                onClientSelect={handleClientSelect} 
                placeholder="Select a client"
                currentClient={{
                    id: formData.client.id,
                    fullname: formData.client.fullname,
                }}
                />
            </div>

            <div style={{ marginBottom: "15px" }}>
            <label>Car:</label>
            <CarSearchSelect
                onCarSelect={handleCarSelect}
                placeholder="Select a car"
                currentCar={{
                id: formData.car_id,
                label: `${formData.car.manufacturer} ${formData.car.model} (${formData.car.reg_number})`,
                }}
            />
            </div>


      <div style={{ marginBottom: "15px" }}>
        <label>Comment:</label>
        <textarea
          value={formData.comment}
          onChange={(e) => handleFieldChange("comment", e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Status:</label>
        <select
          value={formData.status}
          onChange={(e) => handleFieldChange("status", e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        >
          <option value="upcoming">Upcoming</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <button onClick={handleUpdate} style={{ padding: "10px 20px" }}>
        Save Changes
      </button>
      <button onClick={onCancel} style={{ padding: "10px 20px", marginLeft: "10px" }}>
        Cancel
      </button>
    </div>
  );
};

export default WorkOrderUpdate;
