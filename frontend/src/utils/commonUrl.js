// Dynamically determine the backend URL based on the current browser location
// This way, if user accesses http://192.168.1.5:3000, API calls go to http://192.168.1.5:5000
// If user accesses http://localhost:3000, API calls go to http://localhost:5000
const getBaseUrl = () => {
  const hostname = window.location.hostname;
  return `http://${hostname}:5000`;
};

const BASE_URL = getBaseUrl();

export { BASE_URL };

export const commonUrl = {
  drugList: {
    addOne: "/drugs/add-one",
    getAll: "/drugs/get-all",
    deleteOne: "/drugs/delete-one",
    updateOne: "/drugs/update-one",
  },
  Patients: {
    addOne: "/patients/create-one",
    getOne: "/patients/get-one",
    getAll: "/patients/get-all",
    updateOne: "/patients/update-one",
    generateCaseId: "/patients/generate-case-id",
    deleteOne: "/patients/delete-one",
  },
  images: {
    upload: "/patients/upload",
  },
  Appointments: {
    toggleQueue: "/appointment/toggle",
  },
  Examination: {
    createOrUpdate: "/examination",
    getAll: "/examination/get-all",
    getOne: "/examination/get-one",
  },
  Dashboard: {
    getRecord: "/patients/dashboard-record",
  },
};
