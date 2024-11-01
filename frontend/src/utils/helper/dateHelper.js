import moment from "moment";

export const formateDateToYYYY_MM_DD = (date) => {
  return moment(date).format("YYYY-MM-DD");
};

export const formateIntoDateAndTime = (date) => {
  return moment(date).format("YYYY-MM-DD HH:mm");
};
