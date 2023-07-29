import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { evalForm } from "../utils/inputEval";
import UserMng from "../Controllers/UserManager";
import Input from "./Input";

const CreateUserForm = () => {
  const navigate = useNavigate();
  
  async function evalUname(text) {
    const value = text.toLowerCase();
    if (value.length > 4) {
      try {
        const { isOk } = await UserMng.isUnameAvailable(value);
        if (!isOk) throw "UserNameExists";
        return { valid: "valid", data: value };
      } catch (error) {
        return { valid: "invalid", error: "Nombre de usuario ya existe!", data: value };
      }
    }
    return { valid: "invalid", error: "Debe contener 4 caracteres o mas!", data: value };
  }
  const evalPassword = (text) => {
    if (text.length > 8) return { valid: "valid", data: text };
    if (text.length > 0) return { valid: "invalid", error: "Debe contener 8 caracteres o mas!", data: text };
    return { valid: "normal", data: text };
  };
  const evalNames = (text) => {
    if (text.length > 3) return { valid: "valid", data: text };
    if (text.length > 0) return { valid: "invalid", error: "Debe contener 4 caracteres o mas!", data: text };
    return { valid: "normal", data: text };
  };
  const handlingSubmit = async (e) => {
    e.preventDefault();
    const formInfo = evalForm(e.target);
    const { isOk } = await UserMng.createUser(formInfo);
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
  };

  return (
    <form onSubmit={handlingSubmit} className='flex flex-wrap justify-center w-11/12 h-min py-6 my-5 mx-auto rounded-lg bg-gradient-to-r from-purple-500 to-pink-500'>
      <h1 className='text-4xl p-1 mb-5'>Crear cuenta</h1>
      <div className='mx-2'>
        <Input type={"text"} name={"uname"} title={"Nombre de Usuario:"} borderC={"border-gray-700"} evaluator={evalUname} required={true} />
        <Input type={"password"} name={"password"} title={"Contraseña:"} evaluator={evalPassword} required={true} />
        <Input type={"text"} name={"fname"} title={"Nombre:"} evaluator={evalNames} required={true} />
        <Input type={"text"} name={"lname"} title={"Apellido:"} evaluator={evalNames} required={true} />
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
