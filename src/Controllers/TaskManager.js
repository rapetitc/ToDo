import { getDoc, getDocs, addDoc, updateDoc, deleteDoc, doc, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";

class TaskManager {
  constructor() {
    this.dbName = "tasks"
  }
  async getTasks() {
    try {
      const { docs } = await getDocs(collection(db, this.dbName))
      if (docs.length == 0) throw "GetTasks/TasksNotFound"
      return {
        isOk: true, data: docs.map((doc) => {
          return { id: doc.id, ...doc.data() }
        })
      }
    } catch (error) {
      if (error == "GetTasks/TasksNotFound") return { isOk: false, error }

      console.error("GetTasks", error);
      return { isOk: false, error: "GetTasks/UnexpectedError" }
    }
  }
  async getTaskById(id) {
    try {
      const resGet = await getDoc(doc(db, this.dbName, id))
      if (!resGet.exists()) throw "GetTaskById/NotFound"

      return { isOk: true, data: { id: resGet.id, ...resGet.data() } }
    } catch (error) {
      if (error == "GetTaskById/NotFound") return { isOk: false, error }

      console.error("GetTaskById", error);
      return { isOk: false, error: "GetTaskById/UnexpectedError" }
    }
  }
  async getTasksAssignedTo(userId) {
    //TODO Solo de vuelve las tareas propias, falta buscar dentro de cada asignaciones
    try {
      const { docs } = await getDocs(query(collection(db, "tasks"), where("owner", "==", userId)));
      if (docs.length == 0) throw "GetTasksAssignedTo/NotTasksAssigned"

      let newDataFormatted = [];
      for (let i = 0; i < docs.length; i++) {
        const data = { id: docs[i].id, ...docs[i].data() };
        newDataFormatted.push(data);
      }

      return { isOk: true, data: newDataFormatted };
    } catch (error) {
      if (error == "GetTasksAssignedTo/NotTasksAssigned") return { isOk: false, error };

      console.error("GetTasksAssignedTo", error);
      return { isOk: false, error: "GetTasksAssignedTo/UnexpectedError" }
    }
  }
  async addTask(taskInfo) {
    try {
      await addDoc(collection(db, this.dbName), taskInfo)
      return { isOk: true }
    } catch (error) {
      console.error(error);
      return { isOk: false, error: "AddTask/UnexpectedError" }
    }
  }
  async updateTask(id, newValues) {
    try {
      const { isOk, data } = await this.getTaskById(id)
      if (!isOk) throw "UpdateTask/NotFound"
      delete data.id

      const keys = Object.keys(newValues)
      keys.forEach((key) => {
        // Esto solo cambia el valor directo, en el caso de que haya un array, cambiaria un array completo
        data[key] = newValues[key]
      })
      updateDoc(doc(db, this.dbName, id), data);

      return { isOk: true }
    } catch (error) {
      console.error(error);

      if (error == "UpdateTask/NotFound") return { isOk: false, error }
      return { isOk: false, error: "UpdateTask/UnexpectedError" }
    }
  }
  async updateTaskStatus(id, i) {
    try {
      const { isOk, data } = await this.getTaskById(id)
      if (!isOk) throw "UpdateTaskStatus/NotFound"

      const { taskList } = data
      taskList[i].status = !taskList[i].status

      updateDoc(doc(db, this.dbName, id), { taskList });

      return { isOk: true }
    } catch (error) {
      console.error(error);

      if (error == "UpdateTaskStatus/NotFound") return { isOk: false, error }
      return { isOk: false, error: "UpdateTaskStatus/UnexpectedError" }
    }
  }
  async deleteTask(id) {
    try {
      await deleteDoc(doc(db, this.dbName, id))
      return { isOk: true }
    } catch (error) {
      console.error(error);
      return { isOk: false }
    }
  }
}


const TaskMng = new TaskManager
export default TaskMng