import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as moment from "moment";
import { addDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { evalForm, evalInput } from "../utils/inputEval";

const CreateUserForm = () => {
  const navigate = useNavigate();

  const handlingSubmit = async (e) => {
    e.preventDefault();
    try {
      const formInfo = evalForm(e.target);
      const res = await getDocs(query(collection(db, "users"), where("uname", "==", formInfo.uname)));
      if (res.docs[0]) throw "Nombre de usuario existente!";
      await addDoc(collection(db, "users"), { ...formInfo, type: "user", creationdate: moment().format("DD-MM-YYYY, HH:mm:ss"), status: true });
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
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: error,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <form onSubmit={handlingSubmit} className='flex flex-wrap justify-center w-11/12 h-min py-6 my-3 mx-auto rounded-lg bg-gradient-to-r from-purple-500 to-pink-500'>
      <h1 className='text-4xl p-1 mb-5'>Crear cuenta</h1>
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
        <p className='w-full mx-5 my-2' htmlFor='fname'>
          Nombre:
        </p>
        <input
          type='text'
          name='fname'
          id='fname'
          onChange={(e) => {
            evalInput(e.target);
          }}
          className='w-full p-1 mx-5 my-2 outline-none border-2 border-gray-400 hover:border-gray-500 rounded-lg'
          required
        />
      </div>
      <div className='flex justify-center flex-wrap w-full m-1'>
        <p className='w-full mx-5 my-2' htmlFor='lname'>
          Apellido:
        </p>
        <input
          type='text'
          name='lname'
          id='lname'
          onChange={(e) => {
            evalInput(e.target);
          }}
          className='w-full p-1 mx-5 my-2 outline-none border-2 border-gray-400 hover:border-gray-500 rounded-lg'
          required
        />
      </div>
      <div className='flex justify-center flex-wrap w-full m-1'>
        <button type='submit' className='w-full py-2 mx-5 my-2 rounded-lg cursor-pointer bg-gradient-to-r from-sky-500 to-indigo-500'>
          Crear Usuario
        </button>
      </div>
      <div className='flex justify-center flex-wrap w-full m-1'>
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
