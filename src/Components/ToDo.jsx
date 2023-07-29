import React, { useState, useEffect, useContext } from "react";
import UserLogContext from "../Context/UserLogContext";
import AddTaskModal from "./AddTaskModal";
import ToDoList from "./ToDoList";
import SessionMng from "../Controllers/SessionManager";
import TaskMng from "../Controllers/TaskManager";

const ToDo = () => {
  const { userToken } = useContext(UserLogContext);
  const [data, setData] = useState([]);
  const [isAddTaskModalOpen, setAddTaskModalStatus] = useState(false);

  const handlerOpenModal = () => {
    setAddTaskModalStatus(true);
  };
  const getNewData = async () => {
    await SessionMng.actSession(userToken, async (userId) => {
      const { data } = await TaskMng.getTasksAssignedTo(userId);
      setData(data ?? []);
    });
  };

  useEffect(() => {
    getNewData();
  }, []);

  return (
    <div className='h-[calc(100vh-64px)]'>
      <AddTaskModal isAddTaskModalOpen={isAddTaskModalOpen} setAddTaskModalStatus={setAddTaskModalStatus} getNewData={getNewData} />
      <div className='h-full p-2 overflow-y-scroll'>
        <button className="w-full my-2 text-white rounded p-1 bg-blue-400" onClick={()=>{getNewData()}}>
          Actualizar Lista
        </button>
        <ToDoList data={data} getNewData={getNewData} />
      </div>
      <div className='absolute bottom-0 right-0 flex justify-center p-2 m-2'>
        <button className='p-1 m-1 rounded border-2 border-gray-200 bg-amber-300' onClick={handlerOpenModal}>
          <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-9' viewBox='0 0 16 16'>
            <path fillRule='evenodd' d='M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z' />
            <path d='M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z' />
            <path d='M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z' />{" "}
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ToDo;
