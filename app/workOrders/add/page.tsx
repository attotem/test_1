"use client";

import React, { useState } from "react";
import CarSearchSelect from "@/components/Search/CarsSearchSelect";
import ClientSearchSelect from "@/components/Search/ClientSearchSelect";
import MultiServiceSelect from "@/components/Search/MultiServiceSelect";
import {
  addWorkOrder,
  attachServices,
  attachComplexServices,
} from "../../../components/http";

type Service = {
  id: string;
  name: string;
  is_complex: boolean;
};

const AddWorkOrder: React.FC = () => {
  const [formData, setFormData] = useState({
    car_id: "",
    car: {
      manufacturer: "",
      model: "",
      reg_number: "",
    },
    client_id: "",
    client: {
      fullname: "",
    },
    comment: "",
    status: "upcoming",
    documents: [] as string[],
    tax: 0,
    start_at: "",
    end_at: "",
    issued_on: new Date().toISOString(),
    selectedServices: [] as Service[], // Список всех выбранных сервисов
  });

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCarSelect = (carId: string, carLabel: string) => {
    const [manufacturer, model, reg_number] = carLabel.split(" ");
    handleFieldChange("car_id", carId);
    setFormData((prev) => ({
      ...prev,
      car: {
        manufacturer: manufacturer || "",
        model: model || "",
        reg_number: reg_number || "",
      },
    }));
  };

  const handleClientSelect = (clientId: string, clientFullname: string) => {
    handleFieldChange("client_id", clientId);
    setFormData((prev) => ({
      ...prev,
      client: {
        fullname: clientFullname,
      },
    }));
  };

  const handleServicesChange = (services: Service[]) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: services,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.car_id || !formData.client_id) {
        alert("Car and Client fields are required.");
        return;
      }

      const response = await addWorkOrder({
        car_id: formData.car_id,
        client_id: formData.client_id,
        comment: formData.comment,
        status: formData.status,
        documents: formData.documents,
        tax: formData.tax,
        // start_at: formData.start_at,
        // end_at: formData.end_at,
        // issued_on: formData.issued_on,
      });

      const workOrderId = response.work_order_id;

      const regularServices = formData.selectedServices
        .filter((service) => !service.is_complex)
        .map((service) => service.id);

      const complexServices = formData.selectedServices
        .filter((service) => service.is_complex)
        .map((service) => service.id);

      if (regularServices.length > 0) {
        await attachServices({
          work_order_id: workOrderId,
          ids: regularServices,
        });
      }

      if (complexServices.length > 0) {
        await attachComplexServices({
          work_order_id: workOrderId,
          ids: complexServices,
        });
      }

      alert("Work order and services created successfully!");
    } catch (error) {
      console.error("Error creating work order:", error);
      alert("Failed to create work order.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Add New Work Order</h2>

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
        <label>Client:</label>
        <ClientSearchSelect
          onClientSelect={handleClientSelect}
          placeholder="Select a client"
          currentClient={{
            id: formData.client_id,
            fullname: formData.client.fullname,
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Services:</label>
        <MultiServiceSelect
          onServicesChange={handleServicesChange}
          placeholder="Select services"
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

      <div style={{ marginBottom: "15px" }}>
        <label>Tax:</label>
        <input
          type="number"
          value={formData.tax}
          onChange={(e) => handleFieldChange("tax", parseFloat(e.target.value))}
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      {/* <div style={{ marginBottom: "15px" }}>
        <label>Start At:</label>
        <input
          type="datetime-local"
          value={formData.start_at}
          onChange={(e) => handleFieldChange("start_at", e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>End At:</label>
        <input
          type="datetime-local"
          value={formData.end_at}
          onChange={(e) => handleFieldChange("end_at", e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />
      </div> */}

      <button onClick={handleSubmit} style={{ padding: "10px 20px" }}>
        Create Work Order
      </button>
    </div>
  );
};

export default AddWorkOrder;
