import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Phone,
  AlertCircle,
  Stethoscope,
  Pill,
  Clipboard,
  FileText,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import moment from "moment";

const QueuedPatientDetails = ({ selectedRows }) => {
  const [patientsWithDetails, setPatientsWithDetails] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("details");
  const currentPatient = patientsWithDetails[currentIndex] || null;

  useEffect(() => {
    if (selectedRows.length > 0) {
      setPatientsWithDetails(selectedRows);
    }
  }, [selectedRows]);

  const handleNavigation = (direction) => {
    if (patientsWithDetails.length === 0) return;

    if (direction === "next") {
      setCurrentIndex((prev) =>
        prev === patientsWithDetails.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentIndex((prev) =>
        prev === 0 ? patientsWithDetails.length - 1 : prev - 1
      );
    }
  };

  // Handle tab change for both mobile and desktop
  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  if (patientsWithDetails.length === 0) {
    return (
      <Card className="w-full shadow-lg">
        <CardContent className="p-6 flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-center text-gray-600">
            No patient records selected
          </p>
          <p className="text-sm text-center text-gray-500 mt-2">
            Please select patient records to view their examination details
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border border-gray-200">
      {/* Card Header with Navigation */}
      <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center">
          <button
            onClick={() => handleNavigation("prev")}
            className="p-1 rounded-full hover:bg-gray-200 mr-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Previous patient"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <Badge
            variant="outline"
            className="font-medium bg-blue-50 border-blue-200 text-blue-700"
          >
            Case #{currentPatient?.caseId}
          </Badge>

          <button
            onClick={() => handleNavigation("next")}
            className="p-1 rounded-full hover:bg-gray-200 ml-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Next patient"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="font-normal">
            {currentIndex + 1} of {patientsWithDetails.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Patient Info Section */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentPatient?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {currentPatient?.gender}, {currentPatient?.age} years
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-700 truncate">
                {currentPatient?.contact}
              </p>
            </div>

            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-700 truncate">
                {currentPatient?.createdAt ? moment(currentPatient?.createdAt).format("DD-MM-YYYY") : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {currentPatient?.examination ? (
          <div className="w-full">
            {/* Mobile-optimized Tabs */}
            <div className="sm:hidden">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <select
                  className="w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e) => handleTabChange(e.target.value)}
                  value={activeTab}
                >
                  <option value="details">Patient Details</option>
                  <option value="diagnosis">Diagnosis</option>
                  <option value="prescriptions">Prescriptions</option>
                </select>
              </div>
              
              {/* Render active tab content for mobile */}
              <div className="sm:hidden">
                {activeTab === "details" && <PatientDetailsContent patient={currentPatient} />}
                {activeTab === "diagnosis" && <DiagnosisContent patient={currentPatient} />}
                {activeTab === "prescriptions" && <PrescriptionsContent patient={currentPatient} />}
              </div>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden sm:block">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <div className="px-4 border-b border-gray-200">
                  <TabsList className="grid grid-cols-3 w-auto">
                    <TabsTrigger value="details">
                      <Clipboard className="h-4 w-4 mr-2" />
                      <span>Details</span>
                    </TabsTrigger>
                    <TabsTrigger value="diagnosis">
                      <Stethoscope className="h-4 w-4 mr-2" />
                      <span>Diagnosis</span>
                    </TabsTrigger>
                    <TabsTrigger value="prescriptions">
                      <Pill className="h-4 w-4 mr-2" />
                      <span>Prescriptions</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="details" className="p-0 m-0">
                  <PatientDetailsContent patient={currentPatient} />
                </TabsContent>

                <TabsContent value="diagnosis" className="p-0 m-0">
                  <DiagnosisContent patient={currentPatient} />
                </TabsContent>

                <TabsContent value="prescriptions" className="p-0 m-0">
                  <PrescriptionsContent patient={currentPatient} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Examination Data
            </h3>
            <p className="text-sm text-gray-500">
              This patient does not have any examination records available.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-gray-50 border-t border-gray-200 px-4 py-3">
        <div className="w-full flex flex-col sm:flex-row justify-between sm:items-center text-xs text-gray-500 gap-2">
          <span className="truncate">
            Patient ID: {currentPatient?._id?.substring(0, 8)}...
          </span>
          <span className="truncate">
            Address: {currentPatient?.address || "Not provided"}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

// Separated components for better organization
const PatientDetailsContent = ({ patient }) => (
  <div className="p-4">
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="w-1/3 font-medium text-gray-700 bg-gray-50">
            Chief Complaints
          </TableCell>
          <TableCell>
            {patient.examination.chiefComplaints || "None recorded"}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="w-1/3 font-medium text-gray-700 bg-gray-50">
            KCO (Known Case Of)
          </TableCell>
          <TableCell>{patient.examination.kco || "None recorded"}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="w-1/3 font-medium text-gray-700 bg-gray-50">
            Occupation
          </TableCell>
          <TableCell>
            {patient.examination.occupation || "Not specified"}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);

const DiagnosisContent = ({ patient }) => (
  <div className="p-4">
    <div className="bg-gray-50 p-3 rounded-md mb-2">
      <h4 className="text-sm font-medium text-gray-700 mb-1">Diagnosis</h4>
      <p className="text-sm">
        {patient.examination.diagnosis || "No diagnosis recorded"}
      </p>
    </div>
  </div>
);

const PrescriptionsContent = ({ patient }) => {
  const prescriptions = patient.examination.prescriptions || [];

  return (
    <div className="p-4">
      {prescriptions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {prescriptions.map((prescription, idx) => (
            <div
              key={prescription._id || idx}
              className="border rounded-md overflow-hidden bg-white hover:shadow-sm transition-shadow"
            >
              <div className="bg-blue-50 px-3 py-2 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-blue-500 mr-2" />
                  <h4 className="text-sm font-medium text-blue-700">
                    Prescription #{idx + 1}
                  </h4>
                </div>
                <Badge variant="outline" className="text-xs bg-white">
                  {prescription.date}
                </Badge>
              </div>

              <div className="p-3">
                <div className="space-y-3">
                  <div>
                    <h5 className="text-xs font-medium text-gray-500 mb-1">
                      Symptoms
                    </h5>
                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-sm">
                        {prescription.symptoms || "None recorded"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-medium text-gray-500 mb-1">
                      Medication
                    </h5>
                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-sm">
                        {prescription.prescription || "None prescribed"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <Pill className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No prescriptions recorded</p>
        </div>
      )}
    </div>
  );
};

export default QueuedPatientDetails;