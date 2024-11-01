import React, { useState } from "react";
import CalendarComponent from "./CalendarComponent";
import { TableComponent } from "./TableComponent";
import PaginationComponent from "./PaginationComponent";
import { Input } from "@/components/ui/input";

const QueuedPatients = (props) => {
  const {
    selectedDate,
    setSelectedDate,
    tableRows,
    setTableRows,
    tableColumns,
    selectedRows,
    setSelectedRows,
  } = props;

  return (
    <div className="bg-white border-1 rounded-lg border-black shadow-md">
      <div className="flex place-items-center gap-2 justify-between mr-5">
        <CalendarComponent
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <div>
          <Input placeholder="Search" />
        </div>
      </div>
      <br />
      <TableComponent
        tableRows={tableRows}
        setTableRows={setTableRows}
        tableColumns={tableColumns}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <PaginationComponent pageOptions={[5, 10, 20]} />
    </div>
  );
};

export default QueuedPatients;
