import AppointmentTable from "@/components/AppointmentTable";
import CalendarComponent from "@/components/CalendarComponent";
import PaginationComponent from "@/components/PaginationComponent";
import TableLoader from "@/components/TableLoader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BASE_URL, commonUrl } from "@/utils/commonUrl";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Search, Calendar, List, Grid, Filter, RefreshCw } from "lucide-react";
import moment from "moment";

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointmentList, setAppointmentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [filterActive, setFilterActive] = useState(false);

  const appointmentColumn = [
    { Header: "Date", accessor: "date" },
    { Header: "Case Id", accessor: "case" },
    { Header: "Name", accessor: "name" },
    { Header: "Address", accessor: "address" },
    { Header: "Contact", accessor: "contact" },
    { Header: "Action", accessor: "action" },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const fetchAllAppointments = async ({
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
          },
        }
      );
      const result = response.data?.responseData;
      if (result?.success) {
        setAppointmentList(result?.data?.patients);
        setTotalRecords(result?.data?.totalRecords);
      }
    } catch (error) {
      console.log(error, " error in fetchAllPatients");
    } finally {
      setLoading(false);
    }
  };

  // Format date for API
  const formatDate = (date) => {
    if (!date) return null;
    return moment(date).format("YYYY-MM-DD");
  };

  useEffect(() => {
    fetchAllAppointments({
      searchTerm,
      page: currentPage,
      size: pageSize,
      date: selectedDate,
    });
  }, [currentPage, pageSize, selectedDate]);

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
      fetchAllAppointments({
        searchTerm: value,
        page: 1,
        size: pageSize,
        date: selectedDate,
      });
    }, 500);

    setDebounceTimeout(newTimeout);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCurrentPage(1); // Reset to first page when date changes
    setFilterActive(!!date);
  };

  const clearFilters = () => {
    setSelectedDate(null);
    setSearchTerm("");
    setFilterActive(false);
    setCurrentPage(1);

    // Fetch without filters
    fetchAllAppointments({
      searchTerm: "",
      page: 1,
      size: pageSize,
      date: null,
    });
  };

  const refreshData = () => {
    fetchAllAppointments({
      searchTerm,
      page: currentPage,
      size: pageSize,
      date: selectedDate,
    });
  };
  
  // AppointmentCard component for grid view
  const AppointmentCard = ({ appointment }) => {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-lg">{appointment.name}</h3>
              <p className="text-sm text-gray-500">
                Case ID: {appointment.case}
              </p>
            </div>
            <Badge
              variant={
                appointment.showOnDashboard === true ? "success" : "secondary"
              }
            >
              {appointment?.showOnDashboard ? "In Queue" : "Scheduled"}
            </Badge>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Date:</span>
              <span className="font-medium">{appointment.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Address:</span>
              <span className="text-right">{appointment.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Contact:</span>
              <span>{appointment.contact}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t flex justify-end gap-2">
            {appointment.action}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="w-full mx-auto rounded-xl shadow-lg overflow-hidden">
      <CardHeader className="bg-white border-b pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Appointment List
            {filterActive && (
              <Badge variant="outline" className="ml-2 text-xs font-normal">
                Filtered
              </Badge>
            )}
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              className="h-9"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>

            {filterActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="h-9"
              >
                Clear Filters
              </Button>
            )}

            <Tabs defaultValue="table" value={viewMode}>
              <TabsList className="border">
                <TabsTrigger value="table" onClick={() => setViewMode("table")}>
                  <List className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">List</span>
                </TabsTrigger>
                <TabsTrigger value="grid" onClick={() => setViewMode("grid")}>
                  <Grid className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Grid</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row items-start gap-4 mb-6">
          <div className="w-full lg:w-auto">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
              <CalendarComponent
                selectedDate={selectedDate}
                setSelectedDate={handleDateChange}
              />
            </div>
          </div>

          <div className="w-full lg:flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or case ID..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 py-6 bg-white border-gray-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg">
          {loading ? (
            <div className="py-6">
              <TableLoader columns={appointmentColumn?.length} />
            </div>
          ) : appointmentList.length > 0 ? (
            <>
              <Tabs defaultValue={viewMode} value={viewMode} className="w-full">
                <TabsContent value="table" className="mt-0">
                  <div className="overflow-x-auto rounded-lg border">
                    <AppointmentTable
                      appointmentList={appointmentList}
                      appointmentColumn={appointmentColumn}
                      fetchAllAppointments={fetchAllAppointments}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="grid" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {appointmentList.map((appointment, index) => (
                      <AppointmentCard key={index} appointment={appointment} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-4 py-3 px-4 border rounded-lg bg-gray-50">
                <PaginationComponent
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalRecords={totalRecords}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  pageOptions={[5, 10, 20, 50, 100, 500]}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-gray-50">
              <Calendar className="h-12 w-12 text-gray-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-700">
                No appointments found
              </h3>
              <p className="text-gray-500 text-center mt-1">
                {filterActive
                  ? "Try changing your search criteria or date selection"
                  : "No appointments are currently scheduled"}
              </p>
              {filterActive && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Appointments;
