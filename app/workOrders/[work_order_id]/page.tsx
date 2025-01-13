"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getWorkOrder, updateWorkOrder } from "../../../components/http";
import { useTranslation } from "react-i18next";
import WorkOrderUpdate from "./WorkOrderUpdate";

type Client = {
  id: string;
  fullname: string;
  passport_number: string;
};

type Employee = {
  id: string;
  fullname: string;
  post: {
    id: string;
    name: string;
  };
};

type Service = {
  id: string;
  name: string;
  price: string;
  duration: string;
};

type Car = {
  id: string;
  reg_number: string;
  manufacturer: string;
  model: string;
};

type WorkOrder = {
  id: string;
  comment: string;
  status: string;
  documents: string[];
  tax: string;
  issued_on: string;
  start_at: string;
  end_at: string;
  client: Client;
  employees: Employee[];
  services: Service[];
  car: Car;
};

const WorkOrderDetails: React.FC = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const params = useParams();
  const workOrderId = params.work_order_id;

  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchWorkOrder = async () => {
    try {
      const fetchedWorkOrder = await getWorkOrder(workOrderId);
      setWorkOrder(fetchedWorkOrder);
    } catch (error) {
      console.error("Error fetching work order:", error);
      alert(t("workOrder.Details.errorFetching"));
    }
  };

  useEffect(() => {
    fetchWorkOrder();
  }, [workOrderId]);

  if (!workOrder) {
    return <div>{t("workOrder.Details.loading")}</div>;
  }

  const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    fetchWorkOrder(); 
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>{t("workOrder.Details.title")}</h1>
      {!isEditing ? (
        <>
          <Block title={t("workOrder.Details.clientInfo")}>
            <p>
              <strong>{t("workOrder.Details.clientName")}: </strong>
              {workOrder.client.fullname}
            </p>
            <p>
              <strong>{t("workOrder.Details.clientPassport")}: </strong>
              {workOrder.client.passport_number}
            </p>
          </Block>

          <Block title={t("workOrder.Details.carInfo")}>
            <p>
              <strong>{t("workOrder.Details.carDetails")}: </strong>
              {`${workOrder.car.manufacturer} ${workOrder.car.model} (${workOrder.car.reg_number})`}
            </p>
          </Block>

          <Block title={t("workOrder.Details.orderInfo")}>
            <p>
              <strong>{t("workOrder.Details.status")}: </strong>
              {workOrder.status}
            </p>
            <p>
              <strong>{t("workOrder.Details.comment")}: </strong>
              {workOrder.comment}
            </p>
            <p>
              <strong>{t("workOrder.Details.tax")}: </strong>
              {workOrder.tax}
            </p>
            <p>
              <strong>{t("workOrder.Details.issuedOn")}: </strong>
              {new Date(workOrder.issued_on).toLocaleDateString()}
            </p>
            <p>
              <strong>{t("workOrder.Details.startAt")}: </strong>
              {workOrder.start_at
                ? new Date(workOrder.start_at).toLocaleString()
                : t("workOrder.Details.notSpecified")}
            </p>
            <p>
              <strong>{t("workOrder.Details.endAt")}: </strong>
              {workOrder.end_at
                ? new Date(workOrder.end_at).toLocaleString()
                : t("workOrder.Details.notSpecified")}
            </p>
          </Block>

          <button onClick={() => setIsEditing(true)} style={{ marginTop: "10px" }}>
            {t("workOrder.Details.editButton")}
          </button>
        </>
      ) : (
        <WorkOrderUpdate
  workOrderId={workOrder.id}
  initialValues={{
    car_id: workOrder.car.id,
    comment: workOrder.comment,
    status: workOrder.status,
    documents: workOrder.documents,
    tax: parseFloat(workOrder.tax),
    client_id: workOrder.client.id,
    start_at: workOrder.start_at,
    end_at: workOrder.end_at,
    issued_on: workOrder.issued_on,
    car: {
      manufacturer: workOrder.car.manufacturer,
      model: workOrder.car.model,
      reg_number: workOrder.car.reg_number,
    },
    client: {
      id: workOrder.client.id,
      fullname: workOrder.client.fullname,
      passport_number: workOrder.client.passport_number,
    }, 
  }}
  onUpdateSuccess={handleUpdateSuccess}
  onCancel={() => setIsEditing(false)}
/>

      

      )}
    </div>
  );
};

export default WorkOrderDetails;
