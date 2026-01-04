import Examination from "@/pages/examination";

// let BASE_URL = "http://localhost:5000";
let BASE_URL = `${window.location.hostname}:5000`;
const ws = new WebSocket(`${window.location.hostname}:8080`);

ws.onmessage = (event) => {
  console.log("WebSocket message received");
  console.log(event.data,"message from server");
  const data = JSON.parse(event.data);
  if (data.localIP) {
    console.log(data.localIP," --local ip from ws");
    BASE_URL = `http://${data.localIP}:5000`;
  }
};

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
