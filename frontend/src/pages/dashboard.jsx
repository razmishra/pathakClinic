import CalendarComponent from "@/components/CalendarComponent";
import DashboardCard from "@/components/Card";
import Card from "@/components/Card";
import PaginationComponent from "@/components/PaginationComponent";
import QueuedPatientDetails from "@/components/QueuedPatientDetails";
import QueuedPatients from "@/components/QueuedPatients";
import { TableComponent } from "@/components/TableComponent";
import checkIfLoggedIn from "@/utils/checkIfAuth";
import { Activity, BriefcaseMedical, Stethoscope, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const dashboardItems = [
  {
    cardTitle: "Total Patients",
    cardDescription: 10000,
    cardImage: Users,
  },
  {
    cardTitle: "Total Examinations",
    cardDescription: 15000,
    cardImage: Stethoscope,
  },
  {
    cardTitle: "Today's Examinations",
    cardDescription: 1000,
    cardImage: BriefcaseMedical,
  },
  {
    cardTitle: "Today's New Patients",
    cardDescription: 450,
    cardImage: Activity,
  },
];

const tableData = [
  {
    case: "001",
    name: "John Doe",
    address: "123 Main St, Springfield, USA",
    contact: "(555) 123-4567",
    action: "Queued",
  },
  {
    case: "002",
    name: "Jane Smith",
    address: "456 Elm St, Springfield, USA",
    contact: "(555) 234-5678",
    action: "Queued",
  },
  {
    case: "003",
    name: "Mike Johnson",
    address: "789 Maple St, Springfield, USA",
    contact: "(555) 345-6789",
    action: "Queued",
  },
  {
    case: "004",
    name: "Emily Davis",
    address: "101 Oak St, Springfield, USA",
    contact: "(555) 456-7890",
    action: "Queued",
  },
  {
    case: "005",
    name: "Chris Brown",
    address: "202 Pine St, Springfield, USA",
    contact: "(555) 567-8901",
    action: "Queued",
  },
];

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tableRows, setTableRows] = useState(tableData);
  const [selectedRows, setSelectedRows] = useState([]);
  const tableColumns = [
    { Header: "Case", accessor: "case" },
    { Header: "Name", accessor: "name" },
    { Header: "Address", accessor: "address" },
    { Header: "Contact", accessor: "contact" },
    { Header: "Action", accessor: "action" },
  ];

  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(tableData));
  }, []);

  return (
    <>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
        {dashboardItems?.map((item) => {
          return (
            <DashboardCard
              cardTitle={item.cardTitle}
              cardDescription={item.cardDescription}
              cardImage={item?.cardImage}
            />
          );
        })}
      </div>
      {/* Today's queued patients list */}
      <QueuedPatients
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        tableRows={tableRows}
        setTableRows={setTableRows}
        tableColumns={tableColumns}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <div className="py-4">
        {selectedRows && selectedRows?.length > 0 && (
          <QueuedPatientDetails selectedRows={selectedRows} />
        )}
      </div>
    </>
  );
};

export default Dashboard;
