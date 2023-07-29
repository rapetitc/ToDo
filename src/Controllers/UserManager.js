import { getDoc, getDocs, addDoc, updateDoc, deleteDoc, doc, collection, query, where } from "firebase/firestore";
import * as moment from "moment"
import { db } from "../firebase";
import { dateFormat } from "../utils/utils";

class UserManager {
  constructor() {
    this.dbName = "users"
  }
  async getUsers() {
    try {
      const { docs } = await getDocs(collection(db, this.dbName))
      if (docs.length == 0) throw "GetUsers/NotFound"
      const data = docs.map((doc) => {
        return { id: doc.id, ...doc.data() }
      })
      return { isOk: true, msg: "Users were found!", data }
    } catch (error) {
      if (error == "GetUsers/NotFound") return { isOk: false, msg: "Users were not found!", error }
      return { isOk: false, msg: "Unexpected error when trying to find users!" }
    }
  }
  async getUserById(id) {
    try {
      const resGet = await getDoc(doc(db, this.dbName, id))
      if (!resGet.exists()) throw "GetUserById/NotFound"
      return { isOk: true, msg: "User were found!", data: { id: resGet.id, ...resGet.data() } }
    } catch (error) {
      if (error == "GetUserById/NotFound") return { isOk: false, msg: "User were not found!", error }
      return { isOk: false, msg: "Unexpected error when trying to find user!", error: "GetUserById/Unexpected" }
    }
  }
  async getUsersByUname(uname) {
    try {
      // TODO Hacer que devuelva probabilidades basado en el texto entrante
      const { docs } = await getDocs(query(collection(db, this.dbName), where("uname", "==", uname)));
      if (docs.length == 0) throw "GetUsersByUname/NotFound"
      const data = docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      return { isOk: true, msg: "Users were found!", data }
    } catch (error) {
      if (error == "GetUsersByUname/NotFound") return { isOk: false, msg: "Users were not found!", error }
      return { isOk: false, msg: "Unexpected error when trying to find users!" }
    }
  }
  async isUnameAvailable(uname) {
    try {
      const { docs } = await getDocs(query(collection(db, "users"), where("uname", "==", uname)));
      if (docs.length > 0) throw "CheckUserName/Exists";
      return { isOk: true, msg: "Username available!" }
    } catch (error) {
      if (error == "CheckUserName/Exists") return { isOk: false, msg: "Unexpected error when trying to find users!", error }
      return { isOk: false, msg: "Unexpected error when check username availability!", error: "CheckUname/Unexpected" }
    }
  }
  async createUser({ uname, password, fname, lname }) {
    try {
      const { isOk } = await this.isUnameAvailable(uname)
      if (!isOk) throw "CreateUser/UserNameExists";
      // TODO Also evaluate information as password > 8 characteres, and uname, fname, lname > 4 characteres,

      const userInfo = {
        uname,
        password,
        fullname: { fname, lname },
        creationdate: moment().format(dateFormat),
        type: "user",
        status: true
      }
      await addDoc(collection(db, this.dbName), userInfo)

      return { isOk: true, msg: "User was created successfully!" }
    } catch (error) {
      if (error == "CreateUser/UserNameExists") return { isOk: false, msg: "User name already exists!", error }
      return { isOk: false, msg: "Unexpected error when trying to create user!" }
    }
  }
  async updateUser(id, newValues) {
    //TODO Validar quien actualiza estos valores
    try {
      const { isOk, data } = await this.getUserById(id)

      if (!isOk) throw "Error" //TODO Validar
      const keys = Object.keys(newValues)
      keys.forEach((key) => {
        // Esto solo cambia el valor directo, en el caso de que haya un array, cambiaria un array completo
        data[key] = newValues[key]
      })
      updateDoc(doc(db, this.dbName, id), userInfo);
      return { isOk: true, msg: "User info was updated successfully!" }
    } catch (error) {
      return { isOk: false, msg: "Unexpected error when trying to update user!" }
    }

  }
  //TODO
  async deleteUser(id) {
    try {
      const { isOk, data } = await this.getUserById(id)
      if (!isOk) throw "Error" //TODO Validar

      await deleteDoc(doc(db, this.dbName, data.id))

      return { isOk: true, msg: "User info was removed successfully!" }
    } catch (error) {
      return { isOk: false, msg: "Unexpected error when trying to remove user!" }
    }
  }
}

const UserMng = new UserManager
export default UserMng