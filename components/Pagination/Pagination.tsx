import React from "react";
import { Pagination as MuiPagination, PaginationItem } from "@mui/material";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        variant="outlined"
        shape="rounded"
        renderItem={(item) => (
          <PaginationItem
            {...item}
            style={{
              fontWeight: item.selected ? "bold" : "normal",
              color: item.selected ? "#1976d2" : "inherit",
            }}
          />
        )}
      />
    </div>
  );
};

export default Pagination;
