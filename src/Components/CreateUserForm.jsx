import React, { useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { evalForm } from "../utils/inputEval";
import UserMng from "../Controllers/UserManager";
import Input from "./Input";
import ThemeContext from "../Context/ThemeContext";

const CreateUserForm = () => {
  const navigate = useNavigate();
  const { setLoading } = useContext(ThemeContext);

  const handlingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { names, uname, password } = evalForm(e.target);
    const [fname, lname] = names.split(" ");
    const { isOk } = await UserMng.createUser({ fname, lname: lname ?? "", uname, password });
    if (isOk) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Usuario creado exitosamente!",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        e.target.reset();
        navigate("/");
      }, 2000);
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error al intentar crear usuario",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handlingSubmit} className='flex flex-wrap justify-center w-11/12 sm:w-[400px] h-min py-6 my-5 mx-auto rounded-lg bg-gradient-to-r from-purple-500 to-pink-500'>
      <div className='flex justify-center items-center mb-5 w-full'>
        <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-16 p-1 m-1' viewBox='0 0 16 16'>
          <path d='M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z' />
          <path d='M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z' />
        </svg>
        <h1 className='text-4xl p-1 '>Crear cuenta</h1>
      </div>
      <div className='w-full mx-2'>
        <Input type={"text"} name={"names"} title={"Nombre y Apellido:"} required={true} />
        <Input type={"text"} name={"uname"} title={"Nombre de Usuario:"} required={true} />
        <Input type={"password"} name={"password"} title={"Contraseña:"} required={true} />
        <div className='flex justify-center flex-wrap w-full'>
          <button type='submit' className='w-full py-2 m-1 rounded-lg cursor-pointer bg-gradient-to-r from-sky-500 to-indigo-500'>
            Crear Usuario
          </button>
        </div>
      </div>
      <div className='flex justify-center flex-wrap w-full mx-5 my-1'>
        <p className='text-center'>
          Ya tienes una cuenta registrada?.{" "}
          <Link to='/' className='w-full text-fuchsia-900 cursor-pointer hover:underline'>
            Inicia sesion
          </Link>{" "}
          con tu cuenta
        </p>
      </div>
    </form>
  );
};

export default CreateUserForm;
