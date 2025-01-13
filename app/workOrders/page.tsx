export const runtime = "edge";

"use client";

import React, { useState, useEffect } from "react";
import { getWorkOrders, deleteWorkOrder } from "../../components/http";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import TableTemplate from "../../components/TableTemplate/TableTemplate";
import Header from "../../components/header/header";
import Pagination from "../../components/Pagination/Pagination"
import { useTranslation } from "react-i18next";

type WorkOrder = {
  id: string;
  start_at: string;
  end_at: string;
  client: {
    fullname: string;
    passport_number: string;
  };
  car: {
    reg_number: string;
    manufacturer: string;
    model: string;
  };
};

const WorkOrdersPage: React.FC = () => {
  const { t } = useTranslation("common");
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [totalRecords, setTotalRecords] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5; 
  const router = useRouter();

  const fetchWorkOrders = async (page: number) => {
    try {
      const offset = (page - 1) * limit;
      const response = await getWorkOrders(limit, offset); 
      setWorkOrders(response); 
      // setTotalRecords(response.total); 
    } catch (error) {
      console.error("Error fetching work orders:", error);
    }
  };

  useEffect(() => {
    fetchWorkOrders(currentPage); 
  }, [currentPage]);

  const handleDeleteWorkOrder = async (id: string) => {
    const confirmation = confirm(t("workOrder.List.delete"));
    if (!confirmation) return;

    try {
      await deleteWorkOrder(id);
      fetchWorkOrders(currentPage); 
      alert(t("workOrder.List.deletedSuccessfully"));
    } catch (error) {
      console.error("Error deleting work order:", error);
      alert(t("workOrder.List.deleteError"));
    }
  };

  const renderRow = (order: WorkOrder) => (
    <tr
      key={order.id}
      onClick={() => router.push(`/workOrders/${order.id}`)}
      style={{ cursor: "pointer" }}
    >
      <td>{order.client?.fullname || t("workOrder.List.noClient")}</td>
      <td>{order.client?.passport_number || t("workOrder.List.notSpecified")}</td>
      <td>{order.car.reg_number || t("workOrder.List.notSpecified")}</td>
      <td>{order.car.manufacturer || t("workOrder.List.notSpecified")}</td>
      <td>{order.car.model || t("workOrder.List.notSpecified")}</td>
      <td>
        <FaTrash
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteWorkOrder(order.id);
          }}
          style={{ color: "red", cursor: "pointer" }}
          title={t("workOrder.List.delete")}
        />
      </td>
    </tr>
  );

  return (
    <>
      <Header
        title={t("workOrder.List.title")}
        onAddClick={() => router.push(`/workOrders/add`)}
      />
      <TableTemplate
        headers={[
          t("workOrder.List.clientName"),
          t("workOrder.List.passport"),
          t("workOrder.List.carReg"),
          t("workOrder.List.manufacturer"),
          t("workOrder.List.model"),
        ]}
        data={workOrders}
        renderRow={renderRow}
        title={t("workOrder.List.title")}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalRecords / limit)}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default WorkOrdersPage;
