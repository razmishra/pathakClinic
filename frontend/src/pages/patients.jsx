import PaginationComponent from "@/components/PaginationComponent";
import PatientsList from "@/components/PatientsList";
import { Input } from "@/components/ui/input";
import { patientsList } from "@/data/examinations";

const patientsColumn = [
  { Header: "Case", accessor: "case" },
  { Header: "Name", accessor: "name" },
  { Header: "Address", accessor: "address" },
  { Header: "Contact", accessor: "contact" },
  { Header: "Occupation", accessor: "occupation" },
  { Header: "Age", accessor: "age" },
  { Header: "Sex", accessor: "sex" },
  { Header: "Action", accessor: "action" },
];

const Patients = () => {
  return (
    <div className="shadow-lg">
      <div className=" flex justify-between items-center">
        <span className="font-medium p-2 text-2xl">Patients List</span>
        <span>
          <Input placeholder="Search patients" className="" />
        </span>
      </div>
      <PatientsList
        patientsList={patientsList}
        patientsColumn={patientsColumn}
      />
      <PaginationComponent pageOptions={[5, 10, 20]} />
    </div>
  );
};

export default Patients;
