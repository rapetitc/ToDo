import React, { useState, useContext } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import Swal from "sweetalert2";
//Local Modules
import { db } from "../firebase";
import { evalForm } from "../utils/inputEval";
//Context
import UserLogContext from "../Context/UserLogContext";
import * as moment from "moment";

const TitleSection = ({ title, setTitle }) => {
  return (
    <div className='flex justify-between align-middle w-full p-1 my-1 border-b-2 '>
      <input
        type='text'
        name='tasktitle'
        className='w-full p-1 mx-2 text-2xl outline-none'
        placeholder='Titulo de la tarea'
        value={title}
        onChange={({ target }) => {
          setTitle(target.value);
        }}
      />
    </div>
  );
};
const TaskListSection = ({ taskList, setTaskList, emptyTask }) => {
  const addTask = () => {
    let copyTaskList = [...taskList];
    copyTaskList.push({ task: "", status: false });
    setTaskList(copyTaskList);
  };
  const updateTask = (id, value) => {
    let copyTaskList = [...taskList];
    copyTaskList[id].task = value;
    setTaskList(copyTaskList);
  };
  const removeTask = (id) => {
    let copyTaskList = [...taskList];
    copyTaskList = copyTaskList.filter((item) => {
      return item != copyTaskList[id];
    });
    if (copyTaskList.length == 0) copyTaskList = emptyTask;
    setTaskList(copyTaskList);
  };

  return (
    <div className='flex flex-wrap w-full p-1 my-1 mx-2 border-b-2'>
      <p className='m-1 indent-1'>Tareas:</p>
      {taskList.map((data, i) => {
        return (
          <div className='flex justify-center w-full mx-5 my-2' key={i}>
            <input
              type='text'
              name={`tarea-${i + 1}`}
              className='w-full p-1 text-xl outline-none border-b-2 border-gray-400 hover:border-gray-500'
              placeholder='Tarea'
              value={data.task}
              onChange={({ target }) => {
                updateTask(i, target.value);
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
      <div className='flex justify-center w-full my-2'>
        <button type='button' className='mx-3 p-2 text-md text-blue-400 hover:underline' onClick={addTask}>
          <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-5' viewBox='0 0 16 16'>
            <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
            <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z' />
          </svg>
        </button>
      </div>
    </div>
  );
};
//TODO Hacer que la seccion de usuarios encontrados tenga un maximo heigh y tenga scroll
const AssignationSection = ({ assignations, setAssignations }) => {
  const { actSession } = useContext(UserLogContext);
  const [usersFoundList, setUsersFoundList] = useState([]);

  const handlingSearchUser = async ({ target }) => {
    const value = target.value;
    if (value.length > 3) {
      try {
        actSession(async (userId) => {
          // TODO Hacer que devuelva probabilidades basado en el texto entrante
          const resGet = await getDocs(query(collection(db, "users"), where("uname", "==", value)));
          const usersFound = resGet.docs.map((doc) => {
            return { ...doc.data(), userId: doc.id };
          });
          setUsersFoundList(usersFound);
        });
      } catch (error) {
        console.log(error);
      }
    }
    setUsersFoundList([]);
  };
  const assignTaskTo = ({ uname, userId, fname, lname }) => {
    const copyAssignations = [...assignations];
    if (!copyAssignations.find((user) => user.userId == userId)) copyAssignations.push({ uname, userId, fname, lname });
    setAssignations(copyAssignations);
  };
  const removeAssignation = (userId) => {
    const newAssignations = assignations.filter((assignation) => {
      assignation.userId != userId;
    });
    setAssignations(newAssignations);
  };

  return (
    <div className='flex flex-wrap w-full p-1 my-1 border-b-2'>
      <div className='flex flex-wrap items-center w-full p-1'>
        <p className='mx-2 indent-1'>Asignaciones:</p>
        {assignations.length < 1 ? (
          <p>Sin asignaciones</p>
        ) : (
          <>
            {assignations.map(({ uname, userId, fname, lname }, i) => {
              return (
                <button
                  key={i}
                  type='button'
                  onClick={() => {
                    removeAssignation(userId);
                  }}
                  className='hover:underline'
                >
                  {`${fname} ${lname} (${uname})`}
                </button>
              );
            })}
          </>
        )}
        <div className='flex flex-wrap justify-center w-full'>
          <input type='search' placeholder='Buscar usuario' className='w-full mt-2 mx-2 p-2 border-b-2 outline-none' onChange={handlingSearchUser} />
          {usersFoundList.map(({ uname, userId, fname, lname }, i) => {
            return (
              <button
                key={i}
                type='button'
                onClick={() => {
                  assignTaskTo({ uname, userId, fname, lname });
                }}
                className='w-full mx-2 p-1 text-center bg-gray-300'
              >
                {`${uname} (${fname} ${lname})`}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
const LimitDateSection = ({ limitDate, setLimitDate }) => {
  const addRemLimitDate = (status) => {
    status ? setLimitDate(moment().add(1, "h").format("DD-MM-YYYY, HH:mm:ss")) : setLimitDate("NoLimits");
  };
  const adjustLimitDate = ({ target }) => {
    let date = moment(limitDate, "DD-MM-YYYY, HH:mm:ss").format("DD-MM-YYYY"),
      time = moment(limitDate, "DD-MM-YYYY, HH:mm:ss").format("HH:mm"),
      datetime = `${date}, ${time}`;
    if (target.type == "date") datetime = moment(`${target.value} ${time}`, "YYYY-MM-DD, HH:mm").format("DD-MM-YYYY, HH:mm:ss");
    if (target.type == "time") datetime = moment(`${date} ${target.value}`, "DD-MM-YYYY, HH:mm").format("DD-MM-YYYY, HH:mm:ss");
    setLimitDate(datetime);
  };

  return (
    <div className='flex justify-center w-full p-1 my-1 border-b-2'>
      {limitDate == "NoLimits" ? (
        <button
          type='button'
          className='mx-3 p-2 text-md text-blue-400 hover:underline'
          onClick={() => {
            addRemLimitDate(true);
          }}
        >
          Asignar fecha limite
        </button>
      ) : (
        <div className='flex flex-wrap justify-between items-center p-1'>
          <p className='m-2 indent-1'>Fecha/Hora de vencimiento:</p>
          <button
            onClick={() => {
              addRemLimitDate(false);
            }}
            className='mx-1 p-1 h-min'
          >
            <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-5' viewBox='0 0 16 16'>
              <path d='M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z' />
            </svg>
          </button>
          <div className='flex flex-wrap w-full'>
            <div className='flex justify-center items-center w-full'>
              <p className='h-min'>Fecha:</p>
              <input type='date' onChange={adjustLimitDate} value={moment(limitDate, "DD-MM-YYYY, HH:mm:ss").format("YYYY-MM-DD")} min={moment().format("YYYY-MM-DD")} className='mx-1 p-1 outline-none border-b-2' />
            </div>
            <div className='flex justify-center items-center w-full'>
              <p className='h-min'>Hora:</p>
              <input type='time' onChange={adjustLimitDate} value={moment(limitDate, "DD-MM-YYYY, HH:mm:ss").format("HH:mm")} className='mx-1 p-1 outline-none border-b-2' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const AddTaskModal = ({ isAddTaskModalOpen, setAddTaskModalStatus, getNewData }) => {
  const { actSession } = useContext(UserLogContext);

  const [title, setTitle] = useState("");
  const emptyTask = [{ task: "", status: false }],
    [taskList, setTaskList] = useState(emptyTask);
  const [assignations, setAssignations] = useState([]);
  const [limitDate, setLimitDate] = useState("NoLimits");

  const cleanTask = () => {
    setTitle("");
    setTaskList(emptyTask);
    setLimitDate("NoLimits");
    setAssignations([]);
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    try {
      evalForm(e.target);
      await actSession(async (userId) => {
        // TODO Luego de realizar la actualizacion sobre TaskList descomentar el codigo de abajo
        // const assignationsFormatted = assignations.map((user) => {
        //   return user.userId;
        // });
        await addDoc(collection(db, "tasks"), { owner: userId, title, taskList, limitDate, assignations });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Tarea creada exitosamente",
          showConfirmButton: false,
          timer: 1500,
        });
        getNewData();
        setAddTaskModalStatus(false);
        cleanTask();
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={isAddTaskModalOpen ? "absolute top-0 h-full w-full bg-slate-500/50" : "hidden"}>
      <form onSubmit={handlerSubmit} className='flex flex-wrap w-11/12 mx-auto mt-16 rounded-lg bg-white'>
        <TitleSection title={title} setTitle={setTitle} />
        <TaskListSection taskList={taskList} setTaskList={setTaskList} emptyTask={emptyTask} />
        <AssignationSection assignations={assignations} setAssignations={setAssignations} />
        <LimitDateSection limitDate={limitDate} setLimitDate={setLimitDate} />
        <div className='flex justify-between w-full p-1 my-1 '>
          <button
            type='button'
            onClick={(e) => {
              cleanTask();
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
