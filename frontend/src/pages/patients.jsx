import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import PaginationComponent from "@/components/PaginationComponent";
import PatientsList from "@/components/PatientsList";
import { BASE_URL, commonUrl } from "@/utils/commonUrl";
import TableLoader from "@/components/TableLoader";
import { User } from "lucide-react";

const patientsColumn = [
  { Header: "Case Id", accessor: "case" },
  { Header: "Name", accessor: "name" },
  { Header: "Address", accessor: "address" },
  { Header: "Contact", accessor: "contact" },
  { Header: "Occupation", accessor: "occupation" },
  { Header: "Age", accessor: "age" },
  { Header: "Sex", accessor: "sex" },
  { Header: "Action", accessor: "action" },
];

const Patients = () => {
  const [patientsList, setPatientsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAllPatients = async ({
    searchTerm = null,
    page = 1,
    size = 10,
  }) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}${commonUrl.Patients.getAll}`,
        {
          params: { search: searchTerm, pageNo: page, itemsPerPage: size },
        }
      );
      const result = response.data?.responseData;
      if (result?.success) {
        setPatientsList(result?.data?.patients);
        setTotalRecords(result?.data?.totalRecords);
      }
    } catch (error) {
      console.log(error, " error in fetchAllPatients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPatients({ searchTerm, page: currentPage, size: pageSize });
  }, [currentPage, pageSize]);

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
      fetchAllPatients({ searchTerm: value, page: 1, size: pageSize });
    }, 500);

    setDebounceTimeout(newTimeout);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="shadow-lg p-4 pt-0">
      <div className="flex justify-between items-center">
        <span className="font-medium p-2 text-2xl">Patients List</span>
        <span>
          <Input
            placeholder="Search patients"
            value={searchTerm}
            onChange={handleSearchChange}
            className=""
          />
        </span>
      </div>
      {loading ? (
        <TableLoader columns={patientsColumn?.length} />
      ) : patientsList.length > 0 ? (
        <>
          <PatientsList
            patientsList={patientsList}
            patientsColumn={patientsColumn}
            fetchAllPatients={fetchAllPatients}
          />
          <PaginationComponent
            currentPage={currentPage}
            pageSize={pageSize}
            totalRecords={totalRecords}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageOptions={[5, 10, 20, 50, 100, 500]}
          />
        </>
      ) : (
        <div className="text-center py-12 bg-gradient-to-b from-gray-50 to-gray-100/50 rounded-xl border border-gray-100 shadow-sm">
          <User className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-1">
            No patients found
          </h3>
          <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
            Get started by adding a new patient.
          </p>
        </div>
      )}
    </div>
  );
};

export default Patients;
