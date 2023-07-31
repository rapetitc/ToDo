import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import ThemeContext from "../Context/ThemeContext";
import UserLogContext from "../Context/UserLogContext";
import { pageConfig } from "../utils/config";

const Header = () => {
  const { setMenuOpen } = useContext(ThemeContext);
  const { userToken } = useContext(UserLogContext);

  const handlerMenuStatus = () => {
    setMenuOpen(true);
  };

  return (
    <header className={`flex ${userToken.length > 0 ? "justify-between" : "justify-center"} align-middle m-1 shadow-xl`}>
      <Link to={"/"}>
        <h1 className='p-2 text-4xl'>{pageConfig.title}</h1>
      </Link>
      {userToken.length > 0 ? (
        <button onClick={handlerMenuStatus} className="p-1 m-1">
          <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-6' viewBox='0 0 16 16'>
            <path d='M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' />
            <path fillRule='evenodd' d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z' />
          </svg>
        </button>
      ) : (
        ""
      )}
    </header>
  );
};

export default Header;
