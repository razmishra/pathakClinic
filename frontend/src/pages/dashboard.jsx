import CalendarComponent from "@/components/CalendarComponent";
import DashboardCard from "@/components/Card";
import Card from "@/components/Card";
import PaginationComponent from "@/components/PaginationComponent";
import QueuedPatientDetails from "@/components/QueuedPatientDetails";
import QueuedPatients from "@/components/QueuedPatients";
import { TableComponent } from "@/components/TableComponent";
import checkIfLoggedIn from "@/utils/checkIfAuth";
import { BASE_URL, commonUrl } from "@/utils/commonUrl";
import axios from "axios";
import { Activity, BriefcaseMedical, Stethoscope, Users } from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tableRows, setTableRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [totalPatients, setTotalPatients] = useState(null);
  const [todaysNewPatients, setTodaysNewPatients] = useState(null);
  const [totalExaminations, setTotalExaminations] = useState(null);
  const [todaysNewExaminations, setTodaysNewExaminations] = useState(null);

  const dashboardHeader = [
    {
      cardTitle: "Total Patients",
      cardImage: Users,
    },
    {
      cardTitle: "Total Examinations",
      cardImage: Stethoscope,
    },
    {
      cardTitle: "Today's Examinations",
      cardImage: BriefcaseMedical,
    },
    {
      cardTitle: "Today's New Patients",
      cardImage: Activity,
    },
  ];

  const [dashboardItems, setDashboardItems] = useState(dashboardHeader);

  const tableColumns = [
    { Header: "Date & Time", accessor: "date" },
    { Header: "Case Id", accessor: "case" },
    { Header: "Name", accessor: "name" },
    { Header: "Address", accessor: "address" },
    { Header: "Contact", accessor: "contact" },
    { Header: "Action", accessor: "action" },
  ];

  // Format date for API
  const formatDate = (date) => {
    if (!date) return null;
    return moment(date).format("YYYY-MM-DD");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset page to 1 when search term changes

    // Clear the previous debounce timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new debounce timeout to delay the API call
    const newTimeout = setTimeout(() => {
      fetchAllPatients({
        searchTerm: value,
        page: 1,
        size: pageSize,
        date: selectedDate,
      });
    }, 500);

    setDebounceTimeout(newTimeout);
  };

  const fetchDashboardCardDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}${commonUrl.Dashboard.getRecord}`
      );
      const result = response.data?.responseData;
      if (!result?.success) {
        toast.error(result?.errorMessage);
      } else {
        setTotalPatients(result?.data?.totalPatients);
        setTodaysNewPatients(result?.data?.todaysNewPatients);
        setTotalExaminations(result?.data?.totalExaminations);
        setTodaysNewExaminations(result?.data?.todaysExaminations);

        setDashboardItems([
          {
            cardTitle: "Total Patients",
            cardDescription: result?.data?.totalPatients,
            cardImage: Users,
          },
          {
            cardTitle: "Total Examinations",
            cardDescription: result?.data?.totalExaminations,
            cardImage: Stethoscope,
          },
          {
            cardTitle: "Today's Examinations",
            cardDescription: result?.data?.todaysExaminations,
            cardImage: BriefcaseMedical,
          },
          {
            cardTitle: "Today's New Patients",
            cardDescription: result?.data?.todaysNewPatients,
            cardImage: Activity,
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPatients = async ({
    searchTerm = null,
    page = 1,
    size = 10,
    date = null,
  }) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}${commonUrl.Patients.getAll}`,
        {
          params: {
            search: searchTerm,
            pageNo: page,
            itemsPerPage: size,
            date: date ? formatDate(date) : null,
            sortKey: "createdAt",
            sortOrder: "desc",
            includeExaminations: true,
            showOnDashboard: true,
          },
        }
      );
      const result = response.data?.responseData;
      if (result?.success) {
        setTableRows(result?.data?.patients);
        setTotalRecords(result?.data?.totalRecords);
      }
    } catch (error) {
      console.log(error, " error in fetchAllPatients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPatients({ page: currentPage, size: pageSize, date: selectedDate });
  }, [currentPage, pageSize, selectedDate]);

  useEffect(() => {
    fetchDashboardCardDetail();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCurrentPage(1); // Reset to first page when date changes
  };

  return (
    <>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
        {dashboardItems?.map((item, index) => {
          return (
            <DashboardCard
              key={index}
              cardTitle={item.cardTitle}
              cardDescription={item.cardDescription}
              cardImage={item?.cardImage}
              totalPatients={totalPatients}
              todaysNewPatients={todaysNewPatients}
              totalExaminations={totalExaminations}
              todaysNewExaminations={todaysNewExaminations}
            />
          );
        })}
      </div>
      {/* Today's queued patients list */}
      <QueuedPatients
        selectedDate={selectedDate}
        setSelectedDate={handleDateChange}
        tableRows={tableRows}
        setTableRows={setTableRows}
        tableColumns={tableColumns}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearchChange={handleSearchChange}
        currentPage={currentPage}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
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
