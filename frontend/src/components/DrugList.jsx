import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CircleMinus, CirclePlus, Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { BASE_URL, commonUrl } from "@/utils/commonUrl";

const FormFields = ({ formData, setFormData, errors }) => (
  <div className="grid gap-4 py-4">
    <div className="grid gap-2">
      <Label htmlFor="drugName">Drug Name*</Label>
      <Input
        id="drugName"
        value={formData.drugName}
        onChange={(e) => setFormData({ ...formData, drugName: e.target.value })}
        className={errors.drugName ? "border-red-500" : ""}
      />
      {errors.drugName && (
        <span className="text-red-500 text-sm">{errors.drugName}</span>
      )}
    </div>

    <div className="grid gap-2">
      <Label htmlFor="potency">Potency*</Label>
      <Input
        id="potency"
        value={formData.potency}
        onChange={(e) => setFormData({ ...formData, potency: e.target.value })}
        className={errors.potency ? "border-red-500" : ""}
      />
      {errors.potency && (
        <span className="text-red-500 text-sm">{errors.potency}</span>
      )}
    </div>

    <div className="grid gap-2">
      <Label htmlFor="brandName">Brand Name*</Label>
      <Input
        id="brandName"
        value={formData.brandName}
        onChange={(e) =>
          setFormData({ ...formData, brandName: e.target.value })
        }
        className={errors.brandName ? "border-red-500" : ""}
      />
      {errors.brandName && (
        <span className="text-red-500 text-sm">{errors.brandName}</span>
      )}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantity*</Label>
        <Input
          id="quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: parseInt(e.target.value) })
          }
          className={errors.quantity ? "border-red-500" : ""}
        />
        {errors.quantity && (
          <span className="text-red-500 text-sm">{errors.quantity}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ml">ML*</Label>
        <Input
          id="ml"
          type="number"
          value={formData.ml}
          onChange={(e) =>
            setFormData({ ...formData, ml: parseInt(e.target.value) })
          }
          className={errors.ml ? "border-red-500" : ""}
        />
        {errors.ml && <span className="text-red-500 text-sm">{errors.ml}</span>}
      </div>
    </div>

    <div className="grid gap-2">
      <Label htmlFor="drawerNumber">Drawer Number</Label>
      <Input
        id="drawerNumber"
        value={formData.drawerNumber}
        onChange={(e) =>
          setFormData({ ...formData, drawerNumber: e.target.value })
        }
      />
    </div>

    <div className="grid gap-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
    </div>
  </div>
);

const DrugList = () => {
  const { toast } = useToast();
  const [drugs, setDrugs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentDrug, setCurrentDrug] = useState(null);
  const [formData, setFormData] = useState({
    drugName: "",
    potency: "",
    brandName: "",
    quantity: 0,
    ml: 0,
    drawerNumber: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.drugName) newErrors.drugName = "Drug name is required";
    if (!formData.potency) newErrors.potency = "Potency is required";
    if (!formData.brandName) newErrors.brandName = "Brand name is required";
    if (!formData.quantity || formData.quantity < 0)
      newErrors.quantity = "Valid quantity is required";
    if (!formData.ml || formData.ml < 0) newErrors.ml = "Valid ml is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch drugs from API
  const fetchDrugs = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}${commonUrl.drugList.getAll}`
      );
      setDrugs(response?.data ?? []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch drugs",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  // Add new drug
  const handleAddDrug = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${BASE_URL}${commonUrl.drugList.addOne}`,
        formData
      );

      if (response.data.success) {
        fetchDrugs();
        setIsAddDialogOpen(false);
        setFormData({
          drugName: "",
          potency: "",
          brandName: "",
          quantity: 0,
          ml: 0,
          drawerNumber: "",
          description: "",
        });
        toast({
          title: "Success",
          description: "Drug added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add drug",
        variant: "destructive",
      });
    }
  };

  // Update the edit handler
  const handleEditClick = (row) => {
    setCurrentDrug(row);
    setFormData({ ...row });
    setIsEditDialogOpen(true);
  };

  // Edit drug
  const handleEditDrug = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.patch(
        `${BASE_URL}${commonUrl.drugList.updateOne}/${currentDrug?._id}`,
        formData
      );

      if (response.data.success) {
        fetchDrugs();
        setIsEditDialogOpen(false);
        setCurrentDrug(null);
        setFormData({
          drugName: "",
          potency: "",
          brandName: "",
          quantity: 0,
          ml: 0,
          drawerNumber: "",
          description: "",
        });
        toast({
          title: "Success",
          description: "Drug updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update drug",
        variant: "destructive",
      });
    }
  };

  // Soft delete drug
  const handleDeleteDrug = async (id) => {
    if (window.confirm("Are you sure you want to delete this drug?")) {
      try {
        const response = await axios.delete(
          `${BASE_URL}${commonUrl.drugList.deleteOne}/${id}`
        );

        if (response.data.success) {
          fetchDrugs();
          toast({
            title: "Success",
            description: "Drug deleted successfully",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete drug",
          variant: "destructive",
        });
      }
    }
  };

  // Update quantity
  const handleUpdateQuantity = async (id, increment) => {
    const drug = drugs.find((d) => d._id === id);
    const newQuantity = drug.quantity + (increment ? 1 : -1);

    if (newQuantity >= 0) {
      try {
        const response = await axios.patch(
          `${BASE_URL}${commonUrl.drugList.updateOne}/${id}`,
          { ...drug, quantity: newQuantity }
        );

        if (response.data.success) {
          fetchDrugs();
          toast({
            title: "Success",
            description: `Quantity ${
              increment ? "increased" : "decreased"
            } successfully`,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update quantity",
          variant: "destructive",
        });
      }
    }
  };

  // Filter drugs based on search query
  const filteredDrugs = drugs.filter(
    (drug) =>
      drug.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    console.log("Current Drug:", currentDrug);
    console.log("Form Data:", formData);
    console.log("Errors:", errors);
  }, [formData, errors, currentDrug]);
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search by drug name or brand..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Drug
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Drug</DialogTitle>
            </DialogHeader>
            <FormFields
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
            <Button onClick={handleAddDrug}>Add Drug</Button>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Drug Name</TableHead>
            <TableHead>Brand Name</TableHead>
            <TableHead>Potency</TableHead>
            <TableHead>ML</TableHead>
            <TableHead>Drawer</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Add</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Remove</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDrugs.map((row, index) => (
            <TableRow key={row._id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{row.drugName}</TableCell>
              <TableCell>{row.brandName}</TableCell>
              <TableCell>{row.potency}</TableCell>
              <TableCell>{row.ml}</TableCell>
              <TableCell>{row.drawerNumber}</TableCell>
              <TableCell
                className="cursor-pointer hover:bg-muted/100"
                onClick={() => handleEditClick(row)}
              >
                <Edit className="h-4 w-4" />
              </TableCell>
              <TableCell
                className="cursor-pointer hover:bg-muted/100"
                onClick={() => handleUpdateQuantity(row._id, true)}
              >
                <CirclePlus className="h-4 w-4" />
              </TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell
                className="cursor-pointer hover:bg-muted/100"
                onClick={() => handleUpdateQuantity(row._id, false)}
              >
                <CircleMinus className="h-4 w-4" />
              </TableCell>
              <TableCell
                className="cursor-pointer hover:bg-muted/100"
                onClick={() => handleDeleteDrug(row._id)}
              >
                <Trash2 className="h-4 w-4" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Drug</DialogTitle>
          </DialogHeader>
          <FormFields />
          <Button onClick={handleEditDrug}>Save Changes</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DrugList;
