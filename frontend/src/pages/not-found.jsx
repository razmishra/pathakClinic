import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <div>The page you are looking for is deleted or does not exists</div>
      <Button onClick={goToHome}>Go Home</Button>
    </div>
  );
};

export default NotFound;
