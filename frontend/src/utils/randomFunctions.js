export const decideDrugRowBgColor = (quantity) => {
  if (quantity <= 0) {
    return "bg-red-100";
  } else if (quantity < 5) {
    return "bg-yellow-100";
  } else {
    return "bg-green-100";
  }
};
