import React, { useState, useContext } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";
//Context
import UserLogContext from "../Context/UserLogContext";

const AddTaskModal = ({ isAddTaskModalOpen, setAddTaskModalStatus, getNewData }) => {
  const { actSession } = useContext(UserLogContext);
  const empty = { title: "", tasks: [{ task: "", status: false }] };
  const [newTaskInfo, setNewTaskInfo] = useState(empty);

  const handlerUpdateTitle = (value) => {
    setNewTaskInfo({ ...newTaskInfo, title: value });
  };

  const addTask = () => {
    let copyTask = { ...newTaskInfo };
    copyTask.tasks.push({ task: "", status: false });
    setNewTaskInfo({ ...copyTask });
  };
  const updateTask = (id, value) => {
    const copyTask = { ...newTaskInfo };
    copyTask.tasks[id].task = value;
    setNewTaskInfo({ ...copyTask });
  };
  const removeTask = (id) => {
    const copyTask = { ...newTaskInfo };
    copyTask.tasks = copyTask.tasks.filter((item) => {
      return item != copyTask.tasks[id];
    });
    if (copyTask.tasks.length == 0) copyTask.tasks.push({ task: "", status: false })
    setNewTaskInfo({ ...copyTask });
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    if (newTaskInfo.title.length == 0 && newTaskInfo.tasks.length == 0) return console.log("No se puede enviar");
    await actSession(async (userId) => {
      const res = await addDoc(collection(db, "tasks"), { ...newTaskInfo, owner: userId });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Tarea creada exitosamente",
        showConfirmButton: false,
        timer: 1500,
      });
      getNewData();
      setAddTaskModalStatus(false);
      setNewTaskInfo(empty);
    });
  };

  return (
    <div className={isAddTaskModalOpen ? "absolute top-0 h-full w-full bg-slate-500/50" : "hidden"}>
      <form onSubmit={handlerSubmit} className='flex flex-wrap w-11/12 mx-auto mt-16 rounded-lg bg-white'>
        <div className='flex justify-between align-middle w-full p-1 mb-2 border-b-2 '>
          <input
            type='text'
            name='tasktitle'
            className='w-full p-1 mx-2 text-2xl outline-none'
            placeholder='Titulo de la tarea'
            value={newTaskInfo.title}
            onChange={(e) => {
              handlerUpdateTitle(e.target.value);
            }}
          />
        </div>
        <div className='flex flex-wrap justify-center w-full my-2'>
          {newTaskInfo.tasks.length > 0 ? (
            <>
              {newTaskInfo.tasks.map((data, i) => {
                return (
                  <div className='flex justify-center w-full mx-5 my-2' key={i}>
                    <input
                      type='text'
                      name={`tarea-${i + 1}`}
                      className='w-full p-1 text-xl outline-none border-b-2 border-gray-400 hover:border-gray-500'
                      placeholder='Tarea'
                      value={data.task}
                      onChange={(e) => {
                        updateTask(i, e.target.value);
                      }}
                    />
                    <button
                      type='button'
                      className='p-1 m-1'
                      onClick={() => {
                        removeTask(i);
                      }}
                    >
                      <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-5' viewBox='0 0 16 16'>
                        <path d='M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z' />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </>
          ) : (
            "Sin tareas"
          )}
          <div className='flex justify-center w-full my-2'>
            <button type='button' className='mx-3 p-2 text-md text-blue-400 hover:underline' onClick={addTask}>
              Agregar nueva tarea
            </button>
          </div>
        </div>
        <div className='flex justify-center w-full mt-2 p-2 border-t-2'>
          <button
            type='button'
            onClick={(e) => {
              setNewTaskInfo(empty);
              setAddTaskModalStatus(false);
            }}
            className='mx-3 px-4 py-2 rounded-lg cursor-pointer bg-orange-500 text-white'
          >
            Cancelar
          </button>
          <button type='submit' className='mx-3 px-4 py-2 rounded-lg cursor-pointer bg-green-500'>
            Guardar Tarea
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskModal;
