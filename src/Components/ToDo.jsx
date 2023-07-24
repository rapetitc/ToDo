import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { db } from "../firebase";
import { collection, doc, getDocs, addDoc, deleteDoc, query, where } from "firebase/firestore";
import UserLogContext from "../Context/UserLogContext";

const AddTaskModal = ({ isAddTaskModalOpen, setAddTaskModalStatus, getNewData }) => {
  const { actSession } = useContext(UserLogContext);
  const empty = { title: "", tasks: [] };
  const [newTaskInfo, setNewTaskInfo] = useState(empty);

  const handlerCloseModal = (e) => {
    setAddTaskModalStatus(false);
  };

  const handlerUpdateTitle = (value) => {
    setNewTaskInfo({ ...newTaskInfo, title: value });
  };

  const handlerNewTask = () => {
    let copyTask = { ...newTaskInfo };
    copyTask.tasks.push({ task: "", status: true });
    setNewTaskInfo({ ...copyTask });
  };
  const handlerUpdateTask = (id, value) => {
    const copyTask = { ...newTaskInfo };
    copyTask.tasks[id].task = value;
    setNewTaskInfo({ ...copyTask });
  };
  const handlerDeleteTask = (id) => {
    const copyTask = { ...newTaskInfo };
    copyTask.tasks = copyTask.tasks.filter((item) => {
      return item != copyTask.tasks[id];
    });
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
      // e.target.reset();
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
          <button type='button' className='p-1 mx-2' onClick={handlerCloseModal}>
            <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-5' viewBox='0 0 16 16'>
              <path d='M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z' />
            </svg>
          </button>
        </div>
        <div className='flex flex-wrap justify-center w-full my-2'>
          {newTaskInfo.tasks.length > 0 ? (
            <>
              {newTaskInfo.tasks.map((data, i) => {
                return (
                  <div className='flex justify-center w-full mx-5 my-2' key={i}>
                    <input
                      type='text'
                      name='tarea'
                      className='w-full p-1 text-xl outline-none border-b-2 border-gray-400 hover:border-gray-500'
                      placeholder='Tarea'
                      value={data.task}
                      onChange={(e) => {
                        handlerUpdateTask(i, e.target.value);
                      }}
                    />
                    <button
                      type='button'
                      className='p-1 m-1'
                      onClick={() => {
                        handlerDeleteTask(i);
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
            <button type='button' className='mx-3 p-2 text-md text-blue-400 hover:underline' onClick={handlerNewTask}>
              Agregar nueva tarea
            </button>
          </div>
        </div>
        <div className='flex justify-center w-full mt-2 p-2 border-t-2'>
          <button type='submit' className='mx-3 px-4 py-2 rounded-lg cursor-pointer bg-gradient-to-r from-sky-500 to-indigo-500'>
            Crear Tarea
          </button>
        </div>
      </form>
    </div>
  );
};
const ToDoList = ({ data, getNewData }) => {
  const handlerDeleteTask = async (taskID) => {
    await deleteDoc(doc(db, "tasks", taskID));
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Tarea eliminada exitosamente!",
      showConfirmButton: false,
      timer: 1500,
    });
    getNewData();
  };
  const handlerEditTask = (taskID) => {
    getNewData();
  };

  if (data.length > 0) {
    return (
      <ul className='w-full'>
        {data.map((item, i) => (
          <li className='my-5 p-1 rounded-md border-2 border-solid border-slate-300' key={i}>
            <div className='flex justify-between p-1 border-b-2'>
              <h3 className='text-lg font-semibold'>{item.title}</h3>
              <div>
                <button
                  className='mx-2 hover:underline'
                  onClick={() => {
                    handlerEditTask(item.id);
                  }}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-5 text-blue-400' viewBox='0 0 16 16'>
                    <path d='M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z' />
                  </svg>
                </button>
                <button
                  className='mx-2 hover:underline'
                  onClick={() => {
                    handlerDeleteTask(item.id);
                  }}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-5 text-red-500' viewBox='0 0 16 16'>
                    <path d='M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='p-1'>
              {item.tasks.map((task, i) => {
                return (
                  <div key={i}>
                    <input type='checkbox' id={`task${item.id}-${i}`} defaultChecked={task.status} className='m-1' />
                    <label htmlFor={`task${item.id}-${i}`} className='m-1'>
                      {task.task}
                    </label>
                  </div>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className='flex justify-center items-center w-full h-72 '>
      <p className="h-min">No hay tareas asignadas, agrega una para enlistar las tareas</p>
    </div>
  );
};
const ToDo = () => {
  const { actSession } = useContext(UserLogContext);
  const [data, setData] = useState([]);
  const [isAddTaskModalOpen, setAddTaskModalStatus] = useState(false);

  const handlerOpenModal = () => {
    setAddTaskModalStatus(true);
  };

  const getNewData = async () => {
    await actSession(async (userId) => {
      const res = await getDocs(query(collection(db, "tasks"), where("owner", "==", userId)));
      const data = res.docs;
      const newDataFormatted = [];
      data.forEach((doc) => {
        newDataFormatted.push({ id: doc.id, ...doc.data() });
      });
      setData(newDataFormatted);
    });
  };

  useEffect(() => {
    getNewData();
  }, []);

  return (
    <div className=''>
      <AddTaskModal isAddTaskModalOpen={isAddTaskModalOpen} setAddTaskModalStatus={setAddTaskModalStatus} getNewData={getNewData} />
      <div className='w-11/12 m-auto'>
        <ToDoList data={data} getNewData={getNewData} />
      </div>
      <div className='flex justify-center fixed bottom-0 w-full p-2 bg-orange-300'>
        <button className='m-1' onClick={handlerOpenModal}>
          <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-9' viewBox='0 0 16 16'>
            <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
            <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z' />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ToDo;
