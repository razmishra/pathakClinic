import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { examinationsData } from "@/data/examinations";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formateIntoDateAndTime } from "@/utils/helper/dateHelper";

const QueuedPatientDetails = (props) => {
  const tableData = localStorage.getItem("tableData");
  const { selectedRows } = props;
  const [patientsDetails, setPatientsDetails] = useState([]);
  const [allExamDetails, setAllExamDetails] = useState([]);
  const [currentPatientDetails, setCurrentPatientDetails] = useState(null);
  const [currentPatientExamDetails, setCurrentPatientExamDetails] =
    useState(null);
  const [currentViewingIndex, setCurrentViewingIndex] = useState(0);

  useEffect(() => {
    const allSelectedPatients = JSON.parse(tableData).filter((data) =>
      selectedRows.includes(data.case)
    );
    setPatientsDetails(allSelectedPatients);
    const allExamDetails = examinationsData?.filter((data) =>
      selectedRows?.includes(data.caseId)
    );
    setAllExamDetails(allExamDetails);
  }, [selectedRows]);

  useEffect(() => {
    if (patientsDetails && patientsDetails.length) {
      const details = patientsDetails[currentViewingIndex];
      if (!details && patientsDetails?.length) {
        // show the next patients details when current patient is unchecked
        setCurrentPatientDetails(patientsDetails[currentViewingIndex + 1]);
      } else {
        setCurrentPatientDetails(details);
      }
    }
  }, [patientsDetails, currentViewingIndex]);

  useEffect(() => {
    if (currentPatientDetails) {
      const data = allExamDetails?.filter(
        (item) => (item.case = currentPatientDetails.case)
      );
      setCurrentPatientExamDetails(data[0]);
    }
  }, [currentPatientDetails]);

  const handleNextAndPrevDetails = (type) => {
    if (type === "next") {
      setCurrentViewingIndex((prevIndex) =>
        prevIndex === patientsDetails.length - 1 ? 0 : prevIndex + 1
      );
    }
    if (type === "prev") {
      setCurrentViewingIndex((prevIndex) =>
        prevIndex === 0 ? patientsDetails.length - 1 : prevIndex - 1
      );
    }
  };
  const Divider = () => (
    <div style={{ borderRight: "2px solid #ccc", height: "100%" }} />
  );

  return (
    <div className="shadow-lg">
      <head className="flex items-center justify-between ml-2 mr-2">
        <span
          onClick={() => handleNextAndPrevDetails("prev")}
          className="cursor-pointer bg-slate-800 text-white hover:bg-slate-500
          p-2 rounded"
        >
          <ChevronLeft />
        </span>
        <span className="bg-slate-800 text-white p-2 rounded">
          {currentPatientDetails && currentPatientDetails?.case}
        </span>
        <span
          onClick={() => handleNextAndPrevDetails("next")}
          className="cursor-pointer bg-slate-800 text-white hover:bg-slate-500
          p-2 rounded"
        >
          <ChevronRight />
        </span>
      </head>
      <div className="flex flex-col items-center">
        <span>{currentPatientDetails?.name}</span>
        <span>
          {formateIntoDateAndTime(currentPatientExamDetails?.createdAt) ??
            "N/A"}
        </span>
      </div>
      {currentPatientExamDetails && (
        <Table style={{ tableLayout: "fixed", width: "100%" }}>
          <TableBody>
            <TableRow className="hover:bg-muted/100">
              <TableCell className="border-r-2 w-1/3 border-[rgb(236 219 219)]">
                chiefComplaints
              </TableCell>
              <TableCell>{currentPatientExamDetails.chiefComplaints}</TableCell>
            </TableRow>
            <TableRow className="hover:bg-muted/100">
              <TableCell className="border-r-2 w-1/3 border-[rgb(236 219 219)]">
                KCO
              </TableCell>
              <TableCell>{currentPatientExamDetails.KCO}</TableCell>
            </TableRow>
            <TableRow className="hover:bg-muted/100">
              <TableCell className="border-r-2 w-1/3 border-[rgb(236 219 219)]">
                diagnosis
              </TableCell>
              <TableCell>{currentPatientExamDetails.diagnosis}</TableCell>
            </TableRow>
            <TableRow className="hover:bg-muted/100">
              <TableCell className="border-r-2 w-1/3 border-[rgb(236 219 219)]">
                prescription
              </TableCell>
              <TableCell>{currentPatientExamDetails.prescription}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default QueuedPatientDetails;
