export const validateField = (field, fieldName) => {
  if (!field) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateContact = (contact) => {
  if (contact?.toString()?.length !== 10) {
    return "Invalid contact number";
  }
  return null;
};

export const validateDateOfBirth = (dateOfBirth) => {
  const date = new Date(dateOfBirth);
  const today = new Date();
  const hundredYearsAgo = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate()
  );

  if (date > today || date < hundredYearsAgo || isNaN(date.getTime())) {
    return "Invalid date of birth";
  }
  return null;
};
