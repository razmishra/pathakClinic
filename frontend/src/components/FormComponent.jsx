import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import axios from "axios";
import { BASE_URL, commonUrl } from "@/utils/commonUrl";

// Modified schema to handle multiple images
const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.number().min(0, {
    message: "Age must be a positive number.",
  }),
  gender: z.enum(["male", "female", "other"], {
    message: "Gender must be one of Male, Female, or Other.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  occupation: z.string().min(1, { message: "Occupation is required." }),
  contact: z.preprocess(
    (val) => String(val),
    z
      .string()
      .length(10, { message: "Contact number must be exactly 10 digits." })
      .transform((val) => Number(val))
  ),
  images: z
    .array(
      z.instanceof(File).refine(
        (file) => file.size <= 35 * 1024 * 1024,
        (file) => ({
          message: `${file.name} must be less than 35MB`,
        })
      )
    )
    .max(5, "Maximum 5 images allowed"),
});

const FormComponent = () => {
  const [imagePreview, setImagePreview] = useState([]);
  const [caseId, setCaseId] = useState(null);
  const mounted = useRef(false);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      "case-id": caseId,
      images: [],
    },
  });

  useEffect(() => {
    if (caseId) {
      form.reset({ "case-id": caseId, images: [] });
    }
  }, [caseId, form]);

  const fetchNewCaseId = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}${commonUrl.Patients.generateCaseId}`
      );
      const result = response?.data?.responseData;
      if (!result?.success) {
        toast.error(result?.message || "error creating case id");
        return;
      }
      setCaseId(result?.data?.caseId);
    } catch (error) {
      toast.error(error?.message || "error creating case id");
    }
  };

  useEffect(() => {
    if (!mounted.current) {
      fetchNewCaseId();
      mounted.current = true;
    }
  }, []);

  const handleImageChange = (e, onChange) => {
    const files = Array.from(e.target.files);
    const currentImages = form.getValues("images") || [];

    if (currentImages.length + files.length > 5) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Maximum 5 images allowed",
      });
      return;
    }

    // Validate file size and type
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      return true;
    });

    // Update form and preview
    const newImages = [...currentImages, ...validFiles];
    onChange(newImages);

    // Generate previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((prev) => [
          ...prev,
          {
            url: reader.result,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const currentImages = form.getValues("images");
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue("images", newImages);
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(data) {
    try {
      // First, create the patient record
      const patientData = { ...data, caseId };

      delete patientData.images;

      const patientResponse = await axios.post(
        `${BASE_URL}${commonUrl.Patients.addOne}`,
        patientData
      );

      if (patientResponse.data?.responseData?.success) {
        // If patient creation successful, check if there are images to upload
        if (data.images && data.images.length > 0) {
          const formData = new FormData();
          formData.append(
            "patientId",
            patientResponse?.data?.responseData?.data?._id
          );

          data.images.forEach((file) => {
            formData.append("files", file);
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
            toast.error(
              uploadResponse.data?.responseData?.message || "Image upload failed"
            );
          }
        }

        toast.success("Patient added successfully");
        form.reset({
          name: "",
          age: "",
          gender: undefined,
          address: "",
          occupation: "",
          contact: "",
          images: [],
        });
        setImagePreview([]);
        fetchNewCaseId();
      } else {
        toast.error(
          patientResponse.data?.responseData?.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Could not add patient");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full mx-3 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="pathak" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="case-id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case Id</FormLabel>
                <FormControl>
                  <Input
                    placeholder="caseId"
                    {...field}
                    value={field.value}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age Field */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    placeholder="35"
                    {...field}
                    type="number"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="no-spinner"
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "-" ||
                        e.key === "e" ||
                        e.key === "E"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onWheel={(e) => e.preventDefault()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender Field */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      {field.value ? (
                        <SelectValue placeholder="Select Gender" />
                      ) : (
                        "Select Gender"
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="1234567890"
                  {...field}
                  maxLength={10}
                  type="tel"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (
                      e.key === "ArrowUp" ||
                      e.key === "ArrowDown" ||
                      e.key === "-" ||
                      e.key === "e" ||
                      e.key === "E"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.preventDefault()}
                />
              </FormControl>
              <FormDescription>Do not mention country code.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input placeholder="Occupation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {imagePreview.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={`Preview ${index}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 rounded-full p-1 
                                   opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                    {imagePreview.length < 5 && (
                      <label
                        className="flex items-center justify-center w-full h-32 
                                      border-2 border-dashed rounded-lg cursor-pointer
                                      hover:border-gray-400 transition-colors"
                      >
                        <div className="flex flex-col items-center">
                          <Plus className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            Add Image
                          </span>
                        </div>
                        <Input
                          type="file"
                          multiple
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, field.onChange)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Upload up to 5 images (max 5MB each)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default FormComponent;
