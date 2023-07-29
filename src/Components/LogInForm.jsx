import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import UserLogContext from "../Context/UserLogContext";
import SessionMng from "../Controllers/SessionManager";
import Input from "./Input";
import { evalInput, evalForm } from "../utils/inputEval";

const LogInForm = () => {
  const { setUserToken } = useContext(UserLogContext);

  const evalUname = (uname) => {
    let value = uname.toLowerCase();
    if (value.length > 4) return { valid: "valid", data: value };
    if (value.length > 0) return { valid: "invalid", error: "Debe contener 4 caracteres o mas!", data: value };
    return { valid: "normal", data: value };
  };
  const evalPassword = (value) => {
    if (value.length > 8) return { valid: "valid", data: value };
    if (value.length > 0) return { valid: "invalid", error: "Debe contener 8 caracteres o mas!", data: value };
    return { valid: "normal", data: value };
  };

  const handlingSubmit = async (e) => {
    e.preventDefault();
    const credentials = evalForm(e.target);
    const { isOk, data } = await SessionMng.logSession(credentials);
    if (isOk) {
      Swal.fire({
        position: "center",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        localStorage.setItem("UserToken", data);
        setUserToken(data);
      }, 2000);
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Usuario y/o Contraseña incorrecta",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <form onSubmit={handlingSubmit} className='flex flex-wrap justify-center w-11/12 h-min py-6 my-5 mx-auto rounded-lg bg-gradient-to-r from-purple-500 to-pink-500'>
      <h1 className='text-4xl p-1 mb-5'>Iniciar Sesion</h1>
      <Input type={"text"} name={"uname"} title={"Nombre de Usuario"} evaluator={evalUname} required={true} />
      <Input type={"password"} name={"password"} title={"Contraseña"} evaluator={evalPassword} required={true} />
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
