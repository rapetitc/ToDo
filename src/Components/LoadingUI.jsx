import React, { useContext } from "react";
import ThemeContext from "../Context/ThemeContext";

const LoadingUI = () => {
  const { isLoading } = useContext(ThemeContext);

  return (
    <div className={`z-50 ${isLoading ? "flex" : "hidden"} flex-wrap justify-center items-center fixed top-0 left-0 h-screen w-screen bg-[rgba(255,255,255,0.5)]`}>
      <span>Loading . . . </span>
    </div>
  );
};

export default LoadingUI;
