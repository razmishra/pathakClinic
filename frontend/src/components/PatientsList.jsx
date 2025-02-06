import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const PatientsList = (props) => {
  const { patientsList, patientsColumn } = props;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editedPatient, setEditedPatient] = useState(null);
  const [patientImages, setPatientImages] = useState([]);

  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setEditedPatient({ ...patient });
    setPatientImages(patient.images || []);
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setPatientImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setPatientImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the patient
    console.log("Saving patient:", editedPatient);
    console.log("Updated images:", patientImages);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-800">
            {patientsColumn?.map((column) => (
              <TableHead key={column.Header} className="text-white">
                {column.Header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {patientsList.map((row) => (
            <TableRow
              key={row.case}
              className="cursor-pointer hover:bg-muted/100"
            >
              <TableCell className="font-medium">{row?.caseId}</TableCell>
              <TableCell>{row?.name}</TableCell>
              <TableCell>{row?.address}</TableCell>
              <TableCell>{row?.contact}</TableCell>
              <TableCell>{row?.occupation}</TableCell>
              <TableCell>{row?.age}</TableCell>
              <TableCell>{row?.sex}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditClick(row)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Patient Details</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={editedPatient?.name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={editedPatient?.age || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={editedPatient?.contact || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  value={editedPatient?.occupation || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={editedPatient?.address || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {patientImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Patient ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 rounded-full p-1 
                               opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
                <label
                  className="flex items-center justify-center w-full h-24 
                                border-2 border-dashed rounded-md cursor-pointer
                                hover:border-gray-400 transition-colors"
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Plus className="h-8 w-8 text-gray-400" />
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatientsList;
