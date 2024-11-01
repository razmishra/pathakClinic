const checkIfLoggedIn = () => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  return isLoggedIn;
};

export default checkIfLoggedIn;
