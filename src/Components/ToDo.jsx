import React, { useState, useEffect, useContext } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
// Local Modules
import { db } from "../firebase";
// Context
import UserLogContext from "../Context/UserLogContext";
// Components
import AddTaskModal from "./AddTaskModal";
import ToDoList from "./ToDoList";

const ToDo = () => {
  const { actSession } = useContext(UserLogContext);
  const [data, setData] = useState([]);
  const [isAddTaskModalOpen, setAddTaskModalStatus] = useState(true);

  const handlerOpenModal = () => {
    setAddTaskModalStatus(true);
  };

  const getNewData = async () => {
    try {
      await actSession(async (userId) => {
        const res = await getDocs(query(collection(db, "tasks"), where("owner", "==", userId)));
        const data = res.docs;
        const newDataFormatted = [];
        data.forEach((doc) => {
          newDataFormatted.push({ id: doc.id, ...doc.data() });
        });
        setData(newDataFormatted);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNewData();
  }, []);

  return (
    <div>
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
