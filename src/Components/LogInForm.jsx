import React, { useContext } from "react";
import { Link } from "react-router-dom";
//Context
import UserLogContext from "../Context/UserLogContext";

const LogInForm = () => {
  const { logSession } = useContext(UserLogContext);

  const handlingSubmit = (e) => {
    e.preventDefault();
    //TODO Eval creadential before perform the log in
    const credentials = {
      uname: e.target[0].value,
      password: e.target[1].value,
    };
    logSession(credentials);
  };
  return (
    <form onSubmit={handlingSubmit} className='flex flex-wrap justify-center w-11/12 py-6 mt-10 mx-auto rounded-lg bg-gradient-to-r from-purple-500 to-pink-500'>
      <h1 className='text-4xl p-1 mb-5'>Iniciar Sesion</h1>
      <div className='flex justify-center flex-wrap w-full my-1 mx-5'>
        <p className='w-full mx-5 my-2' htmlFor='uname'>
          Nombre de usuario:
        </p>
        <input type='text' name='uname' id='uname' className='w-full p-1 mx-5 my-2 outline-none border-2 border-gray-400 hover:border-gray-500 rounded-lg' />
      </div>
      <div className='flex justify-center flex-wrap w-full my-1 mx-5'>
        <p className='w-full mx-5 my-2' htmlFor='password'>
          Contraseña:
        </p>
        <input type='password' name='password' id='password' className='w-full p-1 mx-5 my-2 outline-none border-2 border-gray-400 hover:border-gray-500 rounded-lg' />
      </div>
      <div className='flex justify-center flex-wrap w-full my-1 mx-5'>
        <button type='submit' className='w-full py-2 mx-5 my-2 rounded-lg cursor-pointer bg-gradient-to-r from-sky-500 to-indigo-500'>
          Iniciar Sesion
        </button>
      </div>
      <div className='flex justify-center flex-wrap w-full my-1 mx-5'>
        <p>
          No tienes cuenta?.
          <Link to='/signin' className='w-full py-2 mx-5 my-2 hover:underline cursor-pointer'>
            Crear una cuenta
          </Link>
          nueva
        </p>
      </div>
    </form>
  );
};

export default LogInForm;
