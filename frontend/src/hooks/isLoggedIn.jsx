import { useState, useEffect } from "react";

const useIsLoggedIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(checkIfLoggedIn());

  useEffect(() => {
    // Check the value in localStorage
    const loggedInStatus = checkIfLoggedIn();
    setIsLoggedIn(loggedInStatus === true);
  }, []);

  function checkIfLoggedIn() {
    const loggedInStatus = localStorage.getItem("loggedIn");
    return loggedInStatus;
  }

  return isLoggedIn;
};

export default useIsLoggedIn;
