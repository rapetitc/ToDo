import React from "react";
import { Link } from "react-router-dom";
import * as moment from "moment";
import { db } from "../firebase";
import { addDoc, getDocs, collection, query, where } from "firebase/firestore";

const CreateUserForm = () => {
  const evalInput = (target) => {
    const styles = "w-full p-1 mx-5 my-2 outline-none border-2 rounded-lg";
    if (target.value.length >= 4) {
      target.className = `${styles} border-green-500 hover:border-green-400`;
      return true;
    }
    if (target.value.length == 0) {
      target.className = `${styles} border-gray-500 hover:border-gray-400`;
    } else {
      target.className = `${styles} border-red-500 hover:border-red-400`;
    }
    return false;
  };
  const evalForm = (form) => {
    const { elements } = form;
    let evalResult = [];
    for (let i = 0; i < elements.length - 1; i++) {
      if (evalInput(elements[i])) evalResult.push(true);
    }
    if (evalResult.length != 4) throw "Campos incompletos";
    return {
      uname: elements["uname"].value,
      password: elements["password"].value,
      fname: elements["fname"].value,
      lname: elements["lname"].value,
    };
  };

  const handlingSubmit = (e) => {
    e.preventDefault();
    try {
      const formInfo = evalForm(e.target);
      getDocs(query(collection(db, "users"), where("uname", "==", formInfo.uname)))
        .then((doc) => {
          if (doc.docs[0]) throw "Usuario existe";
          addDoc(collection(db, "users"), { ...formInfo, type: "user", creationdate: moment().format("DD-MM-YYYY, HH:mm:ss"), status: true })
            .then((data) => {
              e.target.reset();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handlingSubmit} className='flex flex-wrap justify-center w-11/12 py-6 mt-10 mx-auto rounded-lg bg-gradient-to-r from-purple-500 to-pink-500'>
      <h1 className='text-4xl p-1 mb-5'>Crear cuenta</h1>
      <div className='flex justify-center flex-wrap w-full my-1 mx-5'>
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
      <div className='flex justify-center flex-wrap w-full my-1 mx-5'>
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
      <div className='flex justify-center flex-wrap w-full my-1 mx-5'>
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
      <div className='flex justify-center flex-wrap w-full my-1 mx-5'>
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
      <div className='flex justify-center flex-wrap w-full my-1 mx-5'>
        <button type='submit' className='w-full py-2 mx-5 my-2 rounded-lg cursor-pointer bg-gradient-to-r from-sky-500 to-indigo-500'>
          Crear Usuario
        </button>
      </div>
      <div className='flex justify-center flex-wrap w-full my-1 mx-5'>
        <p>
          Ya tienes una cuenta registrada?.
          <Link to='/' className='w-full py-2 mx-5 my-2 hover:underline cursor-pointer'>
            Inicia sesion
          </Link>
        </p>
      </div>
    </form>
  );
};

export default CreateUserForm;
