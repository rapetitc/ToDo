import React, { useState, useEffect, useContext } from "react";
import UserLogContext from "../Context/UserLogContext";
import ThemeContext from "../Context/ThemeContext";
import AddTaskModal from "./AddTaskModal";
import ToDoList from "./ToDoList";
import SessionMng from "../Controllers/SessionManager";
import TaskMng from "../Controllers/TaskManager";

const ToDo = () => {
  const { setLoading } = useContext(ThemeContext);
  const { userToken } = useContext(UserLogContext);
  const [data, setData] = useState([]);
  const [isAddTaskModalOpen, setAddTaskModalStatus] = useState(false);

  const handlerOpenModal = () => {
    setAddTaskModalStatus(true);
  };
  const getNewData = async () => {
    setLoading(true)
    await SessionMng.actSession(userToken, async (userId) => {
      const { data } = await TaskMng.getTasksAssignedTo(userId);
      setData(data ?? []);
    });
    setLoading(false)
  };

  useEffect(() => {
    getNewData();
  }, []);

  return (
    <div className='h-[calc(100vh-64px)]'>
      <AddTaskModal isAddTaskModalOpen={isAddTaskModalOpen} setAddTaskModalStatus={setAddTaskModalStatus} getNewData={getNewData} />
      <div className='h-full p-2 overflow-y-auto'>
        <ToDoList data={data} getNewData={getNewData} />
      </div>
      <div className='fixed bottom-0 right-1 flex flex-wrap justify-center w-16 p-2 m-2 text-white'>
        <button
          className='p-1 m-1 rounded-lg border-2 border-gray-200 bg-amber-300'
          onClick={() => {
            getNewData();
          }}
        >
          <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-9' viewBox='0 0 16 16'>
            <path fillRule='evenodd' d='M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z' />
            <path d='M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z' />
          </svg>
        </button>
        <button className='p-1 m-1 rounded-lg border-2 border-gray-200 bg-amber-300' onClick={handlerOpenModal}>
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
