import React, { useEffect, useState } from "react";
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
import { BASE_URL, commonUrl } from "@/utils/commonUrl";
import axios from "axios";
import toast from "react-hot-toast";

const PatientsList = (props) => {
  const { patientsList, patientsColumn, fetchAllPatients } = props;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editedPatient, setEditedPatient] = useState(null);
  const [patientImages, setPatientImages] = useState([]);
  const [newImages, setNewImages] = useState([]); // For newly uploaded images
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFullImageUrl = (path) => {
    // Remove leading slash if it exists in both BASE_URL and path
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    const cleanBackendUrl = BASE_URL.endsWith("/")
      ? BASE_URL.slice(0, -1)
      : BASE_URL;
    return `${cleanBackendUrl}/${cleanPath}`;
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return !value?.toString()?.trim()
          ? "Name is required"
          : value.length < 2
          ? "Name must be at least 2 characters"
          : "";
      case "age":
        return !value
          ? "Age is required"
          : isNaN(value) || value < 0 || value > 150
          ? "Please enter a valid age between 0 and 150"
          : "";
      case "contact":
        return !value?.toString()?.trim()
          ? "Contact is required"
          : !/^\d{10}$/.test(value?.toString()?.trim())
          ? "Contact must be a 10-digit number"
          : "";
      case "occupation":
        return !value?.toString()?.trim()
          ? "Occupation is required"
          : value.length < 2
          ? "Occupation must be at least 2 characters"
          : "";
      case "address":
        return !value?.toString()?.trim()
          ? "Address is required"
          : value.length < 5
          ? "Address must be at least 5 characters"
          : "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(editedPatient || {}).forEach((field) => {
      if (field !== "fileName" && field !== "caseId" && field !== "_id") {
        const error = validateField(field, editedPatient[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setEditedPatient({ ...patient });
    setPatientImages(patient.fileName || []);
    setNewImages([]);
    setErrors({});
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPatient((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Add the newly selected images to the newImages state
    const newImageObjects = files.map((file) => ({
      file,
      fileName: file.name,
      originalName: file.name,
      path: URL.createObjectURL(file),
      mimeType: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      _id: `temp-${Math.random()}`,
      isNew: true,
    }));

    setNewImages((prev) => [...prev, ...newImageObjects]);
  };

  const removeImage = (imageToRemove) => {
    if (imageToRemove.isNew) {
      // Remove from new images
      setNewImages((prev) =>
        prev.filter((img) => img._id !== imageToRemove._id)
      );
    } else {
      // Remove from existing images
      setPatientImages((prev) =>
        prev.filter((img) => img._id !== imageToRemove._id)
      );
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }
    setIsSubmitting(true);

    try {
      // First, update the patient information
      const response = await axios.patch(
        `${BASE_URL}${commonUrl.Patients.updateOne}/${editedPatient.caseId}`,
        editedPatient
      );
      const result = response.data?.responseData;

      if (result?.success) {
        // If patient update is successful, upload new images
        if (newImages.length > 0) {
          const formData = new FormData();
          formData.append("patientId", result?.data?._id);

          newImages.forEach((image) => {
            formData.append("files", image.file);
          });

          const uploadResponse = await axios.post(
            `${BASE_URL}${commonUrl.images.upload}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (!uploadResponse.data?.responseData?.success) {
            throw new Error("Failed to upload images");
          }
        }

        toast.success("Patient updated successfully");
        // Optionally, refresh the patients list here
        fetchAllPatients();
      } else {
        throw new Error(result?.message || "Failed to update patient");
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error(error?.message || "Failed to save changes");
    } finally {
      setIsEditModalOpen(false);
      setIsSubmitting(false);
    }
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
              <TableCell className="font-medium">
                {row?.caseId || "NA"}
              </TableCell>
              <TableCell>{row?.name || "NA"}</TableCell>
              <TableCell>{row?.address || "NA"}</TableCell>
              <TableCell>{row?.contact || "NA"}</TableCell>
              <TableCell>{row?.occupation || "NA"}</TableCell>
              <TableCell>{row?.age || "NA"}</TableCell>
              <TableCell>{row?.gender || "NA"}</TableCell>
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
                <Label htmlFor="name" className="flex gap-1">
                  Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={editedPatient?.name || ""}
                  onChange={handleInputChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="flex gap-1">
                  Age<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={editedPatient?.age || ""}
                  onChange={handleInputChange}
                  className={errors.age ? "border-red-500" : ""}
                />
                {errors.age && (
                  <p className="text-red-500 text-sm">{errors.age}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="flex gap-1">
                  Contact<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  value={editedPatient?.contact || ""}
                  onChange={handleInputChange}
                  className={errors.contact ? "border-red-500" : ""}
                />
                {errors.contact && (
                  <p className="text-red-500 text-sm">{errors.contact}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation" className="flex gap-1">
                  Occupation<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="occupation"
                  name="occupation"
                  value={editedPatient?.occupation || ""}
                  onChange={handleInputChange}
                  className={errors.occupation ? "border-red-500" : ""}
                />
                {errors.occupation && (
                  <p className="text-red-500 text-sm">{errors.occupation}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="flex gap-1">
                  Address<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={editedPatient?.address || ""}
                  onChange={handleInputChange}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Display existing images */}
                {patientImages.map((image) => (
                  <div key={image._id} className="relative group">
                    <img
                      src={getFullImageUrl(image.path)}
                      alt={`Patient ${image.originalName}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      onClick={() => removeImage(image)}
                      className="absolute top-1 right-1 bg-red-500 rounded-full p-1 
                               opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}

                {/* Display newly uploaded images */}
                {newImages.map((image) => (
                  <div key={image._id} className="relative group">
                    <img
                      src={image.path}
                      alt={`Patient ${image.originalName}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      onClick={() => removeImage(image)}
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
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatientsList;
