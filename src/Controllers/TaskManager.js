import { getDoc, getDocs, addDoc, updateDoc, deleteDoc, doc, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";

class TaskManager {
  constructor() {
    this.dbName = "tasks"
  }
  async getTasks() {
    try {
      const { docs } = await getDocs(collection(db, this.dbName))
      if (docs.length == 0) throw "Tasks/NotFoundTasks"
      return {
        isOk: true, msg: "Tasks were gotten successfully", data: docs.map((doc) => {
          return { id: doc.id, ...doc.data() }
        })
      }
    } catch (error) {
      if (error == "Tasks/NotFoundTasks") return { isOk: false, msg: "Tasks were not found!" }
      return { isOk: false, msg: "Unexpected error when trying get all the tasks!" }
    }
  }
  async getTaskById(id) {
    try {
      const resGet = await getDoc(doc(db, this.dbName, id))
      if (!resGet.exists()) throw "Task/NotFound"

      return { isOk: true, msg: "Task was found!", data: { id: resGet.id, ...resGet.data() } }
    } catch (error) {
      if (error == "Task/NotFound") return { isOk: false, msg: "Unexpected error when trying get a the task!" }
      return { isOk: false, msg: "Unexpected error when trying get a the task!" }
    }
  }
  async getTasksAssignedTo(userId) {
    //TODO Solo de vuelve las tareas propias, falta buscar dentro de cada asignaciones
    try {
      const { docs } = await getDocs(query(collection(db, "tasks"), where("owner", "==", userId)));
      if (docs.length == 0) throw "Tasks/NotTasksAssigned"

      let newDataFormatted = [];
      for (let i = 0; i < docs.length; i++) {
        const data = { id: docs[i].id, ...docs[i].data() };
        newDataFormatted.push(data);
      }

      return { isOk: true, msg: "Tasks assigned were gotten successfully", data: newDataFormatted };
    } catch (error) {
      if (error == "Tasks/NotTasksAssigned") return { isOk: false, msg: "There are not tasks assigned" };
      return { isOk: false, msg: "Unexpected error when trying get a all the tasks assigned!" }
    }
  }
  async addTask(taskInfo) {
    try {
      await addDoc(collection(db, this.dbName), taskInfo)
      return { isOk: true, msg: "Task was added successfully!" }
    } catch (error) {
      return { isOk: false, msg: "Unexpected error when trying add a task!" }
    }
  }
  async updateTask(id, newValues) {
    try {
      const { isOk, data } = await this.getTaskById(id)
      if (!isOk) throw "Task/NotFound"
      delete data.id

      const keys = Object.keys(newValues)
      keys.forEach((key) => {
        // Esto solo cambia el valor directo, en el caso de que haya un array, cambiaria un array completo
        data[key] = newValues[key]
      })
      updateDoc(doc(db, this.dbName, id), data);

      return { isOk: true, msg: "Task was updated successfully!" }
    } catch (error) {
      console.log(error);
      if (error == "Task/NotFound") return { isOk: false, msg: "Task was not found!" }
      return { isOk: false, msg: "Unexpected error when trying update task!" }
    }
  }
  async updateTaskStatus(id, i) {
    try {
      const { isOk, data } = await this.getTaskById(id)
      if (!isOk) throw "Task/NotFound"

      const { taskList } = data
      taskList[i].status = !taskList[i].status

      updateDoc(doc(db, this.dbName, id), { taskList });

      return { isOk: true, msg: "Task was updated successfully!" }
    } catch (error) {
      console.log(error);
      if (error == "Task/NotFound") return { isOk: false, msg: "Task was not found!" }
      return { isOk: false, msg: "Unexpected error when trying update task!" }
    }
  }
  async deleteTask(id) {
    try {
      await deleteDoc(doc(db, this.dbName, id))
      return { isOk: true, msg: "Task was deleted successfully!" }
    } catch (error) {
      return { isOk: false, msg: "Unexpected error when trying delete a task!" }
    }
  }
}


const TaskMng = new TaskManager
export default TaskMng