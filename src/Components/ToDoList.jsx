import React from "react";
import Swal from "sweetalert2";
import TaskMng from "../Controllers/TaskManager";

const DeleteTaskButton = ({ taskId, callback }) => {
  const removeTask = async (taskId) => {
    const { isOk } = await TaskMng.deleteTask(taskId);
    if (isOk) {
      await getNewData();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Tarea eliminada exitosamente!",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Tarea no pude ser eliminada",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    await callback();
  };

  return (
    <button
      className='mx-2 hover:underline'
      onClick={() => {
        removeTask(taskId);
      }}
    >
      <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-5 text-red-500' viewBox='0 0 16 16'>
        <path d='M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z' />
      </svg>
    </button>
  );
};
const EditTaskButton = ({ taskId, callback }) => {
  const editTask = (taskId) => {
    // TODO
    Swal.fire({
      position: "center",
      title: "Esta opcion esta siendo desarrollada!",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <button
      className='mx-2 hover:underline'
      onClick={() => {
        editTask(taskId);
      }}
    >
      <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-5 text-blue-400' viewBox='0 0 16 16'>
        <path d='M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z' />
      </svg>
    </button>
  );
};

const ToDoList = ({ data, getNewData }) => {
  const editTaskStatus = async (id, i) => {
    const { isOk } = await TaskMng.updateTaskStatus(id, i);
    if (isOk) console.log(`Tarea ${id} actualizada`);
  };

  if (data.length > 0) {
    return (
      <div className='grid gap-2 w-full mb-28' style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {data.map(({ id, title, taskList, assignations, limitDate }, i) => (
          <div className='w-full p-1 bg-white rounded shadow-lg' key={i}>
            <div className='flex justify-between p-1 '>
              <h3 className='text-lg font-semibold'>{title}</h3>
              <div>
                <EditTaskButton taskId={id} />
                <DeleteTaskButton taskId={id} callback={getNewData} />
              </div>
            </div>
            <div className='py-1 px-3 my-2'>
              {taskList.map((task, i) => {
                return (
                  <div key={i}>
                    <input
                      type='checkbox'
                      id={`task${id}-${i}`}
                      defaultChecked={task.status}
                      className='m-1'
                      onChange={() => {
                        editTaskStatus(id, i, task.status);
                      }}
                    />
                    <label htmlFor={`task${id}-${i}`} className='m-1'>
                      {task.task}
                    </label>
                  </div>
                );
              })}
            </div>
            <div className='flex flex-wrap p-1 border-t-2'>
              {assignations.length > 0 ? <div className='flex flex-wrap w-full'>Asignaciones: {`${assignations.length}`}</div> : ""}
              <div className='w-full'>{limitDate != "NoLimits" ? <p>Vence el: {limitDate}</p> : <p>Sin fecha de vencimiento</p>}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className='flex justify-center items-center w-full h-72 '>
      <p className='h-min text-center'>No hay tareas asignadas, agrega una para enlistar las tareas</p>
    </div>
  );
};

export default ToDoList;
