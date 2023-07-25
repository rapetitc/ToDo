import React, { useContext } from "react";
import { Link } from "react-router-dom";
// Local Modules
import { pageConfig } from "../utils/config";
// Context
import UserLogContext from "../Context/UserLogContext";

const Header = () => {
  const { userToken, expSession } = useContext(UserLogContext);

  const handlerLogOut = () => {
    expSession();
  };

  return (
    <header className={`flex ${userToken.length > 0 ? "justify-between" : "justify-center"} align-middle m-1`}>
      <Link to={"/"}>
        <h1 className='p-2 text-4xl'>{pageConfig.title}</h1>
      </Link>
      {userToken.length > 0 ? (
        <>
          <button className='p-2 mx-3' onClick={handlerLogOut}>
            <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-6' viewBox='0 0 16 16'>
              <path fillRule='evenodd' d='M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z' />
              <path fillRule='evenodd' d='M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z' />
            </svg>
          </button>
        </>
      ) : (
        ""
      )}
    </header>
  );
};

export default Header;
