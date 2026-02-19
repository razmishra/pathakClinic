import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, PlusCircle, Trash2 } from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL, commonUrl } from "@/utils/commonUrl";

const Examination = () => {
  const today = moment().format("DD-MM-YYYY");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    date: today,
    caseId: "",
    contact: "",
    occupation: "",
    chiefComplaints: "",
    kco: "",
    diagnosis: "",
    prescriptions: [
      {
        date: today,
        symptoms: "",
        prescription: "",
      },
    ],
  });

  const resetForm = () => {
    setFormData({
      patientName: "",
      date: today,
      caseId: "",
      contact: "",
      occupation: "",
      chiefComplaints: "",
      kco: "",
      diagnosis: "",
      prescriptions: [
        {
          date: today,
          symptoms: "",
          prescription: "",
        },
      ],
    });
  };

  const fetchExaminationDetails = async (caseId) => {
    if (!caseId?.toString()?.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}${commonUrl.Examination.getOne}/${caseId}`
      );
      const result = response?.data?.responseData?.data;
      const data = { ...result?.patientDetails, ...result?.examinationDetails };
      if (data) {
        // Prefill the form with retrieved data
        setFormData({
          patientName: data.name || "",
          date: today,
          caseId: data.caseId || "",
          contact: data.contact || "",
          occupation: data.occupation || "",
          chiefComplaints: data.chiefComplaints || "",
          kco: data.kco || "",
          diagnosis: data.diagnosis || "",
          prescriptions: data.prescriptions?.length
            ? data.prescriptions.map((p) => ({
                date: p.date || today,
                symptoms: p.symptoms || "",
                prescription: p.prescription || "",
              }))
            : [{ date: today, symptoms: "", prescription: "" }],
        });
      }
    } catch (error) {
      console.error("Failed to fetch examination details:", error);
      toast.error("Failed to fetch examination details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaseIdBlur = () => {
    if (formData.caseId) {
      fetchExaminationDetails(formData.caseId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${BASE_URL}${commonUrl.Examination.createOrUpdate}`,
        formData
      );
      const result = response?.data?.responseData;
      if (!result?.success) {
        toast.error(
          "Failed to create or update examination details. Please try again."
        );
        return;
      }

      toast.success("Examination data saved successfully");

      if (result.data) {
        setFormData((prev) => ({
          ...prev,
          caseId: result.data.caseId || prev.caseId,
        }));
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save examination:", error);
      toast.error("Failed to save examination data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNewPrescription = () => {
    const lastPrescription =
      formData.prescriptions[formData.prescriptions.length - 1];

    setFormData({
      ...formData,
      prescriptions: [
        ...formData.prescriptions,
        {
          date: today,
          symptoms: "",
          prescription: "",
        },
      ],
    });
  };

  const updatePrescription = (index, field, value) => {
    const updatedPrescriptions = [...formData.prescriptions];
    updatedPrescriptions[index][field] = value;

    setFormData({
      ...formData,
      prescriptions: updatedPrescriptions,
    });
  };

  const removePrescription = (index) => {
    if (formData.prescriptions.length === 1) {
      // Don't remove if it's the last prescription
      return;
    }

    const updatedPrescriptions = formData.prescriptions.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      prescriptions: updatedPrescriptions,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-5 pb-0">
        <h2 className="text-xl font-semibold">New Examination</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Patient Info Section */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Patient Name
            </Label>
            <Input
              type="text"
              value={formData.patientName}
              onChange={(e) =>
                setFormData({ ...formData, patientName: e.target.value })
              }
              className="mt-1 w-full rounded-lg border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter patient name"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Date</Label>
              <div className="relative mt-1">
                <Input
                  type="text"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="pl-9 rounded-lg border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={isLoading}
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Case ID
              </Label>
              <Input
                type="text"
                value={formData.caseId}
                onChange={(e) =>
                  setFormData({ ...formData, caseId: e.target.value })
                }
                onBlur={handleCaseIdBlur}
                className="mt-1 rounded-lg border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter case ID"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Contact
              </Label>
              <Input
                type="text"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                className="mt-1 rounded-lg border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Phone number"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Occupation
              </Label>
              <Input
                type="text"
                value={formData.occupation}
                onChange={(e) =>
                  setFormData({ ...formData, occupation: e.target.value })
                }
                className="mt-1 rounded-lg border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Patient occupation"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Chief Complaints */}
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Chief complaints
          </Label>
          <Textarea
            value={formData.chiefComplaints}
            onChange={(e) =>
              setFormData({ ...formData, chiefComplaints: e.target.value })
            }
            className="mt-1 h-24 rounded-lg border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Describe patient's primary complaints..."
            disabled={isLoading}
          />
        </div>

        {/* Extra Field */}
        <div>
          <Label className="text-sm font-medium text-gray-700">K/C/O</Label>
          <Textarea
            value={formData.kco}
            onChange={(e) => setFormData({ ...formData, kco: e.target.value })}
            className="mt-1 rounded-lg border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="K/C/O..."
            disabled={isLoading}
          />
        </div>

        {/* Diagnosis Section */}
        <Card className="overflow-hidden border-0 shadow-md rounded-xl">
          <div className="bg-indigo-50 px-4 py-2">
            <h3 className="text-sm font-medium text-indigo-700">Diagnosis</h3>
          </div>
          <CardContent className="p-4">
            <Textarea
              value={formData.diagnosis}
              onChange={(e) =>
                setFormData({ ...formData, diagnosis: e.target.value })
              }
              placeholder="Enter diagnosis details..."
              className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 h-16 outline-none focus:outline-none"
              disabled={isLoading}
            />
          </CardContent>
        </Card>

        {/* Prescription */}
        <Card className="overflow-hidden border-0 shadow-md rounded-xl">
          <div className="bg-indigo-50 px-4 py-2 flex justify-between items-center">
            <h3 className="text-sm font-medium text-indigo-700">
              Prescription
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100"
              onClick={addNewPrescription}
              disabled={isLoading}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">Add New</span>
            </Button>
          </div>
          <CardContent className="p-4 space-y-6">
            {formData.prescriptions.map((prescription, index) => (
              <div
                key={index}
                className="relative grid grid-cols-3 gap-3 pt-2 pb-1 border-b border-gray-100"
              >
                <div>
                  <Label className="text-xs text-gray-600">Date</Label>
                  <Input
                    value={prescription.date}
                    onChange={(e) =>
                      updatePrescription(index, "date", e.target.value)
                    }
                    className="mt-1 text-sm rounded-lg border-gray-200"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Symptoms</Label>
                  <Textarea
                    value={prescription.symptoms}
                    onChange={(e) =>
                      updatePrescription(index, "symptoms", e.target.value)
                    }
                    placeholder="Describe symptoms..."
                    className="mt-1 text-sm h-20 rounded-lg"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Prescription</Label>
                  <Textarea
                    value={prescription.prescription}
                    onChange={(e) =>
                      updatePrescription(index, "prescription", e.target.value)
                    }
                    placeholder="Medication details..."
                    className="mt-1 text-sm h-20 rounded-lg"
                    disabled={isLoading}
                  />
                </div>

                {/* Delete button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePrescription(index)}
                  className={`absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-50 hover:bg-red-100 ${
                    formData.prescriptions.length === 1 ? "hidden" : ""
                  }`}
                  disabled={isLoading}
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isLoading || isSubmitting}
          >
            Reset
          </Button>
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700"
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Examination;
