import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, commonUrl } from "@/utils/commonUrl";
import toast from "react-hot-toast";

const QueueButton = ({ appointmentId, showOnDashboard }) => {
  const [inQueue, setInQueue] = useState(showOnDashboard);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isFirstRender, setIsFirstRender] = useState(true); // Track first render

  const handleClick = () => {
    setInQueue((prev) => !prev);
  };

  useEffect(() => {
    if (isFirstRender) {
      // Skip API call on the first render
      setIsFirstRender(false);
      return;
    }

    // Clear the previous debounce timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new debounce timeout to delay the API call
    const newTimeout = setTimeout(() => {
      updateQueueStatus();
    }, 500);

    setDebounceTimeout(newTimeout);

    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [inQueue]);

  const updateQueueStatus = async () => {
    try {
      const response = await axios.patch(
        `${BASE_URL}${commonUrl.Appointments.toggleQueue}/${appointmentId}`,
        { inQueue }
      );
      const result = response?.data?.responseData;
      if (result?.success) {
        console.log("Queue status updated successfully");
        toast.dismiss();
        toast.success("Queue status updated successfully");
      }
    } catch (error) {
      console.error("Error updating queue status:", error);
      toast.dismiss();
      toast.error("Error updating queue status");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-md text-white font-semibold transition-all duration-300 ${
        inQueue
          ? "bg-red-500 hover:bg-red-600"
          : "bg-green-500 hover:bg-green-600"
      }`}
    >
      {inQueue ? "Take out of Queue" : "Push into Queue"}
    </button>
  );
};

export default QueueButton;
