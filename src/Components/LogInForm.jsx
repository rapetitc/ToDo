import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
// Local Modules
import { evalInput, evalForm } from "../utils/inputEval";
//Context
import UserLogContext from "../Context/UserLogContext";

const LogInForm = () => {
  const { setUserToken, logSession } = useContext(UserLogContext);

  const handlingSubmit = async (e) => {
    e.preventDefault();
    try {
      const credentials = evalForm(e.target);
      const userToken = await logSession(credentials);
      Swal.fire({
        position: "center",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        localStorage.setItem("UserToken", userToken);
        setUserToken(userToken);
      }, 2000);
    } catch (error) {
      if (error == "LogSession/CredentialsNotFound") {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Usuario y/o Contraseña incorrecta",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  return (
    <form onSubmit={handlingSubmit} className='flex flex-wrap justify-center w-11/12 h-min py-6 my-5 mx-auto rounded-lg bg-gradient-to-r from-purple-500 to-pink-500'>
      <h1 className='text-4xl p-1 mb-5'>Iniciar Sesion</h1>
      <div className='flex justify-center flex-wrap w-full m-1'>
        <p className='w-full mx-5 my-2' htmlFor='uname'>
          Nombre de usuario:
        </p>
        <input
          type='text'
          name='uname'
          id='uname'
          onChange={(e) => {
            evalInput(e.target);
          }}
          className='w-full p-1 mx-5 my-2 outline-none border-2 border-gray-400 hover:border-gray-500 rounded-lg'
          required
        />
      </div>
      <div className='flex justify-center flex-wrap w-full m-1'>
        <p className='w-full mx-5 my-2' htmlFor='password'>
          Contraseña:
        </p>
        <input
          type='password'
          name='password'
          id='password'
          onChange={(e) => {
            evalInput(e.target);
          }}
          className='w-full p-1 mx-5 my-2 outline-none border-2 border-gray-400 hover:border-gray-500 rounded-lg'
          required
        />
      </div>
      <div className='flex justify-center flex-wrap w-full m-1'>
        <button type='submit' className='w-full py-2 mx-5 my-2 rounded-lg cursor-pointer bg-gradient-to-r from-sky-500 to-indigo-500'>
          Iniciar Sesion
        </button>
      </div>
      <div className='flex justify-center flex-wrap w-full mx-5 my-1'>
        <p className='text-center'>
          No tienes cuenta?.{" "}
          <Link to='/signin' className='w-full text-fuchsia-900 cursor-pointer hover:underline '>
            Crea una cuenta
          </Link>{" "}
          nueva
        </p>
      </div>
    </form>
  );
};

export default LogInForm;
