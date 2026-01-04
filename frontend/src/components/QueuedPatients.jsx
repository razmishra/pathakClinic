import React, { memo } from "react";
import CalendarComponent from "./CalendarComponent";
import { TableComponent } from "./TableComponent";
import PaginationComponent from "./PaginationComponent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const QueuedPatients = (props) => {
  const {
    selectedDate,
    setSelectedDate,
    tableRows,
    setTableRows,
    tableColumns,
    selectedRows,
    setSelectedRows,
    searchTerm,
    setSearchTerm,
    handleSearchChange,
    currentPage,
    pageSize,
    totalRecords,
    onPageChange,
    onPageSizeChange,
  } = props;

  // Function to reset date to today
  const handleResetDate = () => {
    setSelectedDate(null);
    // If you have a search reset function, you might want to call it here too
    setSearchTerm("");
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg p-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <div className="flex-1 w-full sm:w-auto">
          <h2 className="text-xl font-semibold mb-2">Queued Patients</h2>
          <div className="flex items-center gap-2">
            <CalendarComponent
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            {selectedDate && <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetDate}
              className="flex items-center gap-1"
            >
              <RefreshCw size={16} />
              <span>Clear</span>
            </Button>}
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="min-w-[240px]"
          />
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <TableComponent
          tableRows={tableRows}
          setTableRows={setTableRows}
          tableColumns={tableColumns}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </div>
      
      <div className="mt-4">
        <PaginationComponent
          currentPage={currentPage}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageOptions={[5, 10, 20, 50, 100, 500]}
        />
      </div>
    </div>
  );
};

export default memo(QueuedPatients);
