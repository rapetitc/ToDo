import React, { useContext, useState } from "react";
import SessionMng from "../Controllers/SessionManager";
import ThemeContext from "../Context/ThemeContext";
import UserLogContext from "../Context/UserLogContext";
import Swal from "sweetalert2";

const Menu = () => {
  const { userToken, setUserToken } = useContext(UserLogContext);
  const { setLoading, isMenuOpen, setMenuOpen } = useContext(ThemeContext);
  const user = JSON.parse(localStorage.getItem("user"));

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const closeSession = async () => {
    setLoading(true);
    const { isOk } = await SessionMng.closeSession(userToken);
    if (isOk) {
      setUserToken("");
      setMenuOpen(false);
    }
    setLoading(false);
  };

  const testing = () => {
    Swal.fire({
      position: "center",
      title: "Esta opcion esta siendo desarrollada!",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className={`z-20 ${isMenuOpen ? "block" : "hidden"} absolute top-0 left-0 h-screen w-screen bg-white `}>
      <div className='flex items-center p-2 shadow-lg'>
        <button onClick={closeMenu} className='p-1 m-1'>
          <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-6' viewBox='0 0 16 16'>
            <path d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z' />
          </svg>
        </button>
        <h3 className='text-lg w-full ms-[-16px] text-center'>¡Bienvenido {user?.fullname.fname}!</h3>
      </div>
      <div className='flex flex-wrap justify-center my-10 mx-3'>
        <button className='flex items-center w-full p-2 mx-3 my-1 rounded bg-gray-400' onClick={testing}>
          <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-6' viewBox='0 0 16 16'>
            <path d='M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' />
            <path fillRule='evenodd' d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z' />
          </svg>
          <p className='mx-2 text-base'>Perfil</p>
        </button>
        <button className='flex items-center w-full p-2 mx-3 my-1 rounded bg-gray-400' onClick={testing}>
          <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-5' viewBox='0 0 16 16'>
            <path fillRule='evenodd' d='M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z' />
          </svg>
          <p className='mx-2 text-base'>Configuracion</p>
        </button>
        <button className='flex items-center p-2 mx-3 my-1' onClick={closeSession}>
          <p className='mx-2 text-base'>Cerrar Session</p>
          <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-5' viewBox='0 0 16 16'>
            <path fillRule='evenodd' d='M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z' />
            <path fillRule='evenodd' d='M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z' />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Menu;
